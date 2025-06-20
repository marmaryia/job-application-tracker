import { useNavigate } from "react-router-dom";
import type { TApplication } from "../types/applicationTypes";
import { getDateFromIsoTimestamp } from "../utils/dates";

const statuses = ["Application sent", "In review", "Rejected", "Archived"];

function ApplicationsTableRow({
  application,
  serialId,
}: {
  application: TApplication;
  serialId: number;
}) {
  const navigate = useNavigate();
  return (
    <tr>
      <td>{serialId}</td>
      <td
        onClick={() => {
          navigate(`/applications/${application.application_id}`);
        }}
      >
        {application.company}
      </td>
      <td>{application.position}</td>
      <td>{getDateFromIsoTimestamp(application.date_created)}</td>
      <td>
        <select
          name="statuses"
          id="statuses"
          value={application.status}
          // onChange={(e) => {
          //   setApplicationsData((currentData) => {
          //     const newData = [...currentData];
          //     newData.forEach((item, i) => {
          //       item.recent = { ...currentData[i].recent };
          //     });
          //     newData[i].status = e.target.value;
          //     return newData;
          //   });
          // }}
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
        {getDateFromIsoTimestamp(application.latest_event.date)}:{" "}
        {application.latest_event.title}
      </td>
      <td>
        {application.job_url && <a href={application.job_url}>To listing</a>}
      </td>
    </tr>
  );
}

export default ApplicationsTableRow;
