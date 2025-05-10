import { Input } from "@/components/ui/input";

interface Drug {
  drugId: number;
  drugName: string;
  unit: string;
  totalQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  expiryDate: Date;
}

export function SearchDrugs({
  drugs,
  setSearchedDrug,
}: {
  drugs: Drug[];
  setSearchedDrug: (drugs: Drug[]) => void;
}) {
  const handleSearch = (e: string) => {
    const searchedDrugs = drugs.filter((drug) =>
      drug.drugName.toLowerCase().includes(e.toLowerCase())
    );
    setSearchedDrug(searchedDrugs);
  };

  return (
    <div className="flex items-center">
      <Input
        type="text"
        placeholder="Search drugs..."
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
