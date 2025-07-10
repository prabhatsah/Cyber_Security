import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import ExpenseComponent from "../components/expense-component";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function ProductExpenseTab({ params }: { params: { product_id: string } }) {
    const productIdentifier = params?.product_id || "";
    const expenseInstanceData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
        projections: ["Data.expenseDetails"],
      });
      console.log('expenseInstanceData ------- ',expenseInstanceData)
      const expenseData = expenseInstanceData[0].data.expenseDetails;
      console.log("expenseData --------- ",expenseData)
      
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Expenses',
                    href: `/expense`,
                }}
            />
            <ExpenseComponent expenseData={expenseData || {}} productIdentifier={productIdentifier}/>
        </>

    );
}