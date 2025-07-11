import { useContext, useState } from "react";
import type { TApplicationFull } from "../types/applicationTypes";
import { handleDataEntry } from "../utils/dataEntry";
import { editApplicationById } from "../api";
import { UserContext } from "../contexts/userContext";

const keys: ["company", "position", "job_url", "notes"] = [
  "company",
  "position",
  "job_url",
  "notes",
];

function ApplicationInfoSection({
  application,
}: {
  application: TApplicationFull;
}) {
  const [activeField, setActiveField] = useState<string>("");
  const { events, ...applicationInfo } = application;
  const [applicationData, setApplicationData] = useState(applicationInfo);
  const { loggedInUser } = useContext(UserContext);

  async function handleBlur() {
    // To DO
    // Send api request only if data is updated
    // Add "save" button and / or save on enter
    // Update info on page and events
    setActiveField("");

    const updatedApplication = await editApplicationById(
      loggedInUser!.accessToken,
      applicationData
    );
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
              <input
                autoFocus
                type="text"
                value={applicationData[key]!}
                onChange={(e) => {
                  handleDataEntry(key, e.target.value, setApplicationData);
                }}
                onBlur={handleBlur}
              />
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
