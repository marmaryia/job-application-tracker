import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { TApplication } from "../types/applicationTypes";
import { UserContext } from "../contexts/userContext";
import { getApplicationsByUserId } from "../api";
import { formatIsoTimestamp } from "../utils/dates";

import {
  DataGrid,
  type GridRenderCellParams,
  type GridRowParams,
  type MuiEvent,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import LaunchIcon from "@mui/icons-material/Launch";

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
    {
      field: "application_id",
      headerName: "ID",
      width: 90,
      sortable: false,
      editable: false,
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        const allRowIds = params.api.getAllRowIds();
        const index = allRowIds.indexOf(params.id);
        return <span>{index + 1}</span>;
      },
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      editable: false,
      sortable: false,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1,
      editable: false,
      sortable: false,
    },
    {
      field: "date_created",
      headerName: "Date Applied",
      flex: 1,
      editable: false,
      valueGetter: (_: any, application: TApplication) =>
        formatIsoTimestamp(application.date_created, true),
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      flex: 1,
    },
    {
      field: "latest_event",
      headerName: "Recent Activity",
      editable: false,
      flex: 2,
      valueGetter: (_: any, application: TApplication) =>
        `${formatIsoTimestamp(application.latest_event.date, true)}: ${
          application.latest_event.title
        }`,
    },
    {
      field: "job_url",
      headerName: "Link",
      sortable: false,
      width: 90,
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        if (!params.value) return null;
        const href = params.value?.startsWith("http")
          ? params.value
          : `https://${params.value}`;
        return (
          <a href={href} target="_blank">
            <LaunchIcon fontSize="small" />
          </a>
        );
      },
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
      <Box sx={{ height: "100%", width: "100%" }}>
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
            sx={{
              ".MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },
            }}
            onRowDoubleClick={(
              params: GridRowParams,
              _: MuiEvent<React.MouseEvent>
            ) => navigate(`/applications/${params.row.application_id}`)}
          />
        </div>
      </Box>
    </>
  );
}

export default ApplicationsTable;
