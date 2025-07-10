
import { Card, CardContent } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

interface ResourceTableProps {
    resourceDataWithAllocation: any[];
    userMaps: UserMaps;
    monthsRange: string[];
}

interface UserMaps {
    userDetailsMap: {
        [key: string]: {
            name: string;
        };
    };
    rolesMap: {
        [key: string]: {
            roleId: string;
            roleName: string;
        };
    };
}

interface GroupedResource {
    taskId: number;
    taskName: string;
    resources: any[];
}

const groupResourcesByTask = (resources: any[]): GroupedResource[] => {
    const groupedMap = resources.reduce((acc, resource) => {
        const taskId = resource.taskId;
        if (!acc.has(taskId)) {
            acc.set(taskId, {
                taskId,
                taskName: resource.taskName,
                resources: []
            });
        }
        acc.get(taskId).resources.push(resource);
        return acc;
    }, new Map<number, GroupedResource>());

    return Array.from(groupedMap.values());
};

const ResourceTable: React.FC<ResourceTableProps> = ({ resourceDataWithAllocation, userMaps, monthsRange }) => {
    const { setValue } = useFormContext();
    const [expandedTasks, setExpandedTasks] = React.useState<Set<number>>(new Set());
    const groupedResources = groupResourcesByTask(resourceDataWithAllocation);

    const toggleTask = (taskId: number) => {
        setExpandedTasks((prev) => {
            const newSet = new Set(prev);
            newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
            return newSet;
        });
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px] bg-muted/50">Task Name</TableHead>
                            <TableHead className="w-[200px] bg-muted/50">Employee Name</TableHead>
                            <TableHead className="w-[200px] bg-muted/50">Role</TableHead>
                            {monthsRange.map((month) => (
                                <TableHead key={month} className="w-[100px] bg-muted/50">
                                    {month.replace("_", " ")}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groupedResources.map((group) => (
                            <React.Fragment key={group.taskId}>
                                <TableRow className="cursor-pointer hover:bg-accent" onClick={() => toggleTask(group.taskId)}>
                                    <TableCell colSpan={3 + monthsRange.length}>
                                        <div className="flex items-center gap-2">
                                            {expandedTasks.has(group.taskId) ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-primary" />}
                                            <span className="font-medium">{group.taskName}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedTasks.has(group.taskId) && group.resources.map((resource) => (
                                    <TableRow key={`${resource.taskId}-${resource.resourceId}`} className="hover:bg-muted/30">
                                        <TableCell className="pl-8">
                                            <Input value={resource.taskName} disabled className="w-full bg-transparent border-0 px-0 disabled:opacity-100" />
                                        </TableCell>
                                        <TableCell>
                                            <Select defaultValue={resource.resourceId}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select employee" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(userMaps.userDetailsMap).map(([id, user]) => (
                                                        <SelectItem key={id} value={id}>{user.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select defaultValue={resource.gradeId.toString()}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(userMaps.rolesMap).map(([id, role]) => (
                                                        <SelectItem key={id} value={id}>{role.roleName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        {monthsRange.map((month) => (
                                            <TableCell key={month}>
                                                <Input type="number" min="0" max="1" step="0.01" defaultValue={resource.allocation[month] || 0} className="w-20" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ResourceTable;