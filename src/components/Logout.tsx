import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";

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

  return (
    <div className="logout-button">
      <IconButton onClick={handleLogout} size="large">
        <LogoutIcon sx={{ color: "white" }} fontSize="large" />
      </IconButton>
    </div>
  );
}

export default Logout;
