import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            Medications need restock
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">38</div>
          <p className="text-xs text-muted-foreground">Within next 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Drug Issues to Wards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">152</div>
          <p className="text-xs text-muted-foreground">In the last 7 days</p>
          <Button asChild className="mt-2 w-full">
            <Link to="/drug-issues">View Details</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
