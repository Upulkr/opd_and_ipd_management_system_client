export interface Surgery {
  id: string;
  patientName: string;
  surgeryType: string;
  assignedStaff: string;
  date: string;
  phoneNumber: string;
}

export interface DashboardStats {
  totalUpcomingSurgeries: number;
  successfulSurgeries: number;
  averageSurgeryDuration: string;
}
