import { Course } from "../../classes/Course";
import AddTAModal from "./AddTAModal";


const AssignTARow = ({ course, fetchCourseData }: { course: Course; fetchCourseData: Function }) => {
  const courseNumber = course.courseNumber;
  const instructor = course.instructorName;
  const year = course.year;
  const term = course.term;
  const assignedTAs = course.assignedTAs;
  const course_instructor_id = course.instructor_user_id;
  const course_id = course.course_id;



  return (

    <tr className="body">
      <td className="column0">
        {/* {console.log("Mapping TA Modal Button")} */}
        <AddTAModal courseNumber={courseNumber} term={term} year={year} cid={course_id} instructorID={course_instructor_id} />
      </td>
      <td className="column1">{courseNumber}</td>
      <td className="column2">{instructor}</td>
      <td className="column3">{term}</td>
      <td className="column4">{year}</td>
      <td className="column5">{assignedTAs}</td>
    </tr>

  );
};

export default AssignTARow;
