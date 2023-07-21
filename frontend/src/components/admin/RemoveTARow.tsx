import React from "react";
import { PerformanceLog } from "../../classes/PerformanceLog";
import { TACohort } from "../../classes/TACohort";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PerformanceLogButton from "./PerformanceLogButton";

const RemoveTARow = ({ taCohort, fetchAvailableTAData }: { taCohort: TACohort; fetchAvailableTAData: Function }) => {
  console.log("Add TA Rowing After clicking modify course.")
  const name = taCohort.ta_name;
  const sid = taCohort.student_ID;
  const wished = taCohort.in_wish_list;
  const courseNum = taCohort.courseNum;
  const course_id = taCohort.course_id;
  const uuid = taCohort.uuid;
  const ta_email = taCohort.email;
  const [logs, setLogs] = React.useState<Array<PerformanceLog>>([]);

  const handleRemoveTA = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/course/removeCourseTAByID", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: course_id,
          taUserID: uuid
        }),
      });
      if (res.status === 201) {
        const data = await res.json();
      } else {
        alert("Error while assigning TA to " + courseNum + ".");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleRemoveTA}>
          <PersonRemoveIcon />
        </button>
      </td>
      <td className="column1">{name}</td>
      <td className="column2">{sid}</td>
      <td className="column3 course-button">
        <PerformanceLogButton name={name} />
      </td>
    </tr>
  );
};






export default RemoveTARow;
