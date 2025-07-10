'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Network, Shield, Globe, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    tcp?: {
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
    udp?: {
      src_port: string;
      dst_port: string;
      length: string;
    };
    icmp?: {
      type: string;
      code: string;
    };
    http?: {
      request_uri?: string;
      status_code?: string;
      content_type?: string;
      payload?: string;
    };
    dns?: {
      query?: string;
      type?: string;
      class?: string;
    };
  };
}

interface PacketModalProps {
  isOpen: boolean;
  onClose: () => void;
  packet: PacketData | null;
}

export function PacketModal({ isOpen, onClose, packet }: PacketModalProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (packet && isOpen) {
      // Auto-expand the first section when the modal opens
      setExpandedSection('ethernet');
    } else {
      setExpandedSection(null);
    }
  }, [packet, isOpen]);

  const getFlagColor = (flag: boolean) =>
    flag ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
         : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  
  // Safe access helper function
  const safeGet = (obj: any, path: string, fallback: any = 'N/A') => {
    try {
      const pathParts = path.split('.');
      let result = obj;
      
      for (const part of pathParts) {
        if (result === undefined || result === null) {
          return fallback;
        }
        result = result[part];
      }
      
      return result === undefined || result === null ? fallback : result;
    } catch (err) {
      return fallback;
    }
  };

  if (!packet || !isOpen) return null;

  const hasEthernet = packet.layers && packet.layers.ethernet;
  const hasIP = packet.layers && packet.layers.ip;
  const hasTCP = packet.layers && packet.layers.tcp;
  const hasUDP = packet.layers && packet.layers.udp;
  const hasICMP = packet.layers && packet.layers.icmp;
  const hasHTTP = packet.layers && packet.layers.http;
  const hasDNS = packet.layers && packet.layers.dns;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-primary" />
            <DialogTitle>Packet Analysis</DialogTitle>
          </div>
          <DialogDescription>
            Captured at: {safeGet(packet, 'timestamp')} | Length: {safeGet(packet, 'length')} bytes
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Accordion
            type="single"
            collapsible
            value={expandedSection}
            onValueChange={setExpandedSection}
            className="w-full"
          >
            {hasEthernet && (
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
                        <div className="font-mono text-xs bg-muted p-1 rounded mt-1">
                          {safeGet(packet.layers.ethernet, 'src_mac')}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Destination MAC:</span>
                        <div className="font-mono text-xs bg-muted p-1 rounded mt-1">
                          {safeGet(packet.layers.ethernet, 'dst_mac')}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {hasIP && (
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
                        <div className="font-mono text-xs bg-muted p-1 rounded mt-1">
                          {safeGet(packet.layers.ip, 'src_ip')}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Destination IP:</span>
                        <div className="font-mono text-xs bg-muted p-1 rounded mt-1">
                          {safeGet(packet.layers.ip, 'dst_ip')}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Protocol:</span>
                        <Badge variant="secondary" className="ml-2">
                          {safeGet(packet.layers.ip, 'protocol')}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">TTL:</span>
                        <Badge variant="secondary" className="ml-2">
                          {safeGet(packet.layers.ip, 'ttl')}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Version:</span>
                        <Badge variant="secondary" className="ml-2">
                          IPv{safeGet(packet.layers.ip, 'version')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {hasTCP && (
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
                          {safeGet(packet.layers.tcp, 'src_port')}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Destination Port:</span>
                        <Badge variant="secondary" className="ml-2">
                          {safeGet(packet.layers.tcp, 'dst_port')}
                        </Badge>
                      </div>
                    </div>
                    {packet.layers.tcp?.flags && (
                      <div>
                        <span className="text-sm font-medium">TCP Flags:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(packet.layers.tcp.flags || {}).map(([flag, value]) => (
                            <span
                              key={flag}
                              className={`px-2 py-1 rounded text-xs font-medium ${getFlagColor(
                                !!value
                              )}`}
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {hasUDP && (
              <AccordionItem value="udp">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4" />
                    <span>UDP Layer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Source Port:</span>
                        <Badge variant="secondary" className="ml-2">
                          {safeGet(packet.layers.udp, 'src_port')}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Destination Port:</span>
                        <Badge variant="secondary" className="ml-2">
                          {safeGet(packet.layers.udp, 'dst_port')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Length:</span>
                      <Badge variant="secondary" className="ml-2">
                        {safeGet(packet.layers.udp, 'length')}
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {hasICMP && (
              <AccordionItem value="icmp">
                {/* ICMP content */}
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4" />
                    <span>ICMP Layer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Type:</span>
                        <Badge variant="secondary" className="ml-2">
                          {safeGet(packet.layers.icmp, 'type')}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Code:</span>
                        <Badge variant="secondary" className="ml-2">
                          {safeGet(packet.layers.icmp, 'code')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {hasHTTP && (
              <AccordionItem value="http">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>HTTP Layer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2 p-2">
                    {safeGet(packet.layers.http, 'request_uri') !== 'N/A' && (
                      <div className="text-sm">
                        <span className="font-medium">Request URI:</span>
                        <div className="font-mono text-xs bg-muted p-1 rounded mt-1">
                          {safeGet(packet.layers.http, 'request_uri')}
                        </div>
                      </div>
                    )}
                    {safeGet(packet.layers.http, 'status_code') !== 'N/A' && (
                      <div className="text-sm">
                        <span className="font-medium">Status Code:</span>
                        <Badge
                          variant={safeGet(packet.layers.http, 'status_code') === '200' ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {safeGet(packet.layers.http, 'status_code')}
                        </Badge>
                      </div>
                    )}
                    {safeGet(packet.layers.http, 'content_type') !== 'N/A' && (
                      <div className="text-sm">
                        <span className="font-medium">Content Type:</span>
                        <Badge variant="outline" className="ml-2">
                          {safeGet(packet.layers.http, 'content_type')}
                        </Badge>
                      </div>
                    )}
                    {safeGet(packet.layers.http, 'payload') !== 'N/A' && (
                      <div className="text-sm">
                        <span className="font-medium">Payload:</span>
                        <div className="font-mono text-xs bg-muted p-1 rounded mt-1 break-all">
                          {safeGet(packet.layers.http, 'payload')}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {hasDNS && (
              <AccordionItem value="dns">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>DNS Layer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2 p-2">
                    {safeGet(packet.layers.dns, 'query') !== 'N/A' && (
                      <div className="text-sm">
                        <span className="font-medium">Query:</span>
                        <div className="font-mono text-xs bg-muted p-1 rounded mt-1">
                          {safeGet(packet.layers.dns, 'query')}
                        </div>
                      </div>
                    )}
                    {safeGet(packet.layers.dns, 'type') !== 'N/A' && (
                      <div className="text-sm">
                        <span className="font-medium">Type:</span>
                        <Badge variant="outline" className="ml-2">
                          {safeGet(packet.layers.dns, 'type')}
                        </Badge>
                      </div>
                    )}
                    {safeGet(packet.layers.dns, 'class') !== 'N/A' && (
                      <div className="text-sm">
                        <span className="font-medium">Class:</span>
                        <Badge variant="outline" className="ml-2">
                          {safeGet(packet.layers.dns, 'class')}
                        </Badge>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}