import { TACohort } from "../../classes/TACohort";
import TAInfoModal from "./TAInfoModal";

const TAInfoRow = ({ ta, fetchAllTAs }: { ta: TACohort; fetchAllTAs: Function }) => {

  const name = ta.legal_name;
  const email = ta.email;
  const supervisor_name = ta.supervisor_name;

  return (

    <tr className="body">
      <td className="column0">{name}</td>
      <td className="column1">{email}</td>
      <td className="column2">{supervisor_name}</td>
      <td className="column3">
        <TAInfoModal ta={ta} />
      </td>
    </tr>

  );
};

export default TAInfoRow;