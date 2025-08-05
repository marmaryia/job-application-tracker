import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { TApplication } from "../types/applicationTypes";
import { UserContext } from "../contexts/userContext";
import { getApplicationsByUserId } from "../api";
import { formatIsoTimestamp } from "../utils/dates";
import StatusSelect from "./StatusSelect";

import {
  DataGrid,
  type GridRenderCellParams,
  type GridRowParams,
  type MuiEvent,
  type GridSortModel,
  type GridSortDirection,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import LaunchIcon from "@mui/icons-material/Launch";

function ApplicationsTable({
  status,
  search,
  refetchData,
}: {
  status: string | null;
  search: string | null;
  refetchData: number;
}) {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [applicationsData, setApplicationsData] = useState<TApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortByQuery = searchParams.get("sort_by");
  const orderQuery = searchParams.get("order");
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: sortByQuery || "", sort: orderQuery as GridSortDirection },
  ]);

  const columns = [
    {
      field: "application_id",
      headerName: "ID",
      width: 70,
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
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        return (
          <StatusSelect
            application={params.row}
            setApplications={setApplicationsData}
          />
        );
      },
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
        sortModel[0]?.field || null,
        (sortModel[0]?.sort as string) || null,
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

  function handleSortModelChange(model: GridSortModel) {
    setSortModel(model);

    const newParams = new URLSearchParams(searchParams);
    if (model[0]) {
      newParams.set("sort_by", model[0].field);
      newParams.set("order", model[0].sort as string);
    } else {
      newParams.delete("sort_by");
      newParams.delete("order");
    }
    setSearchParams(newParams);
  }

  useEffect(() => {
    getApplications();
  }, [sortModel, status, search, refetchData]);

  if (error) return <p>There has been an error</p>;
  if (isLoading) return <p>Fetching data</p>;
  if (applicationsData.length === 0)
    return <p>You do not have any applications yet</p>;

  return (
    <>
      <Box sx={{ height: "100%", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={applicationsData}
            columns={columns}
            sortingMode="server"
            getRowId={(application) => application.application_id}
            disableColumnMenu
            hideFooter
            loading={isLoading}
            sx={{
              ".MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus-within":
                {
                  outline: "none",
                },
            }}
            onRowDoubleClick={(
              params: GridRowParams,
              _: MuiEvent<React.MouseEvent>
            ) => navigate(`/applications/${params.row.application_id}`)}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
          />
        </div>
      </Box>
    </>
  );
}

export default ApplicationsTable;
