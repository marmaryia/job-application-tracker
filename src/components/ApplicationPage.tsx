import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { getApplicationById } from "../api";

import type { TApplicationFull } from "../types/applicationTypes";
import EventsTimeline from "./EventsTimeline";
import ApplicationInfoSection from "./ApplicationInfoSection";

function ApplicationPage() {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  const application_id = Number(useParams().application_id);

  const [application, setApplication] = useState<TApplicationFull>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [pageUpdates, setPageUpdates] = useState<number>(0);

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
  }, [pageUpdates]);

  if (isLoading) {
    return <p>Fetching data...</p>;
  }

  if (error) {
    return <p>There has been an error</p>;
  }

  return (
    <section>
      <h2>You application to {application!.company} </h2>

      <div className="application-container">
        <EventsTimeline
          events={application!.events}
          setPageUpdates={setPageUpdates}
        />
        <ApplicationInfoSection
          application={application!}
          setApplication={setApplication}
          setError={setError}
        />
      </div>
    </section>
  );
}

export default ApplicationPage;
