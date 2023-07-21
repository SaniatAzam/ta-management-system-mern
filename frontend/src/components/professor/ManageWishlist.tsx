import React, { useEffect } from "react";
import WishListRow from "./WishlistRow";
import "../../style/userTable.css";
import { Container } from "react-bootstrap";
import { ProfTAWishlist } from "../../classes/ProfTAWishlist";
import AddToWishlist from "./AddToWishList";

const ManageWishlist = (props) => {
  const [TAs, setTAs] = React.useState<Array<ProfTAWishlist>>([]);

  const fetchTAData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/prof/getAllWishlist");
      const data = await res.json();
      const profObject = [];
      for (const d of data.wishlist) {
        let item = {};
        if (d.course_num == props.course) {
          item["TA_name"] = d.TA_name;
          item["term_year_this_is_for"] = d.term_year_this_is_for;
        } else {
          item["TA_name"] = "";
          item["term_year_this_is_for"] = "";
        }
        profObject.push(item);
      }
      setTAs(profObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Load data
    fetchTAData();
  }, []);

  return (
    <div>
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>TA Wishlist</h2>
          <AddToWishlist fetchTAData={fetchTAData} course={props.course} />
        </div>
        <div id="profTable">
          <table>
            <thead>
              <tr>
                <th className="column1">TA Name</th>
                <th className="column2">Term Year</th>
              </tr>
            </thead>
            <tbody>
              {/**Set to hardcoded list of profs for testing purposes */}
              {TAs.map((ta: ProfTAWishlist, i: number) => {
                if (ta) {
                  return (
                    <WishListRow key={i} ta={ta} fetchTAData={fetchTAData} />
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

export default ManageWishlist;