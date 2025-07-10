import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import ExpenseComponent from "../components/expense-component";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function ProductExpenseTab({ params }: { params: { projectIdentifierId: string } }) {
    const projectIdentifier = params?.projectIdentifierId || "";
    const expenseInstanceData = await getMyInstancesV2<any>({
        processName: "Product of Project",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
        projections: ["Data.expenseDetails"],
      });
      console.log('expenseInstanceData ------- ',expenseInstanceData)
      const expenseData = expenseInstanceData[0]?.data?.expenseDetails;
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
            <ExpenseComponent expenseData={expenseData || {}} projectIdentifier={projectIdentifier}/>
        </>

    );
}