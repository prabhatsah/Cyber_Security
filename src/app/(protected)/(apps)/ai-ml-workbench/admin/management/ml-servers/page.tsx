import { useMlServerData } from "../../components/data-collection";
import MlServerDataTable from "./components/ml-server-datatable";

export default async function Servers() {
  const mlServerData = await useMlServerData();

  return (
    <>
      <MlServerDataTable mlServerDataTableData={mlServerData} />
    </>
  );
}
