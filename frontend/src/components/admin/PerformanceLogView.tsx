import { PerformanceLog } from "../../classes/PerformanceLog";

const PerformanceLogView = ({ pLog, fetchPerformanceLog }: { pLog: PerformanceLog; fetchPerformanceLog: Function }) => {
  const instructor = pLog.professor_name;
  const courseNum = pLog.course_num;
  const term_year = pLog.term_year;
  const comment = pLog.comment;


  return (
    <>
      <li><strong>{instructor}, {courseNum}, {term_year}:</strong> "{comment}" </li>
      <div style={{
        borderTop: '1px solid gray',
        height: '1px',
        width: 'auto',
        opacity: '0.1'
      }}>
      </div>
    </>
  );
}


export default PerformanceLogView;