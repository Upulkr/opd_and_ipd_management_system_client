import AdmissionSheetForm from "../forms/AdmissionSheetForm";

function AdmissionSheet() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-600">
        Admission Sheet for inpatient
      </h1>
      <AdmissionSheetForm />
    </div>
  );
}

export default AdmissionSheet;
