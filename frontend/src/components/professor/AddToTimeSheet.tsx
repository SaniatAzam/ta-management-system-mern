import { useState, useContext } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import "../../style/userTable.css";
import { UserContext } from "../../App";

function AddToTimeSheet({ fetchTimeSheet, course }) {
  const [show, setShow] = useState(false);
  const [tempDay, setTempDay] = useState<string>();
  const [tempStartTime, setTempStartTime] = useState<string>();
  const [tempEndTime, setTempEndTime] = useState<string>();
  const [tempFirstName, setTempFirstName] = useState<string>();
  const [tempLastName, setTempLastName] = useState<string>();
  const [tempDuties, setTempDuties] = useState<string>();
  const [tempLocation, setTempLocation] = useState<string>();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:3000/api/prof/addToTimeSheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: tempFirstName,
          last_name: tempLastName,
          course_num: course,
          office_hours_from: tempStartTime,
          office_hours_to: tempEndTime,
          office_hours_day: tempDay,
          duties: tempDuties,
          location: tempLocation,
        }),
      });
      if (res.status === 201) {
        const data = await res.json();
        setTimeout(() => {
          fetchTimeSheet()
        }, 500);
      } else {
        alert("Error while adding to Time Sheet.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button className="mb-4 mt-2" onClick={() => setShow(true)}>
        <AddIcon />
      </button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Add To Time Sheet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="First Name"
                  value={tempFirstName}
                  onChange={(e) => setTempFirstName(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Last Name"
                  value={tempLastName}
                  onChange={(e) => setTempLastName(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Select
                  required
                  onChange={(e) => setTempDay(e.target.value)}
                >
                  <option value="">Select a Day for Office Hours</option>
                  <option value="M">Monday</option>
                  <option value="T">Tuesday</option>
                  <option value="W">Wednesday</option>
                  <option value="TR">Thursday</option>
                  <option value="F">Friday</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Select a start time (24HR format eg: 18:00)"
                  value={tempStartTime}
                  onChange={(e) => setTempStartTime(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Select a end time (24HR format eg: 18:00)"
                  value={tempEndTime}
                  onChange={(e) => setTempEndTime(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Enter your duties for the semester"
                  value={tempDuties}
                  onChange={(e) => setTempDuties(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Enter location of office hours"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                />
              </Col>
            </Row>
            <Button className="mt-3" variant="light" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddToTimeSheet;
