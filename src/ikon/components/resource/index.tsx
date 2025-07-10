import React, { useMemo } from 'react';
import { Button } from "@/shadcn/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { DataTable } from '../data-table';

interface ResourceTableProps {
  resourceDataWithAllocation: any[];
  userMaps: {
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
  };
  monthsRange: string[];
}

const ResourceTable: React.FC<ResourceTableProps> = ({
  resourceDataWithAllocation,
  userMaps,
  monthsRange,
}) => {
  const [data, setData] = React.useState(resourceDataWithAllocation);

  const calculateTotalFTE = (row: any) => {
    if (!row.detailedAllocation) return 0;
    return Object.values(row.detailedAllocation).reduce((sum: number, value: any) => sum + (parseFloat(value) || 0), 0);
  };

  const handleAddResource = (taskId: number) => {
    const newResource = {
      id: `new-${Date.now()}`,
      taskId,
      taskName: data.find(r => r.taskId === taskId)?.taskName || '',
      userId: '',
      roleId: '',
      detailedAllocation: monthsRange.reduce((acc, month) => ({
        ...acc,
        [month]: 0
      }), {}),
    };
    setData([...data, newResource]);
  };

  const handleDeleteResource = (resourceId: string) => {
    setData(data.filter(resource => resource.id !== resourceId));
  };

  const handleUpdateAllocation = (resourceId: string, month: string, value: string) => {
    setData(data.map(resource => {
      if (resource.id === resourceId) {
        return {
          ...resource,
          detailedAllocation: {
            ...resource.detailedAllocation,
            [month]: parseFloat(value) || 0
          }
        };
      }
      return resource;
    }));
  };

  const columns = useMemo(() => [
    {
      accessorKey: "taskName",
      header: "Task Name",
      cell: ({ row }: { row: { original: { taskName: string } } }) => row.original.taskName,
    },
    {
      accessorKey: "userId",
      header: "Employee Name",
      cell: ({ row }: { row: { original: any } }) => (
        <Select
          value={row.original.userId}
          onValueChange={(value) => {
            setData(data.map(resource => 
              resource.id === row.original.id 
                ? { ...resource, userId: value }
                : resource
            ));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employee">
              {userMaps.userDetailsMap[row.original.userId]?.name || "Select employee"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(userMaps.userDetailsMap).map(([id, user]) => (
              <SelectItem key={id} value={id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "roleId",
      header: "Role",
      cell: ({ row }: { row: { original: any } }) => (
        <Select
          value={row.original.roleId}
          onValueChange={(value) => {
            setData(data.map(resource => 
              resource.id === row.original.id 
                ? { ...resource, roleId: value }
                : resource
            ));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role">
              {userMaps.rolesMap[row.original.roleId]?.roleName || "Select role"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(userMaps.rolesMap).map(([id, role]) => (
              <SelectItem key={id} value={id}>
                {role.roleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "totalFTE",
      header: "Total FTE",
      cell: ({ row }: { row: { original: any } }) => calculateTotalFTE(row.original).toFixed(2),
    },
    ...monthsRange.map(month => ({
      accessorKey: `detailedAllocation.${month}`,
      header: month.replace('_', ' '),
      cell: ({ row }: { row: { original: any } }) => (
        <Input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={row.original.detailedAllocation[month] || 0}
          onChange={(e) => handleUpdateAllocation(row.original.id, month, e.target.value)}
          className="w-20"
        />
      ),
    })),
    {
      id: "actions",
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAddResource(row.original.taskId)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteResource(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [data, monthsRange, userMaps]);

  return (
    <DataTable
      columns={columns}
      data={data}
      extraParams={{
        defaultGroups: ["taskName"],
        grouping: true,
        sorting: true,
        header: true,
        paginationBar: true,
      }}
    />
  );
};

export default ResourceTable;