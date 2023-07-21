import RemoveIcon from "@material-ui/icons/Remove";
import "../../style/userTable.css";
import { User } from "../../classes/User";

const UserRow = ({ user, fetchUserData }: { user: User; fetchUserData: Function }) => {
  const userEmail = user.email;

  const handleDeleteUser = async (e) => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });
      if (res.status === 201) {
        setTimeout(() => {
          fetchUserData();
        }, 500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteUser}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{user.email}</td>
      <td className="column2">{user.firstName}</td>
      <td className="column3">{user.lastName}</td>
      <td className="column5">{user.userType.join(", ")}</td>
    </tr>
  );
};

export default UserRow;
