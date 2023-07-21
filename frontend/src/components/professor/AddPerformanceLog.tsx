import { useState, useContext } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import "../../style/userTable.css";
import { UserContext } from "../../App";

function AddPerfLogForm({ fetchProfData, course }) {
  const [show, setShow] = useState(false);
  const [tempComment, setTempComment] = useState<string>();
  const [tempYear, setTempYear] = useState<string>();
  const [tempTA, setTempTA] = useState<string>();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://127.0.0.1:3000/api/prof/addToPerformanceLog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prof_first_name: user.firstName,
            prof_last_name: user.lastName,
            comment: tempComment,
            ta_name: tempTA,
            course_num: course,
            term_year: tempYear
          }),
        }
      );
      if (res.status === 201) {
        const data = await res.json();
        setTimeout(() => {
          fetchProfData();
        }, 500);
      } else {
        alert("Error while adding to Performance Log");
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
            Add a Performance Log
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="TA Name"
                  value={tempTA}
                  onChange={(e) => setTempTA(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Term Year"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Comment"
                  value={tempComment}
                  onChange={(e) => setTempComment(e.target.value)}
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

export default AddPerfLogForm;