import { useState, useEffect } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import "../../style/userTable.css";
import { Professor } from "../../classes/Professor";
import { Course } from "../../classes/Course";

const ProfRow = ({ professor, fetchProfData }: { professor: Professor; fetchProfData: Function }) => {
  const [courses, setCourses] = useState<Array<Course>>([]);
  const profDept = professor.department;
  const profEmail = professor.email;
  const profFac = professor.faculty;
  const profFname = professor.firstName;
  const profLname = professor.lastName;
  const uuid = professor.uuid;

  const handleDeleteProf = async (e) => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/prof/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profDept: profDept,
          profEmail: profEmail,
          profFac: profFac,
          profFname: profFname,
          profLname: profLname
        }),
      });
      if (res.status === 201) {
        setTimeout(() => {
          fetchProfData();
        }, 500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProfCourses = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/course/`);
      const data = await res.json();
      const all_courses = []
      for (const course of data.courses) {
        try {
          const course_tas = course.courseInstructor;
          console.log(`obj ${course.courseInstructor}`)
          console.log(`id ${uuid}`)
          const hasProf = course.courseInstructor === uuid;
          console.log(hasProf);
          if (hasProf) {
            all_courses.push(course.courseNumber);
          }
        } catch (err) {
          console.log(err);
        }
      }
      setCourses(all_courses);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfCourses();
  }, []);

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteProf}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{professor.email}</td>
      <td className="column2">{professor.firstName}</td>
      <td className="column3">{professor.lastName}</td>
      <td className="column4">{professor.faculty}</td>
      <td className="column5">{professor.department}</td>
      <td className="column6">{courses.toString()}</td>
    </tr>
  );
};

export default ProfRow;
