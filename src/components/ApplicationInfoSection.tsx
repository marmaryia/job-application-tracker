import { useContext, useState } from "react";
import Popup from "reactjs-popup";

import type { TApplicationFull } from "../types/applicationTypes";
import { handleDataEntry } from "../utils/dataEntry";
import { editApplicationById, patchApplicationStatus } from "../api";
import { UserContext } from "../contexts/userContext";
import { statuses } from "../assets/statuses";
import { eventsPreceedDate } from "../utils/dates";
import DeleteButtonAndPopup from "./DeleteButtonAndPopup";
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";

import { type SelectChangeEvent } from "@mui/material/Select";

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
  const [updatedApplication, setUpdatedApplication] =
    useState<TApplicationFull>(application);

  function handleUpdateCancellation() {
    setEditing(false);
    setUpdatedApplication(application);
  }

  async function handleDataUpdate() {
    setEditing(false);
    const { events, ...updatedApplicationInfo } = updatedApplication;
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

  async function handleStatusChange(event: SelectChangeEvent) {
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
    <section className="application-info-section">
      <Box
        sx={{
          minWidth: 120,
          display: "grid",
          gridTemplateColumns: "40% 60%",
          alignItems: "center",
        }}
      >
        <p className="application-info-tag">Status</p>

        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={application.status}
            onChange={(e) => handleStatusChange(e)}
            sx={{
              backgroundColor: "white",
              borderRadius: "10px",
              color: "black",
            }}
          >
            {statuses.map((statusOption, i) => (
              <MenuItem value={statusOption} key={i}>
                {statusOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <hr />
      <form
        action="submit"
        onDoubleClick={() => setEditing(true)}
        onSubmit={(e) => {
          e.preventDefault();

          if (
            !eventsPreceedDate(
              updatedApplication.date_created,
              application.events
            )
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
              {key === "notes" ? (
                <textarea
                  rows={3}
                  className="edit-form-input"
                  id={key}
                  disabled={!editing}
                  value={updatedApplication[key]!}
                  onChange={(e) => {
                    handleDataEntry(key, e.target.value, setUpdatedApplication);
                  }}
                />
              ) : (
                <input
                  required={!(key === "job_url")}
                  className="edit-form-input"
                  id={key}
                  disabled={!editing}
                  type={key === "date_created" ? "date" : "text"}
                  value={
                    key === "date_created"
                      ? updatedApplication[key]!.split("T")[0]
                      : updatedApplication[key]!
                  }
                  onChange={(e) => {
                    handleDataEntry(key, e.target.value, setUpdatedApplication);
                  }}
                  max={
                    key === "date_created"
                      ? new Date(Date.now()).toISOString().split("T")[0]
                      : undefined
                  }
                />
              )}
            </div>
          );
        })}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "1em",
          }}
        >
          {editing && (
            <>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "var(--accent-color)",
                  color: "black",
                  marginRight: "1em",
                }}
                size="large"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{
                  backgroundColor: "var(--accent-color)",
                  color: "black",
                  marginRight: "1em",
                }}
                size="large"
                onClick={handleUpdateCancellation}
              >
                Cancel
              </Button>
            </>
          )}
          {!editing && (
            <Button
              type="button"
              variant="contained"
              sx={{
                backgroundColor: "var(--accent-color)",
                color: "black",
                marginRight: "1em",
              }}
              size="large"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
          <DeleteButtonAndPopup />
        </Box>
      </form>

      <Popup open={popupOpen}>
        <h3>Date conflict</h3>
        <p className="popup-text">
          Any events preceeding the selected date will be deleted.
          <br />
          Save the new date?
        </p>
        <Button
          onClick={() => {
            handleDataUpdate();
            setPopupOpen(false);
          }}
          variant="contained"
          sx={{
            backgroundColor: "var(--accent-color)",
            color: "black",
            marginRight: "1em",
          }}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            setPopupOpen(false);
            setUpdatedApplication(application);
          }}
          variant="outlined"
          sx={{
            borderColor: "var(--accent-color)",
            color: "white",
            marginRight: "1em",
          }}
        >
          Cancel
        </Button>
      </Popup>
    </section>
  );
}

export default ApplicationInfoSection;
