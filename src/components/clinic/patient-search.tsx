import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function PatientSearch() {
  const [nic, setNic] = useState<string>("");
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Patient Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search patients..."
            className="flex-grow"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
          <Link to={`/patient-profile-page/${nic}`}>
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
