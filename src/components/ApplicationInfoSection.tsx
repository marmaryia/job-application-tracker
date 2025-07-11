import { useState } from "react";
import type { TApplicationFull } from "../types/applicationTypes";
import { handleDataEntry } from "../utils/dataEntry";

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
  const [applicationData, setApplicationData] = useState(application);

  function handleBlur() {
    setActiveField("");
  }

  return (
    <section>
      {keys.map((key) => {
        return (
          <div
            className="application-info-container"
            onClick={() => {
              setActiveField(key);
            }}
          >
            <p className="application-info-tag">{key}</p>
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
