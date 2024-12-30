import InputNicForm from "@/components/nic-input-model/nic-input";
import { InpatienDashboardTable } from "@/components/tables/InpatienDashboardTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BedIcon,
  BookIcon,
  ClipboardIcon,
  FileTextIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function InpatientDepartment() {
  const [isShowNicForm, setIsShowNicForm] = useState(false);

  return (
    <div className="relative">
      {isShowNicForm && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={() => setIsShowNicForm(false)} // Close when clicking outside
        >
          <InputNicForm onClose={() => setIsShowNicForm(false)} />
        </div>
      )}
      <div
        className={`container mx-auto p-4  ${isShowNicForm ? "hidden" : ""}`}
      >
        <h1 className="text-3xl font-bold mb-6">
          Inpatient Department Dashboard
        </h1>

        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
          <Card>
            <CardHeader>
              <CardTitle>Patient Search</CardTitle>
              <CardDescription>
                Find patient information quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input placeholder="Search patients..." />
                <Button size="icon">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bed Availability</CardTitle>
              <CardDescription>Current bed status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">24/30</p>
                  <p className="text-sm text-muted-foreground">Occupied Beds</p>
                </div>
                <BedIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" /> View Drugs Detials
                </Button>
                <Button variant="outline">
                  <ClipboardIcon className="mr-2 h-4 w-4" />
                  Order Drugs From Pharmacy Unit
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admission Sheet</CardTitle>
              <CardDescription>Patient admission details</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setIsShowNicForm(true)}>
                <FileTextIcon className="mr-2 h-4 w-4" /> Go to Admission Sheet
              </Button>
              {/* <Link to="/inpatient-department/admission-sheet">
          
            </Link> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admission Book</CardTitle>
              <CardDescription>Comprehensive admission records</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admission-book">
                <Button className="w-full">
                  <BookIcon className="mr-2 h-4 w-4" /> Open Admission Book
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="mt-6">
          <TabsList>
            <TabsTrigger value="patients">{`Today's Update: ${new Date().toLocaleDateString()}`}</TabsTrigger>
            <TabsTrigger value="admissions">Recent Admissions</TabsTrigger>
          </TabsList>
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>
                  Current Ward Status in Inpatient Department
                </CardTitle>
                {/* <CardDescription>
                List of patients currently admitted
              </CardDescription> */}
              </CardHeader>
              <CardContent>
                {/* <div className="space-y-4">
                {["John Doe", "Jane Smith", "Bob Johnson"].map(
                  (patient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{patient}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  )
                )}
              </div> */}
                <InpatienDashboardTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admissions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Admissions</CardTitle>
                <CardDescription>
                  Patients admitted in the last 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Alice Brown", "Charlie Davis", "Eva Wilson"].map(
                    (patient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>{patient}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
