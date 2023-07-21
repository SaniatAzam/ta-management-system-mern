import React, { useEffect } from "react";
import "../../style/userTable.css";
import { Container } from "react-bootstrap";
import { PerformanceLog } from "../../classes/PerformanceLog";
import PerfLogRow from "./PerfLogRow";
import AddPerfLogForm from "./AddPerformanceLog";

const ManagePerfLogs = (props) => {
  const [perfLogs, setPerfLogs] = React.useState<Array<PerformanceLog>>([]);

  const fetchPerformanceData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/prof/getAllPerfLogs");
      const data = await res.json();
      console.log(data);
      const perfLogObject = [];
      for (const d of data.perfLogs) {
        let item = {};
        if (d.course_num == props.course) {
          item["ta_name"] = d.ta_name;
          item["term_year"] = d.term_year;
          item["professor_name"] = d.professor_name;
          item["course_num"] = d.course_num;
          item["createdAt"] = d.createdAt;
          item["comment"] = d.comment;
        } else {
          item["ta_name"] = ""
          item["term_year"] = ""
          item["professor_name"] = ""
          item["course_num"] = ""
          item["createdAt"] = ""
          item["comment"] = ""
        }
        perfLogObject.push(item);
      }
      setPerfLogs(perfLogObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Load data
    fetchPerformanceData();
  }, []);

  return (
    <div>
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>TA Performance Logs</h2>
          <AddPerfLogForm fetchProfData={fetchPerformanceData} course={props.course} />
        </div>
        <div id="profTable">
          <table>
            <thead>
              <tr>
                <th className="column1">TA Name</th>
                <th className="column2">Term Year</th>
                <th className="column3">Comment</th>
                <th className="column4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {/**Set to hardcoded list of profs for testing purposes */}
              {perfLogs.map((log: PerformanceLog, i: number) => {
                if (log) {
                  return (
                    <PerfLogRow
                      key={i}
                      perfLog={log}
                      fetchPerformanceData={fetchPerformanceData}
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

export default ManagePerfLogs;