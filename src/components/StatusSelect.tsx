import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { statuses } from "../assets/statuses";
import type { TApplication } from "../types/applicationTypes";
import { patchApplicationStatus } from "../api";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function BasicSelect({
  application,
  setApplications,
}: {
  application: TApplication;
  setApplications: Function;
}) {
  const { loggedInUser } = useContext(UserContext);
  async function handleStatusChange(event: SelectChangeEvent) {
    try {
      const applicationFromApi = await patchApplicationStatus(
        loggedInUser!.accessToken,
        application.application_id,
        event.target.value
      );
      setApplications((current: TApplication[]) => {
        const newApplications = current.map((currApp) => {
          if (currApp.application_id === application.application_id) {
            return {
              ...applicationFromApi,
              latest_event: applicationFromApi.events.at(-1),
            };
          } else {
            return currApp;
          }
        });

        return newApplications;
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={application.status}
          onChange={handleStatusChange}
        >
          {statuses.map((statusOption, i) => (
            <MenuItem value={statusOption} key={i}>
              {statusOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
