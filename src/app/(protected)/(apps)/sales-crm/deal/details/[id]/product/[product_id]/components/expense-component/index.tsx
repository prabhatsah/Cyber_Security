import ExpenseMainDataTable, { ExpenseData } from "./expenseMainDataTable";

interface Expensess {
  [key: string]: ExpenseData;
}

export default function ExpenseComponent({ expenseData, productIdentifier }: { expenseData: Expensess; productIdentifier: string }) {
  // const expenseData1: ExpenseData[] = []
  // for (const key in expenseData) {
  //   expenseData1.push({ ...expenseData[key], id: key })
  // }
  return (
    <>
      {/* <ExpenseMainDataTable expenseData={expenseData1} productIdentifier={productIdentifier} /> */}
      <ExpenseMainDataTable expenseData={Object.keys(expenseData).map(key => ({ ...expenseData[key], id: key }))} productIdentifier={productIdentifier} />
    </>
  );
}
