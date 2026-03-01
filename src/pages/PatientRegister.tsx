import PatientRegisterForm from "@/components/forms/PatientRegisterForm";

/**
 * PatientRegister Page
 *
 * This page contains the form for registering a new patient into the system.
 * It provides a dedicated full-page layout for the registration process.
 */
const PatientRegister = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-1 bg-white rounded-lg ">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Register Patient
      </h1>
      <PatientRegisterForm />
    </div>
  );
};

export default PatientRegister;
