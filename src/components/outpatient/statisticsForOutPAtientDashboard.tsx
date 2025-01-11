import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Search, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// interface StatisticsData {
//   totalPatients: number;
//   patientsScheduledToday: number;
//   patientsSeenToday: number;
//   admittedToIPD: number;
// }
interface StatisticsProps {
  numberOfTodayOutPatients: number;
}

export default function Statistics({
  numberOfTodayOutPatients,
}: StatisticsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // In a real application, this would trigger a search in your patient database
    console.log("Searching for:", searchTerm);
    // You would typically update state here or navigate to a search results page
  };
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patient Search</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients Scheduled Today
          </CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* <div className="text-2xl font-bold">
            {data.patientsScheduledToday}
          </div> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Patients Seen Today
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numberOfTodayOutPatients}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admitted to IPD</CardTitle>
          <BedDouble className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* <div className="text-2xl font-bold">{data.admittedToIPD}</div> */}
        </CardContent>
      </Card>
    </div>
  );
}
