import AdmissionBookForm from "@/components/AdmiisonBook/AdmissionBookForm";

export default function AdmissionBookPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Admission Book Form
      </h1>
      <AdmissionBookForm />
    </div>
  );
}
