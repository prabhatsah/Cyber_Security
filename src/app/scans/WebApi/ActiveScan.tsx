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

export default function ActiveScan({
  progress,
  newAlerts,
  numRequests,
  messages,
}) {
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
              <span>Number of Requests: </span>
              <span>{numRequests}</span>
            </p>
          </div>
          <div>
            <p>
              <span>New Alerts: </span>
              <span>{newAlerts}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mt-8">
        <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
          Messages
        </h1>
        <TableRoot className="mt-3">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Req Timestamp</TableHeaderCell>
                <TableHeaderCell>Resp Timestamp</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>URI</TableHeaderCell>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Reason</TableHeaderCell>
                <TableHeaderCell>RTT</TableHeaderCell>
                <TableHeaderCell>Size Resp Header</TableHeaderCell>
                <TableHeaderCell>Size Resp Body</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.length > 0 ? (
                messages.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.request_timestamp}</TableCell>
                    <TableCell>{item.response_timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="default">{item.method}</Badge>
                    </TableCell>
                    <TableCell>{item.url}</TableCell>
                    <TableCell>{item.status_code}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>{item.rtt}</TableCell>
                    <TableCell>{item.response_header_size}</TableCell>
                    <TableCell>{item.response_body_size}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No Messages found yet.
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
