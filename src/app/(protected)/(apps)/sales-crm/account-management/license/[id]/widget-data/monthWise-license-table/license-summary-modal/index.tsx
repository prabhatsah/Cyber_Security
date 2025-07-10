import { memo, useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import LicenseKendoSummary from "./LicenseKendoSummary";
import { SheetDescriptor } from "@progress/kendo-react-spreadsheet";
import ComboboxInput from "@/ikon/components/combobox-input";
import { Checkbox } from "@/shadcn/ui/checkbox";

interface LicenseSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: SheetDescriptor[];
  monthArray: any;
  selectedMonth: any;
}

const nonProductionRows: SheetDescriptor[] = [
  {
    name: "EmptySheet",
    columns: [{ width: 150 }, { width: 100 }, { width: 100 }],
    rows: [],
  },
];

const LicenseSummaryModal: React.FC<LicenseSummaryModalProps> = ({
  isOpen,
  onClose,
  rows,
  monthArray,
  selectedMonth,
}) => {
  const [selectedDate, setSelectedDate] = useState(selectedMonth);
  const [isProduction, setIsProduction] = useState(true);
  //const [displayedRows, setDisplayedRows] = useState<SheetDescriptor[]>(rows);

 

  // useEffect(() => {
  //   setDisplayedRows(isProduction ? [...rows] : [...nonProductionRows]);
  // }, [isProduction]);
  const displayedRows = useMemo(
    () => (isProduction ? [...rows] : [...nonProductionRows]),
    [isProduction]
  );

  const productionRows: SheetDescriptor[] = [
    {
      name: "UserSummary (Production)",
      mergedCells: ["A1:A2", "B1:C1", "D1:E1"],
      columns: [
        { width: 150 },
        { width: 100 },
        { width: 100 },
        { width: 100 },
        { width: 100 },
      ],
      rows: [
        {
          cells: [
            {
              value: "Name",
              bold: true,
              background: "rgb(236,239,241)",
              textAlign: "center",
            },
            {
              value: "Production",
              bold: true,
              background: "rgb(236,239,241)",
              textAlign: "center",
            },
            {},
            {
              value: "Total Users",
              bold: true,
              background: "rgb(236,239,241)",
              textAlign: "center",
            },
            {},
          ],
        },
        {
          cells: [
            {},
            {
              value: "Admin",
              bold: true,
              background: "rgb(236,239,241)",
              textAlign: "center",
            },
            {
              value: "Non Admin",
              bold: true,
              background: "rgb(236,239,241)",
              textAlign: "center",
            },
            {
              value: "Admin",
              bold: true,
              background: "rgb(236,239,241)",
              textAlign: "center",
            },
            {
              value: "Non Admin",
              bold: true,
              background: "rgb(236,239,241)",
              textAlign: "center",
            },
          ],
        },
        {
          cells: [
            {
              value: "Total",
              bold: true,
              background: "rgb(198,224,180)",
              textAlign: "center",
            },
            { value: "-", background: "rgb(198,224,180)", textAlign: "center" },
            { value: "-", background: "rgb(198,224,180)", textAlign: "center" },
            { value: "-", background: "rgb(198,224,180)", textAlign: "center" },
            { value: "-", background: "rgb(198,224,180)", textAlign: "center" },
          ],
        },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>License Summary</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <div className="w-1/2">
            <ComboboxInput
              items={monthArray}
              placeholder="Please Select the month"
              onSelect={(selectedMonth: any) => setSelectedDate(selectedMonth)}
              defaultValue={selectedDate}
            />
          </div>
          <div className="w-1/2 flex items-center gap-2">
            <Checkbox
              checked={isProduction}
              onCheckedChange={(checked) => setIsProduction(checked as boolean)}
            />
            <span>Production</span>
          </div>
        </div>
        <LicenseKendoSummary sheets={displayedRows} />
      </DialogContent>
    </Dialog>
  );
};

export default LicenseSummaryModal;
