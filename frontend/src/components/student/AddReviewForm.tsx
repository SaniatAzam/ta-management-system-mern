import { useState, useContext } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Modal } from "react-bootstrap";
import { UserContext } from "../../App";
import "../../style/userTable.css";

function AddReviewForm({ ta }) {
  const [show, setShow] = useState(false);
  const [reviewBox, setReviewBox] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const taCourseRes = await fetch("http://127.0.0.1:3000/api/course/" + ta.courseID);
      if (taCourseRes) {
        const taCourseData = await taCourseRes.json();
        const courseNum = taCourseData.course.courseNumber;
        const courseTerm = taCourseData.course.term;
        const courseYear = taCourseData.course.year;
        const taFname = ta.firstName;
        const taLname = ta.lastName;
        const taEmail = ta.email;
        const res = await fetch("http://127.0.0.1:3000/api/review/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseNumber: courseNum,
            term: courseTerm,
            year: courseYear,
            taEmail: taEmail,
            reviewer: user,
            rating: rating,
            comment: reviewBox,
          }),
        });

        if (res.status === 201) {
          const data = await res.json();
          setTimeout(() => {
            alert("Review published successfully!");
            setShow(false);
          }, 500);
        } else {
          alert("Error while adding Review.");
        }
      } else {
        alert("Couldn't find the assoicated Course object for this TA, contact Admin.")
      }

    } catch (err) {
      console.log(err);
    }
  };

  function handleCheckbox(e) {
    setRating(e.target.value);
    console.log(e.target.value);
  }

  return (
    <div>
      <button className="courses" onClick={() => setShow(true)}>
        <OpenInFullIcon fontSize="small" /> Rate TA
      </button>

      <Modal show={show} onHide={() => setShow(false)}
        dialogClassName="modal-lg"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">Review TA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Label>Review</Form.Label>
              <Col>
                <Form.Control required type="firstName"
                  as="textarea" rows={3}
                  placeholder="Write your review here."
                  value={reviewBox}
                  onChange={(e) => setReviewBox(e.target.value)} />
              </Col>
            </Row>

            <Row>
              <Form.Label>Rating</Form.Label>
              <Col>
                <Form.Check inline type="radio" name="rating" label="1" value="1" onChange={handleCheckbox} />
                <Form.Check inline type="radio" name="rating" label="2" value="2" onChange={handleCheckbox} />
                <Form.Check inline type="radio" name="rating" label="3" value="3" onChange={handleCheckbox} />
                <Form.Check inline type="radio" name="rating" label="4" value="4" onChange={handleCheckbox} />
                <Form.Check inline type="radio" name="rating" label="5" value="5" onChange={handleCheckbox} />
              </Col>
            </Row>

            <Button className="mt-3" variant="light" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddReviewForm;