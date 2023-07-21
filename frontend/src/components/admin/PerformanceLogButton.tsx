import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import React from "react";
import "../../style/userTable.css";
import ReviewsIcon from '@mui/icons-material/Reviews';
import { PerformanceLog } from "../../classes/PerformanceLog";
import PerformanceLogView from "./PerformanceLogView";


const PerformanceLogButton = ({ name }: { name: string }) => {
  const [logs, setLogs] = React.useState<Array<PerformanceLog>>([]);
  const [showDetails, setShowDetails] = useState(false);

  const fetchPerformanceLog = async () => {
    const logObject = [];
    try {
      const res = await fetch("http://127.0.0.1:3000/api/prof/getAllPerfLogs");
      if (res) {
        const allPLogs = await res.json();
        console.log(allPLogs);
        for (const d of allPLogs.perfLogs) {
          let item = {};
          if (d.ta_name === name) {
            item["term_year"] = d.term_year;
            item["course_num"] = d.course_num;
            item["comment"] = d.comment;
            item["professor_name"] = d.professor_name;
            logObject.push(item);
          }
        }
      };
      setLogs(logObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPerformanceLog();
  }, []);

  const pStyle = {
    border: "red",
  };

  return (
    <div style={{ zIndex: 200 }}>
      <button className="btn btn-secondary" onClick={() => setShowDetails(true)}>
        <ReviewsIcon />
      </button>

      <Modal show={showDetails} style={pStyle} onHide={() => setShowDetails(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">{name}'s Perfomance Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {logs.map((pLog: PerformanceLog, i: number) => {
              if (pLog) {
                return (
                  <PerformanceLogView key={i} pLog={pLog} fetchPerformanceLog={fetchPerformanceLog} />
                )
              }
            })}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );


}

export default PerformanceLogButton;