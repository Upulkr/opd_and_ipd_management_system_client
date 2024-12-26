import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardHeader() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Clinic Dashboard</CardTitle>
        <CardDescription>
          Overview of today's activities and statistics
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
