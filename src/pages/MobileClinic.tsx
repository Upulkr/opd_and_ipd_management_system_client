import { ClinicStats } from "@/components/mobile-clinic/clininc-stats";
import { PatientTable } from "@/components/mobile-clinic/patient-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MobileClinic() {
  return (
    <div className="w-full">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Mobile Clinic</h1>
        </div>
      </header>
      <main>
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <ClinicStats />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Patient Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <PatientTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default MobileClinic;
