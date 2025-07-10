import { Avatar, AvatarFallback } from "@/shadcn/ui/avatar";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Input } from "@/shadcn/ui/input";
import { Progress } from "@/shadcn/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import {
  Calculator,
  Calendar,
  Check,
  Clipboard,
  File,
  HeartPulse,
  Mail,
  MessageCircle,
  Plus,
  PlusCircle,
  PlusCircleIcon,
  Shield,
  ShieldAlert,
  User2,
  Users2,
} from "lucide-react";

export default function FrameworkCreation() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Framework Creation
        </h1>
        <div className="relative w-64">
          <Input
            placeholder="Search..."
            className="pl-8 rounded-full bg-gray-800 border-gray-700 focus-visible:ring-blue-500 text-gray-200 placeholder-gray-400"
          />
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fillers Card */}
        <Card className="border-blue-900/50 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-blue-900/30 transition-all hover:border-blue-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <FolderIcon className="h-5 w-5" />
              Fillers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-blue-300">Subset A1</h3>
              <ul className="space-y-3">
                {[
                  "LATEST ISO",
                  "Unstandard Framework - Task",
                  "Unit 5",
                  "Unit 6",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 group">
                    <Checkbox className="h-5 w-5 border-blue-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 group-hover:border-blue-400" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-700 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
            >
              Select All
            </Button>
          </CardFooter>
        </Card>

        {/* Practice Areas Card */}
        <Card className="border-purple-900/50 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-purple-900/30 transition-all hover:border-purple-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <LayersIcon className="h-5 w-5" />
              Practice Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-purple-300">Subset A1</h3>
              <ul className="space-y-3">
                {[
                  { name: "Cloud Governance", type: "Cloud" },
                  { name: "Cloud Management", type: "Cloud" },
                  { name: "Banking Governance", type: "Banking" },
                  { name: "Audit and Reporting", type: "Audit" },
                ].map((item) => (
                  <li key={item.name} className="flex items-center gap-3 group">
                    <Checkbox className="h-5 w-5 border-purple-700 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 group-hover:border-purple-400" />
                    <div className="flex items-center gap-2">
                      {/* <Badge
                        variant="outline"
                        className={`px-2 py-0.5 text-xs ${
                          item.type === "Cloud"
                            ? "bg-purple-900/40 text-purple-300 border-purple-700"
                            : item.type === "Banking"
                            ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                            : "bg-amber-900/40 text-amber-300 border-amber-700"
                        }`}
                      >
                        {item.type}
                      </Badge> */}
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                        {item.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-700 text-purple-400 hover:bg-purple-900/30 hover:text-purple-300"
            >
              Select All
            </Button>
          </CardFooter>
        </Card>

        {/* Procedural Types Card */}
        <Card className="border-emerald-900/50 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-emerald-900/30 transition-all hover:border-emerald-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <ListIcon className="h-5 w-5" />
              Procedural Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-emerald-300">
                Subset A1
              </h3>
              <ul className="space-y-3">
                {["Technical", "Operational", "Management"].map((item) => (
                  <li key={item} className="flex items-center gap-3 group">
                    <Checkbox className="h-5 w-5 border-emerald-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 group-hover:border-emerald-400" />
                    <div className="flex items-center gap-2">
                      {/* <Badge
                        variant="outline"
                        className="px-2 py-0.5 text-xs bg-emerald-900/40 text-emerald-300 border-emerald-700"
                      >
                        {item}
                      </Badge> */}
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                        {item}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 hover:text-emerald-300"
            >
              Select All
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-gray-800 bg-gray-800/50 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-200">Framework Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-blue-700 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
              >
                Filter
              </Button>
              <p className="text-sm text-gray-400 flex items-center">
                Drag a column header here to group its column.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                Apply
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              >
                View
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-blue-400">Control Name</TableHead>
                <TableHead className="text-purple-400">
                  Control Objective
                </TableHead>
                <TableHead className="text-emerald-400">
                  Control Weight
                </TableHead>
                <TableHead className="text-blue-400">Proc Area</TableHead>
                <TableHead className="text-purple-400">Proc Type</TableHead>
                <TableHead className="text-emerald-400">
                  Cross Reference
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-gray-800 hover:bg-gray-700/30">
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500"
                >
                  Tools in code of rows.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Icon components (same as before)
function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FolderIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function LayersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function ListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}
