import React, { useEffect, useState } from "react";
import "../../style/userTable.css";
import { Course } from "../../classes/Course";
import { NavDropdown, Container } from "react-bootstrap";
import RenderPages from "./RenderPages";

const SelectCourse = (props) => {
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [currentCourse, setCurrentCourse] = React.useState("Select Course");

  function handleNavClick(course: Course): void {
    setCurrentCourse(course.courseNumber);
  }

  const fetchCourseData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/course");
      const data = await res.json();
      const courseObject = [];
      for (const d of data.courses) {
        const instructorRes = await fetch(
          "http://127.0.0.1:3000/api/users/" + d.courseInstructor
        );
        let item = {
          courseNumber: d.courseNumber,
          courseName: d.courseName,
          courseDesc: d.courseDesc,
          term: d.term,
          year: d.year,
        };
        if (instructorRes) {
          const instructorData = await instructorRes.json();
          item["instructorName"] =
            instructorData.user.firstName + " " + instructorData.user.lastName;
        } else {
          item["instructorName"] = "";
        }
        courseObject.push(item);
      }
      setCourses(courseObject);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  return (
    <Container>
      <h4 style={{ marginBottom: "20px" }}>Welcome to TA Management!</h4>
      <p style={{ marginBottom: "20px" }}>
        <b>Select an option</b> in the drop down below to view the menu!
      </p>
      <NavDropdown title={currentCourse}>
        {courses.map((course) => (
          <NavDropdown.Item
            key={course.courseNumber.toString()}
            onClick={() => {
              handleNavClick(course);
            }}
          >
            {course.courseNumber}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
      <RenderPages course={currentCourse}></RenderPages>
    </Container>
  );
};

export default SelectCourse;
