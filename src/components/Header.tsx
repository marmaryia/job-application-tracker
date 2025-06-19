import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/userContext";
import Logout from "./Logout";

function Header() {
  const { loggedInUser } = useContext(UserContext);
  return (
    <header>
      <h1>TRACTION</h1>
      {!loggedInUser && <Link to="/register">Register</Link>}
      {!loggedInUser && <Link to="/login">Log in</Link>}
      {loggedInUser && <Logout />}
    </header>
  );
}

export default Header;
