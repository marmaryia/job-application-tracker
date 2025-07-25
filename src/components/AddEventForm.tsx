import { useContext, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { useParams } from "react-router-dom";
import { handleDataEntry } from "../utils/dataEntry";
import { postNewEvent } from "../api";

function AddEventForm({
  setAddingEvent,
  setPageUpdates,
}: {
  setAddingEvent: Function;
  setPageUpdates: Function;
}) {
  const { loggedInUser } = useContext(UserContext);
  const application_id = Number(useParams().application_id);
  const [error, setError] = useState([false, ""]);
  const [eventData, setEventData] = useState({
    user_id: loggedInUser!.id,
    application_id: application_id,
    title: "",
    date: new Date(Date.now()).toISOString(),
    notes: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const newEvent = await postNewEvent(loggedInUser!.accessToken, eventData);
      setAddingEvent(false);
      setPageUpdates((current: number) => current + 1);
    } catch (error: any) {
      if (error.response.data.error === "FORBIDDEN_ACTION") {
        setError([
          true,
          "The event cannot be saved as the date selected preceeds application date",
        ]);
      } else {
        setError([true, "There has been an error, please try again later"]);
      }
    }
  }

  return (
    <form action="submit" onSubmit={handleSubmit}>
      <h3 className="vertical-timeline-element-title">New event</h3>
      <label htmlFor="event-title">Event:</label> <br />
      <input
        required
        type="text"
        id="event-title"
        onChange={(e) => handleDataEntry("title", e.target.value, setEventData)}
        value={eventData.title}
      />
      <br />
      <label htmlFor="event-notes">Notes:</label> <br />
      <input
        type="text"
        id="event-notes"
        onChange={(e) => handleDataEntry("notes", e.target.value, setEventData)}
        value={eventData.notes}
      />
      <br />
      <label htmlFor="event-date">Date:</label> <br />
      <input
        required
        type="date"
        id="event-notes"
        value={eventData.date.split("T")[0]}
        max={new Date(Date.now()).toISOString().split("T")[0]}
        onChange={(e) => {
          setError([false, ""]);
          handleDataEntry("date", e.target.value, setEventData);
        }}
      />
      <br />
      {error[0] && <p>{error[1]}</p>}
      <button type="submit">Save</button>
    </form>
  );
}

export default AddEventForm;
