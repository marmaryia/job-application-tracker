import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";

function ApplicationSearch({
  searchQuery,
  setQuery,
}: {
  searchQuery: string | null;

  setQuery: Function;
}) {
  const [searchString, setSearchString] = useState<string>(
    searchQuery ? searchQuery : ""
  );

  return (
    <Box
      component="form"
      sx={{ display: "flex", alignItems: "center", gap: 2 }}
    >
      <TextField
        id="outlined-basic"
        type="text"
        variant="outlined"
        placeholder="Company or position"
        onChange={(event) => setSearchString(event.target.value)}
        value={searchString}
        size="small"
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "white",
          },
          "& .MuiInputBase-input": {
            color: "black",
          },
        }}
      />

      <Button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          setQuery("search", searchString);
        }}
        variant="contained"
        sx={{ backgroundColor: "var(--accent-color)", color: "black" }}
      >
        Search
      </Button>

      <Button
        type="button"
        onClick={() => {
          setQuery("search", "");
          setSearchString("");
        }}
        variant="outlined"
        sx={{
          borderColor: "var(--accent-color)",
          color: "var(--accent-color)",
        }}
      >
        Clear
      </Button>
    </Box>
  );
}

export default ApplicationSearch;
