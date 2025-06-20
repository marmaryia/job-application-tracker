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

  function setSortingQuery(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort_by", event.currentTarget.value);
    setSearchParams(newParams);
  }

  function setOrderQuery(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order", event.currentTarget.value);
    setSearchParams(newParams);
  }

  return (
    <section>
      <h2>History</h2>
      <div>
        <button>Filter by status</button>
        <button value="date_created" onClick={setSortingQuery}>
          Sort by application date
        </button>
        <button value="recent_activity" onClick={setSortingQuery}>
          Sort by last activity date
        </button>
        <button
          value={orderQuery === "asc" ? "desc" : "asc"}
          onClick={setOrderQuery}
        >
          {orderQuery === "desc" || !orderQuery ? "Oldest" : "Newest"} first
        </button>
        <input type="text" placeholder="Company name" />
        <button>Search by company</button>
        <button>New application</button>
      </div>
      <ApplicationsTable sortBy={sortByQuery} order={orderQuery} />
    </section>
  );
}

export default ApplicationsList;
