import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import EmployeeDataTable from "./components/employee-table";
//import CompanyDataTab from "./components/tabs";

export default function EmployeeData() {



  return (
    <div className="w-full h-full">
      {/* <CompanyDataTab /> */}
      <EmployeeDataTable/>
    </div>
  );
}