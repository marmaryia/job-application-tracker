import { useContext } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { UserContext } from "../contexts/userContext";
import ApplicationsTable from "./ApplicationsTable";

function ApplicationsList() {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const sortByQuery = searchParams.get("sort_by");
  const orderQuery = searchParams.get("order");
  const statusQuery = searchParams.get("status");

  function setQuery(queryName: string, value: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(queryName, value);
    setSearchParams(newParams);
  }

  return (
    <section>
      <h2>History</h2>
      <div>
        <select
          name="statuses"
          id="statuses"
          value={statusQuery ? statusQuery : "All"}
          onChange={(event) => {
            setQuery("status", event.target.value);
          }}
        >
          <option value="" disabled></option>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived</option>
        </select>
        <button
          value="date_created"
          onClick={(event) => {
            setQuery("sort_by", event.currentTarget.value);
          }}
        >
          Sort by application date
        </button>
        <button
          value="recent_activity"
          onClick={(event) => {
            setQuery("sort_by", event.currentTarget.value);
          }}
        >
          Sort by last activity date
        </button>
        <button
          value={orderQuery === "asc" ? "desc" : "asc"}
          onClick={(event) => {
            setQuery("order", event.currentTarget.value);
          }}
        >
          {orderQuery === "desc" || !orderQuery ? "Oldest" : "Newest"} first
        </button>
        <input type="text" placeholder="Company name" />
        <button>Search by company</button>
        <button>New application</button>
      </div>
      <ApplicationsTable
        sortBy={sortByQuery}
        order={orderQuery}
        status={statusQuery}
      />
    </section>
  );
}

export default ApplicationsList;
