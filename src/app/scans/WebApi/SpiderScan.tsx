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
import { Card } from "@tremor/react";
import { Gauge } from "lucide-react";

export default function SpiderScan({ progress, foundURI }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Gauge className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-3">Scan Progress</p>
                <div className="space-y-2">
                  <progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{progress}%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Found URLs</p>
                <p className="text-2xl font-bold">{foundURI.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Gauge className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
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
