import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

function Home() {
  const { loggedInUser } = useContext(UserContext);

  const path = loggedInUser ? "/applications" : "/login";
  return <Navigate to={path} />;
}

export default Home;
