import { WidgetProps } from "@/ikon/components/widgets/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import InvoiceDataTable from "./component/invoice-details-datatable";
import { InvoiceData } from "../../components/type";
import { addMonths, format, parseISO, subDays } from "date-fns";
import InvoiceCalculation from "../component/invoice-calculation";

// import DealDataTable from "./component/deal-datatable";
// import { WidgetProps } from "@/ikon/components/widgets/type";
// import DealWidget from "./component/deal-widget";

export default async function InvoiceDetails() {
 
  const {gridData} = await InvoiceCalculation();
  console.log('gridData', gridData)
  //console.log('dealIdWiseDealNameMap', dealIdWiseDealNameMap)
  //const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
  //console.log('userIdWiseUserDetailsMap', userIdWiseUserDetailsMap)

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex-grow overflow-hidden">
        <InvoiceDataTable invoiceData={gridData}/>
        {/* <AccountDataTable accountsData={accountData} userIdWiseUserDetailsMap={userIdWiseUserDetailsMap} accountIdWiseAccountNameMap={accountIdWiseAccountNameMap}/> */}
      </div>
    </div>
  );
}
