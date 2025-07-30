import type { TEvent } from "../types/eventTypes";

export function formatIsoTimestamp(timestamp: string, dateOnly: boolean) {
  if (timestamp.toUpperCase().charAt(-1) !== "Z") {
    timestamp += "Z";
  }

  const date = new Date(timestamp);
  if (dateOnly) {
    return date.toLocaleDateString("en-GB");
  }

  return date.toLocaleString("en-GB");
}

export function eventsPreceedDate(date: string, events: TEvent[]): boolean {
  const dateObj = new Date(date);

  for (const appEvent of events) {
    const eventDateObj = new Date(appEvent.date);
    if (eventDateObj < dateObj && !appEvent.undeletable) {
      return true;
    }
  }
  return false;
}
