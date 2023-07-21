import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/images/mcgill_logo.jpg";
import "../style/subTopbar.css";
import { UserContext } from "../App";
import { UserTypes } from "../enums/UserTypes";
import ManageProfessors from "../components/sysop/ManageProfessors";
import ManageCourses from "../components/sysop/ManageCourses";
import ManageUsers from "../components/sysop/ManageUsers";
import RateTA from "../components/student/RateTA";
import AssignTA from "../components/admin/AssignTA";
import ManageTAs from "../components/professor/AllTAReport";
import SelectCourse from "../components/professor/SelectCourse";
import { profile } from "console";
import StartPageTA from "../components/ta/StartPageTA";

export function TAManagement() {
  const tabsPerProfile = new Map<UserTypes, Array<string>>([
    [UserTypes.Professor, ["TA Management"]],
    [UserTypes.TA, ["Rating"]]
  ]);

  const tabNamesToJSX = new Map<string, JSX.Element>([
    ["Professors", <ManageProfessors />],
    ["Courses", <ManageCourses />],
    ["Users", <ManageUsers />],
    ["Rating", <RateTA />],
    ["Assign TA", <AssignTA />],
    ["TA Management", <ManageTAs />],
  ]);

  const navigate = useNavigate();
  /**
   * Get list of user's profiles/types
   * @TODO Retrieve this information from the actual global user state
   */
  const { user, setUser } = useContext(UserContext);

  // Set a default profile
  const [currentProfile, setCurrentProfile] = useState<UserTypes>(
    user.userType[0]
  );

  function handleExit(): void {
    navigate("/dashboard");
  }

  useEffect(() => {
    // if no user redirect to login page
    if (!user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Render nav dropdown options and nav tabs based on state above
  return (
    <div>
      <Navbar expand="lg">
        <Container>
          <img className="logo" src={logo} alt="mcgill-logo" />
          <Nav className="me-auto">TA Management</Nav>
          <button className="logout" onClick={() => handleExit()}>
            <LogoutIcon />
          </button>
        </Container>
      </Navbar>
      <br></br>
      <SelectCourse className="me-auto"></SelectCourse>
    </div>
  );
}

export default TAManagement;