import { useContext, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { UserContext } from "../contexts/userContext";
import ApplicationsTable from "./ApplicationsTable";
import NewApplicationPopup from "./NewApplicationPopup";

function ApplicationsList() {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }

  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [submitSuccessful, setSubmitSuccessful] = useState<boolean>(false);
  const [refetchData, setRefetchData] = useState<number>(0);
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
        <input type="text" placeholder="Company name or position" />
        <button>Search</button>
        <button
          onClick={() => {
            setPopupOpen(true);
            setSubmitSuccessful(false);
          }}
        >
          New application
        </button>
        <NewApplicationPopup
          popupOpen={popupOpen}
          setPopupOpen={setPopupOpen}
          submitSuccessful={submitSuccessful}
          setSubmitSuccessful={setSubmitSuccessful}
          setRefetchData={setRefetchData}
        />
      </div>
      <ApplicationsTable
        sortBy={sortByQuery}
        order={orderQuery}
        status={statusQuery}
        refetchData={refetchData}
      />
    </section>
  );
}

export default ApplicationsList;
