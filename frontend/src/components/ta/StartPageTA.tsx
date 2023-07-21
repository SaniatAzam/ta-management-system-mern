import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/userTable.css";
import { NavDropdown, Container } from "react-bootstrap";
import { UserContext } from "../../App";

const StartPageTA = (props) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  function handleNavClick(option: String): void {
    if (option === features[0]) {
      navigate("/alltareport");
    }
  }

  let features = ["TA Management"];
  return (
    <Container>
      <p style={{ marginTop: "60px", marginBottom: "20px" }}>
        <b>Select selecting the following drop option</b> will navigate you to the All TA report
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

export default StartPageTA;