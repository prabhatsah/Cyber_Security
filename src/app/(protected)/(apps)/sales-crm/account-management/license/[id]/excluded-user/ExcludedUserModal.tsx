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
import { fetchMarkAdminData, fetchExcludeUsersInstance, fetchBillingAccountConverterData } from "../mark-admin-user/AllQuery";
import FormComboboxInputWithValue from "@/ikon/components/form-fields/combobox-input-value";
import { invokeExcludeUser } from "./invokeExcludeUser";

export const ExcludeUserSchema = z.object({
    parentAccount: z.string().optional(),
});

interface ExcludeUserProps {
    isOpen: boolean;
    onClose: () => void;
    accountId: string | undefined;
}

const ExcludeUser: React.FC<ExcludeUserProps> = ({ isOpen, onClose, accountId }) => {
    const [servers, setServers] = useState<any>([]);
    const [markAdminData, setMarkAdminData] = useState<any>({});
    const [selectedServer, setSelectedServer] = useState<any>("");
    const [tableData, setTableData] = useState<any>([]);
    const [excludedIdServerMap, setExcludedIdServerMap] = useState<any>({});
    const [converterData, setConverterData] = useState<any>(null);
    const [excludedUsers, setExcludedUsers] = useState<any>([]);
    const [serverWiseAdminUsers, setServerWiseAdminUsers] = useState<any>({});
    const [serverWiseNonAdminUsers, setServerWiseNonAdminUsers] = useState<any>({});
    const form = useForm({
        resolver: zodResolver(ExcludeUserSchema),
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
                setServerWiseAdminUsers(markAdmin?.serverWiseAdminUsers || {});
                setServerWiseNonAdminUsers(markAdmin?.serverWiseNonAdminUsers || {});

                
                

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
    
        let excludedUsersList = excludedIdServerMap[selectedServer] || [];
        let serverWiseAdminUsers = markAdminData?.serverWiseAdminUsers || {};
        let adminUsers = serverWiseAdminUsers[selectedServer] || [];
        let nonAdminUsers = markAdminData?.serverWiseNonAdminUsers?.[selectedServer] || [];
        
        let extractedData = [];
    
        let endDate = converterData?.converterConfigDataServerMap?.[selectedServer]?.[serverConfig]?.billingPeriod?.endDate;
    
        if (serverConfig === "Billing Events") {
            let activityLogsUserIdMap = converterData?.converterConfigDataServerMap?.[selectedServer]?.[serverConfig]?.allUsersActivityLogsDateMap?.[endDate] || {};
    
            extractedData = Object.entries(activityLogsUserIdMap).map(([userId, user]) => {
                let isUserAdmin = adminUsers.includes(userId);
                let isUserNotAdmin = nonAdminUsers.includes(userId);
    
                return {
                    userId,
                    userName: user?.name || "N/A",
                    isAdmin: !isUserAdmin && !isUserNotAdmin ? user.admin : isUserAdmin,
                    isExcluded: excludedUsersList.includes(userId),
                };
            });
    
        } else if (serverConfig === "User List") {
            let activityLogsData = converterData?.converterConfigDataServerMap?.[selectedServer]?.[serverConfig]?.allUsersLoginDateMap?.[endDate] || [];
    
            extractedData = activityLogsData.map((userObject: any) => {
                let userId = userObject.login;
                let isUserAdmin = adminUsers.includes(userId);
                let isUserNotAdmin = nonAdminUsers.includes(userId);
    
                return {
                    userId,
                    userName: userObject[userId]?.name || "N/A",
                    isAdmin: !isUserAdmin && !isUserNotAdmin ? userObject.admin : isUserAdmin,
                    isExcluded: excludedUsersList.includes(userId),
                };
            });
        }
    
        setTableData(extractedData);
        setExcludedUsers(extractedData.filter((user: any) => user.isExcluded));
    }, [selectedServer, converterData, markAdminData]);
    
    
    
    


    const handleOnSubmit = async () => {
        // console.log("Final Excluded Users:", excludedUsers);
        // console.log("Final Excluded Id Server Map:", excludedIdServerMap);
        // console.log("selectedServer:", selectedServer);
        // console.log("accountId:", accountId);
        // console.log("selectedServer:", selectedServer);
        // console.log("markAdminData:", markAdminData);
        // console.log("converterData:", converterData);
        // console.log("servers:", servers);
        // console.log("serverWiseAdminUsers:", serverWiseAdminUsers);
        // console.log("serverWiseNonAdminUsers:", serverWiseNonAdminUsers);

        var serverWiseExcludedUserIds = Object.keys(excludedIdServerMap).map(server => ({
            server: server,
            excludedUserIds: excludedIdServerMap[server]
        }));

        console.log("serverWiseExcludedUsers:", serverWiseExcludedUserIds);

        const finalData={
            'accountId':markAdminData['accountId'],
            'accountName':markAdminData['accountName'],
            'createdOn':markAdminData['createdOn'],
            'recalculate':markAdminData['recalculate'],
            'resources':markAdminData['resources'],
            'servers':servers,
            'status':markAdminData['status'],
            'updatedOn':markAdminData['updatedOn'],
            'excludedIdServerMap':excludedIdServerMap,
            'serverWiseExcludedUserIds':serverWiseExcludedUserIds

        }

        console.log("finalData:",finalData);
        await invokeExcludeUser(finalData);
        onClose();
    };

    const toggleAdminStatus = (server: string, userId: string) => {
        setExcludedIdServerMap((prevMap: any) => {
            const excludedUsers = prevMap[server] ?? [];
    
            // Toggle user in the excluded list
            const updatedUsers = excludedUsers.includes(userId)
                ? excludedUsers.filter((id: any) => id !== userId) // Remove user
                : [...excludedUsers, userId]; // Add user
    
            return { ...prevMap, [server]: updatedUsers };
        });
    
        // Update `isExcluded` property in `tableData`
        setTableData((prevData: any) =>
            prevData.map((user: any) =>
                user.userId === server ? { ...user, isExcluded: !user.isExcluded } : user
            )
        );
    };
    

    const columns: ColumnDef<any>[] = [
        { accessorKey: "userId", header: "Id/Login", cell: ({ row }) => row.original.userId },
        { accessorKey: "userName", header: "Name", cell: ({ row }) => row.original.userName ? row.original.userName : "N/A" },
        {
            accessorKey: "isAdmin", header: "Is Admin?", cell: ({ row }) => row.original.isAdmin ? "Yes" : "No"
            // (
            //     <Button variant="outline" onClick={() => toggleAdminStatus(row.original.userId)}>
            //         {row.original.isAdmin ? "Yes" : "No"}
            //     </Button>
            // )
        },
        {
            accessorKey: "isExcluded", header: "Is Excluded?", cell: ({ row }) => 
                (
                <Button variant="outline" onClick={() => toggleAdminStatus(row.original.userId,row.original.userId)}>
                    {row.original.isExcluded ? "Yes" : "No"}
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
                    <DialogTitle>Excluded Users</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="grid gap-4">
                        <FormComboboxInputWithValue
                            //items={servers}
                            items={servers.map((s: any) => ({ value: s.name, label: s.name }))}
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

export default ExcludeUser;