import InputBHTForm from "@/components/input-id-models/bht-input";
import InputBHTFormFrAdmissionSheet from "@/components/input-id-models/bht-input-for--individualadmissionSheetSearch";
import InputBHTFormForAdmissionBookSearch from "@/components/input-id-models/bht-input-for-individual-AdmissionBook";
import InputNicForm from "@/components/input-id-models/nic-input";
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
import { useAdmissionBookByBHT } from "@/stores/useAdmissionBook";
import { useAdmissionSheetByBHT } from "@/stores/useAdmissionSheet";
import { useAuthStore } from "@/stores/useAuth";
import { useFrontendComponentsStore } from "@/stores/useFrontendComponentsStore";
import { usePatientStore } from "@/stores/usePatientStore";
import { useWardTableInpatient } from "@/stores/useWardTableInpatient";
import axios from "axios";
import { BedIcon, BookIcon, FileTextIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function InpatientDepartment() {
  const { setEnableUpdating } = useFrontendComponentsStore((state) => state);
  const [nic, setNic] = useState<string>("");
  // const [isSearcing, setIsSearching] = useState(false);
  const [isShowNicForm, setIsShowNicForm] = useState(false);
  const [isShoBhtForm, setIsShoBhtForm] = useState(false);
  const [wardData, setWardData] = useState([]);
  const { setAdmissionSheetByBHT } = useAdmissionSheetByBHT((state) => state);
  const [isShowBHTForAdmissionSheet, setIsShowBHTForAdmissionSheet] =
    useState(false);
  const [isShowBHTForAdmissionBook, setIsShowBHTForAdmissionBook] =
    useState(false);
  const { setPatientNic } = usePatientStore((state) => state);
  const { setAdmissionBook } = useAdmissionBookByBHT((state) => state);
  const { noOfTotalBeds, noOfFreeBeds, setNoOfFreeBeds, setNoOfTotalBeds } =
    useWardTableInpatient((state) => state);
  const token = useAuthStore((state) => state.token);

  // const patientProfileHandler = async () => {
  //   try {
  //     // setIsSearching(true);
  //     const response = await axios.get(`/api/patient/${nic}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       console.log("response", response.data.Patient);
  //       setPatient(response.data.Patient);
  //       // setIsSearching(false);
  //       toast.success("Patient found successfully");
  //       navigate(`/patient-profile-page`);
  //     }
  //   } catch (error: any) {
  //     if (error.status === 500) {
  //       // setIsSearching(false);
  //       toast.error("Patient not found");
  //       return;
  //     } else {
  //       // setIsSearching(false);
  //       console.log("Error fetching patient", error);
  //     }
  //   }
  // };

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`/api/warddetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("response", response.data?.wardData);
        setWardData(response.data?.wardData);
        setNoOfFreeBeds(response.data?.wardData[0].noOfFreeBeds);
        setNoOfTotalBeds(response.data?.wardData[0].noOfFreeBeds);
      }
    } catch (error: any) {
      console.log("Error fetching table data", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);
  console.log("noOfFreeBeds", noOfFreeBeds);
  return (
    <div className="relative">
      {isShowNicForm ? (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={() => setIsShowNicForm(false)} // Close when clicking outside
        >
          <InputNicForm />
        </div>
      ) : (
        isShoBhtForm && (
          <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setIsShoBhtForm(false)} // Close when clicking outside
          >
            <InputBHTForm />
          </div>
        )
      )}
      {isShowBHTForAdmissionBook ? (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={() => setIsShowBHTForAdmissionBook(false)} // Close when clicking outside
        >
          <InputBHTFormForAdmissionBookSearch
          // onClose={() => setIsShowBHTForAdmissionBook(false)}
          />
        </div>
      ) : (
        isShowBHTForAdmissionSheet && (
          <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setIsShowBHTForAdmissionSheet(false)} // Close when clicking outside
          >
            <InputBHTFormFrAdmissionSheet
            // onClose={() => setIsShowBHTForAdmissionSheet(false)}
            />
          </div>
        )
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
              <CardTitle>Patient Profile Search</CardTitle>
              <CardDescription>
                Find patient information quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter patients' NIC"
                  onChange={(e) => setNic(e.target.value)}
                />
                <Link to={`/patient-profile-page/${nic}`}>
                  {" "}
                  <Button
                    size="icon"
                    //  onClick={patientProfileHandler}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Bed Availability in IPD Wards</CardTitle>
              <CardDescription>Current bed status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{`${noOfFreeBeds}/ ${noOfTotalBeds}`}</p>
                  <p className="text-sm text-muted-foreground">
                    Available Beds
                  </p>
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
                <Button
                  onClick={() => {
                    setEnableUpdating(true);
                    setIsShowBHTForAdmissionSheet(true);
                    setAdmissionSheetByBHT([]);
                  }}
                >
                  <SearchIcon className="mr-2 h-4 w-4" /> View Existing
                  Admission Sheets by BHT Number
                </Button>
                <Button
                  onClick={() => {
                    setEnableUpdating(true);
                    setIsShowBHTForAdmissionBook(true);
                    setAdmissionSheetByBHT([]);
                  }}
                >
                  <SearchIcon className="mr-2 h-4 w-4" /> View Exisiting
                  Admission Books by BHT Number
                </Button>
                {/* <Button variant="outline">
                  <ClipboardIcon className="mr-2 h-4 w-4" />
                  Order Drugs From Pharmacy Unit
                </Button> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admission Sheet</CardTitle>
              <CardDescription>Patient admission details</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  setIsShowNicForm(true);
                  setPatientNic("");
                  setAdmissionSheetByBHT([]);
                  setEnableUpdating(false);
                }}
              >
                <FileTextIcon className="mr-2 h-4 w-4" /> Create New Admission
                Sheet
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
              <Button
                className="w-full"
                onClick={() => {
                  setIsShoBhtForm(true);
                  setPatientNic("");
                  setAdmissionSheetByBHT([]);
                  setEnableUpdating(false);
                  setAdmissionBook([]);
                }}
              >
                <BookIcon className="mr-2 h-4 w-4" /> Create New Admission Book
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="mt-6">
          <TabsList>
            <TabsTrigger value="patients">{`Today's Update: ${new Date().toLocaleDateString()}`}</TabsTrigger>
            {/* <TabsTrigger value="admissions">Recent Admissions</TabsTrigger> */}
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
                <InpatienDashboardTable wardData={wardData} />
              </CardContent>
            </Card>
          </TabsContent>
          {/* <TabsContent value="admissions">
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
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
