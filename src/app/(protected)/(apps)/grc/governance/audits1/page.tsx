import Link from "next/link";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/shadcn/ui/table";

const audits = [
  {
    id: "soc2-2025",
    name: "SOC 2 Type II 2025",
    type: "SOC 2",
    lead: "Maria Auditore",
    status: "Fieldwork",
    due: "2025-09-15"
  },
  {
    id: "pci-2025",
    name: "PCI DSS Onsite 2025",
    type: "PCI DSS",
    lead: "John Gold",
    status: "Planning",
    due: "2025-03-22"
  },
  {
    name: "SOC 2 Type II",
    cycle: "Annual",
    status: "In Progress",
    due: "2024-09-15"
  },
  {
    name: "GDPR DSR Review",
    cycle: "Quarterly",
    status: "Planned",
    due: "2024-06-30"
  },
  {
    name: "PCI DSS Onsite",
    cycle: "Annual",
    status: "Complete",
    due: "2024-01-12"
  },
];

export default function AuditsPage() {
  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Audits</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((a) => (
            <TableRow key={a.id || a.name} className="hover:bg-muted transition cursor-pointer">
              <TableCell>
                <Link className="text-primary underline" href={`/grc/governance/audits1/${a.id || a.name}`}>{a.name}</Link>
              </TableCell>
              <TableCell>{a.type || a.cycle}</TableCell>
              <TableCell>{a.lead || "-"}</TableCell>
              <TableCell>{a.status}</TableCell>
              <TableCell>{a.due}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
