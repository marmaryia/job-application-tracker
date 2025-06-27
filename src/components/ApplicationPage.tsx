import { useContext } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { deleteApplicationById } from "../api";

function ApplicationPage() {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  const navigate = useNavigate();
  const application_id = Number(useParams().application_id);

  async function deleteApplication() {
    try {
      await deleteApplicationById(loggedInUser!.accessToken, application_id);
      navigate("/applications");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section>
      <h2>You application to...</h2>
      <button onClick={deleteApplication}>Delete</button>
    </section>
  );
}

export default ApplicationPage;
