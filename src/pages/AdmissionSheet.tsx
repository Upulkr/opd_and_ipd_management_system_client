import AdmissionSheetForm from "@/components/forms/AdmissionSheetForm";

/**
 * AdmissionSheet Page
 *
 * This component acts as a page wrapper for the AdmissionSheetForm.
 * It renders the form utilized for creating initial admission sheets.
 */
function AdmissionSheet() {
  return (
    <div className="w-full max-w-4xl mx-auto p-1 bg-white rounded-lg ">
      <h1 className="text-3xl font-bold text-center p-3">Admission Sheet</h1>
      <AdmissionSheetForm />;
    </div>
  );
}

export default AdmissionSheet;
