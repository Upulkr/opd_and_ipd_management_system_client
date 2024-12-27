import { DashboardStats, Surgery } from "@/types/surgery";
import { DailyStats, Department } from "@/types/type";
export const surgeries: Surgery[] = [
  {
    id: "1",
    patientName: "John Doe",
    surgeryType: "Appendectomy",
    assignedStaff: "Dr. Smith",
    date: "2024-01-15",
    phoneNumber: "123-456-7890",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    surgeryType: "Hip Replacement",
    assignedStaff: "Dr. Johnson",
    date: "2024-01-18",
    phoneNumber: "234-567-8901",
  },
  {
    id: "3",
    patientName: "Bob Brown",
    surgeryType: "Cataract Surgery",
    assignedStaff: "Dr. Williams",
    date: "2024-01-20",
    phoneNumber: "345-678-9012",
  },
  // Add more mock data as needed
];

export const dashboardStats: DashboardStats = {
  totalUpcomingSurgeries: 15,
  successfulSurgeries: 1250,
  averageSurgeryDuration: "2h 30m",
};

export const departments: Department[] = [
  { id: "1", name: "Emergency", nurses: 20, doctors: 10, absentees: 2 },
  { id: "2", name: "Surgery", nurses: 30, doctors: 15, absentees: 1 },
  { id: "3", name: "Pediatrics", nurses: 25, doctors: 8, absentees: 3 },
  { id: "4", name: "Cardiology", nurses: 15, doctors: 12, absentees: 0 },
  { id: "5", name: "Neurology", nurses: 18, doctors: 9, absentees: 2 },
];

export const dailyStats: DailyStats[] = [
  { date: "2023-06-01", totalPresent: 150 },
  { date: "2023-06-02", totalPresent: 155 },
  { date: "2023-06-03", totalPresent: 148 },
  { date: "2023-06-04", totalPresent: 152 },
  { date: "2023-06-05", totalPresent: 157 },
  { date: "2023-06-06", totalPresent: 160 },
  { date: "2023-06-07", totalPresent: 158 },
];

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
