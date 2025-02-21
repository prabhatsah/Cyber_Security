'use client';

import { DashboardHeader } from '@/components/dashboard-header';
import { PacketDetails } from '@/components/packet-details';
import { PacketStats } from '@/components/packet-stats';
import { PacketTable } from '@/components/packet-table';
import { VulnerabilityAlert } from '@/components/vulnerability-alert';
import { PacketFilter } from '@/components/packet-filter';
import { useState } from 'react';

const packetData = {
  count: 2,
  packets: [
    {
      layers: {
        ethernet: {
          dst_mac: "c4:7e:e0:22:7f:42",
          src_mac: "e0:70:ea:ae:75:a3"
        },
        http: {
          cache_control: "N/A",
          connection: "close",
          content_length: "N/A",
          content_type: "N/A",
          date: "N/A",
          full_request_uri: "http://www.msftncsi.com/ncsi.txt",
          payload: "N/A",
          reason_phrase: "N/A",
          request_uri: "/ncsi.txt",
          status_code: "N/A"
        },
        ip: {
          checksum: "0x0043",
          dscp: "0",
          dst_ip: "23.58.120.209",
          ecn: "0",
          flags: {
            DF: false,
            MF: false
          },
          fragment_offset: "0",
          header_length: "20",
          identification: "0xa656",
          protocol: "6",
          src_ip: "192.168.3.7",
          total_length: "164",
          ttl: "128",
          version: "4"
        },
        tcp: {
          acknowledgment_number: "1",
          dst_port: "80",
          flags: {
            ACK: true,
            FIN: true,
            PSH: true,
            RST: true,
            SYN: true
          },
          payload_length: "124",
          sequence_number: "1",
          src_port: "64979",
          window_size: "262656"
        }
      },
      length: "178",
      timestamp: "2025-02-21 13:41:41.508933"
    },
    {
      layers: {
        ethernet: {
          dst_mac: "e0:70:ea:ae:75:a3",
          src_mac: "c4:7e:e0:22:7f:42"
        },
        http: {
          cache_control: "max-age=30, must-revalidate",
          connection: "close",
          content_length: "14",
          content_type: "text/plain",
          date: "Fri, 21 Feb 2025 08:11:42 GMT",
          full_request_uri: "http://www.msftncsi.com/ncsi.txt",
          payload: "4d:69:63:72:6f:73:6f:66:74:20:4e:43:53:49",
          reason_phrase: "OK",
          request_uri: "/ncsi.txt",
          status_code: "200"
        },
        ip: {
          checksum: "0x9cba",
          dscp: "0",
          dst_ip: "192.168.3.7",
          ecn: "0",
          flags: {
            DF: false,
            MF: false
          },
          fragment_offset: "0",
          header_length: "20",
          identification: "0x4aa8",
          protocol: "6",
          src_ip: "23.58.120.209",
          total_length: "219",
          ttl: "63",
          version: "4"
        },
        tcp: {
          acknowledgment_number: "125",
          dst_port: "64979",
          flags: {
            ACK: true,
            FIN: true,
            PSH: true,
            RST: true,
            SYN: true
          },
          payload_length: "179",
          sequence_number: "1",
          src_port: "80",
          window_size: "14720"
        }
      },
      length: "233",
      timestamp: "2025-02-21 13:41:41.511847"
    }
  ]
};

export default function Home() {
  const [filters, setFilters] = useState({});
  
  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    // In a real application, you would filter the packets based on these criteria
    console.log('Applying filters:', newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6 space-y-6">
        <PacketStats />
        <PacketFilter onFilter={handleFilter} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PacketTable />
          <VulnerabilityAlert />
        </div>
        <PacketDetails packets={packetData.packets} />
      </main>
    </div>
  );
}