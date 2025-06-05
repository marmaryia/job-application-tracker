import { useState } from "react";

type TApplicationObject = {
  company: string;
  position: string;
  date_applied: string;
  status: string;
  recent: { date: string; action: string };
  listing_url: string;
};

type TApplicationData = TApplicationObject[];

const data = [
  {
    company: "Vanilla",
    position: "Secretary",
    date_applied: "01/01/2025",
    status: "Applied",
    recent: { date: "01/01/2025", action: "Application sent" },
    listing_url: "https://uk.indeed.com/viewjob?jk=4d26b053ab1cb8b8",
  },
  {
    company: "Coconut LTD",
    position: "Fireman",
    date_applied: "15/01/2025",
    status: "In review",
    recent: { date: "01/02/2025", action: "Initial screening call" },
    listing_url: "https://www.linkedin.com/jobs/view/4234131197",
  },
  {
    company: "Flower Arrangement Society",
    position: "Florist",
    date_applied: "15/03/2025",
    status: "Rejected",
    recent: { date: "08/05/2025", action: "Status changed to 'rejected'" },
    listing_url: "https://www.exampleurl.com/jobs",
  },
];

const statuses = ["Application sent", "In review", "Rejected", "Archived"];

function ApplicationsList() {
  const [applicationsData, setApplicationsData] =
    useState<TApplicationData>(data);
  return (
    <section>
      <h2>History</h2>
      <div>
        <button>Filter by status</button>
        <button>Sort by application date</button>
        <button>Sort by last activity date</button>
        <input type="text" placeholder="Company name" />
        <button>Search by company</button>
        <button>New application</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Date applied</th>
            <th>Status</th>
            <th>Recent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applicationsData.map((application, i) => {
            return (
              <tr key={i}>
                <td>{application.company}</td>
                <td>{application.position}</td>
                <td>{application.date_applied}</td>
                <td>
                  <select
                    name="statuses"
                    id="statuses"
                    value={application.status}
                    onChange={(e) => {
                      setApplicationsData((currentData) => {
                        const newData = [...currentData];
                        newData.forEach((item, i) => {
                          item.recent = { ...currentData[i].recent };
                        });
                        newData[i].status = e.target.value;
                        return newData;
                      });
                    }}
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
                </td>
                <td>
                  {application.recent.date}: {application.recent.action}
                </td>
                <td>
                  <a href={application.listing_url}>To listing</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default ApplicationsList;
