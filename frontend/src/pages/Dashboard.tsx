import React, { useContext, useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown, Tab, Tabs } from "react-bootstrap";
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
import StartPageProfessor from "../components/professor/StartPageProfessor";
import ManageTAInfo from "../components/admin/ManageTAInfo";
import UnassignTA from "../components/admin/UnassignTA";
import ManageStudents from "../components/sysop/ManageStudents";
import AddTAToCourse from "../components/admin/AddTAToCourse";
import StartPageTA from "../components/ta/StartPageTA";



export function Dashboard() {
  const tabsPerProfile = new Map<UserTypes, Array<string>>([
    [UserTypes.Sysop, ["Professors", "Students", "Courses", "Users"]],
    [UserTypes.Student, ["Rating"]],
    [UserTypes.Admin, ["TA Info & History", "Assign TA", "Unassign TA", "Add TA To Course", "Remove TA from Course"]],
    [UserTypes.Professor, ["Welcome Professor!"]],
    [UserTypes.TA, ["Welcome TA!", "Rating"]],
  ]);

  const userTypePermissions = new Map<UserTypes, Array<UserTypes>>([
    [UserTypes.Sysop, [UserTypes.Sysop, UserTypes.Student, UserTypes.Admin, UserTypes.Professor, UserTypes.TA]],
    [UserTypes.Student, [UserTypes.Student]],
    [UserTypes.Admin, [UserTypes.Admin, UserTypes.Professor, UserTypes.Student]],
    [UserTypes.Professor, [UserTypes.Professor, UserTypes.Student]],
    [UserTypes.TA, [UserTypes.TA, UserTypes.Student]],
  ]);

  const tabNamesToJSX = new Map<string, JSX.Element>([
    ["Professors", <ManageProfessors />],
    ["Courses", <ManageCourses />],
    ["Users", <ManageUsers />],
    ["Rating", <RateTA />],
    ["Assign TA", <AssignTA />],
    ["Welcome Professor!", <StartPageProfessor />],
    ["Welcome TA!", <StartPageTA />],
    ["TA Info & History", <ManageTAInfo />],
    ["Students", <ManageStudents />],
    ["Unassign TA", <UnassignTA />],
    ["Add TA To Course", <AddTAToCourse />],
  ]);

  const navigate = useNavigate();
  /**
   * Get list of user's profiles/types
   * @TODO Retrieve this information from the actual global user state
   */
  const { user, setUser } = useContext(UserContext);


  function collect_user_profiles() {
    const user_profiles = new Set<UserTypes>();
    for (const tp of user.userType) {
      // user_profiles.add(userTypePermissions.get(tp));
      userTypePermissions.get(tp).forEach(item => user_profiles.add(item))
    }
    console.log(user_profiles);
    console.log(Array.from(user_profiles));

    return Array.from(user_profiles);
  }

  // Set a default profile
  const [currentProfile, setCurrentProfile] = useState<UserTypes>(
    user.userType[0]
  );

  // Set the default array of tabs relative to our default profile
  const [currentTabs, setCurrentTabs] = useState<Array<string>>(
    tabsPerProfile.get(currentProfile)!
  );

  // On nav bar selection, this function sets the new current profile and associated tabs.
  function handleNavClick(profile: UserTypes): void {
    setCurrentProfile(profile);
    setCurrentTabs(tabsPerProfile.get(profile)!);
  }

  function handleLogout(): void {
    navigate("/logout");
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
          <Nav className="me-auto">
            <NavDropdown title={currentProfile} id="basic-nav-dropdown">
              {

                collect_user_profiles().map((profile) => (
                  <NavDropdown.Item
                    key={profile.toString()}
                    onClick={() => {
                      handleNavClick(profile);
                    }}
                  >
                    {profile}
                  </NavDropdown.Item>
                ))}
            </NavDropdown>
          </Nav>
          <button className="logout" onClick={() => handleLogout()}>
            <LogoutIcon />
          </button>
        </Container>
      </Navbar>
      <Container>
        <Tabs
          defaultActiveKey="0"
          transition={false}
          id="noanim-tab"
          className="sub"
        >
          {currentTabs.map((currentTabName, i) => (
            <Tab className="sub" key={i} eventKey={i} title={currentTabName}>
              {tabNamesToJSX.get(currentTabName)}
            </Tab>
          ))}
        </Tabs>
      </Container>
    </div>
  );
}

export default Dashboard;
