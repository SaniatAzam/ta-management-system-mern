import { Wishlist } from "../../classes/Wishlist";

const WishlistMembershipRow = ({ wishlist, fetchTAWishlistMembership }: { wishlist: Wishlist; fetchTAWishlistMembership: Function }) => {

    const course = wishlist.course_num;
    const prof = wishlist.prof_name;

    return (

        <tr className="body">
            <td className="column0">{prof}</td>
            <td className="column1">{course}</td>
        </tr>

    );
};

export default WishlistMembershipRow;