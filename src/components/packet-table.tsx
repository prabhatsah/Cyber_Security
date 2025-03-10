"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PacketModal } from "./packet-modal";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// const testpacket = [
//   {
//     id: "1",
//     timestamp: "2024-03-26 10:15:23",
//     src_addr: "192.168.1.100",
//     dst_addr: "10.0.0.5",
//     protocol: "TCP",
//     severity: "Safe",
//   },
//   {
//     id: "1",
//     timestamp: "2024-03-26 10:15:23",
//     src_addr: "192.168.1.100",
//     dst_addr: "10.0.0.5",
//     protocol: "TCP",
//     severity: "Safe",
//   },
//   {
//     id: "1",
//     timestamp: "2024-03-26 10:15:23",
//     src_addr: "192.168.1.100",
//     dst_addr: "10.0.0.5",
//     protocol: "TCP",
//     severity: "Safe",
//   },
//   {
//     id: "1",
//     timestamp: "2024-03-26 10:15:23",
//     src_addr: "192.168.1.100",
//     dst_addr: "10.0.0.5",
//     protocol: "TCP",
//     severity: "Safe",
//   },
//   {
//     id: "1",
//     timestamp: "2024-03-26 10:15:23",
//     src_addr: "192.168.1.100",
//     dst_addr: "10.0.0.5",
//     protocol: "TCP",
//     severity: "Safe",
//   },
// ];

interface Packet {
  id: string;
  timestamp: string;
  src_addr: string;
  dst_addr: string;
  protocol: string;
  severity: string;
}

interface PacketDetailsProps {
  packets: Packet[];
}
/* export function PacketTable(packets: Packet[]) { */
export function PacketTable({ packets }: PacketDetailsProps) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (packet: Packet) => {
    setSelectedRow(packet.id);
    setSelectedPacket({
      timestamp: packet.timestamp,
      length: packet.length,
      layers: packet.layers,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  console.log("Packets => ", packets);
  return (
    <>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recent Network Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add fixed height and scroll for the table */}
          <ScrollArea className="h-64 w-full">
            {/* Ensure the parent container allows the table to be scrollable */}
            <div className="w-full overflow-x-auto h-full relative">
              <Table>
                {/* Make the header sticky */}
                <TableHeader className="sticky top-0 bg-white z-10 shadow">
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packets && packets.length ? (
                    packets.map((packet) => (
                      <TableRow
                        key={packet.id}
                        onClick={() => handleRowClick(packet)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell>{packet.timestamp}</TableCell>
                        <TableCell>{packet.src_addr}</TableCell>
                        <TableCell>{packet.dst_addr}</TableCell>
                        <TableCell>{packet.protocol}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              packet.severity.toLowerCase() === "safe"
                                ? "bg-green-100 text-green-800"
                                : packet.severity.toLowerCase() === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {packet.severity}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>No packets found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Packet Modal */}
      <PacketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        packet={selectedPacket}
      />
    </>
  );
}
