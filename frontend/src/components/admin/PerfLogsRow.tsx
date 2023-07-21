import { PerformanceLog } from "../../classes/PerformanceLog";

const PerfLogsRow = ({ perfLog, fetchTAPerfLogs }: { perfLog: PerformanceLog; fetchTAPerfLogs: Function }) => {

  const term = perfLog.term_year;
  const course = perfLog.course_num;
  const comment = perfLog.comment;
  const prof = perfLog.professor_name;

  return (

    <tr className="body">
      <td className="column0">{term}</td>
      <td className="column1">{course}</td>
      <td className="column2">{comment}</td>
      <td className="column3">{prof}</td>
    </tr>

  );
};

export default PerfLogsRow;