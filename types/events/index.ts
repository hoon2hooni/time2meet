import type { Timestamp } from "firebase/firestore";

export type Event = {
  id: string;
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  attendees: Attendees;
  maxCapacity: number;
};

export type Attendees = Attendee[];

export type Attendee = {
  name: string;
  availableDates: AvailableDates;
};

export type AvailableDates = Timestamp[];
