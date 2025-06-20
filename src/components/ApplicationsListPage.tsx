import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../contexts/userContext";
import ApplicationsTable from "./ApplicationsTable";

function ApplicationsList() {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

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
      <ApplicationsTable />
    </section>
  );
}

export default ApplicationsList;
