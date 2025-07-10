'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Network, Shield, Globe, Layers } from 'lucide-react';

interface PacketData {
  timestamp: string;
  length: string;
  layers: {
    ethernet: {
      src_mac: string;
      dst_mac: string;
    };
    ip: {
      src_ip: string;
      dst_ip: string;
      protocol: string;
      ttl: string;
      version: string;
    };
    tcp: {
      src_port: string;
      dst_port: string;
      flags: {
        ACK: boolean;
        FIN: boolean;
        PSH: boolean;
        RST: boolean;
        SYN: boolean;
      };
    };
    http?: {
      request_uri?: string;
      status_code?: string;
      content_type?: string;
      payload?: string;
    };
  };
}

interface PacketDetailsProps {
  packets: PacketData[];
}

export function PacketDetails({ packets }: PacketDetailsProps) {
  const getFlagColor = (flag: boolean) =>
    flag ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Network Packets Analysis</h2>
      <div className="grid gap-4">
        {packets.map((packet, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Packet #{index + 1}</CardTitle>
                </div>
                <Badge variant="outline">
                  Length: {packet.length} bytes
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Captured at: {packet.timestamp}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ethernet">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Ethernet Layer</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 p-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Source MAC:</span>
                          <div className="font-mono text-xs bg-muted p-1 rounded">
                            {packet.layers.ethernet.src_mac}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Destination MAC:</span>
                          <div className="font-mono text-xs bg-muted p-1 rounded">
                            {packet.layers.ethernet.dst_mac}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ip">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>IP Layer</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 p-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Source IP:</span>
                          <div className="font-mono text-xs bg-muted p-1 rounded">
                            {packet.layers.ip.src_ip}
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Destination IP:</span>
                          <div className="font-mono text-xs bg-muted p-1 rounded">
                            {packet.layers.ip.dst_ip}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Protocol:</span>
                          <Badge variant="secondary" className="ml-2">
                            {packet.layers.ip.protocol}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">TTL:</span>
                          <Badge variant="secondary" className="ml-2">
                            {packet.layers.ip.ttl}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Version:</span>
                          <Badge variant="secondary" className="ml-2">
                            IPv{packet.layers.ip.version}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tcp">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4" />
                      <span>TCP Layer</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 p-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Source Port:</span>
                          <Badge variant="secondary" className="ml-2">
                            {packet.layers.tcp.src_port}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Destination Port:</span>
                          <Badge variant="secondary" className="ml-2">
                            {packet.layers.tcp.dst_port}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">TCP Flags:</span>
                        <div className="flex gap-2 mt-2">
                          {Object.entries(packet.layers.tcp.flags).map(([flag, value]) => (
                            <span
                              key={flag}
                              className={`px-2 py-1 rounded text-xs font-medium ${getFlagColor(
                                value
                              )}`}
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {packet.layers.http && (
                  <AccordionItem value="http">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>HTTP Layer</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2 p-2">
                        {packet.layers.http.request_uri && (
                          <div className="text-sm">
                            <span className="font-medium">Request URI:</span>
                            <div className="font-mono text-xs bg-muted p-1 rounded mt-1">
                              {packet.layers.http.request_uri}
                            </div>
                          </div>
                        )}
                        {packet.layers.http.status_code && (
                          <div className="text-sm">
                            <span className="font-medium">Status Code:</span>
                            <Badge
                              variant={packet.layers.http.status_code === '200' ? 'default' : 'destructive'}
                              className="ml-2"
                            >
                              {packet.layers.http.status_code}
                            </Badge>
                          </div>
                        )}
                        {packet.layers.http.content_type && (
                          <div className="text-sm">
                            <span className="font-medium">Content Type:</span>
                            <Badge variant="outline" className="ml-2">
                              {packet.layers.http.content_type}
                            </Badge>
                          </div>
                        )}
                        {packet.layers.http.payload && packet.layers.http.payload !== 'N/A' && (
                          <div className="text-sm">
                            <span className="font-medium">Payload:</span>
                            <div className="font-mono text-xs bg-muted p-1 rounded mt-1 break-all">
                              {packet.layers.http.payload}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}