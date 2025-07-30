export interface TEvent {
  date: string;
  event_id: number;
  title: string;
  notes?: null | string;
  undeletable: boolean;
}

export interface TNewEvent extends Omit<TEvent, "event_id" | "undeletable"> {}
