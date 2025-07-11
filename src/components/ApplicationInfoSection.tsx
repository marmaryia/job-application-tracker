import { useState } from "react";
import type { TApplicationFull } from "../types/applicationTypes";
import { handleDataEntry } from "../utils/dataEntry";

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
    <section className="application-info-container">
      <p className="application-info-tag">Company</p>
      {activeField === "company" ? (
        <input
          autoFocus
          type="text"
          value={applicationData.company}
          onChange={(e) => {
            handleDataEntry("company", e.target.value, setApplicationData);
          }}
          onBlur={handleBlur}
        />
      ) : (
        <p
          className="application-info"
          onClick={() => {
            setActiveField("company");
          }}
        >
          {applicationData.company}
        </p>
      )}

      <p className="application-info-tag">Position</p>
      <p className="application-info">{applicationData.position}</p>
      <p className="application-info-tag">Job listing URL</p>
      <p className="application-info">
        {applicationData.job_url ? applicationData.job_url : "Not provided..."}
      </p>
      <p className="application-info-tag">Notes</p>
      <p className="application-info">
        {applicationData.notes ? applicationData.notes : "No notes yet..."}
      </p>
    </section>
  );
}

export default ApplicationInfoSection;
