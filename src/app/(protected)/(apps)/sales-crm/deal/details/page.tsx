import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import DealDataTable from "./component/deal-datatable";
import { WidgetProps } from "@/ikon/components/widgets/type";
import DealWidget from "./component/deal-widget";

export default async function Deal() {
  const dealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
  });
  const dealsData = dealsInstanceData.map((e: any) => e.data);

  const accountInsData = await getMyInstancesV2({
    processName: "Account",
    predefinedFilters: { taskName: "View State" },
    projections: ["Data"],
  });

  const accountData = accountInsData.map((e: any) => e.data);

  const productInsData = await getMyInstancesV2({
    processName: "Dynamic Product Add",
    predefinedFilters: { taskName: "View State" },
    projections: ["Data"],
  });

  const productData = productInsData.map((e: any) => e.data);

  interface DealStatus {
    Open: number;
    Won: number;
    Lost: number;
    Closed: number;
  }

  const dealStatus: DealStatus = {
    Open: 0,
    Won: 0,
    Lost: 0,
    Closed: 0,
  };

  for (var i = 0; i < dealsData.length; i++) {
    if (dealsData[i].dealStatus != "Won" && dealsData[i].dealStatus != "Lost") {
      ++dealStatus.Closed;
    }
    if (dealsData[i].dealStatus == "Won") {
      ++dealStatus.Won;
    } else if (dealsData[i].dealStatus == "Lost") {
      ++dealStatus.Lost;
    } else {
      ++dealStatus.Open;
    }
  }

  const WidgetData: WidgetProps[] = [
    {
      id: "noOfDeals",
      widgetText: "Total No. of Deal(s)",
      widgetNumber: "" + dealsData.length,
      iconName: "sticky-note" as const,
    },
    {
      id: "noOfwonDeals",
      widgetText: "No. of Won Deal(s)",
      widgetNumber: "" + dealStatus.Won,
      iconName: "trophy" as const,
    },
    {
      id: "noOfclosedDeals",
      widgetText: "No. of Closed Deal(s)",
      widgetNumber: "" + dealStatus.Won,
      iconName: "ban" as const,
    },
    {
      id: "noOflostDeals",
      widgetText: "No. of Active Deal(s)",
      widgetNumber: "" + dealStatus.Open,
      iconName: "trophy" as const,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <DealWidget widgetData={WidgetData} />
      <div className="flex-grow overflow-hidden">
        <DealDataTable dealsData={dealsData} accountData={accountData} productData={productData}/>
      </div>
    </div>
  );
}
