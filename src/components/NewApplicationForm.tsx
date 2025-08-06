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
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";

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
    const data = { ...applicationData, allow_duplicates: true };

    try {
      await postNewApplication(loggedInUser!.accessToken, data);
      setSubmitSuccessful(true);
    } catch (error: any) {
      setError(true);
    }
    setDuplicateApplications(undefined);
  }

  if (duplicateApplications) {
    return (
      <div>
        <h3>Duplicate application</h3>
        <p className="popup-text">
          You have already applied for a job (jobs) at this URL:
        </p>
        <ul>
          {duplicateApplications.map(
            (application: TDuplicateApplication, i) => {
              return (
                <li key={i} className="popup-text">
                  <Link
                    to={`${application.application_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {application.position} at {application.company} on{" "}
                    {formatIsoTimestamp(application.date_created, true)}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
        <p className="popup-text">
          Do you want to add another one anyway? Click on an existing one to go
          to view it
        </p>
        <Button
          onClick={() => setDuplicateApplications(undefined)}
          variant="contained"
          sx={{
            backgroundColor: "var(--accent-color)",
            color: "black",
            marginRight: "1em",
            marginTop: "1em",
          }}
        >
          Edit
        </Button>
        <Button
          onClick={overrideDuplicate}
          variant="contained"
          sx={{
            backgroundColor: "var(--accent-color)",
            color: "black",
            marginRight: "1em",
            marginTop: "1em",
          }}
        >
          Add anyway
        </Button>
        <Button
          onClick={() => setPopupOpen(false)}
          variant="outlined"
          sx={{
            borderColor: "var(--accent-color)",
            color: "white",
            marginRight: "1em",
            marginTop: "1em",
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <form action="submit" onSubmit={handleFromSubmit}>
      <h3>New application</h3>
      <label htmlFor="company-name" className="new-app-form-label">
        Company *
      </label>
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
      <label htmlFor="position" className="new-app-form-label">
        Position *
      </label>
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
      <label htmlFor="listing-link" className="new-app-form-label">
        Link to listing
      </label>
      <input
        type="text"
        id="listing-link"
        onChange={(event) =>
          handleDataEntry("job_url", event.target.value, setApplicationData)
        }
        value={applicationData.job_url}
      />
      <br />
      <label htmlFor="statuses" className="new-app-form-label">
        Status *
      </label>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <Select
            id="status-select"
            value={applicationData.status}
            onChange={(event: SelectChangeEvent) =>
              handleDataEntry("status", event.target.value, setApplicationData)
            }
            sx={{ backgroundColor: "white" }}
          >
            {statuses.map((statusOption, i) => (
              <MenuItem value={statusOption} key={i}>
                {statusOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <br />
      <label htmlFor="date-submitted" className="new-app-form-label">
        Date submitted *
      </label>
      <br />
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
      <label htmlFor="notes" className="new-app-form-label">
        Notes
      </label>
      <textarea
        rows={3}
        id="notes"
        onChange={(event) =>
          handleDataEntry("notes", event.target.value, setApplicationData)
        }
        value={applicationData.notes}
      />

      <br />
      {error && <p>There has been an error, please try again</p>}
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "var(--accent-color)",
          color: "black",
          marginRight: "1em",
        }}
      >
        Submit
      </Button>
      <Button
        type="button"
        onClick={() => setPopupOpen(false)}
        variant="outlined"
        sx={{
          borderColor: "var(--accent-color)",
          color: "var(--accent-color)",
        }}
      >
        Cancel
      </Button>
    </form>
  );
}

export default NewApplicationForm;
