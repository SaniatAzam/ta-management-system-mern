import React, { useEffect } from "react";
import "../../style/userTable.css";
import { Container } from "react-bootstrap";
import AddToTimeSheet from "./AddToTimeSheet";
import TimeSheetRow from "./TimeSheetRow";
import { TimeSheet } from "../../classes/TimeSheet";

const ManageTimeSheet = (props) => {
  const [timeSheet, setTimesheet] = React.useState<Array<TimeSheet>>([]);

  const fetchTimeSheet = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/prof/getTimeSheet");
      const data = await res.json();
      console.log(data);
      const timeSheetObject = [];
      for (const d of data.timeSheet) {
        let item = {};
        let courseData = await fetch(
          "http://127.0.0.1:3000/api/course/" + d.course
        );
        let courseDataObject = await courseData.json()
        let courseNumData = courseDataObject.course.courseNumber
        if (courseNumData == props.course) {
          item["duties"] = d.duties;
          item["office_hours"] = d.office_hours_day + " " + d.office_hours_from + "-" + d.office_hours_to
          item["location"] = d.office_location;
        } else {
          item["duties"] = ""
          item["office_hours"] = ""
          item["location"] = ""
        }
        timeSheetObject.push(item);
      }
      console.log(timeSheetObject)
      setTimesheet(timeSheetObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Load data
    fetchTimeSheet();
  }, []);

  return (
    <div>
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>
            Office Hour/Responsibilities Sheet
          </h2>
          <AddToTimeSheet fetchTimeSheet={fetchTimeSheet} course={props.course} />
        </div>
        <div id="profTable">
          <table>
            <thead>
              <tr>
                <th className="column1">Duties</th>
                <th className="column2">Location</th>
                <th className="column3">Office Hours</th>
              </tr>
            </thead>
            <tbody>
              {/**Set to hardcoded list of profs for testing purposes */}
              {timeSheet.map((log: TimeSheet, i: number) => {
                if (log) {
                  return (
                    <TimeSheetRow
                      key={i}
                      timeSheet={log}
                      fetchTimeSheet={fetchTimeSheet}
                    />
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};

export default ManageTimeSheet;
