import { useEffect, useState, useContext } from "react";

import type { TApplication } from "../types/applicationTypes";
import { UserContext } from "../contexts/userContext";
import { getApplicationsByUserId } from "../api";
import ApplicationsTableRow from "./ApplicationsTableRow";
import { useNavigate } from "react-router-dom";
import { formatIsoTimestamp } from "../utils/dates";

import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

function ApplicationsTable({
  sortBy,
  order,
  status,
  search,
  refetchData,
}: {
  sortBy: string | null;
  order: string | null;
  status: string | null;
  search: string | null;
  refetchData: number;
}) {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [applicationsData, setApplicationsData] = useState<TApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const columns = [
    { field: "application_id", headerName: "ID", width: 90 },
    {
      field: "company",
      headerName: "Company",
      width: 150,
      editable: false,
    },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      editable: false,
    },
    {
      field: "date_created",
      headerName: "Date Applied",
      width: 110,
      editable: false,
      valueGetter: (_: any, application: TApplication) =>
        formatIsoTimestamp(application.date_created, true),
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      width: 160,
    },
    {
      field: "latest_event",
      headerName: "Recent Activity",
      editable: false,
      width: 160,
      valueGetter: (_: any, application: TApplication) =>
        `${formatIsoTimestamp(application.latest_event.date, true)}: ${
          application.latest_event.title
        }`,
    },
  ];

  async function getApplications() {
    setIsLoading(true);
    setError(false);
    try {
      const applications = await getApplicationsByUserId(
        loggedInUser!.accessToken,
        loggedInUser!.id,
        sortBy,
        order,
        status,
        search
      );
      setApplicationsData(applications);
    } catch (apiError: any) {
      if (apiError.status === 401) {
        setLoggedInUser(null);
        navigate("/login");
      }
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getApplications();
  }, [sortBy, order, status, search, refetchData]);

  if (error) return <p>There has been an error</p>;
  // if (isLoading) return <p>Fetching data</p>;
  if (applicationsData.length === 0)
    return <p>You do not have any applications yet</p>;

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={applicationsData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            pageSizeOptions={[50]}
            getRowId={(application) => application.application_id}
            disableColumnMenu
            hideFooter
            loading={isLoading}
            // onRowClick={navigate to application}
          />
        </div>
      </Box>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Company</th>
            <th>Position</th>
            <th>Date applied</th>
            <th>Status</th>
            <th>Recent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applicationsData.map((application: TApplication, i) => {
            return (
              <ApplicationsTableRow
                application={application}
                key={application.application_id}
                serialId={i + 1}
                setError={setError}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ApplicationsTable;
