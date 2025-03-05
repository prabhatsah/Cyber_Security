"use client";
import { Input } from "@/components/Input";
import { Card, Title, Text, Button, Select, SelectItem } from "@tremor/react";

export default function ConfigDashboard() {
  return (
    <div className="flex-grow">
      {/* Cloud Service Configuration */}
      <Card>
        <Title>Cloud Service Configuration</Title>
        <Text>
          Select the cloud provider and enter the details below to configure the
          service.
        </Text>

        {/* AWS Configuration */}
        <Card className="mt-4">
          <Title>AWS Configuration</Title>
          <Input
            label="AWS Access Key ID"
            placeholder="Enter AWS Access Key"
            type="text"
          />
          <Input
            label="AWS Secret Access Key"
            placeholder="Enter AWS Secret Key"
            type="password"
          />
          <Select label="Region">
            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
            <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
            {/* Add more regions */}
          </Select>
          <Input
            label="Name of Configuration"
            placeholder="Enter a name for this connection"
            type="text"
          />
          <Button className="mt-4" color="blue">
            Save AWS Configuration
          </Button>
        </Card>

        {/* Azure Configuration */}
        <Card className="mt-4">
          <Title>Azure Configuration</Title>
          <Input
            label="Subscription ID"
            placeholder="Enter Azure Subscription ID"
            type="text"
          />
          <Input
            label="Client ID"
            placeholder="Enter Azure Client ID"
            type="text"
          />
          <Input
            label="Tenant ID"
            placeholder="Enter Azure Tenant ID"
            type="text"
          />
          <Input
            label="Client Secret"
            placeholder="Enter Azure Client Secret"
            type="password"
          />
          <Select label="Region">
            <SelectItem value="eastus">East US</SelectItem>
            <SelectItem value="westeurope">West Europe</SelectItem>
            {/* Add more regions */}
          </Select>
          <Input
            label="Name of Configuration"
            placeholder="Enter a name for this connection"
            type="text"
          />
          <Button className="mt-4" color="blue">
            Save Azure Configuration
          </Button>
        </Card>
      </Card>

      {/* Other Tool Configurations */}
      <Card>
        <Title>Other Tool Configuration</Title>

        {/* VirusTotal Configuration */}
        <Card className="mt-4">
          <Title>VirusTotal Configuration</Title>
          <Input
            label="API Key"
            placeholder="Enter VirusTotal API Key"
            type="password"
          />
          <Input
            label="Name of Configuration"
            placeholder="Enter a name for this configuration"
            type="text"
          />
          <Button className="mt-4" color="blue">
            Save VirusTotal Configuration
          </Button>
        </Card>

        {/* OWASP ZAP Configuration */}
        <Card className="mt-4">
          <Title>OWASP ZAP Configuration</Title>
          <Input
            label="ZAP URL"
            placeholder="Enter OWASP ZAP URL"
            type="text"
          />
          <Input
            label="API Key"
            placeholder="Enter ZAP API Key"
            type="password"
          />
          <Input
            label="Name of Configuration"
            placeholder="Enter a name for this configuration"
            type="text"
          />
          <Button className="mt-4" color="blue">
            Save OWASP ZAP Configuration
          </Button>
        </Card>
      </Card>

      {/* Saved Configurations (Optional) */}
      <Card>
        <Title>Saved Configurations</Title>
        <Text>Select a pre-configured connection to start scanning.</Text>
        <Select label="Select Cloud Service Configuration">
          <SelectItem value="aws">AWS - My AWS Config</SelectItem>
          <SelectItem value="azure">Azure - My Azure Config</SelectItem>
          {/* Add dynamically from stored configurations */}
        </Select>
      </Card>
    </div>
  );
}
