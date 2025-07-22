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
}: {
  application: TApplicationFull;
  setApplication: Function;
}) {
  const [activeField, setActiveField] = useState<string>("");
  const { events, ...applicationInfo } = application;
  const [applicationData, setApplicationData] = useState(applicationInfo);
  const { loggedInUser } = useContext(UserContext);

  async function handleBlur() {
    // To DO
    // Send api request only if data is updated
    // Add "save" button and / or save on enter

    setActiveField("");
    try {
      const updatedApplication = await editApplicationById(
        loggedInUser!.accessToken,
        applicationData
      );
      setApplication(updatedApplication);
    } catch (error) {
      console.log(error);
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
                  onChange={async (e) => {
                    const { events, ...applicationInfo } =
                      await patchApplicationStatus(
                        loggedInUser!.accessToken,
                        applicationData.application_id,
                        e.target.value
                      );
                    setActiveField("");
                    setApplication({ events, applicationInfo });
                    setApplicationData(applicationInfo);
                  }}
                  onBlur={handleBlur}
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
                <input
                  autoFocus
                  type="text"
                  value={applicationData[key]!}
                  onChange={(e) => {
                    handleDataEntry(key, e.target.value, setApplicationData);
                  }}
                  onBlur={handleBlur}
                />
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
