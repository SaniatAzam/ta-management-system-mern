import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import React from "react";
import "../../style/userTable.css";
import RemoveTARow from "./RemoveTARow"
import { TACohort } from "../../classes/TACohort";
import EditIcon from '@mui/icons-material/Edit';
import { Course } from "../../classes/Course";

const RemoveTAModal = ({ courseNumber, term, year, cid, instructorID }: { courseNumber: string; term: string; year: string; cid: string; instructorID: string }) => {
  console.log(courseNumber)
  console.log(term)
  console.log(year)
  console.log(cid)
  console.log(instructorID)
  const [TAs, setTAs] = React.useState<Array<TACohort>>([]);
  const [showDetails, setShowDetails] = useState(false);
  console.log("Remove TA Modaling." + instructorID);



  const fetchAvailableTAData = async () => {
    console.log("Fetching TA Data from RemoveTAModal");
    const term_year = term + " " + year;

    try {
      const taObject = [];

      const coursesRes = await fetch("http://127.0.0.1:3000/api/course");
      const coursesData = await coursesRes.json();
      console.log(coursesData);

      let courseData: Course;
      for (const d of coursesData.courses) {
        if (d._id === cid) {
          courseData = d;
          break
        }
      }

      const allTARes = await fetch("http://127.0.0.1:3000/api/cohort");
      const allTA = await allTARes.json();

      for (const d of courseData.assignedTAs) {
        console.log("HELLO MUY BABY HELO MY HONEY")
        console.log(d);

        let taData: TACohort;
        for (const ta of allTA.cohorts) {
          if (d == ta._id) {
            taData = ta;
          }
        }
        console.log(taData);

        let item = {};
        item["ta_name"] = taData.legal_name;
        item["student_ID"] = taData.student_ID;
        item["course_id"] = cid;
        item["courseNum"] = courseNumber;
        item["uuid"] = d;
        taObject.push(item);
      }
      setTAs(taObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAvailableTAData();
  }, []);

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => setShowDetails(true)}>
        <EditIcon />
      </button>

      <Modal show={showDetails} onHide={() => setShowDetails(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">{courseNumber} • {term} • {year}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="profTable" >
            <table>
              <thead>
                <tr>
                  <th className="column0"></th>
                  <th className="column1">TA Name</th>
                  <th className="column2">Student ID</th>
                  <th className="column3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {TAs.map((taCohort: TACohort, i: number) => {
                  if (taCohort) {
                    return <RemoveTARow key={i} taCohort={taCohort} fetchAvailableTAData={fetchAvailableTAData} />;
                  }
                })}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
};

export default RemoveTAModal;