import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import getFileData from "./file-data";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // optional spinner icon from lucide-react

interface Props {
  isOpen: boolean;
  onClose: () => void;
  department?: string;
}
interface fileProps {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceData: fileProps;
  sector: string;
  product_service: string;
}

export default function OpenFileModal({ isOpen, onClose, department }: Props) {
  const [fileData, setFileData] = useState<fileProps[]>([]);
  const [tableData, setSetTableData] = useState<fileProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // start loading
      const fileData = await getFileData();
      setFileData(fileData);
      const array: fileProps[] = [];
      for (let each of fileData) {
        if (each?.department === department) {
          for (let file of each.files) {
            array.push({
              resourceName: file.resourceName,
              resourceId: file.resourceId,
              resourceType: file.resourceType,
              resourceData: file,
              sector: each.sector,
              product_service: each.product_service,
            });
          }
        }
      }
      setSetTableData(array);
      setLoading(false); // done loading
    };

    if (isOpen) fetchData(); // only fetch when modal is open
  }, [isOpen, department]);

  const columns: DTColumnsProps<fileProps>[] = [
    {
      accessorKey: "resourceName",
      header: () => <div className="text-center">File Name</div>,
      cell: ({ row }) => <span>{row.original.resourceName || "N/A"}</span>,
    },
    {
      accessorKey: "sector",
      header: () => <div className="text-center">Sector</div>,
      cell: ({ row }) => <span>{row.original.sector || "N/A"}</span>,
    },
    {
      accessorKey: "product_service",
      header: () => <div className="text-center">Product / Service</div>,
      cell: ({ row }) => <span>{row.original.product_service || "N/A"}</span>,
    },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{department}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 mr-2 text-foreground" />
            <span>Loading files...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tableData}
            extraParams={extraParams}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
