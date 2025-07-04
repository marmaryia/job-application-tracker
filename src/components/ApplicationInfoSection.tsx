import type { TApplicationFull } from "../types/applicationTypes";

function ApplicationInfoSection({
  application,
}: {
  application: TApplicationFull;
}) {
  return (
    <section className="application-info-container">
      <p className="application-info-tag">Position</p>
      <p className="application-info">{application.position}</p>
      <p className="application-info-tag">Job listing URL</p>
      <p className="application-info">{application.job_url}</p>
      <p className="application-info-tag">Notes</p>
      <p className="application-info">
        {application.notes ? application.notes : "No notes yet..."}
      </p>
    </section>
  );
}

export default ApplicationInfoSection;
