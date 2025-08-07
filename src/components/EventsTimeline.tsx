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
import EventIcon from "@mui/icons-material/Event";
import AddEventForm from "./AddEventForm";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

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
  const reversedEvents = [...events].reverse();

  return (
    <VerticalTimeline layout={"1-column-right"}>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        id="add-event-icon"
        contentStyle={
          addingEvent
            ? {
                background: "var(--accent-color)",
                color: "black",
                padding: "2em",
                borderRadius: "20px",
              }
            : { display: "none" }
        }
        iconStyle={{
          background: "var(--accent-color)",
          color: "black",
          marginTop: addingEvent ? "" : "-1em",
        }}
        icon={<AddIcon />}
        iconOnClick={() =>
          setAddingEvent((current: boolean) => {
            return !current;
          })
        }
        visible={true}
      >
        {addingEvent && (
          <AddEventForm
            setAddingEvent={setAddingEvent}
            setPageUpdates={setPageUpdates}
          />
        )}
      </VerticalTimelineElement>
      {reversedEvents.map((appEvent) => {
        return (
          <VerticalTimelineElement
            key={appEvent.event_id}
            className="vertical-timeline-element--work"
            contentStyle={{
              background: "var(--accent-color)",
              color: "black",
              padding: "2em",
              borderRadius: "20px",
            }}
            date={formatIsoTimestamp(appEvent.date, true)}
            iconStyle={{
              background: "var(--background-color-primary)",
              color: "#fff",
            }}
            icon={<EventIcon />}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <h4 className="vertical-timeline-element-title">
                {appEvent.title}
              </h4>
              {!appEvent.undeletable && (
                <Button
                  onClick={() => deleteEvent(appEvent.event_id)}
                  variant="text"
                  sx={{ color: "black" }}
                  size="small"
                >
                  <ClearIcon />
                </Button>
              )}
            </Box>
            <p className="event-text">{appEvent?.notes?.replace("_", " ")}</p>
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
}

export default EventsTimeline;
