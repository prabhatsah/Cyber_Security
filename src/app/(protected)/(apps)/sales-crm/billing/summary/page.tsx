import { WidgetProps } from "@/ikon/components/widgets/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import InvoiceCalculation from "../component/invoice-calculation";
import Widgets from "@/ikon/components/widgets";
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { addDays, addMonths, differenceInDays, endOfMonth, format, isAfter, isBefore, isSameDay, parse, parseISO, subDays, subMonths } from "date-fns";
import MultiBarChart from "@/ikon/components/charts/multi-bar-chart";
import InvoiceDataTable from "../invoice-details/component/invoice-details-datatable";
import { count } from "console";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
// import DealDataTable from "./component/deal-datatable";
// import { WidgetProps } from "@/ikon/components/widgets/type";
// import DealWidget from "./component/deal-widget";

export default async function InvoiceSummary() {

  const {gridData, allDealsData, dealIdWisePaymentDetails} = await InvoiceCalculation();
  console.log('gridData', gridData)
  const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
  const totalInvoiceCount = Object.keys(gridData).length;
  var paidInvoice = 0;
  for (var i = 0; i < gridData.length; i++) {
    if (gridData[i].invoiceStatus == "paid" || gridData[i].invoiceStatus == "Paid") {
      paidInvoice = paidInvoice + 1;
    }
  }

  var dueInvoice = totalInvoiceCount - paidInvoice;
  const WidgetData: WidgetProps[] = [
    {
      id: "totalInvoiced",
      widgetText: "Total Invoiced",
      widgetNumber: "" + totalInvoiceCount,
      iconName: "banknote" as const,
    },
    {
      id: "totalPaid",
      widgetText: "Total Paid",
      widgetNumber: "" + paidInvoice,
      iconName: "banknote" as const,
    },
    {
      id: "totalDue",
      widgetText: "Due",
      widgetNumber: "" + dueInvoice,
      iconName: "banknote" as const,
    },

  ];
  var data: { [key: string]: { date: string; Invoiced: number; Paid: number; tobeInvoiced: number; due?: number } } = {};

  var mongoWhereClause = `(`
  var count = 0
  var totalCount = gridData.length;
  for (var i = 0; i < gridData.length; i++) {
			count++;
			if(count == totalCount){
				mongoWhereClause += 'this.Data.parentId  == "' + gridData[i].invoiceIdentifier + '" )';
			}else{
				mongoWhereClause += 'this.Data.parentId  == "' + gridData[i].invoiceIdentifier + '" ||';
			}
		
    const today = new Date();
    const lastDateofPreviousMonth = subMonths(today, 1);
    const lastDateOfThisMonth = endOfMonth(lastDateofPreviousMonth);
    
    const currentYearMonthStr = format(lastDateofPreviousMonth, "yyyy-MM");
    const currentTimeAndZoneStr = format(lastDateofPreviousMonth, "HH:mm:ss.SSSxxx");
  
    const thisMonthLastDate = new Date(`${currentYearMonthStr}-${format(lastDateOfThisMonth, "dd")}T${currentTimeAndZoneStr}`);
    
    let month = "";
    
    console.log('gridData', gridData[i]);

    // Correctly parsing '01-Dec-2021' format
    const invoiceDate = gridData[i].invoiceDates 
        ? parse(gridData[i].invoiceDates as string, "dd-MMM-yyyy", new Date()) 
        : new Date();

    

    if (isBefore(invoiceDate, thisMonthLastDate)) {
      month = format(invoiceDate, "MMM");
      gridData[i]["tobeInvoiced"] = true;
    } else if (isSameDay(invoiceDate, thisMonthLastDate) || isAfter(invoiceDate, thisMonthLastDate)) {
      month = format(invoiceDate, "MMM");
      gridData[i]["tobeInvoiced"] = false;
    }
  
    if (month && data[month]) {
      data[month]["Invoiced"] += gridData[i].tobeInvoiced !== true && gridData[i].invoiceStatus !== "paid" ? Number(gridData[i].invoicedAmounts) : 0;
      data[month]["Paid"] += gridData[i].invoiceStatus === "paid" ? Number(gridData[i].invoicedAmounts) : 0;
      data[month]["tobeInvoiced"] += gridData[i].tobeInvoiced === true && gridData[i].invoiceStatus !== "paid" ? Number(gridData[i].invoicedAmounts) : 0;
    } else {
      data[month] = {
        "date": month,
        "Invoiced": gridData[i].tobeInvoiced !== true && gridData[i].invoiceStatus !== "paid" ? Number(gridData[i].invoicedAmounts) : 0,
        "Paid": gridData[i].invoiceStatus === "paid" ? Number(gridData[i].invoicedAmounts) : 0,
        "tobeInvoiced": gridData[i].tobeInvoiced === true && gridData[i].invoiceStatus !== "paid" ? Number(gridData[i].invoicedAmounts) : 0
      };
    }
}
  for(var key in data){
    data[key]["due"] = data[key]["Invoiced"] - (data[key]["Paid"]+data[key]["tobeInvoiced"]);
  }
 
  var arrayData = Object.values(data);

  arrayData = arrayData.sort(function(a,b){
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  })
  arrayData = arrayData.reverse();
  console.log('arrayData', arrayData)
  const MultiBarChart_configurationObj: any = {
    title: "Total Invoiced",
    showLegend: true,
    showCursor: true,
    showScrollx: false,
    showScrolly: false,
    zoomToIndex: true,
    zoomStartIndex: "0",
    zoomEndIndex: "100",
    showoverallTooltip: true,
    seriesCreationArrayofObj: [
        { seriesType: 'bar', seriesColor: '#675f73' },
        { seriesType: 'bar', seriesColor: '#6a5e7d' },
        { seriesType: 'bar', seriesColor: '#9283a9' },
        { seriesType: 'bar', seriesColor: '#b5a1d3' },
        { seriesType: 'bar', seriesColor: '#ccbbe7' }
    ],
    dimensions: ['date', 'Invoiced', 'Paid', 'tobeInvoiced'],
};
var deadLineTrackerData = [];
var paidInvoices = []
var nextMonthsForecastData = []
const today = new Date();
const thirtyDaysLater = addDays(today, 30);
for (var i = 0; i < gridData.length; i++) {
  let currentInvoice = { ...gridData[i] };
  
  if (
      currentInvoice.invoiceStatus == "created" ||
      currentInvoice.invoiceStatus == "invoiced" ||
      currentInvoice.invoiceStatus == "unpaid"
  ) {
      var paymentDetails = dealIdWisePaymentDetails[gridData[i].dealIdentifier];
      var dealData = allDealsData.find(
          (deal) => deal["dealIdentifier"] == currentInvoice.dealIdentifier
      );
      
      var invoiceDate = currentInvoice.invoiceDate ? currentInvoice.invoiceDate : "";
      var paymentTerms = paymentDetails?.payment_Terms ?? "";
     // var accountDetails = dealData?.accountDetails ?? {};

      var timeStamp = invoiceDate ? format(new Date(invoiceDate), "ddMMyyyy") : "";
      var receiptDateNotFormatted = invoiceDate
          ? addMonths(new Date(invoiceDate), Number(paymentTerms))
          : null;
      var receiptDate = receiptDateNotFormatted
          ? format(subDays(receiptDateNotFormatted, 1), "yyyy-MM-dd")
          : "";

      var currentDate = format(new Date(), "yyyy-MM-dd");
      var difference = receiptDate
          ? differenceInDays(new Date(receiptDate), new Date(currentDate))
          : 0;
      
      // if (!currentInvoice.accountDetails) {
      //     currentInvoice.accountDetails = accountDetails;
      // }

      // currentInvoice.timeStamp = timeStamp;
      // currentInvoice.dueDate = receiptDate;
      // currentInvoice.dealName = dealName;
      // currentInvoice.dealNo = dealNo;
      //currentInvoice.noOfDays = difference + 1;
      //currentInvoice.isNoOfdaysNegetive = difference < 0;

       deadLineTrackerData.push(currentInvoice);
  }
  if (gridData[i].invoiceStatus == "paid" || gridData[i].invoiceStatus == "Paid") {
    paidInvoices.push(gridData[i]);
  }
  const dueDate = gridData[i].receiptDates;

  // Ensure dueDate is not null before parsing
  if (dueDate) {
    const parsedDueDate = parseISO(dueDate);

    // Compare the dates using date-fns
    if (isAfter(parsedDueDate, today) && isBefore(parsedDueDate, thirtyDaysLater)) {
      nextMonthsForecastData.push(gridData[i]);
    }
  }
}
console.log('deadLineTrackerData', deadLineTrackerData)
const activityInstanceData = await getMyInstancesV2({
  processName: "Activity Logs",
  predefinedFilters: { taskName: "Activity" },
  mongoWhereClause: mongoWhereClause
})
const activityData = activityInstanceData.map((e: any) => e.data);
console.log("activityData - ",activityData)

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <Widgets widgetData={WidgetData} />
      <div className='flex-grow overflow-y-auto pr-2'>
        <div className="grid grid-cols-6 gap-4 ">
          <div className="col-span-12">
            <Card className='p-4 h-full'>
            
              <MultiBarChart chartData={arrayData} configurationObj={MultiBarChart_configurationObj} />
              
            </Card>
          </div>
         
        </div>
        <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
            <Card>
              <CardHeader>Deadline Tracker</CardHeader>
              <CardContent className="h-[450px] overflow-auto">
                
                <InvoiceDataTable invoiceData={deadLineTrackerData} />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-6">
            <Card>
              <CardHeader>Paid Invoices</CardHeader>
              <CardContent className="h-[450px] overflow-auto">
                <InvoiceDataTable invoiceData={paidInvoices} />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-6">
            <Card>
            <CardHeader>Activity</CardHeader>
            <CardContent className="h-[450px] overflow-auto">
            <ScrollArea className="h-[400px] overflow-auto">
          {activityData.map((item, index) => (
            <div key={index} className="border-b py-2 px-3">
              <div className="flex flex-col">
                <span className="font-medium">{item.activity}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-400">{userIdWiseUserDetailsMap[item.updatedBy].userName}</span>
                <span className="text-sm font-medium">{item.updatedOn}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
            </CardContent>
            </Card>
          </div>
          <div className="col-span-6">
            <Card>
              <CardHeader>Next 30 Days Forecast</CardHeader>
              <CardContent className="h-[450px] overflow-auto">
                <InvoiceDataTable invoiceData={nextMonthsForecastData} />
              </CardContent>
            </Card>
          </div>
            </div>
      </div>

    </div>
  );
}
