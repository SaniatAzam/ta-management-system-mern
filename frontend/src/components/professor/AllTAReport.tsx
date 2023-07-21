import React, { useEffect } from "react";
import AddProfForm from "../sysop/AddProfForm";
import ProfRow from "../sysop/ProfRow";
import "../../style/userTable.css";
import { Professor } from "../../classes/Professor";
import { Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../../assets/images/mcgill_logo.jpg";

const ManageTAs = () => {
  const [profs, setProfs] = React.useState<Array<Professor>>([]);

  const fetchProfData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/cohort");
      const data = await res.json();
      const profObject = [];
      for (const d of data.cohorts) {
        const taRes = await fetch(
          "http://127.0.0.1:3000/api/users/" + d.ta_user
        );
        let item = {
          faculty: d.faculty,
          department: d.department,
        };
        if (taRes) {
          const instructorData = await taRes.json();
          item["firstName"] = instructorData.user.firstName;
          item["lastName"] = instructorData.user.lastName;
          item["email"] = instructorData.user.email;
        } else {
          item["firstName"] = "";
          item["lastName"] = "";
          item["email"] = "";
        }
        profObject.push(item);
      }
      setProfs(profObject);
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Load data
    fetchProfData();
  }, []);

  function handleExit(): void {
    navigate("/dashboard");
  }

  return (
    <div>
      <Container>
        <img className="logo" src={logo} alt="mcgill-logo" />
        <button className="logout" onClick={() => handleExit()}>
          <LogoutIcon />
        </button>
      </Container>
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>All TAs Report</h2>
          <AddProfForm fetchProfData={fetchProfData} />
        </div>
        <div id="profTable">
          <table>
            <thead>
              <tr>
                <th className="column0"></th>
                <th className="column1">Email</th>
                <th className="column2">First name</th>
                <th className="column3">Last name</th>
                <th className="column4">Faculty</th>
                <th className="column5">Department</th>
                <th className="column5">Courses</th>
              </tr>
            </thead>
            <tbody>
              {/**Set to hardcoded list of profs for testing purposes */}
              {profs.map((professor: Professor, i: number) => {
                if (professor) {
                  return (
                    <ProfRow
                      key={i}
                      professor={professor}
                      fetchProfData={fetchProfData}
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

export default ManageTAs;
