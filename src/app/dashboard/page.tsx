import Dashboard from "@/app/dashboard/components/Dashboard";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { ScanNotificationDataModified, ScanNotificationInDatabase } from "@/components/type";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchData } from "@/utils/api";

const fetchScanNotificationDetailsOnLogin = async () => {
  const userId = (await getLoggedInUserProfile()).USER_ID;

  const scanNotificationDataOnLogin = await fetchData("scandetails", "scan_id", [{ column: "user_id", value: userId }]);

  return scanNotificationDataOnLogin;
}

export default async function Home() {
  // useEffect(() => {
  //   const socket = getSocket();
  //   console.log('inside first useEffect')

  //   socket.on('connect', () => {
  //     console.log('Socket connected:', socket.id);
  //   });

  //   const onCustomMessage = (data: any) => {
  //     console.log('📨 Received from socket:', data);
  //   };

  //   socket.on('custom_event', onCustomMessage);

  //   return () => {
  //     socket.off('custom_event', onCustomMessage);
  //     socket.off('connect');
  //   };
  // }, []);

  const scanNotificationDataOnLogin: ScanNotificationInDatabase[] = await fetchScanNotificationDetailsOnLogin() ? (await fetchScanNotificationDetailsOnLogin()).data : [];

  const scanNotificationDataOnLoginFormatted: ScanNotificationDataModified[] = scanNotificationDataOnLogin.map(eachScanNotificationData => ({
    scanId: eachScanNotificationData.scan_id,
    tool: eachScanNotificationData.tool,
    target: eachScanNotificationData.target,
    startTime: eachScanNotificationData.start_time,
    endTime: eachScanNotificationData.end_time ?? "",
    status: eachScanNotificationData.status,
    pentestId: eachScanNotificationData.pentest_id ?? "",
  }));

  console.log(scanNotificationDataOnLoginFormatted);

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Dashboard",
          href: "/dashboard",
        }}
      />
      <Dashboard />
    </>
  );
}
