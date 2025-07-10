"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Shield, Users, FileCheck, Lock } from "lucide-react";

export default function CustomerTrustOverview() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Customer Trust Center</h1>
        <p className="text-muted-foreground mt-2">
          Discover how we maintain and protect your trust through our security and compliance initiatives
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Security Measures</CardTitle>
            <CardDescription>
              Our comprehensive security program and controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Enterprise-grade infrastructure security</li>
              <li>• Regular security assessments and penetration testing</li>
              <li>• 24/7 security monitoring and incident response</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Data Privacy</CardTitle>
            <CardDescription>
              How we protect and handle your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• GDPR and CCPA compliance</li>
              <li>• Data encryption at rest and in transit</li>
              <li>• Strict access controls and authentication</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileCheck className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Compliance</CardTitle>
            <CardDescription>
              Our certifications and compliance standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• SOC 2 Type II certified</li>
              <li>• ISO 27001 certified</li>
              <li>• Regular compliance audits</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Lock className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Trust Policies</CardTitle>
            <CardDescription>
              Our commitment to maintaining your trust
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Transparent data handling practices</li>
              <li>• Regular security updates and notifications</li>
              <li>• Dedicated trust and security team</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}