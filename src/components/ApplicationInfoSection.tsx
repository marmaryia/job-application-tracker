import { useContext, useState } from "react";
import type { TApplicationFull } from "../types/applicationTypes";
import { handleDataEntry } from "../utils/dataEntry";
import { editApplicationById, patchApplicationStatus } from "../api";
import { UserContext } from "../contexts/userContext";
import { statuses } from "../assets/statuses";

const keys: ["company", "position", "status", "job_url", "notes"] = [
  "company",
  "position",
  "status",
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
  const [activeField, setActiveField] = useState<string>("");
  const [applicationData, setApplicationData] = useState(application);

  async function handleDataUpdate() {
    setActiveField("");
    const { events, ...updatedApplicationInfo } = applicationData;
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
        applicationData.application_id,
        event.target.value
      );
      setActiveField("");
      setApplication(updatedStatusApplication);
      setApplicationData(updatedStatusApplication);
    } catch {
      setError(true);
    }
  }

  return (
    <section>
      {keys.map((key, i) => {
        return (
          <div
            className="application-info-container"
            onClick={() => {
              setActiveField(key);
            }}
            key={i}
          >
            <p className="application-info-tag">
              {key[0].toUpperCase() + key.replace("_", " ").slice(1)}
            </p>
            {activeField === key ? (
              key === "status" ? (
                <select
                  name="statuses"
                  id="statuses"
                  value={applicationData.status}
                  onChange={(e) => handleStatusChange(e)}
                  onBlur={() => setActiveField("")}
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
              ) : (
                <form
                  action="submit"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDataUpdate();
                  }}
                >
                  <input
                    autoFocus
                    type="text"
                    value={applicationData[key]!}
                    onChange={(e) => {
                      handleDataEntry(key, e.target.value, setApplicationData);
                    }}
                    onBlur={handleDataUpdate}
                  />
                </form>
              )
            ) : (
              <p className="application-info">{applicationData[key]}</p>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default ApplicationInfoSection;
