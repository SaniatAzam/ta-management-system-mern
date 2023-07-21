import { useState, useContext } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import "../../style/userTable.css";
import { UserContext } from "../../App";

function RateTA() {
  const [tempComment, setTempComment] = useState<string>();
  const [tempRating, setTempRating] = useState<string>();
  const [tempYear, setTempYear] = useState<string>();
  const [tempCourseNum, setCourseNum] = useState<string>();
  const [tempTerm, setTempTerm] = useState<string>();
  const [tempTA, setTempTA] = useState<string>();
  const { user, setUser } = useContext(UserContext);
  console.log(user);
  console.log(user.firstName + " " + user.lastName);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:3000/api/review/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseNumber: tempCourseNum,
          term: tempTerm,
          year: parseInt(tempYear),
          taEmail: tempTA,
          reviewerEmail: user.email,
          rating: tempRating,
          comment: tempComment
        }),
      });
      if (res.status === 201) {
        const data = await res.json();
        setTimeout(() => {
          alert('Rating Added Successfully!')
        }, 500);
      } else {
        alert("Error while adding rating details.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row style={{ marginBottom: "20px", maxWidth: "50%" }}>
        <Col>
          <Form.Control
            required
            type="string"
            placeholder="TA Email"
            value={tempTA}
            onChange={(e) => setTempTA(e.target.value)}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px", maxWidth: "50%" }}>
        <Col>
          <Form.Control
            required
            type="string"
            placeholder="Course Num"
            value={tempCourseNum}
            onChange={(e) => setCourseNum(e.target.value)}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px", maxWidth: "50%" }}>
        <Col>
          <Form.Control
            required
            type="string"
            placeholder="Term"
            value={tempTerm}
            onChange={(e) => setTempTerm(e.target.value)}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px", maxWidth: "50%" }}>
        <Col>
          <Form.Control
            required
            type="string"
            placeholder="Year"
            value={tempYear}
            onChange={(e) => setTempYear(e.target.value)}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px", maxWidth: "50%" }}>
        <Col>
          <Form.Select required onChange={(e) => setTempRating(e.target.value)}>
            <option value="">Rate your TA (0-5)</option>
            <option value="0">0 (Extremely Unsatisfactory)</option>
            <option value="1">1 (Very Unsatisfactory)</option>
            <option value="2">2 (Neutral)</option>
            <option value="3">3 (Satisfactory)</option>
            <option value="4">4 (Very Satisfactory)</option>
            <option value="5">5 (Extremely Satisfractory)</option>
          </Form.Select>
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px", maxWidth: "50%" }}>
        <Col>
          <Form.Control
            required
            type="string"
            placeholder="Comment"
            value={tempComment}
            style={{ minHeight: "100px" }}
            onChange={(e) => setTempComment(e.target.value)}
          />
        </Col>
      </Row>
      <Button className="mt-3" variant="light" type="submit">
        Add
      </Button>
    </Form>
  );
}

export default RateTA;
