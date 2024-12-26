import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AddClinicDetails() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Add Clinic Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Clinic Details
        </Button>
      </CardContent>
    </Card>
  );
}
