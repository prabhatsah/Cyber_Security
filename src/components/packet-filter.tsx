"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, RefreshCcw } from "lucide-react";

const interfaces = [
  { id: "Ethernet", name: "Ethernet" },
  { id: "Wi-Fi", name: "Wi-Fi" },
  { id: "docker0", name: "Docker Bridge" },
  { id: "lo", name: "Loopback" },
];

const protocols = ["All", "tcp", "udp", "http", "https", "icmp"];

export function PacketFilter({
  onFilter,
}: {
  onFilter: (filters: any) => void;
}) {
  const [sourceIp, setSourceIp] = useState("");
  const [destinationIp, setDestinationIp] = useState("");
  const [selectedInterface, setSelectedInterface] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState("All");

  const handleFilter = () => {
    onFilter({
      sourceIp,
      destinationIp,
      interface: selectedInterface,
      protocol: selectedProtocol,
    });
  };

  const handleReset = () => {
    setSourceIp("");
    setDestinationIp("");
    setSelectedInterface("");
    setSelectedProtocol("All");
    onFilter({});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Packet Filters
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Interface</label>
            <Select
              value={selectedInterface}
              onValueChange={setSelectedInterface}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interface" />
              </SelectTrigger>
              <SelectContent>
                {interfaces.map((iface) => (
                  <SelectItem key={iface.id} value={iface.id}>
                    {iface.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Protocol</label>
            <Select
              value={selectedProtocol}
              onValueChange={setSelectedProtocol}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select protocol" />
              </SelectTrigger>
              <SelectContent>
                {protocols.map((protocol) => (
                  <SelectItem key={protocol} value={protocol}>
                    {protocol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Source IP</label>
            <Input
              placeholder="e.g., 192.168.1.1"
              value={sourceIp}
              onChange={(e) => setSourceIp(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Destination IP</label>
            <Input
              placeholder="e.g., 10.0.0.1"
              value={destinationIp}
              onChange={(e) => setDestinationIp(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={handleFilter} className="btn-primary">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
