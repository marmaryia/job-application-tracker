import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import type { TApplication } from "../types/applicationTypes";
import { formatIsoTimestamp } from "../utils/dates";
import { patchApplicationStatus } from "../api";
import { UserContext } from "../contexts/userContext";
import { statuses } from "../assets/statuses";

function ApplicationsTableRow({
  application,
  serialId,
  setError,
}: {
  application: TApplication;
  serialId: number;
  setError: Function;
}) {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(UserContext);
  const [updatedApplication, setUpdatedApplication] =
    useState<TApplication>(application);

  async function changeStatus(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const applicationFromApi = await patchApplicationStatus(
        loggedInUser!.accessToken,
        application.application_id,
        event.target.value
      );
      setUpdatedApplication({
        ...applicationFromApi,
        latest_event: applicationFromApi.events[0],
      });
    } catch {
      setError(true);
    }
  }

  return (
    <tr>
      <td>{serialId}</td>
      <td
        onClick={() => {
          navigate(`/applications/${updatedApplication.application_id}`);
        }}
      >
        {updatedApplication.company}
      </td>
      <td>{updatedApplication.position}</td>
      <td>{formatIsoTimestamp(updatedApplication.date_created, true)}</td>
      <td>
        <select
          name="statuses"
          id="statuses"
          value={updatedApplication.status}
          onChange={changeStatus}
        >
          <option value="" disabled></option>
          {statuses.map((appStatus, i) => {
            return (
              <option key={i} value={appStatus}>
                {appStatus}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        {formatIsoTimestamp(updatedApplication.latest_event.date, true)}:{" "}
        {updatedApplication.latest_event.title}
      </td>
      <td>
        {updatedApplication.job_url && (
          <a href={updatedApplication.job_url}>To listing</a>
        )}
      </td>
    </tr>
  );
}

export default ApplicationsTableRow;
