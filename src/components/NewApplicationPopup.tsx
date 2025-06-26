import Popup from "reactjs-popup";

import NewApplicationForm from "./NewApplicationForm";

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
          <p>Application added successfully</p>
          <button
            onClick={() => {
              setRefetchData((current: number) => ++current);
              setPopupOpen(false);
            }}
          >
            OK
          </button>
          <button
            onClick={() => {
              setRefetchData((current: number) => ++current);
              setSubmitSuccessful(false);
            }}
          >
            New application
          </button>
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
