import { getActiveAccountId } from "@/ikon/utils/actions/account/index";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService/index";



async function SubscribedAppData() {
    const accountId = await getActiveAccountId();
    const subscribedApps = await getAllSubscribedSoftwaresForClient({ accountId })
    return subscribedApps;
}
export default SubscribedAppData;
