import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Remaining Clinics",
    value: 15,
    description: "for this month",
  },
  {
    title: "Completed Clinics",
    value: 42,
    description: "this month",
  },
  {
    title: "Total Patients",
    value: 128,
    description: "visited this month",
  },
  {
    title: "Average Distance",
    value: "4.7 km",
    description: "per visit",
  },
];

export const ClinicStats = () => {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ClinicStats;
