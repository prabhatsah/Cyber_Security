import { DataTable } from "@/ikon/components/data-table";
import { Button } from "@/shadcn/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Checkbox } from "@/shadcn/ui/checkbox"
import { Label } from "@/shadcn/ui/label"
import { Switch } from "@/shadcn/ui/switch"
import { getUserMapForCurrentAccount, getSharedWithMeData } from "../../actions";
import { useEffect, useState } from "react";
import { LoadingSpinner } from '@/ikon/components/loading-spinner'
import { useController } from "react-hook-form";

function getColumnSchema(control: any) {
    //Column Schema
    const columns: DTColumnsProps<any>[] = [
        {
            accessorKey: "userName",
            header: ({ column }) => (
                <Button
                    className="px-0"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User Name
                    <ArrowUpDown />
                </Button>
            ),
            title: "Name",
            accessorFn: (row) => `${row.name}`,
            cell: ({ row }: any) => {
                const userId = row.original.userId;

                const { field: checkBoxField } = useController({
                    name: `folderCheckBoxArray`,
                    control,
                    defaultValue: [],
                });

                const handleCheckboxChange = (checked: boolean) => {
                    checkBoxField.onChange(
                        checked
                            ? [...checkBoxField.value, userId] // Add ID when checked
                            : checkBoxField.value.filter((id: any) => id !== userId) // Remove when unchecked
                    );
                };

                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`checked_${userId}`}
                            onCheckedChange={handleCheckboxChange}
                            checked={checkBoxField.value.includes(userId)}
                        />
                        <label htmlFor={`checked_${userId}`} className="text-sm font-medium">
                            {row.original.name}
                        </label>
                    </div>
                );
            },
        },
        {
            accessorKey: "userEmail",
            header: ({ column }) => {
                return (
                    <Button
                        className="px-0"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        User Email
                        <ArrowUpDown />
                    </Button>
                );
            },
            title: "Email",
            accessorFn: (row) => `${row.email} `,
        },
        {
            header: "Edit Access",
            enableHiding: false,
            cell: ({ row }: any) => {
                const userId = row.original.userId;

                const { field: toggleField } = useController({
                    name: `folderToggleArray`,
                    control,
                    defaultValue: [],
                });

                const handleToggleChange = (checked: boolean) => {
                    toggleField.onChange(
                        checked
                            ? [...toggleField.value, userId] // Add ID when toggled ON
                            : toggleField.value.filter((id: any) => id !== userId) // Remove when toggled OFF
                    );
                };

                return (
                    <div className="flex items-center space-x-2">
                        <Switch
                            id={`toggleId_${userId}`}
                            onCheckedChange={handleToggleChange}
                            checked={toggleField.value.includes(userId)}
                        />
                    </div>
                );
            },
        },

    ];
    return columns;
}


export default function SharedDatatable({ control, userData }: { control: any; userData: any[] }) {
    // const [userData, setUserData] = useState([]);
    // useEffect(() => {
    //     async function fetchData() {
    //         const data = await getUserMapForCurrentAccount({ groups: ["Document Management User"] });
    //         // console.log("data is : " + data);
    //         setUserData(prevData => {
    //             if (JSON.stringify(prevData) === JSON.stringify(data)) {
    //                 return prevData; // Prevent unnecessary re-renders
    //             }
    //             return data;
    //         });
    //     }
    //     fetchData();
    // }, []);
    // console.log(userData)
    const columns = getColumnSchema(control);
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [],
    };
    return (
        <>
            <DataTable
                columns={columns}
                data={userData}
                extraParams={extraParams}
            />
        </>
    );
}
