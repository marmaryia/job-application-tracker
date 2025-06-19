import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/userContext";
import { logoutUser } from "../api";

function Logout() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    setLoggedInUser(null);
    logoutUser(loggedInUser!.accessToken);
    navigate("/login");
  }

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
