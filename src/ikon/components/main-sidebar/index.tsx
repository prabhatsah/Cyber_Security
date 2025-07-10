import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shadcn/ui/sidebar";
import {
  BrainCircuit,
  BrainCog,
  ChartPie,
  Code,
  Cpu,
  Dock,
  DollarSign,
  FileText,
  Headset,
  List,
  Database,
  Building,
} from "lucide-react";
import Link from "next/link";
import AccountSwitcher from "@/ikon/components/account-switcher";
import {
  getAllSubscribedSoftwares,
  getCurrentAppName,
} from "@/ikon/utils/actions/software";
import { getAccount, getActiveAccountId } from "@/ikon/utils/actions/account";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getAllInvitedAccountsForUser } from "@/ikon/utils/api/accountService";
import { appWiseSoftwareNameVersionMap } from "@/ikon/utils/config/app-wise-software-name-version-map";

// const navManu = [
//   /* {
//     title: "Sales CRM",
//     href: "sales-crm",
//     icon: DollarSign,
//     isActive: false,
//   },
//   {
//     title: "Project Management",
//     href: "project-management",
//     icon: List,
//     isActive: false,
//   },
//   {
//     title: "Document Management",
//     href: "document-management",
//     icon: FileText,
//     isActive: false,
//   },
//   {
//     title: "SSD",
//     href: "ssd",
//     icon: ChartPie,
//     isActive: false,
//   },
//   {
//     title: "AI ML Workbench",
//     href: "ai-ml-workbench",
//     icon: BrainCog,
//     isActive: false,
//   },
//   {
//     title: "Customer Support",
//     href: "customer-support",
//     icon: Headset,
//     isActive: false,
//   },
//   {
//     title: "Tender Management",
//     href: "tender-management",
//     icon: Dock,
//     isActive: false,
//   },
//   {
//     title: "AI Workforce",
//     href: "ai-workforce",
//     icon: Cpu,
//     isActive: false,
//   },
//   {
//     title: "CCC",
//     href: "ccc",
//     icon: Code,
//     isActive: false,
//   }, */
//   {
//     title: "BMS",
//     href: "bms",
//     icon: Building,
//     isActive: false,
//   },
//   /*  {
//      title: "ITSM",
//      href: "itsm",
//      icon: Database,
//      isActive: false,
//    }, */
// ];
// interface MainSideBarProps extends React.ComponentProps<typeof Sidebar> {
//     appName: string;
// }
export default async function MainSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  //const appName = await getCurrentAppName()
  const subscribeSoftware = await getAllSubscribedSoftwares();
  // console.log("subscribeSoftware", subscribeSoftware, appWiseSoftwareNameVersionMap)
  const navManu = [];
  for (const key in appWiseSoftwareNameVersionMap) {
    if (key == "base-app") continue;
    const { softwareName, version } = appWiseSoftwareNameVersionMap[key];
    const isFind = subscribeSoftware.find(
      (software) =>
        software.SOFTWARE_NAME === softwareName &&
        software.SOFTWARE_VERSION == parseInt(version)
    );
    if (isFind) {
      navManu.push({
        title: appWiseSoftwareNameVersionMap[key]?.tooltip || softwareName,
        href: key,
        icon: appWiseSoftwareNameVersionMap[key].icon,
        isActive: false,
      });
    }
  }
  const account = await getAccount();
  const profile = await getProfileData();
  const invitedAccounts = await getAllInvitedAccountsForUser(profile.USER_ID);
  //console.log("invitedAccounts", invitedAccounts)
  const accounts = [...invitedAccounts, account];
  const accountId = await getActiveAccountId();
  const activeAccount = accounts.find(
    (account) => account.ACCOUNT_ID === accountId
  );
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r "
    >
      <SidebarHeader className="border-b">
        <SidebarMenu className="justify-center h-9">
          <SidebarMenuItem>
            <AccountSwitcher
              accounts={accounts}
              activeAccountDetails={activeAccount}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              {navManu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.title,
                      hidden: false,
                    }}
                    // isActive={appName === item.href}
                    className="px-2.5 md:px-2"
                    asChild
                  >
                    <Link href={"/" + item.href}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
