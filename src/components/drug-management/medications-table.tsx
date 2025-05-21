import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

interface Drug {
  drugId: number;
  drugName: string;
  unit: string;
  totalQuantity: number;
  usedQuantity: number;

  expiryDate: Date;
}
export function MedicationsTable({
  drugs,
  searchedDrug,
}: {
  drugs: Drug[];
  searchedDrug: Drug[];
}) {
  return (
    <div className="rounded-md border ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Current in Stock</TableHead>
            {/* <TableHead>Used</TableHead>
            <TableHead>Remaining</TableHead> */}
            <TableHead>Expiry Date</TableHead>
            {/* <TableHead>Update</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(drugs && drugs.length > 0) || searchedDrug.length > 0 ? (
            (searchedDrug.length > 0 ? searchedDrug : drugs).map(
              (drug: Drug) => (
                <TableRow key={drug.drugId}>
                  <TableCell className="font-medium">{drug.drugName}</TableCell>
                  <TableCell>{drug.unit}</TableCell>
                  <TableCell>{drug.totalQuantity}</TableCell>
                  {/* <TableCell>
                    {drug.usedQuantity ? drug.usedQuantity : "-"}
                  </TableCell>
                  <TableCell>
                    {drug.totalQuantity - drug.usedQuantity}
                  </TableCell> */}
                  <TableCell
                    className={`${
                      new Date(drug.expiryDate).getTime() - Date.now() <=
                      30 * 24 * 60 * 60 * 1000
                        ? "text-red-500 font-bold"
                        : ""
                    }`}
                  >
                    {new Date(drug.expiryDate).toLocaleDateString("en-LK", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Colombo",
                    })}
                  </TableCell>
                  {/* <Link to={`/add-new-drug-page/${drug.drugId}`}>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </TableCell>
                  </Link> */}
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No drugs
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
