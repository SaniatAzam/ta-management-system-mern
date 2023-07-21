import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/userTable.css";
import { NavDropdown, Container } from "react-bootstrap";
import { UserContext } from "../../App";

const StartPageProfessor = (props) => {

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  function handleNavClick(option: String): void {
    if (option === features[0]) {
      navigate("/tamanagement")
    }
    if (option === features[1]) {
      navigate("/alltareport");
    }
  }

  let features = ["TA Management", "All TA Report"]
  return (
    <Container>
      <h4 style={{ marginBottom: "20px" }}>Welcome Professor {user.lastName}</h4>
      <p style={{ marginBottom: "20px" }}>
        <b>Select an option</b> in the drop down below to reach intended feature
      </p>
      <NavDropdown title={"Select Feature"}>
        {features.map((feature) => (
          <NavDropdown.Item
            key={feature.toString()}
            onClick={() => {
              handleNavClick(feature);
            }}
          >
            {feature}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    </Container>
  );
};

export default StartPageProfessor;