import { getActiveAccountId } from "@/ikon/utils/actions/account/index";
import { getAvailableSoftwaresForAccount } from "@/ikon/utils/api/softwareService/index";



async function AllAppData() {
    const accountId = await getActiveAccountId();
    const allApps = await getAvailableSoftwaresForAccount({ accountId });
    return allApps;
}
export default AllAppData;
