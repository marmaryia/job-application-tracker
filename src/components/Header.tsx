import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/userContext";
import Logout from "./Logout";

function Header() {
  const { loggedInUser } = useContext(UserContext);
  return (
    <header>
      <div className="name-logo-container">
        <Link to={"/"}>
          <img
            src="logo.svg"
            alt="figure of a person with a car tire"
            id="logo-svg"
          />
        </Link>
        <h1>TRACTION</h1>
      </div>
      {!loggedInUser && <Link to="/register">Register</Link>}
      {!loggedInUser && <Link to="/login">Log in</Link>}
      {loggedInUser && <Logout />}
    </header>
  );
}

export default Header;
