'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { PacketModal } from './packet-modal';
import { ScrollArea } from '@/components/ui/scroll-area';

/* const packets = [
  {
    id: '1',
    timestamp: '2024-03-26 10:15:23',
    source: '192.168.1.100',
    destination: '10.0.0.5',
    protocol: 'TCP',
    status: 'Safe',
  },
  {
    id: '2',
    timestamp: '2024-03-26 10:15:22',
    source: '172.16.0.10',
    destination: '192.168.1.1',
    protocol: 'UDP',
    status: 'Warning',
  },
  {
    id: '3',
    timestamp: '2024-03-26 10:15:21',
    source: '10.0.0.15',
    destination: '8.8.8.8',
    protocol: 'ICMP',
    status: 'Critical',
  },
]; */

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
export function PacketTable({ packets }: PacketDetailsProps){

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

   // Format timestamp to YYYY-MM-DD HH:mm:ss
   const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      
      // Format to local timezone using Intl.DateTimeFormat
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(date).replace(',', '').replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return timestamp; // Return original if parsing fails
    }
  };
  

  const handleRowClick = (packet) => {
    setSelectedRow(packet.id);
    setSelectedPacket({
      timestamp: packet.timestamp,
      length: packet.length,
      layers: packet.layers
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  console.log("Packets => ",packets);
  return (
    <>
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Network Activity</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="border rounded-md">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead  className="w-[150px]">Source</TableHead>
            <TableHead className="w-[150px]">Destination</TableHead>
            <TableHead className="w-[100px]">Protocol</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <ScrollArea className="h-[250px]">
        <Table>
          <TableBody>
            {packets && packets.length ? packets.map((packet) => (
              <TableRow 
                key={packet.id}
                onClick={() => handleRowClick(packet)}
                className="cursor-pointer hover:bg-muted/50"
                >
                <TableCell className="w-[180px]" >{formatTimestamp(packet.timestamp)}</TableCell>
                <TableCell className="w-[180px]" >{packet.src_addr}</TableCell>
                <TableCell className="w-[180px]">{packet.dst_addr}</TableCell>
                <TableCell className="w-[180px]">{packet.protocol}</TableCell>
                <TableCell className="w-[180px]">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      packet.severity === 'safe'
                        ? 'bg-green-100 text-green-800'
                        : packet.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {packet.severity}
                  </span>
                </TableCell>
              </TableRow>
            )) : (

              <TableRow>
                <TableCell colSpan={5}>No packets found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>
      </CardContent>
    </Card>
    <PacketModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal} 
      packet={selectedPacket} 
     />
   </>
  );
}