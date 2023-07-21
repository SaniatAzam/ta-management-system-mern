import "../../style/userTable.css";
import { TA } from "../../classes/TA";
import AddReviewForm from "./AddReviewForm";

const TARow = ({ ta, fetchTAData }: { ta: TA; fetchTAData: Function }) => {

  return (
    <tr className="body">
      <td className="column0">{ta.email}</td>
      <td className="column1">{ta.firstName}</td>
      <td className="column2">{ta.lastName}</td>
      <td className="column3">{ta.courseNum}</td>
      <td className="column4 course-button"><AddReviewForm ta={ta} /></td>
    </tr>
  );
};

export default TARow;