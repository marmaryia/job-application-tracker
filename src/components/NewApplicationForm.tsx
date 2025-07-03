import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { statuses } from "../assets/statuses";
import { handleDataEntry } from "../utils/dataEntry";
import { UserContext } from "../contexts/userContext";
import type {
  TNewApplication,
  TDuplicateApplication,
} from "../types/applicationTypes";
import { postNewApplication } from "../api";
import { formatIsoTimestamp } from "../utils/dates";

function NewApplicationForm({
  setSubmitSuccessful,
  setPopupOpen,
}: {
  setSubmitSuccessful: Function;
  setPopupOpen: Function;
}) {
  const { loggedInUser } = useContext(UserContext);
  const [applicationData, setApplicationData] = useState<TNewApplication>({
    user_id: loggedInUser!.id,
    company: "",
    date_created: new Date(Date.now()).toISOString(),
    job_url: "",
    position: "",
    status: statuses[0],
    notes: "",
  });
  const [duplicateApplications, setDuplicateApplications] =
    useState<TDuplicateApplication[]>();
  const [error, setError] = useState<boolean>(false);

  async function handleFromSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    try {
      await postNewApplication(loggedInUser!.accessToken, applicationData);
      setSubmitSuccessful(true);
    } catch (error: any) {
      if (error.response?.data?.error === "DUPLICATE_RESOURCE") {
        setDuplicateApplications(error.response.data.duplicates);
      } else {
        setError(true);
      }
    }
  }

  async function overrideDuplicate() {
    setDuplicateApplications(undefined);
    const data = { ...applicationData, allow_duplicates: true };

    try {
      await postNewApplication(loggedInUser!.accessToken, data);
      setSubmitSuccessful(true);
    } catch (error: any) {
      setError(true);
    }
  }

  if (duplicateApplications) {
    return (
      <div>
        <h2>Duplicate application</h2>
        <p>You have already applied for a job (jobs) at this URL:</p>
        <ul>
          {duplicateApplications.map(
            (application: TDuplicateApplication, i) => {
              return (
                <li key={i}>
                  <Link to={`${application.application_id}`}>
                    {application.position} at {application.company} on{" "}
                    {formatIsoTimestamp(application.date_created, true)}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
        <p>
          Do you want to add another one anyway? Click on an existing one to go
          to view it 
        </p>
        <button onClick={() => setDuplicateApplications(undefined)}>Edit</button>
        <button onClick={overrideDuplicate}>Add anyway</button>
        <button onClick={() => setPopupOpen(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <form action="submit" onSubmit={handleFromSubmit}>
      <h2>New application</h2>
      <label htmlFor="company-name">Company*</label>
      <input
        required
        type="text"
        id="company-name"
        onChange={(event) =>
          handleDataEntry("company", event.target.value, setApplicationData)
        }
        value={applicationData?.company}
      />
      <br />
      <label htmlFor="position">Position*</label>
      <input
        required
        type="text"
        id="position"
        onChange={(event) =>
          handleDataEntry("position", event.target.value, setApplicationData)
        }
        value={applicationData?.position}
      />
      <br />
      <label htmlFor="listing-link">Link to listing</label>
      <input
        type="text"
        id="listing-link"
        onChange={(event) =>
          handleDataEntry("job_url", event.target.value, setApplicationData)
        }
        value={applicationData.job_url}
      />
      <br />
      <label htmlFor="statuses">Status*</label>
      <select
        name="statuses"
        id="statuses"
        onChange={(event) =>
          handleDataEntry("status", event.target.value, setApplicationData)
        }
        value={applicationData.status}
      >
        <option value="" disabled></option>
        {statuses.map((status, i) => {
          return (
            <option key={i} value={status}>
              {status}
            </option>
          );
        })}
      </select>
      <br />
      <label htmlFor="date-submitted">Date submitted*</label>
      <input
        required
        type="date"
        id="date-submitted"
        onChange={(event) =>
          handleDataEntry(
            "date_created",
            event.target.value,
            setApplicationData
          )
        }
        value={applicationData.date_created.split("T")[0]}
        max={new Date(Date.now()).toISOString().split("T")[0]}
      />
      <br />
      <label htmlFor="notes">Notes</label>
      <input
        type="text"
        id="notes"
        onChange={(event) =>
          handleDataEntry("notes", event.target.value, setApplicationData)
        }
        value={applicationData.notes}
      />

      <br />
      {error && <p>There has been an error, please try again</p>}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setPopupOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

export default NewApplicationForm;
