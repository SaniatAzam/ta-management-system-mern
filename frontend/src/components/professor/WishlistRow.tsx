import "../../style/userTable.css";
import { ProfTAWishlist } from "../../classes/ProfTAWishlist";

const WishListRow = ({ ta, fetchTAData }: { ta: ProfTAWishlist; fetchTAData: Function; }) => {
  const taName = ta.TA_name
  const termYear = ta.term_year_this_is_for
  console.log(ta)

  return (
    <tr className="body">
      <td className="column1">{taName}</td>
      <td className="column2">{termYear}</td>
    </tr>
  );
};

export default WishListRow;