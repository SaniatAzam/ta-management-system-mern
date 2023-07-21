import React, { useState, useEffect } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import "../../style/userTable.css";

import { Student } from "../../classes/Student";

const StudentRow = ({ student, fetchStudentData }: { student: Student; fetchStudentData: Function; }) => {
  const [show, setShow] = useState(false);
  const studentEmail = student.email;
  const studentFname = student.firstName;
  const studentLname = student.lastName;
  const studentID = student.studentID;

  const handleDeleteProf = async (e) => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/student/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentFname: student.firstName,
          studentLname: student.lastName,
          studentEmail: student.email,
          studentID: student.studentID
        }),
      });
      if (res.status === 201) {
        setTimeout(() => {
          fetchStudentData();
        }, 500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteProf}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{studentEmail}</td>
      <td className="column2">{studentFname}</td>
      <td className="column3">{studentLname}</td>
      <td className="column4">{student.studentID}</td>
      <td className="column6 course-button">
        <>
          <button className="courses" onClick={() => setShow(true)}>
            <OpenInFullIcon fontSize="small" /> View Courses
          </button>
        </>
      </td>
    </tr>
  );
};

export default StudentRow;