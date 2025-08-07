import { useContext, useState } from "react";
import Popup from "reactjs-popup";

import type { TApplicationFull } from "../types/applicationTypes";
import { handleDataEntry } from "../utils/dataEntry";
import { editApplicationById, patchApplicationStatus } from "../api";
import { UserContext } from "../contexts/userContext";
import { statuses } from "../assets/statuses";
import { eventsPreceedDate } from "../utils/dates";
import DeleteButtonAndPopup from "./DeleteButtonAndPopup";

const keys: ["company", "position", "date_created", "job_url", "notes"] = [
  "company",
  "position",
  "date_created",
  "job_url",
  "notes",
];

function ApplicationInfoSection({
  application,
  setApplication,
  setError,
}: {
  application: TApplicationFull;
  setApplication: Function;
  setError: Function;
}) {
  const { loggedInUser } = useContext(UserContext);
  const [editing, setEditing] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  async function handleDataUpdate() {
    setEditing(false);
    const { events, ...updatedApplicationInfo } = application;
    try {
      const updatedApplication = await editApplicationById(
        loggedInUser!.accessToken,
        updatedApplicationInfo
      );
      setApplication(updatedApplication);
    } catch (error) {
      setError(true);
    }
  }

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    try {
      const updatedStatusApplication = await patchApplicationStatus(
        loggedInUser!.accessToken,
        application.application_id,
        event.target.value
      );

      setApplication(updatedStatusApplication);
    } catch {
      setError(true);
    }
  }

  return (
    <section>
      <p className="application-info-tag">Status</p>
      <select
        name="statuses"
        id="statuses"
        value={application.status}
        onChange={(e) => handleStatusChange(e)}
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
      <form
        action="submit"
        onDoubleClick={() => setEditing(true)}
        onSubmit={(e) => {
          e.preventDefault();

          if (
            !eventsPreceedDate(application.date_created, application.events)
          ) {
            handleDataUpdate();
          } else {
            setPopupOpen(true);
          }
        }}
      >
        {keys.map((key, i) => {
          return (
            <div className="application-info-container" key={i}>
              <label htmlFor={key} className="application-info-tag">
                {key[0].toUpperCase() + key.replace("_", " ").slice(1)}
              </label>

              <input
                id={key}
                disabled={!editing}
                type={key === "date_created" ? "date" : "text"}
                value={
                  key === "date_created"
                    ? application[key]!.split("T")[0]
                    : application[key]!
                }
                onChange={(e) => {
                  handleDataEntry(key, e.target.value, setApplication);
                }}
                max={
                  key === "date_created"
                    ? new Date(Date.now()).toISOString().split("T")[0]
                    : undefined
                }
              />
            </div>
          );
        })}
        {editing && <button type="submit">Save</button>}
      </form>
      {!editing && (
        <button type="button" onClick={() => setEditing(true)}>
          Edit
        </button>
      )}
      <DeleteButtonAndPopup />
      <Popup open={popupOpen}>
        <h3>Date conflict</h3>
        <p>
          Any events preceeding the selected date will be deleted. <br />
          Save the data with the new date?
        </p>
        <button
          onClick={() => {
            handleDataUpdate();
            setPopupOpen(false);
          }}
        >
          Save
        </button>
        <button onClick={() => setPopupOpen(false)}>Cancel</button>
      </Popup>
    </section>
  );
}

export default ApplicationInfoSection;
