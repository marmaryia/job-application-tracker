import { useContext, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { UserContext } from "../contexts/userContext";
import ApplicationsTable from "./ApplicationsTable";
import NewApplicationPopup from "./NewApplicationPopup";
import FilterByStatus from "./FilterByStatus";
import ApplicationSearch from "./ApplicationSearch";
import { Button } from "@mui/material";

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

  function setQuery(queryName: string, value: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(queryName, value);
    setSearchParams(newParams);
  }

  return (
    <section className="all-applications-section">
      <div className="applications-list-header">
        <h2>Your applications</h2>
        <Button
          variant="contained"
          onClick={() => {
            setPopupOpen(true);
            setSubmitSuccessful(false);
          }}
          sx={{ backgroundColor: "var(--accent-color)", color: "black" }}
          size="large"
        >
          Add new
        </Button>
      </div>
      <div className="table-nav-container">
        <FilterByStatus statusQuery={statusQuery} setStatusQuery={setQuery} />
        <ApplicationSearch setQuery={setQuery} searchQuery={searchQuery} />
      </div>

      <NewApplicationPopup
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
        submitSuccessful={submitSuccessful}
        setSubmitSuccessful={setSubmitSuccessful}
        setRefetchData={setRefetchData}
      />
      <ApplicationsTable
        status={statusQuery}
        search={searchQuery}
        refetchData={refetchData}
      />
    </section>
  );
}

export default ApplicationsList;
