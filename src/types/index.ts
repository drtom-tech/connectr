// Type definitions for Connectr app

export interface Event {
  eventID: string;
  name: string;
  date: Date;
  location: string;
  description: string;
  userId: string; // To scope data access by user
}

export interface Person {
  personID: string;
  firstName: string;
  lastName: string;
  organization: string;
  contactInfo: string;
  notes: string;
  userId: string; // To scope data access by user
}

export interface Attendance {
  attendanceID: string;
  eventID: string;
  personID: string;
  userId: string; // To scope data access by user
}

export interface Relationship {
  relationshipID: string;
  personA_ID: string;
  personB_ID: string;
  type: string; // e.g., 'Partner', 'Child', 'Colleague'
  userId: string; // To scope data access by user
}

export interface User {
  uid: string;
  email: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Timeline: undefined;
  AddEvent: undefined;
  EventDetail: { eventId: string };
  PersonDetail: { personId: string };
  AddPerson: undefined;
};


