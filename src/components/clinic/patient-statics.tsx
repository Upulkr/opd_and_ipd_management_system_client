import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", total: 15 },
  { name: "Tue", total: 20 },
  { name: "Wed", total: 18 },
  { name: "Thu", total: 25 },
  { name: "Fri", total: 22 },
  { name: "Sat", total: 12 },
  { name: "Sun", total: 8 },
];

export default function PatientStatistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Patient Visits</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
