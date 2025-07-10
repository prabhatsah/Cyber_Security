import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import CompanyDataTab from "./components/tabs";

export default async function CompanyData() {
return (
    <div className="w-full h-full">
      <CompanyDataTab />
    </div>
  );
}