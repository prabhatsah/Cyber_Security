import { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Form } from "@/shadcn/ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { DataTable } from "@/ikon/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { fetchMarkAdminData, fetchExcludeUsersInstance, fetchBillingAccountConverterData } from "./AllQuery";
import FormComboboxInputWithValue from "@/ikon/components/form-fields/combobox-input-value";
import { invokeMarkAdmin } from "./invokeMarkAdmin";

export const MarkAdminSchema = z.object({
    parentAccount: z.string().optional(),
});

interface MarkAdminUserProps {
    isOpen: boolean;
    onClose: () => void;
    accountId: string | undefined;
}

const MarkAdminUser: React.FC<MarkAdminUserProps> = ({ isOpen, onClose, accountId }) => {
    const [servers, setServers] = useState<any>([]);
    const [markAdminData, setMarkAdminData] = useState<any>({});
    const [selectedServer, setSelectedServer] = useState<any>("");
    const [tableData, setTableData] = useState<any>([]);
    const [excludedIdServerMap, setExcludedIdServerMap] = useState<any>({});
    const [converterData, setConverterData] = useState<any>(null);

    const form = useForm({
        resolver: zodResolver(MarkAdminSchema),
        defaultValues: { parentAccount: "" },
    });

    useEffect(() => {
        if (!accountId) return;

        async function fetchData() {
            try {
                const markAdmin = await fetchMarkAdminData(accountId ?? "");
                const excludeUsers = await fetchExcludeUsersInstance(accountId ?? "");
                const billingAccountConverter = await fetchBillingAccountConverterData(accountId ?? "");

                setMarkAdminData(markAdmin);
                setExcludedIdServerMap(excludeUsers?.excludedIdServerMap || {});
                setConverterData(billingAccountConverter);
                setServers(markAdmin?.servers || []);

                if (markAdmin?.servers?.length) {
                    setSelectedServer(markAdmin.servers[0].name);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [accountId]);

    
    useEffect(() => {
        if (!selectedServer || !converterData || !servers.length) return;

        let serverConfig = servers.find((s: any) => s.name === selectedServer)?.config;
        if (!serverConfig) return;

        let excludedUsers = excludedIdServerMap[selectedServer] || [];
        let serverWiseAdminUsers = markAdminData?.serverWiseAdminUsers || {};
        let serverWiseNonAdminUsers = markAdminData?.serverWiseNonAdminUsers || {};
        let adminUsers = serverWiseAdminUsers[selectedServer] || [];

        let extractedData: any[] = [];

        if (serverConfig === "Billing Events") {
            let endDate = converterData?.converterConfigDataServerMap?.[selectedServer]?.[serverConfig]?.billingPeriod?.endDate;
            let activityLogsUserIdMap = converterData?.converterConfigDataServerMap?.[selectedServer]?.[serverConfig]?.allUsersActivityLogsDateMap?.[endDate] || {};

            extractedData = Object.entries(activityLogsUserIdMap).map(([userId, user]: [string, any]) => {
                let existingUser = tableData.find((u: any) => u.userId === userId);
                return {
                    userId,
                    userName: user.name,
                    isExcluded: excludedUsers.includes(userId),
                    isAdmin: existingUser ? existingUser.isAdmin : adminUsers.includes(userId), // Preserve manual changes
                };
            });
        }
        else if (serverConfig === "User List") {
            let endDate = converterData?.converterConfigDataServerMap?.[selectedServer]?.[serverConfig]?.billingPeriod?.endDate;
            let activityLogsData = converterData?.converterConfigDataServerMap?.[selectedServer]?.[serverConfig]?.allUsersLoginDateMap?.[endDate] || [];

            extractedData = activityLogsData.map((userObject: any) => {
                let userId = userObject.login;
                let existingUser = tableData.find((u: any) => u.userId === userId);
                return {
                    userId,
                    userName: userObject[userId]?.name || "N/A",
                    isExcluded: excludedUsers.includes(userId),
                    isAdmin: existingUser ? existingUser.isAdmin : adminUsers.includes(userId), // Preserve manual changes
                };
            });
        }

        setTableData((prevData: any) => {
            let updatedData = prevData.map((user: any) => {
                let newUser = extractedData.find(u => u.userId === user.userId);
                return newUser ? { ...user, isExcluded: newUser.isExcluded } : user;
            });
            let newUsers = extractedData.filter(user => !prevData.some((u:any) => u.userId === user.userId));

            return [...updatedData, ...newUsers];
        });

    }, [selectedServer, converterData, markAdminData]);


    const toggleAdminStatus = (userId: string) => {
        let flag = "";
        //if(!flag){
        setMarkAdminData((prevData: any) => {
            if (!prevData || !selectedServer || !tableData) return prevData;

            const updatedData = { ...prevData };

            if (!flag) {
                updatedData.serverWiseAdminUsers = updatedData.serverWiseAdminUsers || {};
                updatedData.serverWiseNonAdminUsers = updatedData.serverWiseNonAdminUsers || {};

                let adminUsers = updatedData.serverWiseAdminUsers[selectedServer] || [];
                let nonAdminUsers = updatedData.serverWiseNonAdminUsers[selectedServer] || [];

                updatedData.serverWiseAdminUsers[selectedServer] = adminUsers;
                updatedData.serverWiseNonAdminUsers[selectedServer] = nonAdminUsers;

                const isChecked = adminUsers.includes(userId);

                if (isChecked) {
                    updatedData.serverWiseAdminUsers[selectedServer] = adminUsers.filter((id: any) => id !== userId);
                    updatedData.serverWiseNonAdminUsers[selectedServer] = [...nonAdminUsers, userId];
                    flag = userId + isChecked;
                } else {
                    updatedData.serverWiseNonAdminUsers[selectedServer] = nonAdminUsers.filter((id: any) => id !== userId);
                    updatedData.serverWiseAdminUsers[selectedServer] = [...adminUsers, userId];
                    flag = userId + isChecked;
                }

                const selectedAdmins = updatedData.serverWiseAdminUsers[selectedServer];

                updatedData.serverWiseNonAdminUsers[selectedServer] = tableData
                    .map((user: any) => user.userId)
                    .filter((id: any) => !selectedAdmins.includes(id)); // Ensure consistency


                console.log("Updated Data:", updatedData);
                return updatedData;
            }
        });
        // }

        setTableData((prevData: any) =>
            prevData.map((user: any) =>
                user.userId === userId ? { ...user, isAdmin: !user.isAdmin } : user
            )
        );
    };


    // const toggleExclusionStatus = (userId: string) => {
    //     setTableData(prevData => prevData.map(user =>
    //         user.userId === userId ? { ...user, isExcluded: !user.isExcluded } : user
    //     ));
    // };

    const handleOnSubmit = async () => {
        const finalData = {
            ...markAdminData,
            serverWiseAdminUsers: { ...markAdminData.serverWiseAdminUsers },
            serverWiseNonAdminUsers: { ...markAdminData.serverWiseNonAdminUsers },
        };

        console.log("Final Billing Account Data:", finalData);
        await invokeMarkAdmin(finalData);
        onClose();
    };


    const columns: ColumnDef<any>[] = [
        { accessorKey: "userId", header: "Id/Login", cell: ({ row }) => row.original.userId },
        { accessorKey: "userName", header: "Name", cell: ({ row }) => row.original.userName ? row.original.userName : "N/A" },
        {
            accessorKey: "isExcluded", header: "Is Excluded?", cell: ({ row }) => row.original.isExcluded ? "Yes" : "No"
            //     (
            //     <Button variant="outline">
            //         {row.original.isExcluded ? "Yes" : "No"}
            //     </Button>
            // )
        },
        {
            accessorKey: "isAdmin", header: "Is Admin?", cell: ({ row }) => (
                <Button variant="outline" onClick={() => toggleAdminStatus(row.original.userId)}>
                    {row.original.isAdmin ? "Yes" : "No"}
                </Button>
            )
        },
    ];
    const extraParams: DTExtraParamsProps = {
        pageSize: 10,
        rowsPerPage: false,
        grouping: false,
        defaultTools: false,
        sorting: false,
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => open || onClose()} modal>
            <DialogContent className="max-w-3xl" onClick={e => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Mark Admin Users</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="grid gap-4">
                        <FormComboboxInputWithValue
                            items={servers.map((s: any) => ({value:s.name, label:s.name}))}
                            value={selectedServer}
                            onChange={setSelectedServer}
                            name="server"
                            placeholder="Select a server"
                            label="Server"
                            formControl={form.control}
                        />
                        <DataTable columns={columns} data={tableData} extraParams={extraParams} />
                        <DialogFooter className="flex justify-end mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default MarkAdminUser;