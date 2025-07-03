import { useContext, useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { deleteApplicationById, getApplicationById } from "../api";
import Popup from "reactjs-popup";
import type { TApplicationFull } from "../types/applicationTypes";
import EventsTimeline from "./EventsTimeline";


function ApplicationPage() {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  const navigate = useNavigate();
  const application_id = Number(useParams().application_id);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [application, setApplication] = useState<TApplicationFull>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  async function deleteApplication() {
    try {
      await deleteApplicationById(loggedInUser!.accessToken, application_id);
      navigate("/applications");
    } catch (error) {
      setError(true);
    }
  }

  async function fetchData() {
    setIsLoading(true);
    try {
      const applicationFromApi = await getApplicationById(
        loggedInUser!.accessToken,
        application_id
      );

      setApplication(applicationFromApi);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <p>Fetching data...</p>;
  }

  if (error) {
    return <p>There has been an error</p>;
  }

  return (
    <section>
      <h2>You application to {application!.company}</h2>
      <button onClick={() => setPopupOpen(true)}>Delete</button>
      <Popup open={popupOpen}>
        <h3>Deleting your application</h3>
        <p>Are you sure you want to delete this application?</p>
        <button onClick={deleteApplication}>Yes, delete</button>
        <button onClick={() => setPopupOpen(false)}>Cancel</button>
      </Popup>
      <EventsTimeline events={application!.events} />
    </section>
  );
}

export default ApplicationPage;
