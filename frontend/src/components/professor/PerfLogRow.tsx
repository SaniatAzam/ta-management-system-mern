import { useState } from "react";
import "../../style/userTable.css";
import { Course } from "../../classes/Course";
import { PerformanceLog } from "../../classes/PerformanceLog";

const PerfLogRow = ({
  perfLog,
  fetchPerformanceData,
}: {
  perfLog: PerformanceLog;
  fetchPerformanceData: Function;
}) => {
  const [show, setShow] = useState(false);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const taName = perfLog.ta_name;
  const termYear = perfLog.term_year;
  const comment = perfLog.comment;
  const createdAt = perfLog.createdAt;

  return (
    <tr className="body">
      <td className="column1">{taName}</td>
      <td className="column2">{termYear}</td>
      <td className="column1">{comment}</td>
      <td className="column2">{createdAt}</td>
    </tr>
  );
};

export default PerfLogRow;
