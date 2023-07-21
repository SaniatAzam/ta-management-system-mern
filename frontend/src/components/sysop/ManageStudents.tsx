import React, { useEffect } from "react";
import StudentRow from "./StudentRow";
import "../../style/userTable.css";
import { Student } from "../../classes/Student";
import { Container } from "react-bootstrap";

const ManageStudents = () => {
  const [students, setStudents] = React.useState<Array<Student>>([]);

  const fetchStudentData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/student");
      const data = await res.json();
      const studentObject = [];
      console.log(data)
      for (const d of data.students) {
        const studentRes = await fetch(
          "http://127.0.0.1:3000/api/users/" + d.student
        );
        let item = {
          faculty: d.faculty,
          department: d.department,
        };
        if (studentRes) {
          console.log("AMMA")
          console.log(d)
          const studentData = await studentRes.json();
          item["firstName"] = studentData.user.firstName;
          item["lastName"] = studentData.user.lastName;
          item["email"] = studentData.user.email;
          item["studentID"] = d.studentID
        } else {
          item["firstName"] = "";
          item["lastName"] = "";
          item["email"] = "";
          item["studentID"] = "";
        }
        studentObject.push(item);
      }
      setStudents(studentObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Load data
    fetchStudentData();
  }, []);

  return (
    <div>
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>All Students</h2>
          {/* <AddProfForm fetchProfData={fetchProfData} /> */}
        </div>
        <div id="profTable">
          <table>
            <thead>
              <tr>
                <th className="column0"></th>
                <th className="column1">Email</th>
                <th className="column2">First Name</th>
                <th className="column3">Last Name</th>
                <th className="column4">Student ID</th>
                <th className="column5">Course</th>
              </tr>
            </thead>
            <tbody>
              {/**Set to hardcoded list of profs for testing purposes */}
              {students.map((student: Student, i: number) => {
                console.log(student);
                if (student) {
                  return (
                    <StudentRow
                      key={i}
                      student={student}
                      fetchStudentData={fetchStudentData}
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

export default ManageStudents;