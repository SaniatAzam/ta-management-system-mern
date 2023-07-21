import { useContext, useState, useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../style/subTopbar.css";
import { UserContext } from "../../App";
import { UserTypes } from "../../enums/UserTypes";
import ManageProfessors from "../../components/sysop/ManageProfessors";
import ManageCourses from "../../components/sysop/ManageCourses";
import ManageUsers from "../../components/sysop/ManageUsers";
import RateTA from "../student/RateTA";
import AssignTA from "../../components/admin/AssignTA";
import ManageTAs from "./AllTAReport";
import ManageWishlist from "../../components/professor/ManageWishlist";
import ManagePerfLogs from "./ManagePerformanceLogs";
import ManageTimeSheet from "./ManageTimeSheet";

export function RenderPages(props) {
  const tabsPerProfile = new Map<UserTypes, Array<string>>([
    [
      UserTypes.TA,
      [
        "Office Hours/Responsibilities",
      ],
    ],
    [
      UserTypes.Professor,
      ["TA Performance Log", "TA Wishlist", "Office Hours/Responsibilities"],
    ],
  ]);

  const tabNamesToJSX = new Map<string, JSX.Element>([
    ["Professors", <ManageProfessors />],
    ["Courses", <ManageCourses />],
    ["Users", <ManageUsers />],
    ["Rating", <RateTA />],
    ["Assign TA", <AssignTA />],
    ["ProfessorPage1", <ManageTAs />],
    ["TA Wishlist", <ManageWishlist course={props.course} />],
    ["TA Performance Log", <ManagePerfLogs course={props.course} />],
    ["Office Hours/Responsibilities", <ManageTimeSheet course={props.course} />]
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
  if (props.course != "Select Course") {
    return (
      <div>
        <Container>
          <Tabs
            defaultActiveKey="0"
            transition={false}
            id="noanim-tab"
            className="sub"
          >
            {currentTabs.map((currentTabName, i) => (
              <Tab
                className="sub"
                key={i}
                eventKey={i}
                title={currentTabName}
              >
                {tabNamesToJSX.get(currentTabName)}
              </Tab>
            ))}
          </Tabs>
        </Container>
      </div>
    );
  }
}

export default RenderPages;
