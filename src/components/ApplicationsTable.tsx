import { useEffect, useState, useContext } from "react";
import type { TApplication } from "../types/applicationTypes";
import { UserContext } from "../contexts/userContext";
import { getApplicationsByUserId } from "../api";
import ApplicationsTableRow from "./ApplicationsTableRow";
import { useNavigate } from "react-router-dom";

function ApplicationsTable({
  sortBy,
  order,
  status,
  refetchData,
}: {
  sortBy: string | null;
  order: string | null;
  status: string | null;
  refetchData: number;
}) {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [applicationsData, setApplicationsData] = useState<TApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  async function getApplications() {
    setIsLoading(true);
    setError(false);
    try {
      const applications = await getApplicationsByUserId(
        loggedInUser!.accessToken,
        loggedInUser!.id,
        sortBy,
        order,
        status
      );
      setApplicationsData(applications);
    } catch (apiError: any) {
      if (apiError.status === 401) {
        setLoggedInUser(null);
        navigate("/login");
      }
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getApplications();
  }, [sortBy, order, status, refetchData]);

  if (error) return <p>There has been an error</p>;
  if (isLoading) return <p>Fetching data</p>;
  if (applicationsData.length === 0)
    return <p>You do not have any applications yet</p>;

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Company</th>
          <th>Position</th>
          <th>Date applied</th>
          <th>Status</th>
          <th>Recent</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {applicationsData.map((application: TApplication, i) => {
          return (
            <ApplicationsTableRow
              application={application}
              key={application.application_id}
              serialId={i + 1}
              setError={setError}
            />
          );
        })}
      </tbody>
    </table>
  );
}

export default ApplicationsTable;
