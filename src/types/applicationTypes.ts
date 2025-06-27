export interface TApplication {
  application_id: number;
  company: string;
  date_created: string;
  job_url: string | null;
  latest_event: {
    date: string;
    event_id: number;
    title: string;
  };
  position: string;
  status: string;
}

export interface TNewApplication {
  user_id: number;
  company: string;
  date_created: string;
  job_url: string;
  position: string;
  status: string;
  notes: string;
  allow_duplicates?: boolean;
}

export interface TDuplicateApplication {
  application_id: number;
  company: string;
  date_created: string;
  position: string;
}
