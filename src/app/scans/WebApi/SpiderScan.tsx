// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeaderCell,
//   TableRoot,
//   TableRow,
// } from "@/components/Table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/Badge";
import { useEffect, useRef } from "react";

export default function SpiderScan({ progress, foundURI }) {
  const tableBodyRef = useRef(null);

  // Scroll only the table body when new data is added
  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = tableBodyRef.current.scrollHeight;
    }
  }, [foundURI]);

  return (
    <div>
      {/* Progress and URL count */}
      <div className="flex gap-5">
        <ProgressBar
          value={progress}
          label={`${progress}%`}
          className="w-1/2"
        />
        <div className="flex items-center gap-5 w-1/2">
          <p>
            <span>Found URLs: </span>
            <span>{foundURI.length}</span>
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          URLs
        </h3>

        {/* Scrollable Table Body */}
        <div
          ref={tableBodyRef}
          className="overflow-y-auto h-96 border rounded-lg mt-4"
        >
          <Table className="w-full">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
                  Method
                </TableHeaderCell>
                <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
                  URI
                </TableHeaderCell>
                <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
                  Flags
                </TableHeaderCell>
              </TableRow>
            </TableHead>

            {foundURI.length > 0 ? (
              <TableBody>
                {foundURI.map((item, index) => (
                  <TableRow key={`${item.url}-${index}`}>
                    <TableCell className="border-b font-medium text-tremor-content-strong dark:border-dark-tremor-border dark:text-dark-tremor-content-strong">
                      <Badge variant="default">{item.method || "GET"}</Badge>
                    </TableCell>
                    <TableCell className="border-b dark:border-dark-tremor-border">
                      {item.url}
                    </TableCell>
                    <TableCell className="border-b dark:border-dark-tremor-border">
                      {item.flags || "None"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-center p-4">
                    No URLs found yet.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}
