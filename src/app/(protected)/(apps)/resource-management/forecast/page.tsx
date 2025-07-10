import ForecastTable from "./forcast-table";
import ResourceWidgetData from "./forecast-widget";


export default function Forecast() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <ResourceWidgetData />
        <ForecastTable />
      </div>
    </>
  );
}
