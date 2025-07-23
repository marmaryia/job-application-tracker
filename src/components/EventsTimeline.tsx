import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import type { TEvent } from "../types/eventTypes";
import { formatIsoTimestamp } from "../utils/dates";
import { deleteEventById } from "../api";
import { UserContext } from "../contexts/userContext";
import { useContext, useState } from "react";
import AddEventButton from "./AddEventButton";
import AddEventForm from "./AddEventForm";

function EventsTimeline({
  events,
  setPageUpdates,
}: {
  events: TEvent[];
  setPageUpdates: Function;
}) {
  const { loggedInUser } = useContext(UserContext);
  const [addingEvent, setAddingEvent] = useState<boolean>(false);

  async function deleteEvent(event_id: number) {
    try {
      await deleteEventById(loggedInUser!.accessToken, event_id);
      setPageUpdates((current: number) => current + 1);
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <VerticalTimeline layout={"1-column-right"}>
      {events.map((appEvent) => {
        return (
          <VerticalTimelineElement
            key={appEvent.event_id}
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date={formatIsoTimestamp(appEvent.date, false)}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            // icon={<WorkIcon />}
          >
            {!appEvent.undeletable && (
              <button onClick={() => deleteEvent(appEvent.event_id)}>
                Delete
              </button>
            )}
            <h3 className="vertical-timeline-element-title">
              {appEvent.title}
            </h3>
            <p>{appEvent.notes}</p>
          </VerticalTimelineElement>
        );
      })}

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        contentStyle={
          addingEvent
            ? { background: "rgb(33, 150, 243)", color: "#fff" }
            : { display: "none" }
        }
        contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
        iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
        icon={<AddEventButton setAddingEvent={setAddingEvent} />}
      >
        {addingEvent && <AddEventForm />}
      </VerticalTimelineElement>
    </VerticalTimeline>
  );
}

export default EventsTimeline;
