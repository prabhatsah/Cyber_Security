"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { AccountData } from "../../../../components/type";
import { Button } from "@/shadcn/ui/button";
import { ArrowUpDown, Contact, Eye, Plus, SquarePenIcon } from "lucide-react";
import Link from "next/link";
//import CreateDealButtonWithModal from "../create-deal";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";
import CreateAccountButtonWithModal from "../create-account";
import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";
import CreateAccountModalForm from "../create-account/components/account-form-definition";
import ContactModal from "../../../../components/contact-component/add-contact/CreateContactModalForm";
import ViewContactModal from "../view-contact";

// const getShortAbbreviation = (
//   prodObj: Record<string, { productType: string }>
// ): string => {
//   let shortHandString = "";

//   for (const eachProduct in prodObj) {
//     if (prodObj.hasOwnProperty(eachProduct)) {
//       const productType = prodObj[eachProduct].productType;
//       let productOutput = "";

//       const words = productType.split(" ");
//       for (const word of words) {
//         productOutput += word.charAt(0);
//       }
//       productOutput += "-";
//       shortHandString += productOutput;
//     }
//   }

//   // Remove the trailing '-' and return the result
//   return shortHandString.slice(0, -1);
// };

// Column Schema


function AccountDataTable({ accountsData, userIdWiseUserDetailsMap, accountIdWiseAccountNameMap }: { accountsData: AccountData[], userIdWiseUserDetailsMap: UserIdWiseUserDetailsMapProps, accountIdWiseAccountNameMap: { [key: string]: string } }) {
    console.log("accountIdWiseAccountNameMap", accountIdWiseAccountNameMap);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpenAddContact, setModalOpenAddContact] = useState(false);
    const [isModalOpenViewContact, setModalOpenViewContact] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<{} | null>(null);
    const [accountId, setAccountId] = useState("")
    const toggleModal = () => {
        console.log("selectedAccount - ", selectedAccount);
        setModalOpen((prev) => !prev);
    };
    const toggleAddContactModal = () => {
        console.log("selectedAccount - ", selectedAccount);
        setModalOpenAddContact((prev) => !prev);
    }
    const toggleViewContactModal = () => {
        console.log("selectedAccount - ", selectedAccount);
        setModalOpenViewContact((prev) => !prev);
    }
    const handleOpenModalEdit = (account: {}) => {
        console.log("Edit clicked", account);
        setSelectedAccount(account)
      //  if(selectedAccount != null){
            toggleModal();
     //   }
        
    }
    const handleOpenModalAddContact = (accountIdentifier: string) => {
        setAccountId(accountIdentifier)
        toggleAddContactModal()
    }
    const handleOpenModalViewContact = (accountIdentifier: string) => {
        console.log("View clicked", accountIdentifier);
        setAccountId(accountIdentifier)
        setModalOpenViewContact(true)
        //toggleViewContactModal()
    }

    const columns: DTColumnsProps<AccountData>[] = [
        {
            accessorKey: "accountName",
            header: ({ column }) => (
                <div style={{ textAlign: "center" }}>
                    Account
                    {/* <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Deal Name
                <ArrowUpDown />
              </Button> */}
                </div>
            ),
            // cell: ({ row }) => <span>{row.original?.dealName || "n/a"}</span>,
            //    cell: (info: any) => (
            //     <Link className="underline" href={"../deal/details/" + info.row.original.dealIdentifier + "/products"}>
            //         {info.getValue()}
            //     </Link>
            //   ),
            getGroupingValue: (row) => `${row.accountName}`,
        },
        {
            accessorKey: "accountManager",
            header: () => <div style={{ textAlign: "center" }}>Manager</div>,
            //cell: ({ row }) => <span>{row.original?.accountManager || "n/a"}</span>,
            cell: ({ row }) => {
                return <span>{userIdWiseUserDetailsMap[row.original?.accountManager]?.userName || "n/a"}</span>;
            },
        },
        {
            accessorKey: "isChannelPartner",
            header: () => <div style={{ textAlign: "center" }}>Is Channel Partner?</div>,
            cell: ({ row }) => (
                <span>{row.original.isChannelPartner ? "Yes" : "No"}</span>
            ),
        },
        {
            accessorKey: "channelPartnerAccount",
            header: () => <div style={{ textAlign: "center" }}>Channel Partner</div>,
            //  cell: ({ row }) => <span>{row.original?.channelPartnerAccount || "-"}</span>,
            cell: ({ row }) => {
                return <span>{row.original.channelPartnerAccount ? accountIdWiseAccountNameMap[row.original.channelPartnerAccount] || "n/a" : "n/a"}</span>;
            },
        },
        {
            accessorKey: "createdOn",
            header: () => (
                <div style={{ textAlign: "center" }}>Created On</div>
            ),
            cell: ({ row }) => {
                const formattedDate =
                    (row?.original?.createdOn &&
                        format(row.original.createdOn, VIEW_DATE_TIME_FORMAT)) ||
                    "n/a";
                return <span>{formattedDate}</span>;
            },
        },
        {
            accessorKey: "updatedOn",
            header: () => <div style={{ textAlign: "center" }}>Updated On</div>,
            cell: ({ row }) => {
                const formattedDate =
                    (row?.original?.updatedOn &&
                        format(row.original.updatedOn, VIEW_DATE_TIME_FORMAT)) ||
                    "n/a";
                return <span>{formattedDate}</span>;
            },
        }

    ];
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [<CreateAccountButtonWithModal />],
        actionMenu: {
            items: [
                {
                    label: "Edit Account",
                    icon: SquarePenIcon,
                    onClick: (row: any) => {
                        console.log("Edit clicked", row);
                        handleOpenModalEdit(row)
                    }
                },
                {
                    label: "Add Contact",
                    icon: Plus,
                    onClick: (row: any) => {
                        console.log("Edit clicked", row);
                        handleOpenModalAddContact(row.accountIdentifier)
                    }
                },
                {
                    label: "View Contact",
                    icon: Eye,
                    onClick: (row: any) => {
                        console.log("View clicked", row);
                        handleOpenModalViewContact(row.accountIdentifier)
                    }
                },
            ]
        }
    };
    return (
        <>
        <DataTable columns={columns} data={accountsData} extraParams={extraParams} />
        {  <CreateAccountModalForm isOpen={isModalOpen} onClose={toggleModal} selectedAccount={selectedAccount}/>  }
        { <ContactModal isOpen={isModalOpenAddContact} onClose={toggleAddContactModal} source="Accounts" identifier={accountId} accountId={accountId}/> }
        <ViewContactModal isOpen={isModalOpenViewContact} onClose={toggleViewContactModal}  accountId={accountId}/> 
        </>
    );
}

export default AccountDataTable;
