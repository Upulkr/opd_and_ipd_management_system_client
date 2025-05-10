import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    description: "Patient file updated: Sarah Connor",
    time: "5 minutes ago",
  },
  {
    id: 2,
    description: "New appointment scheduled: Mike Johnson",
    time: "15 minutes ago",
  },
  {
    id: 3,
    description: "Lab results received: Emily Brown",
    time: "1 hour ago",
  },
  {
    id: 4,
    description: "Prescription renewed: David Lee",
    time: "2 hours ago",
  },
];

export default function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex justify-between items-center">
              <span className="text-sm">{activity.description}</span>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
