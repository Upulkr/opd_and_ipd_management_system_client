import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
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
  const [weeklyVisits, setWeeklyVisits] = useState([]);

  const getWeeklyPatientVisits = useCallback(async () => {
    try {
      const response = await axios.get(
        "/api/clinicassigmnent/getWeeklyclinincvisits"
      );
      if (response.status === 200) {
        const data = response.data.weeklyData;

        // Ensure all 7 days exist in order
        const filledData = DAYS_OF_WEEK.map((day) => {
          const match = data.find((item: any) => item.day === day);
          return {
            day,
            total: match ? match.count : 0,
          };
        });

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
          <BarChart data={weeklyVisits}>
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
