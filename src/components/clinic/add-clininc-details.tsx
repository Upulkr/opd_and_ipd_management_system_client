import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddClinicDetails() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Add Clinic Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Link to="/create-new-clinic">
          <Button className="w-full" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Clinic Details
          </Button>
        </Link>
      </CardContent>
      <CardContent>
        <Link to="/clinic-assign">
          <Button className="w-full" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Assign Patients for Clininc
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
