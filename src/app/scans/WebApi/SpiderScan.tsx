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

export default function SpiderScan({ progress, foundURI }) {
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
        <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
          URLs
        </h1>
        <TableRoot className="mt-3">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>URI</TableHeaderCell>
                <TableHeaderCell>Flags</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foundURI.length > 0 ? (
                foundURI.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="default">{item.method || "GET"}</Badge>
                    </TableCell>
                    <TableCell>{item.url}</TableCell>
                    <TableCell>{item.flags || "None"}</TableCell>
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
