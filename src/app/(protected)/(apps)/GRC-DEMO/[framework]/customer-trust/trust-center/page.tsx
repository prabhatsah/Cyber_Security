import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import { Shield, Lock, FileCheck, Users, Download, ExternalLink } from "lucide-react";

export default function TrustCenterPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Trust Center</h1>
        <p className="text-muted-foreground mt-2">
          Learn about our commitment to security, privacy, and compliance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Our security measures</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">SOC 2 Type II</Badge>
                <Badge variant="secondary">ISO 27001</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                We maintain comprehensive security controls and undergo regular audits
                to ensure the safety of your data.
              </p>
              <Button variant="outline" className="w-full">
                <FileCheck className="mr-2 h-4 w-4" />
                View Security Practices
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Lock className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Data protection commitment</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">GDPR</Badge>
                <Badge variant="secondary">CCPA</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Your data privacy is our priority. We follow strict protocols to protect
                personal information.
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Compliance</CardTitle>
              <CardDescription>Regulatory standards</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">HIPAA</Badge>
                <Badge variant="secondary">PCI DSS</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                We maintain compliance with major regulatory standards and industry
                requirements.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Certificates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security & Compliance Documentation</CardTitle>
          <CardDescription>
            Access detailed information about our security practices and compliance standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Security Whitepaper",
                description: "Detailed overview of our security architecture and controls",
                icon: Shield,
              },
              {
                title: "Privacy Policy",
                description: "Our commitment to protecting your personal information",
                icon: Lock,
              },
              {
                title: "Compliance Reports",
                description: "SOC 2, ISO 27001, and other compliance reports",
                icon: FileCheck,
              },
              {
                title: "Data Processing Agreement",
                description: "Terms of data processing and protection measures",
                icon: Users,
              },
            ].map((doc, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <doc.icon className="h-6 w-6 text-primary mt-1" />
                <div className="space-y-1">
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                  <Button variant="link" className="p-0">
                    View document <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}