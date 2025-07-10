'use client';

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import AddOfficeDtailsButtonWithModal from "./office-details-button";

interface OfficeDetailData {
  //id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  landmark: string;
  taxinfo: string;
  taxnumber: string;
}

function OfficeDetailsTable() {
  const router = useRouter();
  const [officeDetails, setOfficeDetails] = useState<OfficeDetailData[]>([]);

  const fetchOfficeDetailsData = async () => {
    try {
      const OfficeDetailsInstanceData = await getMyInstancesV2({
        processName: "Address Information",
        predefinedFilters: { taskName: "View Address Info" }
      });
      
      const details: OfficeDetailData[] = OfficeDetailsInstanceData.map((item: any) => {
        const addressInfo = item.data.addressInfo;
        return {
          //id: item.processInstanceId,
          street: addressInfo.street,
          city: addressInfo.city,
          state: addressInfo.state,
          country: addressInfo.country,
          landmark: addressInfo.landmark,
          taxinfo: addressInfo.taxinfo,
          taxnumber: addressInfo.taxnumber,
        };
      });
      
      console.log(details);
      setOfficeDetails(details);
    } catch (error) {
      console.error("Error fetching office details data:", error);
    }
  };

  const columns: ColumnDef<OfficeDetailData>[] = [
    {
      accessorKey: "street",
      header: () => (
        <div style={{ textAlign: "center" }}>Street</div>
      ),
    },
    {
      accessorKey: "city",
      header: () => (
        <div style={{ textAlign: "center" }}>City</div>
      ),
    },
    {
      accessorKey: "state",
      header: () => (
        <div style={{ textAlign: "center" }}>State</div>
      ),
    },
    {
      accessorKey: "country",
      header: () => (
        <div style={{ textAlign: "center" }}>Country</div>
      ),
    },
    {
      accessorKey: "landmark",
      header: () => (
        <div style={{ textAlign: "center" }}>Landmark</div>
      ),
    },
    {
      accessorKey: "taxinfo",
      header: () => (
        <div style={{ textAlign: "center" }}>Tax Info</div>
      ),
    },
    {
      accessorKey: "taxnumber",
      header: () => (
        <div style={{ textAlign: "center" }}>Tax Number</div>
      ),
    },
  ];

  useEffect(() => {
    fetchOfficeDetailsData();
  }, []);

  const extraParams: DTExtraParamsProps = {
    extraTools: [
      <AddOfficeDtailsButtonWithModal />
    ],
  };

  return (
    <>
      <DataTable columns={columns} data={officeDetails} extraParams={extraParams} />
    </>
  );
}

export default OfficeDetailsTable;
