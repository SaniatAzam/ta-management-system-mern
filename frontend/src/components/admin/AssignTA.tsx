import React, { useEffect } from "react";
import "../../style/userTable.css";
import { Course } from "../../classes/Course";
import ImportForm from "./ImportForm";
import AssignTARow from "./AssignTARow";
import { Container } from "react-bootstrap";

const AssignTA = () => {
  const [Courses, setCourses] = React.useState<Array<Course>>([]);

  const fetchCourseData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/course");
      const data = await res.json();
      const courseObject = [];
      for (const d of data.courses) {
        const courseInstructorRes = await fetch("http://127.0.0.1:3000/api/users/" + d.courseInstructor);
        const numOfAssignedTAs = d.assignedTAs.length;
        let item = {};
        if (courseInstructorRes) {
          const courseInstructorData = await courseInstructorRes.json();
          item["courseNumber"] = d.courseNumber;
          item["instructorName"] = courseInstructorData.user.firstName + " " + courseInstructorData.user.lastName;
          item["term"] = d.term;
          item["year"] = d.year;
          item["assignedTAs"] = numOfAssignedTAs + " / " + d.taQuota;
          item["instructor_user_id"] = d.courseInstructor;
          item["course_id"] = d._id;
        } else {
          item["courseNumber"] = "";
          item["instructorName"] = "";
          item["term"] = "";
          item["year"] = "";
          item["assignedTAs"] = "";
          item["instructor_user_id"] = "";
          item["course_id"] = "";

        }
        courseObject.push(item);
      }
      setCourses(courseObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Load data
    fetchCourseData();
  }, []);



  return (
    <div>
      <ImportForm taskName="TACohort" uploadUrl="http://127.0.0.1:3000/api/cohort/upload" fetchFunction={fetchCourseData} />
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }} >All Courses</h2>
        </div>
        <div id="profTable">
          <table>
            <thead>
              <tr>
                <th className="column0"></th>
                <th className="column1">Courses</th>
                <th className="column2">Instructor</th>
                <th className="column3">Term</th>
                <th className="column4">Year</th>
                <th className="column5">Assigned TA'S/Quota</th>
              </tr>
            </thead>
            <tbody>
              {/**Set to hardcoded list of profs for testing purposes */}
              {Courses.map((course: Course, i: number) => {
                if (course) {
                  return <AssignTARow key={i} course={course} fetchCourseData={fetchCourseData} />;
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

export default AssignTA;
