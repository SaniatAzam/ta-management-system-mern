import { useState, useContext } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import "../../style/userTable.css";
import { UserContext } from "../../App";

function AddToWishlist({ fetchTAData, course }) {
  const [show, setShow] = useState(false);
  const [tempTAName, setTAName] = useState<string>();
  const [tempTermYear, setTempTermYear] = useState<string>();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:3000/api/prof/addToWishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prof_first_name: user.firstName,
          prof_last_name: user.lastName,
          TA_name: tempTAName,
          term_year_this_is_for: tempTermYear,
          course_num: course
        }),
      });
      if (res.status === 201) {
        const data = await res.json();
        setTimeout(() => {
          fetchTAData();
        }, 500);
      } else {
        alert("Error while adding to Wishlist");
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
            Add a TA to Wishlist
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
                  value={tempTAName}
                  onChange={(e) => setTAName(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  required
                  type="string"
                  placeholder="Term"
                  value={tempTermYear}
                  onChange={(e) => setTempTermYear(e.target.value)}
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

export default AddToWishlist;
