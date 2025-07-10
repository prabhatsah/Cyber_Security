import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import ExpenseMainDataTable, { ExpenseData } from "./expenseMainDataTable";

interface Expensess {
  [key: string]: ExpenseData;
}

export default function ExpenseComponent({ expenseData, projectIdentifier }: { expenseData: Expensess; projectIdentifier: string }) {
  // const expenseData1: ExpenseData[] = []
  // for (const key in expenseData) {
  //   expenseData1.push({ ...expenseData[key], id: key })
  // }
  return (
    <>
      {/* <ExpenseMainDataTable expenseData={expenseData1} productIdentifier={productIdentifier} /> */}

      {/* <ExpenseMainDataTable expenseData={Object.keys(expenseData).map(key => ({ ...expenseData[key], id: key }))} projectIdentifier={projectIdentifier} /> */}
      <ExpenseMainDataTable
        expenseData={
          Object.keys(expenseData)
            .filter(
              (key) =>
                typeof expenseData[key] === "object" && expenseData[key] !== null
            )
            .map((key) => ({ ...expenseData[key], id: key }))
        }
        projectIdentifier={projectIdentifier}
      />
    </>
  );
}
