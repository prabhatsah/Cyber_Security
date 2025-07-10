// IKON components
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { DeviceIdWiseData, DeviceListDataType, memoryCacheReturn, param, ProfileDataType, serviceDetails } from "./types";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import DiscoveredDevicesTable from "./components/DataTable";
import {
  fetchCurrentRoleData,
  getAllProbesDetails,
  getMemoryCache
} from "../utils/preloader_functions";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import Widgets from "@/ikon/components/widgets";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

type deviceServiceAssociationType = {
  clientId: string;
  deviceId: string;
  serviceId: string;
  service_interval_in_sec: number;
}

async function fetchDeviceData(type: 'ssh' | 'windows' | undefined) {
  try {
    const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
    let deviceData = await getMyInstancesV2<DeviceListDataType>({
      softwareId,
      processName: "Configuration Item",
      predefinedFilters: {
        taskName: "View CI Activity"
      }
    });

    if (type == 'ssh') {
      deviceData = deviceData.filter(obj => obj.data.osType == 'Ssh');

      return deviceData;
    }
    else if (type == 'windows') {
      deviceData = deviceData.filter(obj => obj.data.osType == 'Windows');

      return deviceData;
    }
    else {
      return deviceData;
    }



  }
  catch (err) {
    console.error('error in fetchDeviceData: ', err)
    return [];
  }
}

async function getServiceIdWiseData() {
  const serviceIdWiseServiceDetails: {
    [key: string]: serviceDetails
  } = {};

  const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
  const data = await getMyInstancesV2<serviceDetails>({
    softwareId,
    processName: 'Catalog',
    predefinedFilters: {
      taskName: "View Catalog"
    }
  })

  data.forEach((obj) => {
    serviceIdWiseServiceDetails[obj.data.serviceId] = obj.data;
  });

  return serviceIdWiseServiceDetails;

}

export default async function DiscoveredDevices() {
  const param: param = {
    deviceIdList: [''],
    serviceIdWiseDetails: {}
  }

  // const roleData = await getRoleMap();
  // console.log('custom role data: ', roleData);

  const currentRole = await fetchCurrentRoleData(undefined);

  const osType = currentRole[0].ROLE_NAME == 'Linux Administrator' ? 'ssh' : (currentRole[0].ROLE_NAME == 'Windows Administrator' ? 'windows' : undefined);

  console.log('current role Data: ', currentRole);

  const getCurrentAccountId = await getActiveAccountId();
  param['clientId'] = getCurrentAccountId;

  const profileData = await getProfileData() as ProfileDataType;
  //console.log('Profile data: ', profileData);

  const deviceData = await fetchDeviceData(osType);
  //console.log('Device data: ', deviceData);

  const serviceIDWiseData = await getServiceIdWiseData();
  //console.log('Service Id wise data: ', serviceIDWiseData);

  param.serviceIdWiseDetails = serviceIDWiseData;

  const taskId = deviceData[0].taskId;

  const deviceIdWiseData: DeviceIdWiseData = {}

  const totalDevices = deviceData.length.toString();

  const deviceData1 = deviceData.map((obj) => {
    param.deviceIdList.push(obj.data.deviceId);
    deviceIdWiseData[obj.data.deviceId] = obj.data;

    return obj.data;
  });

  const probeIdNameMap = await getAllProbesDetails();
  //console.log('Probe data: ', probeIdNameMap);

  const allActiveProbes = probeIdNameMap?.activeProbeDetailsMap;

  const cacheData = await getMemoryCache(param, undefined) as memoryCacheReturn;
  //console.log('memory cache data: ', cacheData);
  const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
  const deviceServiceAssociationData = await getMyInstancesV2<deviceServiceAssociationType>({
    softwareId,
    processName: "Device-Service Association",
    predefinedFilters: {
      taskName: "View association details"
    }
  });

  //console.log('deviceServiceAssociation data: ', deviceServiceAssociationData);

  let monitoredDevices = 0;
  let activeDevices = 0;



  deviceData1.forEach((device) => {
    const data = cacheData[device.deviceId];

    const servicesForDevices = deviceServiceAssociationData.filter(obj => obj.data.deviceId == device.deviceId);

    const serviceIDList = servicesForDevices.map(obj => obj.data.serviceId)

    if (!data || !data['Last Monitoring']) {
      device['status'] = 'Stale';
      device['monitoringStatus'] = 'No';
      device['noOfServices'] = servicesForDevices.length;
      device['serviceIdList'] = serviceIDList
    }
    else if (data["Poling Interval"] != null && data["Last Monitoring"] != null) {
      const lastMonitoringTime = new Date(data["Last Monitoring"].replace(' UTC', 'Z')).getTime();
      const currentTime = new Date().getTime();
      const pollingInterval = data["Poling Interval"] * 1000;

      ++monitoredDevices;

      if (currentTime - lastMonitoringTime > pollingInterval) {
        device.status = "Stale";
        device.monitoringStatus = "Yes";
        device.noOfServices = servicesForDevices.length;
        device['serviceIdList'] = serviceIDList
      }
      else {
        ++activeDevices;
        device.status = "Online";
        device.monitoringStatus = "Yes";
        device.noOfServices = servicesForDevices.length;
        device['serviceIdList'] = serviceIDList
      }
    }
    else {
      //console.log('ip: ', device.hostIp);

      device.status = "N/A";
      device.monitoringStatus = "N/A";
      device.noOfServices = 0;
      device.serviceIdList = []
    }

  });

  //console.log('final data: ', deviceData1);

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={
          {
            level: 2,
            title: "Discovered Devices",
            href: "/discoveredDevices"
          }
        }
      />
      <h1 className="text-2xl font-bold mb-2 text-foreground">Discovered Devices</h1>
      <p className="mb-4 text-muted-foreground">
        Discovered Devices in GRC provides a centralized view of all assets detected in your environment, enabling effective monitoring, management, and risk assessment.
      </p>
      {/* <Widgets widgetData={
        [
          {
            id: '111',
            widgetText: 'Devices',
            widgetNumber: totalDevices,
            iconName: 'monitor'
          },
          {
            id: '112',
            widgetText: 'Active Devices',
            widgetNumber: activeDevices.toString(),
            iconName: 'monitor-check'
          },
          {
            id: '113',
            widgetText: 'Monitored Devices',
            widgetNumber: monitoredDevices.toString(),
            iconName: 'monitor-dot'
          }
        ]
      } /> */}

      <br></br>
      
        <DiscoveredDevicesTable deviceData={deviceData1} deviceIdWiseData={deviceIdWiseData} serviceIdWiseDetails={serviceIDWiseData} probeIdNameMap={allActiveProbes} profileData={profileData} taskId={taskId} currentRole={currentRole} />
     
    </>
  );
}
