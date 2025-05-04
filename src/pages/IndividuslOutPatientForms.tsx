"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatientStore } from "@/stores/usePatientStore";
import { Eye } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function OutPatientCard() {
  const { id } = useParams();

  const { outPatients } = usePatientStore((state) => state);
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Colombo",
    }).format(new Date(dateString));
  };

  // const getOutPatientsHandler = async (id: string) => {
  //   const filterOutPatient = outPatients?.filter(
  //     (outPatient) => outPatient.id === id
  //   );
  //   if (filterOutPatient.length > 0) {
  //     navigate(`/admission-outpatient-register-page/${filterOutPatient[0].id}`);
  //   } else {
  //     console.error("No matching outpatient found");
  //   }
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Out-Patient Records
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outPatients?.map((outPatient) => (
          <Card key={outPatient.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {/* Date: {formatDate(outPatient.createdAt)} */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium">Name:</dt>
                  <dd>{outPatient.name}</dd>
                </div>
                <div>
                  <dt className="font-medium">Date:</dt>
                  <dd>
                    {formatDate(
                      typeof outPatient.createdAt === "string"
                        ? outPatient.createdAt
                        : outPatient.createdAt?.toISOString() ?? ""
                    )}
                  </dd>
                </div>
              </dl>
              <Link
                to={`/admission-outpatient-register-page/${id}/${true}/${
                  outPatient.description
                }`}
              >
                <Button
                  className="w-full mt-4"
                  // onClick={() => getOutPatientsHandler(outPatient.id ?? "")}
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
