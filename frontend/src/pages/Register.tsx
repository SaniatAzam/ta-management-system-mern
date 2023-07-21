import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/mcgill_logo.jpg";
// import { UserContext } from "../App";
import "../App.css";
import "../style/login.css";

const Register: React.FC = () => {
  // Load global state

  // Declare hooks
  const [firstname, setFname] = useState<string>("");
  const [lastname, setLname] = useState<string>("");
  const [studentid, setID] = useState<string>("");
  const [courses, setCourses] = useState<Array<String>>([]);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [usertypes, setUserTypes] = useState<Array<string>>([]);

  // on submit pass email and password values entered by user
  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let hasCourses = true;
    if (courses.length < 2 && (courses[0] === "" || courses[0] === undefined)) {
      hasCourses = false;
    }
    const valid_usertypes = ["stud", "prof", "sysop", "admin", "ta"]

    if (usertypes.includes("stud") && (usertypes.includes("prof") || usertypes.includes("admin") || usertypes.includes("sysop"))) {
      console.error("Student role can't double with prof, admin or sysop");
      setError("Student role can't double with prof, admin or sysop");
      return;
    }

    if ((usertypes.length < 2 && usertypes[0] == "") || !usertypes.every(v => valid_usertypes.includes(v))) {
      console.error("Incorrect usertype entry");
      setError("Incorrect usertype entry. Please fix.");
      return;
    }

    // error if empty email or password
    if (!email || !password || !firstname || !lastname) {
      // error if user does not enter username and/or password
      console.error("Missing manditory fields, please fill out form correctly.");
      setError("Please fill missing required fields.");
      return;
    }

    let validCourse = true;
    for (const course of courses) {
      console.log(course)
      try {
        const res = await fetch("http://127.0.0.1:3000/api/course");
        const data = await res.json();
        const courseObject = [];
        for (const d of data.courses) {
          courseObject.push(d.courseNumber);
        }
        if (!courses.every(v => courseObject.includes(v))) {
          validCourse = false;
        }

        if (res.status === 201) {
          const result = await res.json();
          validCourse = false;
        }
      } catch (err) {
        validCourse = false;
      }
    }

    if (!validCourse) {
      console.error("One or more of your courses do not exist. Please fill form correctly.");
      setError("One or more of your courses do not exist. Please fill form correctly.");
      return;
    }

    if (usertypes.some(e => e === "stud") && (!hasCourses || !studentid)) {
      console.error("Missing manditory field for student, please fill out form correctly.");
      setError("Please ensure courses and ID are present.");
      return;
    }

    try {
      // Make login API call
      // CAUTION: Do not hardcode the URLs, instead use routers

      const res = await fetch(
        "http://127.0.0.1:3000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            // remove later v
            userType: usertypes,
          }),
        }
      );

      // If registration was successful, redirect to login page
      if (res.status === 201) {
        const result = await res.json();
        if (usertypes.some(e => e === "stud")) {

          const stud_res = await fetch(
            "http://127.0.0.1:3000/api/student/add",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                studentEmail: email,
                studentID: studentid,
                course1: courses[0] !== 'undefined' ? courses[0] : " ",
                course2: courses[1] !== 'undefined' ? courses[2] : " ",
                course4: courses[3] !== 'undefined' ? courses[3] : " ",
                course5: courses[4] !== 'undefined' ? courses[4] : " ",
                course6: courses[5] !== 'undefined' ? courses[5] : " ",
              }),
            }
          );

          if (stud_res.status === 201) {
            const stud_result = await stud_res.json();
            navigate("/login");
          } else {
            console.log(stud_res)
            setError("Invalid Student Registration.");
          }
        }

        // set user state
        // setUser(result);
        navigate("/login");
        return;
      } else {
        // error unable to login, invalid username or password
        console.log(res)
        setError("Invalid Registration.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login">
      <div className="welcome">
        <form onSubmit={submitHandler}>

          <div className="form-inner">

            <img className="logo" src={logo} alt="mcgill-logo" />

            <p className="top">Create your account</p>
            {error !== "" ? <div className="error"> * {error} </div> : ""}

            <div className="form-group">

              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                id="firstname"
                onChange={(e) => setFname(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                id="lastname"
                onChange={(e) => setLname(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="studentid"
                placeholder="Student ID (For Students, TAs)"
                id="studentid"
                onChange={(e) => setID(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="courses"
                placeholder="Courses (Comma Sep, For Students, TAs)"
                id="courses"
                onChange={(e) => setCourses((e.target.value).split(", "))}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="email"
                placeholder="Email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* remove below */}
            <div className="form-group">
              <input
                type="usertype"
                name="usertype"
                placeholder="Role: stud, prof, ta, admin, sysop"
                id="usertype"
                onChange={(e) => setUserTypes((e.target.value).split(", "))}
              />
            </div>

            <div className="sign-in-button">
              <input type="submit" value="Register" />
            </div>

            <p className="bottom">
              <Link className="links" to="/login">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;