import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";
import { PopularityRanksData } from "./type";

export default function PopularityRanksDataTable({
  popularityRanksDataTableData,
}: {
  popularityRanksDataTableData: PopularityRanksData[];
}) {
  return (
    <>
      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Ranking Service</TableHeaderCell>
              <TableHeaderCell>Rank</TableHeaderCell>
              <TableHeaderCell>Timestamp</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {popularityRanksDataTableData.map((item) => (
              <TableRow key={item.rankingService}>
                <TableCell>{item.rankingService}</TableCell>
                <TableCell>{item.rank}</TableCell>
                <TableCell>{item.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </>
  );
}
