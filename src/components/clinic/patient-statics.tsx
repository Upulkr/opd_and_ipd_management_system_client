import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuth";

import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function PatientStatistics() {
  // State to store the weekly patient visits data as an array of objects ({ day, total })
  const [weeklyVisits, setWeeklyVisits] = useState<
    { day: string; total: number }[]
  >([]);

  // Retrieve the authentication token from the global auth store
  const token = useAuthStore((state) => state.token);

  /**
   * Fetches the weekly patient visits data from the backend.
   * It ensures that data for all 7 days of the week is present, filling in zeros for missing days.
   */
  const getWeeklyPatientVisits = useCallback(async () => {
    try {
      // Make an API GET request to fetch weekly visit statistics
      const response = await apiClient.get(
        "/clinicassigmnent/getWeeklyclinincvisits",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token for authentication
          },
        }
      );

      // If the request is successful (status 200)
      if (response.status === 200) {
        const data = response.data.weeklyData;

        // Ensure all 7 days of the week are represented in the dataset
        const filledData = DAYS_OF_WEEK.map((day) => {
          // Check if data exists for the current day
          const match = data?.find((item: any) => item.day === day);
          return {
            day,
            total: match ? match.count : 0, // Use the actual count or default to 0
          };
        });

        // Update the state with the complete weekly data
        setWeeklyVisits(filledData);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  }, []);

  useEffect(() => {
    getWeeklyPatientVisits();
  }, [getWeeklyPatientVisits]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Patient Visits</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={Array.isArray(weeklyVisits) ? weeklyVisits : []}>
            <XAxis
              dataKey="day"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              stroke="#888888" // ✅ fixed stroke color
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              allowDecimals={false}
            />
            <Tooltip />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
