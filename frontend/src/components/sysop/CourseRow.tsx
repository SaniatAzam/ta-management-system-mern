import RemoveIcon from "@material-ui/icons/Remove";
import { Course } from "../../classes/Course";

const CourseRow = ({ course, fetchCourseData }: { course: Course; fetchCourseData: Function }) => {
  const courseDesc = course.courseDesc;
  const courseName = course.courseName;
  const courseNumber = course.courseNumber;
  const year = course.year;
  const instructor = course.instructorName;
  const term = course.term;


  const handleDeleteCourse = async (e) => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/course/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: courseName,
          courseDesc: courseDesc,
          term: term,
          year: year,
          courseNumber: courseNumber,
          courseInstructor: instructor
          // course: course
        }),
      });
      if (res.status === 201) {
        setTimeout(() => {
          fetchCourseData();
        }, 500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteCourse}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{course.courseNumber}</td>
      <td className="column2">{course.courseName}</td>
      <td className="column3">{course.courseDesc}</td>
      <td className="column4">{course.term}</td>
      <td className="column5">{course.year}</td>
      <td className="column6">{course.instructorName}</td>
    </tr>
  );
};

export default CourseRow;
