import "../../style/userTable.css";
import { TimeSheet } from "../../classes/TimeSheet";

const TimeSheetRow = ({ timeSheet, fetchTimeSheet }: { timeSheet: TimeSheet; fetchTimeSheet: Function; }) => {
  const taName = timeSheet.duties
  const termYear = timeSheet.location
  const comment = timeSheet.office_hours
  console.log(taName);

  return (
    <tr className="body">
      <td className="column1">{taName}</td>
      <td className="column2">{termYear}</td>
      <td className="column3">{comment}</td>
    </tr>
  );
};

export default TimeSheetRow;
