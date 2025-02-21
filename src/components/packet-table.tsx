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

const packets = [
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
];

export function PacketTable() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Network Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packets.map((packet) => (
              <TableRow key={packet.id}>
                <TableCell>{packet.timestamp}</TableCell>
                <TableCell>{packet.source}</TableCell>
                <TableCell>{packet.destination}</TableCell>
                <TableCell>{packet.protocol}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      packet.status === 'Safe'
                        ? 'bg-green-100 text-green-800'
                        : packet.status === 'Warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {packet.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}