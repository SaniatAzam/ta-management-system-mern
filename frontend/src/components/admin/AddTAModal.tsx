import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import React from "react";
import "../../style/userTable.css";
import AddTARow from "./AddTARow"
import { TACohort } from "../../classes/TACohort";
import EditIcon from '@mui/icons-material/Edit';
import { Course } from "../../classes/Course";

const AddTAModal = ({ courseNumber, term, year, cid, instructorID }: { courseNumber: string; term: string; year: string; cid: string; instructorID: string }) => {
  const [TAs, setTAs] = React.useState<Array<TACohort>>([]);
  const [showDetails, setShowDetails] = useState(false);


  const fetchAvailableTAData = async () => {

    const term_year = term + " " + year;

    const prof_user_res = await fetch("http://127.0.0.1:3000/api/users/" + instructorID);
    if (!prof_user_res) {
      console.log("Professor not found");
    } else {
      const prof_user = await prof_user_res.json();
      const allWishListRes = await fetch("http://127.0.0.1:3000/api/prof/getAllWishlist");
      if (!allWishListRes) {
        console.log("No Wish List Available")
      } else {
        const coursesRes = await fetch("http://127.0.0.1:3000/api/course");
        const coursesData = await coursesRes.json();
        console.log(coursesData);

        let courseData: Course;
        for (const c of coursesData.courses) {
          if (c._id === cid) {
            courseData = c;
            break
          }
        }

        const allWishListData = await allWishListRes.json();
        let wishedTAs = new Array<String>();
        // console.log(allWishListData);
        for (const d of allWishListData.wishlist) {
          // console.log(d)
          if (d.term_year_this_is_for === term_year && d.course_num === courseNumber
            && d.prof_name === (prof_user.user.firstName + " " + prof_user.user.lastName)) {

            wishedTAs.push(d.TA_name);
          }
        }
        console.log(wishedTAs)
        try {
          const res = await fetch("http://127.0.0.1:3000/api/cohort/");
          const data = await res.json();
          const taObject = [];
          // console.log(data);
          for (const d of data.cohorts) {
            var applied = false; // Flag to check if the any of the course applied for matches the course number
            var assigned = false; //Flag to check if the person is already assgined
            if (d.courses_applied_for_list.length !== 0) {
              for (const c of d.courses_applied_for_list) { // Check if the ta applied for the course in question
                if (c === cid) applied = true;
                break;
              }
              if (courseData.assignedTAs.length !== 0) {
                for (const a of courseData.assignedTAs) {
                  if (d._id === a) assigned = true;
                  break;
                }
              }
            }
            if (!applied) continue; // If the ta hasn't applied, continue to next ta cohort
            if (assigned) continue;
            var inList = false;
            if (wishedTAs.length !== 0) {
              for (const s of wishedTAs) {
                if (s === d.legal_name) {
                  inList = true;
                  break;
                }
              }
            }

            let item = {};
            let wanted = "No";
            if (inList) wanted = "Yes";
            item["ta_name"] = d.legal_name;
            item["student_ID"] = d.student_ID;
            item["in_wish_list"] = wanted;
            item["course_id"] = cid;
            item["courseNum"] = courseNumber;
            item["uuid"] = d._id;
            taObject.push(item);

          }
          setTAs(taObject);
        } catch (err) {
          console.log(err);
        }
      }
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
                  <th className="column4">In Professor Wishlist</th>
                  <th className="column3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {TAs.map((taCohort: TACohort, i: number) => {
                  console.log("About Map AddTaRows");
                  if (taCohort) {
                    return <AddTARow key={i} taCohort={taCohort} fetchAvailableTAData={fetchAvailableTAData} />;
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

export default AddTAModal;