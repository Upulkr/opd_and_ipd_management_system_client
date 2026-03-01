import AdmissionSheetForm from "@/components/forms/AdmissionSheetForm";

/**
 * AdmissionSheetRegisterPage
 *
 * This page serves as a dedicated route for registering new admission sheets.
 * It sits at the top level of the page hierarchy and renders the AdmissionSheetForm.
 */
const AdmissionSheetRegisterPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-1 bg-white rounded-lg ">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Admission Sheet
      </h1>
      <AdmissionSheetForm />
    </div>
  );
};

export default AdmissionSheetRegisterPage;
