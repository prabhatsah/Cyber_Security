'use client';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SquarePenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import BankingDetailsModal from "./banking-details-modal";
import BankDetailsButtonWithModal from "./banking-details-buttons";

// Updated interface to reflect processed banking data
interface BankingDetailsData {
  id: string;
  bankingAED: string;
  bankingAccName: string;
  bankingNickName: string;
  bankingBankName: string;
  bankingBranch: string;
  bankingIBAN: string;
  bankingDefault: boolean;
}

function BankingDetailsTable() {
  const router = useRouter();
  const [bankingDetails, setBankingDetails] = useState<BankingDetailsData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchBankingDetailsData = async () => {
    try {
      const BankingDetailsInstanceData = await getMyInstancesV2({
        processName: "Banking Details",
        predefinedFilters: { taskName: "View Bank Details" }
      });

      console.log("Fetched Data:", BankingDetailsInstanceData);

      const bankingData: BankingDetailsData[] = [];
      BankingDetailsInstanceData.forEach((instance: any) => {
        if (instance.data && instance.data.bankDetails) {
          const bankDetails = instance.data.bankDetails;
          for (const key in bankDetails) {
            if (Object.hasOwnProperty.call(bankDetails, key)) {
              const record = bankDetails[key];
              bankingData.push({
                id: key,
                bankingAED: record.AED_Number,
                bankingAccName: record.Account_Name,
                bankingNickName: record.Account_Nickname,
                bankingBankName: record.Bank_Name,
                bankingBranch: record.Branch_Name,
                bankingIBAN: record.IBAN_Code,
                bankingDefault: record.Default_Bank
              });
            }
          }
        }
      });

      console.log("Processed Banking Data:", bankingData);
      setBankingDetails(bankingData);
    } catch (error) {
      console.error("Error fetching banking data:", error);
    }
  };

  const columns: ColumnDef<BankingDetailsData>[] = [
    {
      accessorKey: "bankingBankName",
      header: () => <div style={{ textAlign: "center" }}>Bank Name</div>,
    },
    {
      accessorKey: "bankingNickName",
      header: () => <div style={{ textAlign: "center" }}>Nick Name</div>,
    },
    {
      accessorKey: "bankingAccName",
      header: () => <div style={{ textAlign: "center" }}>Account Name</div>,
    },
    {
      accessorKey: "bankingAED",
      header: () => <div style={{ textAlign: "center" }}>AED Number</div>,
    },
    {
      accessorKey: "bankingBranch",
      header: () => <div style={{ textAlign: "center" }}>Branch Name</div>,
    },
    {
      accessorKey: "bankingIBAN",
      header: () => <div style={{ textAlign: "center" }}>IBAN Code</div>,
    },
    {
      accessorKey: "bankingDefault",
      header: () => <div style={{ textAlign: "center" }}>Default</div>,
    },
  ];

  const handleOpenModalEdit = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleCloseModalEdit = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    router.refresh(); // Refresh the page
    fetchBankingDetailsData();
  };

  useEffect(() => {
    fetchBankingDetailsData();
  }, []);

  const extraParams: DTExtraParamsProps = {
    extraTools: [
      <BankDetailsButtonWithModal />
    ],
    actionMenu: {
      items: [
        {
          label: "Edit",
          icon: SquarePenIcon,
          onClick: (row: any) => {
            console.log("Edit clicked", row);
            handleOpenModalEdit(row.id);
          },
        },
      ],
    },
  };

  return (
    <>
      <DataTable columns={columns} data={bankingDetails} extraParams={extraParams} />
      { <BankingDetailsModal isOpen={isModalOpen} onClose={handleCloseModalEdit} selectedId={selectedId}/> }
    </>
  );
}

export default BankingDetailsTable;
