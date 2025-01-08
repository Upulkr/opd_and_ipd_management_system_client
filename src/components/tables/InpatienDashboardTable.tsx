import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tableHeaders = [
  "Ward Number",
  "Ward Name",
  "No.of Patients Undergoing Treatment",
  "No.of Today Admitted",
  "No.of Today Discharged",
  "No.of Deaths",
  "No.of Doctors working",
  "No.of Nurses working",
  "No.of Beds",
  "No.of Beds Available",
  "No.of Beds Occupied",
  "Telephone Number",
];

export type WardDetails = {
  wardNumber: number;
  noOfpatientsUndergoing: number;
  getnoOfTodayAdmitted: number;
  wardName: string;
  noOfDischargedToday: number;
  noOfBeds: number;
  noOfUsedBeds: number;
  noOfFreeBeds: number;
  noOfdoctors: number;
  noOfnurses: number;
  telephone: number;
}[];

export function InpatienDashboardTable({
  wardData,
}: {
  wardData: WardDetails;
}) {
  // Debugging: log the data before rendering

  return (
    <Table>
      <TableCaption>View More</TableCaption>
      <TableHeader>
        <TableRow>
          {tableHeaders.map((header, i) => (
            <TableHead className="text-center" key={i}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Debugging: Add a log for the data */}
        {wardData.length > 0 ? (
          wardData.map(
            (
              {
                wardNumber,
                noOfpatientsUndergoing,
                getnoOfTodayAdmitted,
                wardName,
                noOfDischargedToday,
                noOfBeds,
                noOfUsedBeds,
                noOfFreeBeds,
                noOfdoctors,
                noOfnurses,
                telephone,
              },
              i
            ) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-center">
                  {wardNumber}
                </TableCell>
                <TableCell className="text-center">{wardName}</TableCell>
                <TableCell className="text-center">
                  {noOfpatientsUndergoing}
                </TableCell>
                <TableCell className="text-center">
                  {getnoOfTodayAdmitted}
                </TableCell>
                <TableCell className="text-center">
                  {noOfDischargedToday}
                </TableCell>
                <TableCell className="text-center">{noOfBeds}</TableCell>
                <TableCell className="text-center">{noOfdoctors}</TableCell>
                <TableCell className="text-center">{noOfnurses}</TableCell>
                <TableCell className="text-center">{noOfBeds}</TableCell>
                <TableCell className="text-center">{noOfUsedBeds}</TableCell>
                <TableCell className="text-center">{noOfFreeBeds}</TableCell>
                <TableCell className="text-center">{telephone}</TableCell>
              </TableRow>
            )
          )
        ) : (
          <h2>No Data</h2>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          {/* <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-center">$2,500.00</TableCell> */}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
