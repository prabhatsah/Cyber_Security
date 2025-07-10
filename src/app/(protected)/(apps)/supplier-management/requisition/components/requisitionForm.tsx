import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import { Form } from '@/shadcn/ui/form';
import { Button } from '@/shadcn/ui/button';
import { Plus } from 'lucide-react';
import { DTColumnsProps } from '@/ikon/components/data-table/type';
import { DataTable } from '@/ikon/components/data-table';
import { Checkbox } from '@/shadcn/ui/checkbox';
import { format } from 'date-fns';
import { Input } from '@/shadcn/ui/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { getCurrentUserId } from '@/ikon/utils/actions/auth';
import { getAllSoftwareGroups, getAllUsersForGroupMembershipV2 } from '@/ikon/utils/api/groupService';
import { getActiveAccountId } from '@/ikon/utils/actions/account';
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { v4 } from 'uuid';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { RequisitionInstance } from '../page';

export const RequisitionFormSchema = z.object({
    DELIVERY_DATE: z.coerce.date({
        required_error: "Start date is required.",
    }),
    REMARKS: z.string().optional(),
})

export default function RequisitionForm({ open, setOpen, vendabledata, editRow }: any) {

    console.log(vendabledata);
    console.log(editRow);

    const [allVendableItem, setAllVendableItem] = useState<Record<string, string>[]>([]);

    const [selectItems, setSelectItems] = useState<boolean>(false);

    const [availableQty, setAvailableQty] = useState<Record<string, any>[]>([]);

    const [qtyForTable, setQtyForTable] = useState<Record<string, any>[]>([]);

    const [requiredItemObj, setRequiredItemObj] = useState<Record<string, any>>({});



    const columnsQtyTable: DTColumnsProps<any>[] = [
        {
            accessorKey: "itemId",
            header: "Item ID"
        },
        {
            accessorKey: "itemName",
            header: "Item"
        },
        {
            accessorKey: "deliveryDate",
            header: "Delivery Date",
            cell: ({ row }) => {
                return format(new Date(), "yyyy-MM-dd"); // Format the date
            },
        },
        {
            accessorKey: "itemQuantity",
            header: "Available Stock"
        },
        {
            id: "numberOfRequireItems",
            header: "Number of Required Items",
            cell: ({ row }: { row: any }) => {
                const itemId = row.original.itemId;
                const inputValue =
                    requiredItemObj[itemId]?.requiredItemQuantity ??
                    (editRow ? row.original.itemQtyEditRow : "");
                const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = event.target.value;
                    setRequiredItemObj((prev) => ({
                        ...prev,
                        [itemId]: {
                            ...prev[itemId],
                            availableItemQuantity: prev[itemId]?.availableItemQuantity ?? parseInt(row.original.itemQuantity),
                            requiredItemQuantity: parseInt(newValue),
                            status: prev[itemId]?.status ?? "open",
                        },
                    }));
                };

                return (
                    <div>
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (editRow) {
            const editRowItemObj: string[] = Object.keys(editRow.requiredItemObj);
            let editRowTable: Record<string, any>[] = []
            for (const itemId of editRowItemObj) {
                editRowTable.push({ ...editRow.allItemDetails[itemId], itemQtyEditRow: editRow.requiredItemObj[itemId].requiredItemQuantity });
            }
            console.log(editRowTable);
            setQtyForTable(editRowTable);
        }
    }, [])

    useEffect(() => {

        const updatedVendableData = [...vendabledata];

        const setQtyForSelectedVendableItem = updatedVendableData.filter((data: Record<string, any>) =>
            availableQty.includes(data.itemId)
        );
        console.log(setQtyForSelectedVendableItem);
        setQtyForTable((prev) => [...prev, ...setQtyForSelectedVendableItem]);

        for (let i = updatedVendableData.length - 1; i >= 0; i--) {
            if (availableQty.includes(updatedVendableData[i].itemId)) {
                updatedVendableData.splice(i, 1); // Remove item if it's in availableQty
            }
        }

        if (editRow) {
            const editRowItemObj: string[] = Object.keys(editRow.requiredItemObj);
            console.log(editRowItemObj);
            setAllVendableItem(
                updatedVendableData
                    .filter((data: Record<string, any>) => !editRowItemObj.includes(data.itemId)) // ✅ Filter out existing items
                    .map((data: Record<string, any>) => ({
                        id: data.itemId,
                        text: data.itemName,
                    }))
            );
        } else {
            setAllVendableItem(
                updatedVendableData.map((data: Record<string, any>) => ({
                    id: data.itemId,
                    text: data.itemName
                }))
            );
        }


    }, [availableQty]);

    console.log(allVendableItem);

    console.log(availableQty);

    async function saveRequisitFormInfo(data: z.infer<typeof RequisitionFormSchema>) {
        let allItemDetailsObj: Record<string, any> = {}
        vendabledata.map((data: Record<string, any>) => {
            allItemDetailsObj[data.itemId] = data;
        })
        const currentUserId = await getCurrentUserId();
        console.log(currentUserId);
        console.log(allItemDetailsObj);
        console.log(availableQty);
        console.log(requiredItemObj);
        console.log(data);
        const globalAccountId = await getActiveAccountId();
        const allGroups = await getAllSoftwareGroups({ accountId: globalAccountId });
        console.log(allGroups);

        let groupId = '';

        for (let i = 0; i < allGroups.length; i++) {
            let grpName = allGroups[i].GROUP_NAME;
            if (grpName == "Vendor Admin") {
                groupId = allGroups[i]["GROUP_ID"];
            }
            if (grpName == "Vendor Users") {
                groupId = allGroups[i]["GROUP_ID"];
            }
        }
        console.log(groupId);
        const userForSpecificGroups = groupId.length ? await getAllUsersForGroupMembershipV2({ groupId: groupId, accountId: globalAccountId }) : "";

        const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
        const userIdUserEmailMap: Record<string, string | null> = {};
        for (let i in userIdWiseUserDetailsMap) {
            var eachUser = userIdWiseUserDetailsMap[i];
            userIdUserEmailMap[i] = eachUser.userEmail;
        }
        const userIdList: Record<string, any> = {}
        for (let i = 0; i < userForSpecificGroups.length; i++) {
            if (userForSpecificGroups[i]["MEMBER"] == "member" && userIdUserEmailMap[userForSpecificGroups[i]["USER_ID"]]) {
                userIdList[userForSpecificGroups[i]["USER_ID"]] = userIdUserEmailMap[userForSpecificGroups[i]["USER_ID"]];
            }
        }

        console.log(userIdList);

        let requisitionObject = {
            purchaseRequisitionIdentifier: v4(),
            requisitionIdentifier: "Req-" + Math.floor(Math.random() * 100000),
            purchaseRequisitionDeliveryDate: data.DELIVERY_DATE,
            supplierItems: availableQty,
            purchaseRequisitionItemQuantity: "",
            requisitionShortDescription: data.REMARKS,
            requisitionStatus: "Pending",
            requiredItemObj: requiredItemObj,
            allItemDetails: allItemDetailsObj,
            groupMemberIds: userIdList,
            requisitionRaisedBy: currentUserId,
            requisitionRaisedOn: editRow ? editRow.requisitionRaisedOn : new Date(),
            requisitionUpdatedOn: new Date(),
        }

        console.log(requisitionObject);
        const requisitionProcessId = await mapProcessName({ processName: "Requisition" });
        if (editRow) {
            const requisitionInstance: RequisitionInstance[] = await getMyInstancesV2({
                processName: "Requisition",
                predefinedFilters: { taskName: "Edit Requisition" },
            });
            console.log(requisitionInstance);
            for (let i = 0; i < requisitionInstance.length; i++) {
                const requisitionInstanceData = requisitionInstance[i].data ?? {};
                if(requisitionInstanceData.purchaseRequisitionIdentifier===editRow.purchaseRequisitionIdentifier){
                    console.log(requisitionInstance[i].taskId)
                    const taskId  = requisitionInstance[i].taskId;
                    await invokeAction({
                        taskId: taskId,
                        data: requisitionObject,
                        transitionName: "Update Requisition",
                        processInstanceIdentifierField: ""
                    })
                    break;
                }
            }
        }else{
            await startProcessV2({ processId: requisitionProcessId, data: requisitionObject, processIdentifierFields: "" });
        }
        setOpen(false);
    }

    const form = useForm<z.infer<typeof RequisitionFormSchema>>({
        resolver: zodResolver(RequisitionFormSchema),
        defaultValues: {
            DELIVERY_DATE: editRow ? editRow.purchaseRequisitionDeliveryDate : new Date(),
            REMARKS: editRow ? editRow.requisitionShortDescription : ''
        },
    });
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[40%]">
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Form {...form}>
                            <form>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                                    <div className='col-span-1 md:col-span-2'>
                                        <FormDateInput formControl={form.control} name={"DELIVERY_DATE"} label={"Delivery Date"} placeholder={"Enter Delivery Date"} />
                                    </div>
                                    <div className='flex flex-row gap-3 self-end'>
                                        <div className='self-center'>
                                            Select Item
                                        </div>
                                        <Button size='icon' type="button" onClick={() => { setSelectItems(true) }}>
                                            <Plus className='w-5 h-5' />
                                        </Button>
                                    </div>
                                    <div className='col-span-1 md:col-span-3'>
                                        {
                                            qtyForTable.length ?
                                                <DataTable data={qtyForTable} columns={columnsQtyTable} /> : null
                                        }
                                    </div>
                                    <div className='col-span-1 md:col-span-3'>
                                        <FormTextarea formControl={form.control} name={"REMARKS"} label={"Remarks"} placeholder={"Remarks"} />
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <DialogFooter>
                        <Button onClick={form.handleSubmit(saveRequisitFormInfo)}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {
                selectItems && allVendableItem.length && allVendableItem.length >= qtyForTable.length && <SelectedItems open={selectItems} setOpen={setSelectItems} items={allVendableItem} availableQty={availableQty} setAvailableQty={setAvailableQty} />
            }

        </>
    )

}

export function SelectedItems({ open, setOpen, items, availableQty, setAvailableQty }: any) {

    const [checkedRows, setCheckeRows] = useState<Record<string, boolean>[]>([]);

    console.log(checkedRows);

    const userIdofCheckedRows = (row: any) => {
        setCheckeRows((prevCheckedRows: any) =>
            prevCheckedRows.includes(row.original.id)
                ? prevCheckedRows.filter((id: any) => id !== row.original.id) // Remove if exists
                : [...prevCheckedRows, row.original.id] // Add if not present
        );
    }


    const columnsSelectedItems: DTColumnsProps<any>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => {
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                            userIdofCheckedRows(row);
                        }}
                        aria-label="Select row"
                    />
                )
            },
        },
        {
            accessorKey: "text",
            header: "Items"
        },
    ];

    function saveItems() {
        setAvailableQty(checkedRows);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[40%]">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <DataTable columns={columnsSelectedItems} data={items} />
                <DialogFooter>
                    <Button type="submit" onClick={saveItems}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
