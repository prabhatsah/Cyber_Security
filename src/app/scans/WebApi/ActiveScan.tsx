import { useEffect, useRef } from "react";
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

const truncateUrl = (url, maxLength = 20) => {
  if (url.length <= maxLength) return url;
  const start = url.slice(0, 10); // First 25 chars
  const end = url.slice(-10); // Last 25 chars
  return `${start}...${end}`;
};

export default function ActiveScan({
  progress,
  newAlerts,
  numRequests,
  messages,
}) {
  const tableBodyRef = useRef(null);

  // Scroll only the table body when new messages are added
  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = tableBodyRef.current.scrollHeight;
    }
  }, [messages]);

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
                <TableHeaderCell className="w-52">
                  Req Timestamp
                </TableHeaderCell>
                <TableHeaderCell className="w-52">
                  Resp Timestamp
                </TableHeaderCell>
                <TableHeaderCell className="w-40">Method</TableHeaderCell>
                <TableHeaderCell className="w-56">URI</TableHeaderCell>
                <TableHeaderCell className="w-32">Code</TableHeaderCell>
                <TableHeaderCell className="w-52">Reason</TableHeaderCell>
                <TableHeaderCell className="w-28">RTT</TableHeaderCell>
                <TableHeaderCell className="w-40">
                  Size Resp Header
                </TableHeaderCell>
                <TableHeaderCell className="w-40">
                  Size Resp Body
                </TableHeaderCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableRoot>
        <TableRoot ref={tableBodyRef} className="max-h-96">
          <Table>
            {/* <TableHead>
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
            </TableHead> */}
            <TableBody>
              {messages.length > 0 ? (
                messages.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-52">
                      {item.request_timestamp}
                    </TableCell>
                    <TableCell className="w-52">
                      {item.response_timestamp}
                    </TableCell>
                    <TableCell className="w-40">
                      <Badge variant="default">{item.method}</Badge>
                    </TableCell>
                    <TableCell title={item.url} className="w-56">
                      {truncateUrl(item.url)}
                    </TableCell>
                    <TableCell className="w-32">{item.status_code}</TableCell>
                    <TableCell className="w-52">{item.reason}</TableCell>
                    <TableCell className="w-28">{item.rtt}</TableCell>
                    <TableCell className="w-40">
                      {item.response_header_size}
                    </TableCell>
                    <TableCell className="w-40">
                      {item.response_body_size}
                    </TableCell>
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

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeaderCell,
//   TableRow,
// } from "@tremor/react";
// import { ProgressBar } from "@/components/ui/progress";
// import { Badge } from "@/components/Badge";
// import { useEffect, useRef } from "react";

// export default function ActiveScan({
//   progress,
//   newAlerts,
//   numRequests,
//   messages,
// }) {
//   const tableBodyRef = useRef(null);

//   // Scroll only the table body when new messages are added
//   useEffect(() => {
//     if (tableBodyRef.current) {
//       tableBodyRef.current.scrollTop = tableBodyRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div>
//       {/* Progress and Scan Info */}
//       <div className="flex gap-5">
//         <ProgressBar
//           value={progress}
//           label={`${progress}%`}
//           className="w-1/2"
//         />
//         <div className="flex gap-5 w-1/2">
//           <div>
//             <p>
//               <span>Number of Requests: </span>
//               <span>{numRequests}</span>
//             </p>
//           </div>
//           <div>
//             <p>
//               <span>New Alerts: </span>
//               <span>{newAlerts}</span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Messages Section */}
//       <div className="w-full mt-8">
//         <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
//           Messages
//         </h1>

//         {/* Scrollable Table Body */}
//         <div className="border rounded-lg mt-4">
//           <div className="">
//             <Table className="w-full">
//               <TableHead>
//                 <TableRow>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     Req Timestamp
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     Resp Timestamp
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     Method
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     URI
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     Code
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     Reason
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     RTT
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     Size Resp Header
//                   </TableHeaderCell>
//                   <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                     Size Resp Body
//                   </TableHeaderCell>
//                 </TableRow>
//               </TableHead>
//             </Table>
//           </div>
//           <div ref={tableBodyRef} className="overflow-auto h-96">
//             <Table className="w-full">
//               {/* <TableHead>
//               <TableRow>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   Req Timestamp
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   Resp Timestamp
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   Method
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   URI
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   Code
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   Reason
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   RTT
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   Size Resp Header
//                 </TableHeaderCell>
//                 <TableHeaderCell className="sticky top-0 z-10 border-b bg-tremor-background text-tremor-content-strong dark:bg-gray-950 dark:text-dark-tremor-content-strong">
//                   Size Resp Body
//                 </TableHeaderCell>
//               </TableRow>
//             </TableHead> */}

//               {messages.length > 0 ? (
//                 <TableBody>
//                   {messages.map((item, index) => (
//                     <TableRow key={`${item.id}-${index}`}>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.request_timestamp}
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.response_timestamp}
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         <Badge variant="default">{item.method}</Badge>
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.url}
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.status_code}
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.reason}
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.rtt}
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.response_header_size}
//                       </TableCell>
//                       <TableCell className="border-b dark:border-dark-tremor-border">
//                         {item.response_body_size}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               ) : (
//                 <TableBody>
//                   <TableRow>
//                     <TableCell colSpan={9} className="text-center p-4">
//                       No Messages found yet.
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               )}
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
