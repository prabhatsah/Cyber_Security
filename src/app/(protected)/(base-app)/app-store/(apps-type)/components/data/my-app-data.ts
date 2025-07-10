import { getActiveAccountId } from "@/ikon/utils/actions/account/index";
import { getMySoftwares } from "@/ikon/utils/api/softwareService/index";



async function MyAppData() {
    const accountId = await getActiveAccountId();
    const myApps = await getMySoftwares({ accountId })
    return myApps;
}
export default MyAppData;
