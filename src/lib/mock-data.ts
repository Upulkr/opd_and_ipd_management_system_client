export const patients = [
  { id: 1, name: "John Doe", age: 45, lastVisit: "2023-04-15" },
  { id: 2, name: "Jane Smith", age: 32, lastVisit: "2023-04-18" },
  { id: 3, name: "Bob Johnson", age: 58, lastVisit: "2023-04-20" },
  { id: 4, name: "Alice Brown", age: 27, lastVisit: "2023-04-22" },
  { id: 5, name: "Charlie Davis", age: 41, lastVisit: "2023-04-23" },
];

export const appointments = [
  { id: 1, patientName: "John Doe", date: "2023-04-25", time: "09:00 AM" },
  { id: 2, patientName: "Jane Smith", date: "2023-04-25", time: "10:30 AM" },
  { id: 3, patientName: "Bob Johnson", date: "2023-04-25", time: "02:00 PM" },
  { id: 4, patientName: "Alice Brown", date: "2023-04-26", time: "11:00 AM" },
  { id: 5, patientName: "Charlie Davis", date: "2023-04-26", time: "03:30 PM" },
];

export const statistics = {
  totalPatients: 1250,
  patientsScheduledToday: 25,
  patientsSeenToday: 12,
  newPatientsThisWeek: 23,
  admittedToIPD: 5,
};
