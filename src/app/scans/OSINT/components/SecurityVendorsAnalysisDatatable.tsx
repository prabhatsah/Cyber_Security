import { Badge } from "@/components/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";
import {
  RiCheckboxCircleLine,
  RiInformationLine,
  RiQuestionMark,
} from "@remixicon/react";
import { ReactNode } from "react";
import { VendorDataTable } from "./type";

export function SecurityVendorsAnalysisDataTable({
  vendorsAnalysisDataTableData,
}: {
  vendorsAnalysisDataTableData: VendorDataTable[];
}) {
  return (
    <>
      <TableRoot>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Vendor</TableHeaderCell>
              <TableHeaderCell>Flag</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendorsAnalysisDataTableData.map((item) => {
              let iconHTML: ReactNode =
                item.flag === "unrated" ? (
                  <RiQuestionMark
                    className="-ml-0.5 size-4"
                    aria-hidden={true}
                  />
                ) : item.flag === "malware" || item.flag === "malicious" ? (
                  <RiInformationLine
                    className="-ml-0.5 size-4"
                    aria-hidden={true}
                  />
                ) : (
                  <RiCheckboxCircleLine
                    className="-ml-0.5 size-4"
                    aria-hidden={true}
                  />
                );

              return (
                <TableRow key={item.vendorName}>
                  <TableCell>{item.vendorName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.flag === "malware" || item.flag === "malicious"
                          ? "error"
                          : item.flag === "unrated"
                          ? "neutral"
                          : "success"
                      }
                    >
                      {iconHTML}
                      {item.flag}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableRoot>
    </>
  );
}
