import { useContext, useState } from "react";

import { statuses } from "../assets/statuses";
import { handleDataEntry } from "../utils/dataEntry";
import { UserContext } from "../contexts/userContext";
import type { TNewApplication } from "../types/applicationTypes";
import { postNewApplication } from "../api";

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
  async function handleFromSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await postNewApplication(loggedInUser!.accessToken, applicationData);
    setSubmitSuccessful(true);
  }
  return (
    <form action="submit" onSubmit={handleFromSubmit}>
      <label htmlFor="company-name">Company</label>
      <input
        type="text"
        id="company-name"
        onChange={(event) =>
          handleDataEntry("company", event.target.value, setApplicationData)
        }
        value={applicationData?.company}
      />
      <br />
      <label htmlFor="position">Position</label>
      <input
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
        value={applicationData?.job_url}
      />
      <br />
      <label htmlFor="statuses">Status</label>
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
      <label htmlFor="date-submitted">Date submitted</label>
      <input
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
      />
      <br />
      <label htmlFor="notes">Notes</label>
      <input
        type="text"
        id="notes"
        onChange={(event) =>
          handleDataEntry("notes", event.target.value, setApplicationData)
        }
      />
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setPopupOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

export default NewApplicationForm;
