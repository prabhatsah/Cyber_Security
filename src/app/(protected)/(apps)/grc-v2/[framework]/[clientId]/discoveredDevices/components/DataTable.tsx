'use client'

import { DataTable } from "@/ikon/components/data-table";
import { DeviceListDataType, DiscoveredDevicesTableProps, RoleMembershipInfoType } from "../types";
import { FC, useRef, useState } from "react";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getFormattedDate, trimNewline } from "../../utils/generic";
import { TableToolButton_Add, TableToolButton_ConfigureDevice, TableToolButton_Delete, TableToolButton_DeletedDeviceHistory, TableToolButton_DiscoverHistory, TableToolButton_StartDiscovery } from "./DataTableToolsButton";
import { IconTextButton } from "@/ikon/components/buttons";
import { Activity, Clock, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { ShowModal, ShowModal2, ShowModal3, ShowModal4, ShowModal5, ShowModal6, ShowModal7, ShowModal8, ShowModal9 } from "./showModals";
import CustomAlertDialog from "@/ikon/components/alert-dialog";
import ProbeListTable from "./ProbeListTable";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { v4 as uuidv4 } from "uuid";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";


let viewmode = false;

type DeviceIdWiseDetailsType = {
  [key: string]: DeviceListDataType
}

type DeviceIdWiseChkb = {
  [key: string]: boolean
}

const deviceIdWiseDataObj: {
  [key: string]: DeviceListDataType
} = {}

const setAccess = (role: RoleMembershipInfoType) => {
  const rolename = role.ROLE_NAME;

  switch (rolename) {
    case "System Viewer":
      viewmode = true;
      break;
    case "System Admin":
      //do task
      break;
    case "Asset Administrator":
      //do task
      break;
    case "Windows Administrator":
      //do task
      break;
    case "Linux Administrator":
      //do task
      break;
    case "Network Administrator":
      //do task
      break;
    case "Database Administrator":
  }
}

const DiscoveredDevicesTable: FC<DiscoveredDevicesTableProps> = ({ deviceIdWiseData, deviceData, probeIdNameMap, profileData, taskId, serviceIdWiseDetails, currentRole }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
  const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);
  const [isModalOpen4, setIsModalOpen4] = useState<boolean>(false);
  const [isModalOpen5, setIsModalOpen5] = useState<boolean>(false);

  const [isModalOpen6, setIsModalOpen6] = useState<boolean>(false);
  const [isModalOpen7, setIsModalOpen7] = useState<boolean>(false);
  const [isModalOpen8, setIsModalOpen8] = useState<boolean>(false);
  const [isModalOpen9, setIsModalOpen9] = useState<boolean>(false);

  //const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [showStartDiscoveryConfirmation, setShowStartDiscoveryConfirmation] = useState<boolean>(false);
  const [selectedDeviceForStartDiscovery, setSelectedDeviceForStartDiscovery] = useState<DeviceListDataType[]>([]);
  const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
  const [devicesToDelete, setDevicesToDelete] = useState<string[] | null>(null);
  const [selectedDeviceForEdit, setSelectedDeviceForEdit] = useState<DeviceListDataType>()
  const selectedDevices = useRef<DeviceListDataType[]>([]);
  const selectedChkb = useRef<DeviceIdWiseChkb>({});

  setAccess(currentRole[0])

  //const selectedDevices: DeviceListDataType[] = [];

  //let selectedDeviceForEdit: DeviceListDataType;

  const deleteConfirmation = function (ip: string[]) {
    //console.log('clicked deleteConfirmation');

    setCustomAlertVisible(true);
    setDevicesToDelete(ip);
  }

  const handleDelete = async function () {
    const deviceIDs = devicesToDelete;


    if (!deviceIDs) {
      return
    }

    //const deviceIds = deviceIDs.join(',');

    //console.log('Device ips to delete: ', deviceIps);
    setCustomAlertVisible(false);

    try {
      const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
      let data = await getMyInstancesV2<DeviceListDataType>({
        softwareId,
        processName: 'Configuration Item',
        predefinedFilters: {
          taskName: 'Delete Activity'
        }
      });

      data = data.filter(obj => deviceIDs.includes(obj.data.deviceId))
      debugger;

      //console.log('Fetched data: ', data);

      data.forEach(async (deviceInstanceData) => {
        const deviceData = deviceInstanceData.data;

        // @ts-expect-error : ignore
        deviceInstanceData.softDeletedOn = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        debugger;

        const data2 = await invokeAction({
          taskId: deviceInstanceData.taskId,
          transitionName: 'Update Delete Activity',
          processInstanceIdentifierField: '',
          data: deviceInstanceData.data
        })
        debugger;

        console.log('Device deleted: ', data2);

        // const extractedData = data.map((obj)=>(
        //     {
        //         hostName: obj.data.hostName,
        //         hostIp: obj.data.hostIp,
        //         description: obj.data.description,
        //         os: obj.data.os,
        //         type: obj.data.type,
        //         status: "Ongoing",
        //         deleteDataAndTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
        //         deviceId: obj.data.deviceId,
        //         clientId: obj.data.clientId,
        //         accountable: {
        //             userId:  profileData ? profileData.USER_ID : 'N/A',
        //             userName: profileData ? profileData.USER_NAME : 'N/A',
        //         },
        //     }
        // ))

        const extractedData = {
          hostName: deviceData.hostName,
          hostIp: deviceData.hostIp,
          description: deviceData.description,
          os: deviceData.os,
          type: deviceData.type,
          status: "Ongoing",
          deleteDataAndTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
          deviceId: deviceData.deviceId,
          clientId: deviceData.clientId,
          accountable: {
            userId: profileData ? profileData.USER_ID : 'N/A',
            userName: profileData ? profileData.USER_NAME : 'N/A',
          }
        }

        debugger;

        const deleteData = {
          [extractedData.deviceId]: extractedData
        }

        const deleteDeviceHistoryData = {
          "deleteDeviceData": deleteData
        }

        console.log('delete device data: ', deleteDeviceHistoryData);

        debugger;

        const processId = await mapProcessName({
          processName: "Device Delete History Process"
        })

        debugger;

        const data3 = await startProcessV2({
          processId: processId,
          processIdentifierFields: "probeId,clientId,deviceId",
          data: deleteDeviceHistoryData
        });

        debugger;

        console.log('Device Delete History Process started', data3);
      })

      window.location.reload();
    }
    catch (err) {
      console.error('Error in handleDelete: ', err);
    }
  }

  const addDevice = function (deviceIdWiseData: DeviceIdWiseDetailsType | undefined, deviceId: string) {
    if (deviceIdWiseData) {
      selectedDevices.current.push(deviceIdWiseData[deviceId]);

      deviceIdWiseDataObj[deviceId] = deviceIdWiseData[deviceId];

      const deviceLen = selectedDevices.current.length;

      //console.log('Added device: ', selectedDevices.current);
      //console.log('Device count: ', deviceLen);

      //setSelectedChkb({[deviceId] : true});

      // setSelectedChkb((prev)=> { 
      //   if(prev[deviceId]){
      //     prev[deviceId] = true;
      //   }

      //   return prev;
      //  });

      selectedChkb.current[deviceId] = true;

      if (deviceLen == 1) {
        const ele = document.getElementsByClassName('showOnDeviceClick');

        for (const item of ele) {
          if (item.classList.contains('hidden')) {
            item.classList.remove('hidden')
          }
        }
      }

    }
  };

  const removeDevice = function (deviceIdWiseData: DeviceIdWiseDetailsType | undefined, deviceId: string) {
    if (deviceIdWiseData) {
      let deviceLen = selectedDevices.current.length;

      for (let i = 0, len = deviceLen; i < len; i++) {
        if (selectedDevices.current[i].deviceId === deviceId) {
          selectedDevices.current.splice(i, 1)
          delete deviceIdWiseDataObj[deviceId]
          --deviceLen;
          break;
        }
      }

      console.log('Removed device: ', selectedDevices.current);
      console.log('Device count: ', deviceLen);

      // setSelectedChkb((prev)=> { 
      //   if(prev[deviceId]){
      //     prev[deviceId] = false;
      //   }

      //   return prev;
      //  });

      selectedChkb.current[deviceId] = false;

      if (deviceLen == 0) {
        const ele = document.getElementsByClassName('showOnDeviceClick');

        for (const item of ele) {
          if (!item.classList.contains('hidden')) {
            item.classList.add('hidden')
          }
        }
      }

    }
  }

  const checkAddOrRemove = function (event: React.MouseEvent<HTMLInputElement>, deviceIdWiseData: DeviceIdWiseDetailsType | undefined, deviceId: string) {
    console.log("Clicked on checkAddOrRemove");
    if (event.currentTarget.checked) {
      addDevice(deviceIdWiseData, deviceId);
    }
    else {
      removeDevice(deviceIdWiseData, deviceId);
    }
  }

  const startDiscoveryInit = function () {
    const deviceIdnotHavingProbeId: { [key: string]: string } = {};

    deviceData.forEach((device) => {
      if (!device.probeId) {
        deviceIdnotHavingProbeId[device.deviceId] = device.deviceId
      }
    });

    if (Object.keys(deviceIdnotHavingProbeId).length != 0) {
      <ProbeListTable
        open={true}
        close={
          () => { return false }
        }
        //deviceId="" 
        refresh={
          () => { }
        }
        probleIdWiseDetails={probeIdNameMap}
        selectedDeviceIdWiseProbeId={{}}
      />

    } else {
      setShowStartDiscoveryConfirmation(true);
    }
  }

  function getExtraParams() {
    const extraParams: DTExtraParamsProps = {
      grouping: true,
      extraTools: [
        <TableToolButton_Add
          key='deviceAddButton'
          classes={viewmode ? 'hidden' : ''}
          //classes={access.canAddDevice ? '' : 'hidden'} 
          onclick={
            () => {
              setIsModalOpen(true);
            }
          }
        />,
        <TableToolButton_Delete
          key='deviceDeleteButton'
          classes="showOnDeviceClick hidden"
          //classes={access.canAddDevice ? '' : 'hidden'} 
          onclick={
            () => {
              const deviceIds = selectedDevices.current.map(device => device.deviceId);

              deleteConfirmation(deviceIds)
            }
          }
        />,
        <TableToolButton_StartDiscovery
          key='startDiscoveryButton'
          classes="showOnDeviceClick hidden"
          //classes={access.canAddDevice ? '' : 'hidden'} 
          onclick={
            () => {
              startDiscoveryInit()

              //setShowStartDiscoveryConfirmation(true);
            }
          }
        />,
        <TableToolButton_ConfigureDevice
          key='configureDeviceButton'
          classes="showOnDeviceClick hidden"
          //classes={access.canAddDevice ? '' : 'hidden'} 
          onclick={
            () => {
              setIsModalOpen7(true)
            }
          }
        />,
        <TableToolButton_DiscoverHistory
          key='discoverHistoryButton'
          classes=""
          //classes={access.canAddDevice ? '' : 'hidden'} 
          onclick={
            () => {
              setIsModalOpen9(true)
            }
          }
        />,
        <TableToolButton_DeletedDeviceHistory
          key='deletedDeviceHistoryButton'
          classes=""
          //classes={access.canAddDevice ? '' : 'hidden'} 
          onclick={
            () => {
              setIsModalOpen3(true);
            }
          }
        />
      ],

    };

    return extraParams;
  }

  function getColumns(deviceIdWiseData: DeviceIdWiseDetailsType) {
    const columnDetailsSchema: DTColumnsProps<DeviceListDataType>[] = [
      {
        accessorKey: "deviceId",
        header: '',
        cell: ({ row }) => (
          <span>
            <input
              id={row.original.deviceId}
              defaultChecked={!!selectedChkb.current[row.original.deviceId]}
              name="selectedDevice"
              onClick={(e) => {
                checkAddOrRemove(e, deviceIdWiseData, row.original.deviceId);
              }}
              type="checkbox"
            />
          </span>
        ),
        enableGrouping: false,
        enableSorting: false,
      },
      {
        accessorKey: "hostName",
        header: 'Device Name',
        cell: ({ row }) => (
          <span>{row.original.hostName}</span>
        ),
      },
      {
        accessorKey: "hostIp",
        header: 'Host IP Address',
        cell: ({ row }) => (
          <span>{row.original.hostIp}</span>
        ),
      },
      {
        accessorKey: "classification",
        header: 'Classification',
        cell: ({ row }) => (
          <span>{row.original.classification}</span>
        ),
      },
      {
        accessorKey: "os",
        header: 'OS',
        cell: ({ row }) => (
          <span>{trimNewline(row.original.os)}</span>
        ),
      },
      // {
      //   accessorKey: "accountable.userName",
      //   header: 'Discovered By',
      //   cell: ({ row }) => (
      //     <span>{row.original.accountable.userName ? row.original.accountable.userName : 'N/A'}</span>
      //   ),
      // },
      {
        accessorKey: "",
        header: 'Probe',
        cell: ({ row }) => (
          <span>
            {
              probeIdNameMap && probeIdNameMap[row.original.probeId] ? probeIdNameMap[row.original.probeId] : "N/A"
            }
          </span>
        ),
      },
      // {
      //   accessorKey: "discoverDateAndTime",
      //   header: 'Discovered Time',
      //   cell: ({ row }) => (
      //     <span>
      //       {
      //         getFormattedDate(row.original.discoverDateAndTime)
      //       }
      //     </span>
      //   ),
      // },
      {
        accessorKey: "monitoringStatus",
        header: 'Monitored',
        cell: ({ row }) => (
          <span>
            {row.original.monitoringStatus}
          </span>
        ),
      },
      // {
      //   accessorKey: "noOfServices",
      //   header: 'Services',
      //   cell: ({ row }) => (
      //     <span>
      //       {row.original.noOfServices}
      //     </span>
      //   ),
      // },
      {
        accessorKey: "status",
        header: 'Device Status',
        cell: ({ row }) => (
          <span>
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "",
        header: 'Action',
        enableGrouping: false,
        enableSorting: false,
        cell: ({ row }) => (
          <span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconTextButton variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </IconTextButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="" onClick={
                  () => {
                    setSelectedDeviceForEdit(deviceIdWiseData[row.original.deviceId])
                    setIsModalOpen8(true)
                  }
                }>
                  <div>
                    <Eye />
                  </div>
                  <div>
                    View
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={viewmode ? 'hidden' : ''}
                  onClick={
                    () => {
                      //console.log(deviceIdWiseData[row.original.deviceId])

                      setSelectedDeviceForEdit(deviceIdWiseData[row.original.deviceId])
                      setIsModalOpen2(true);
                    }
                  }
                >
                  <div>
                    <Pencil />
                  </div>
                  <div>
                    Edit
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="" onClick={
                  () => {
                    setSelectedDeviceForEdit(deviceIdWiseData[row.original.deviceId])
                    setIsModalOpen6(true)
                  }
                }>
                  <div>
                    <Activity />
                  </div>
                  <div>
                    Activity Log
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className=""
                  onClick={
                    () => {
                      setSelectedDeviceForEdit(deviceIdWiseData[row.original.deviceId])
                      setIsModalOpen4(true);
                    }
                  }
                >
                  <div>
                    <Clock />
                  </div>
                  <div>
                    Polling Interval
                  </div>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        ),
      }

    ];

    if (viewmode) {
      columnDetailsSchema.shift();
    }

    return columnDetailsSchema;
  }

  deviceData.forEach((device) => {
    deviceIdWiseData[device.deviceId] = device
  });

  const extraParams = getExtraParams();
  const columns = getColumns(deviceIdWiseData);
  const params9 = {
    deviceIdWiseData: deviceIdWiseData
  }

  return (
    <div className="h-[85%]  relative overflow-auto">
     
        <DataTable data={deviceData} columns={columns} extraParams={extraParams} />
     
      <ShowModal profileData={profileData} allActiveProbes={probeIdNameMap} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ShowModal2 deviceData={selectedDeviceForEdit} taskId={taskId} profileData={profileData} allActiveProbes={probeIdNameMap} isModalOpen={isModalOpen2} setIsModalOpen={setIsModalOpen2} />
      <ShowModal3 profileData={profileData} isModalOpen={isModalOpen3} setIsModalOpen={setIsModalOpen3} />
      <ShowModal4 deviceId={selectedDeviceForEdit?.deviceId} serviceIdWiseDetails={serviceIdWiseDetails} isModalOpen={isModalOpen4} setIsModalOpen={setIsModalOpen4} viewMode={viewmode} />
      <ShowModal5 deviceData={selectedDeviceForStartDiscovery} isModalOpen={isModalOpen5} setIsModalOpen={setIsModalOpen5} />

      <ShowModal6
        params={{
          probeId: selectedDeviceForEdit?.probeId ? selectedDeviceForEdit?.probeId : '',
          hostIp: selectedDeviceForEdit?.hostIp ? selectedDeviceForEdit?.hostIp : '',
          hostName: selectedDeviceForEdit?.hostName ? selectedDeviceForEdit?.hostName : ''
        }}
        isModalOpen={isModalOpen6}
        setIsModalOpen={setIsModalOpen6}
      />

      <ShowModal7
        params={{
          deviceIds: selectedDevices.current.map(obj => obj.deviceId),
          deviceIdWiseData: deviceIdWiseDataObj,
          serviceIdWiseDetails: serviceIdWiseDetails
        }}
        isModalOpen={isModalOpen7}
        setIsModalOpen={setIsModalOpen7}
      />

      <ShowModal8 params={{
        deviceId: selectedDeviceForEdit?.deviceId ? selectedDeviceForEdit?.deviceId : '',
        deviceCategory: selectedDeviceForEdit?.type ? selectedDeviceForEdit?.type : '',
        discoveredBy: selectedDeviceForEdit?.accountable.userName ? selectedDeviceForEdit?.accountable.userName : '',
        macAddr: selectedDeviceForEdit?.macAddress ? selectedDeviceForEdit?.macAddress : '',
        modelId: uuidv4(),
        osName: selectedDeviceForEdit?.os ? selectedDeviceForEdit?.os : '',
        osType: selectedDeviceForEdit?.osType ? selectedDeviceForEdit?.osType : '',
        hostIp: selectedDeviceForEdit?.hostIp ? selectedDeviceForEdit?.hostIp : '',
        serviceIdWiseDetails: serviceIdWiseDetails
      }} isModalOpen={isModalOpen8} setIsModalOpen={setIsModalOpen8} />
      <ShowModal9 params={params9} isModalOpen={isModalOpen9} setIsModalOpen={setIsModalOpen9} />
      {
        customAlertVisible && <CustomAlertDialog title="Are you absolutely sure?" description="This action cannot be undone. This will permanently delete selected device" cancelText="Cancel" confirmText='Confirm' onConfirm={() => { setCustomAlertVisible(true); handleDelete() }} onCancel={() => { setCustomAlertVisible(false) }} />
      }

      {
        showStartDiscoveryConfirmation &&
        <CustomAlertDialog
          title="Basic Service Discovery"
          description="Start basic services discovery for the selected device"
          cancelText="Cancel"
          confirmText='Confirm'
          onConfirm={
            () => {
              //console.log('selected devices before render: ', selectedDevices);

              setSelectedDeviceForStartDiscovery(selectedDevices.current)

              setShowStartDiscoveryConfirmation(false);

              setIsModalOpen5(true);
            }
          }
          onCancel={
            () => {
              setShowStartDiscoveryConfirmation(false)
            }
          }
        />
      }
    </div>
  )
}

export default DiscoveredDevicesTable;