import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";

import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/Badge";
import { useEffect, useRef } from "react";

type UrlInfo = {
  method: string;
  url: string;
  flags: string;
};

const truncateUrl = (url: string, maxLength = 100) => {
  if (url.length <= maxLength) return url;
  const start = url.slice(0, 50); // First 25 chars
  const end = url.slice(-50); // Last 25 chars
  return `${start}...${end}`;
};

export default function SpiderScan({ progress, foundURI }: {
  progress: number;
  foundURI: UrlInfo[];
}) {
  const tableBodyRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever new data is added
  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = tableBodyRef.current.scrollHeight;
    }
  }, [foundURI]);

  return (
    <div>
      <div className="flex gap-5">
        <ProgressBar
          value={progress}
          label={`${progress}%`}
          className="w-1/2"
        />
        <div className="flex gap-5 w-1/2">
          <div>
            <p>
              <span>Found URLs: </span>
              <span>{foundURI.length}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mt-8">
        <h1 className="text-widgetHeader font-semibold text-widget-title ">
          URLs
        </h1>
        <TableRoot className="mt-3">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-40">Method</TableHeaderCell>
                <TableHeaderCell>URI</TableHeaderCell>
                <TableHeaderCell className="w-80">Flags</TableHeaderCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableRoot>
        <TableRoot ref={tableBodyRef} className="max-h-96">
          <Table>
            <TableBody>
              {foundURI.length > 0 ? (
                foundURI.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-40">
                      <Badge variant="default">{item.method || "GET"}</Badge>
                    </TableCell>
                    <TableCell>{truncateUrl(item.url)}</TableCell>
                    <TableCell className="w-80">
                      {item.flags || "None"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No URLs found yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
    </div>
  );
}
