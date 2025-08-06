import Popup from "reactjs-popup";

import NewApplicationForm from "./NewApplicationForm";
import { Button } from "@mui/material";

function NewApplicationPopup({
  popupOpen,
  setPopupOpen,
  submitSuccessful,
  setSubmitSuccessful,
  setRefetchData,
}: {
  popupOpen: boolean;
  setPopupOpen: Function;
  submitSuccessful: boolean;
  setSubmitSuccessful: Function;
  setRefetchData: Function;
}) {
  return (
    <Popup
      modal
      open={popupOpen}
      closeOnDocumentClick={false}
      closeOnEscape={false}
    >
      {submitSuccessful ? (
        <div>
          <h3>Application added successfully</h3>
          <Button
            onClick={() => {
              setRefetchData((current: number) => ++current);
              setPopupOpen(false);
            }}
            variant="contained"
            sx={{
              backgroundColor: "var(--accent-color)",
              color: "black",
              marginRight: "1em",
              marginTop: "1em",
            }}
          >
            OK
          </Button>
          <Button
            onClick={() => {
              setRefetchData((current: number) => ++current);
              setSubmitSuccessful(false);
            }}
            variant="contained"
            sx={{
              backgroundColor: "var(--accent-color)",
              color: "black",
              marginRight: "1em",
              marginTop: "1em",
            }}
          >
            New application
          </Button>
        </div>
      ) : (
        <NewApplicationForm
          setPopupOpen={setPopupOpen}
          setSubmitSuccessful={setSubmitSuccessful}
        />
      )}
    </Popup>
  );
}

export default NewApplicationPopup;
