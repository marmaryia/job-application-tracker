import { Button } from "@mui/material";
import { useContext, useState } from "react";
import Popup from "reactjs-popup";
import { deleteApplicationById } from "../api";
import { UserContext } from "../contexts/userContext";
import { useNavigate, useParams } from "react-router-dom";

function DeleteButtonAndPopup() {
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const { loggedInUser } = useContext(UserContext);
  const [error, setError] = useState<boolean>(false);
  const application_id = Number(useParams().application_id);
  const navigate = useNavigate();
  async function deleteApplication() {
    setError(false);
    try {
      await deleteApplicationById(loggedInUser!.accessToken, application_id);
      navigate("/applications");
    } catch (error) {
      setError(true);
    }
  }
  return (
    <>
      <Button
        type="button"
        onClick={() => setPopupOpen(true)}
        variant="outlined"
        sx={{
          borderColor: "var(--accent-color)",
          color: "var(--accent-color)",
        }}
        size="large"
      >
        Delete
      </Button>

      <Popup open={popupOpen} onClose={() => setPopupOpen(false)}>
        <h3>Deleting your application</h3>
        <p className="popup-text">
          Are you sure you want to delete this application?
        </p>
        {error && (
          <p className="popup-text error-message ">
            Something has gone wrong. Please refresh the page and try again
          </p>
        )}
        <Button
          onClick={deleteApplication}
          variant="outlined"
          sx={{
            borderColor: "var(--accent-color)",
            color: "var(--accent-color)",
            marginRight: "1em",
            marginTop: "1em",
          }}
        >
          Yes, delete
        </Button>
        <Button
          onClick={() => setPopupOpen(false)}
          variant="contained"
          sx={{
            backgroundColor: "var(--accent-color)",
            color: "black",
            marginRight: "1em",
            marginTop: "1em",
          }}
        >
          Cancel
        </Button>
      </Popup>
    </>
  );
}

export default DeleteButtonAndPopup;
