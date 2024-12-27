import AdmissionSheetForm from "@/components/forms/AdmissionSheetForm";

function AdmissionSheet() {
  return (
    <div className="container mx-auto ">
      <h1 className="text-3xl font-bold text-center p-3">Admission Sheet</h1>
      <AdmissionSheetForm />;
    </div>
  );
}

export default AdmissionSheet;
