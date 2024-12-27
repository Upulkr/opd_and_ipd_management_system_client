export interface Department {
  id: string;
  name: string;
  nurses: number;
  doctors: number;
  absentees: number;
}

export interface DailyStats {
  date: string;
  totalPresent: number;
}
