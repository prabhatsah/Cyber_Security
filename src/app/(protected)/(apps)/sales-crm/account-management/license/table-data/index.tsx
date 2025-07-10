import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { format } from "date-fns";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { SquarePenIcon } from "lucide-react";
import Link from "next/link";
import CreateBillingButtonWithModal from "../component/billing-form/billing-create";
import BillingModal from "../component/billing-form/billing-modal";

interface Server {
  name: string;
  config: string;
}

interface Resource {
  resourceId: string;
  resourceName: string;
  resourceSize: number;
  resourceType: string;
  fileContentDate: string;
  uploadDate: string;
  uploadType: string;
  isNewUpload: boolean;
  server: string;
  config: string;
}

interface BillingAccountProps {
  id: string;
  name: string;
  parentAccount: string;
  childAccounts: string[];
  servers: Server[];
  resources: Resource[];
  createdOn: string;
  updatedOn: string;
  isParent: boolean;
  isActive?: boolean;
  parentId?: string;
  production?: boolean;
  development?: boolean;
  uat?: boolean;
  preProduction?: boolean;
  [key: string]: any;
}

export default function LicenseTableData() {const [billingAccount, setBillingAccount] = useState<BillingAccountProps[]>([]);
  const [billingRelationshipData, setBillingRelationshipData] = useState<BillingAccountProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingDataEdit, setBillingDataEdit] = useState<BillingAccountProps | null>(null);

  const transformBillingData = (data: BillingAccountProps[]) => {
    return data.map((account) => {
      const tempObj: BillingAccountProps = { ...account };
      tempObj.parentId = tempObj.isParent ? "" : tempObj.parentAccount;
      tempObj.production = false;
      tempObj.development = false;
      tempObj.uat = false;
      tempObj.preProduction = false;

      tempObj.servers.forEach((eachServer) => {
        const words = eachServer.name
          .toLowerCase()
          .split(" ")
          .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          );
        const serverName = words.join("");
        tempObj[serverName] = true;
      });

      return tempObj;
    });
  };

  const fetchLicenseData = async () => {
    try {
      const billingInsData = await getMyInstancesV2({
        processName: "Billing Account",
        predefinedFilters: { taskName: "View" },
        projections: ["Data"],
      });

      const billingData: BillingAccountProps[] = billingInsData.map(
        (e: any) => e.data
      );
      console.log("billingData for table ", billingData);
      setBillingAccount(billingData);

      const transformedData = transformBillingData(billingData);
      setBillingRelationshipData(transformedData);
      console.log("billingRelationshipData ", transformedData);
    } catch (error) {
      console.error("Error fetching License:", error);
    }
  };

  useEffect(() => {
    fetchLicenseData();
  }, []);

  const handleOpenModalEdit = (id: string) => {
    setIsModalOpen(true);
  };

  const handleCloseModalEdit = () => {
    setIsModalOpen(false);
  };

  const extraParams: DTExtraParamsProps = {
    extraTools: [<CreateBillingButtonWithModal />],
    actionMenu: {
      items: [
        {
          label: "Edit",
          icon: SquarePenIcon,
          onClick: (row: any) => {
            console.log("Edit clicked", row);
            handleOpenModalEdit(row.id);
            setBillingDataEdit(row)
          },
        },
      ],
    },
  };

  const columns: ColumnDef<BillingAccountProps>[] = [
    {
      accessorKey: "name",
      header: () => <div style={{ textAlign: "center" }}>Account Name</div>,
      // cell: ({ row }) => <span>{row.original?.name || "n/a"}</span>,
      cell: (info: any) => (
        <Link className="underline" href={"../account-management/license/" + info.row.original.id }>
            {info.getValue()}
        </Link>
      ),
    },
    {
      accessorKey: "development",
      header: () => <div style={{ textAlign: "center" }}>Development</div>,
      cell: ({ row }) => (
        <span>{row.original?.development ? "Yes" : "No"}</span>
      ),
    },
    {
      accessorKey: "uat",
      header: () => <div style={{ textAlign: "center" }}>UAT</div>,
      cell: ({ row }) => <span>{row.original?.uat ? "Yes" : "No"}</span>,
    },
    {
      accessorKey: "preProduction",
      header: () => <div style={{ textAlign: "center" }}>Pre Production</div>,
      cell: ({ row }) => (
        <span>{row.original?.preProduction ? "Yes" : "No"}</span>
      ),
    },
    {
      accessorKey: "production",
      header: () => <div style={{ textAlign: "center" }}>Production</div>,
      cell: ({ row }) => <span>{row.original?.production ? "Yes" : "No"}</span>,
    },

    {
      accessorKey: "createdOn",
      header: () => <div style={{ textAlign: "center" }}>Created On</div>,
      cell: ({ row }) => {
        const date = row.original?.createdOn;
        return (
          <span>{date ? format(new Date(date), "dd-MMM-yyyy") : "n/a"}</span>
        );
      },
    },
    {
      accessorKey: "updatedOn",
      header: () => <div style={{ textAlign: "center" }}>Updated On</div>,
      cell: ({ row }) => {
        const date = row.original?.updatedOn;
        return (
          <span>{date ? format(new Date(date), "dd-MMM-yyyy") : "n/a"}</span>
        );
      },
    },
  ];

  return (
    <div className="">
      <DataTable columns={columns} data={billingRelationshipData} extraParams={extraParams} />

      <BillingModal
          isOpen={isModalOpen}
          onClose={handleCloseModalEdit}
          selectedAcc={billingDataEdit ?? {}}
        />
    </div>
  );
}
