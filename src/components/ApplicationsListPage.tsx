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

  const statusQuery = searchParams.get("status");
  const searchQuery = searchParams.get("search");
  const [searchString, setSearchString] = useState<string>(
    searchQuery ? searchQuery : ""
  );

  function setQuery(queryName: string, value: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(queryName, value);
    setSearchParams(newParams);
  }

  return (
    <section>
      <h2>Your applications</h2>
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

        <input
          type="text"
          placeholder="Company or position"
          onChange={(event) => setSearchString(event.target.value)}
          value={searchString}
        />
        <button onClick={() => setQuery("search", searchString)}>Search</button>
        <button
          onClick={() => {
            setQuery("search", "");
            setSearchString("");
          }}
        >
          Clear search results
        </button>
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
        status={statusQuery}
        search={searchQuery}
        refetchData={refetchData}
      />
    </section>
  );
}

export default ApplicationsList;
