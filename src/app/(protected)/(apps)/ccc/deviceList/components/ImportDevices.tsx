'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  ImportedDeviceListType,
  ImportDevicesProps,
  probleIdMapType,
  ImportedDeviceIdWiseDetailsType,
} from "../types";
import { 
  //FieldValues, 
  useForm, 
  //UseFormSetValue 
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getMyInstancesV2,
  getDataForTaskId,
  mapProcessName,
  startProcessV2,
  getParameterizedDataForTaskId,
} from "@/ikon/utils/api/processRuntimeService";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { getAllProbesDetails } from "../../utils/preloader_functions";
import {
  getAllSubscribedSoftwares,
  getSoftwareIdByNameVersion,
} from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import CustomAlertDialog from "@/ikon/components/alert-dialog";

const importDevicesSchema = z.object({});

let probleIdMap: probleIdMapType | undefined;

const selectedDevice: ImportedDeviceListType[] = [];

const checkAddOrRemove = function(event: React.MouseEvent<HTMLInputElement>, deviceIdWiseData: ImportedDeviceIdWiseDetailsType | undefined, deviceId: string, existingDevices: string[], custAlert: Dispatch<SetStateAction<boolean>>){
  console.log("Clicked on checkAddOrRemove");
  if(event.currentTarget.checked){
    addDevice(deviceIdWiseData, deviceId, existingDevices, custAlert);
  }
  else{
    removeDevice(deviceIdWiseData, deviceId);
  }
}

const addDevice = function (deviceIdWiseData: ImportedDeviceIdWiseDetailsType | undefined, deviceId: string, existingDevices: string[], custAlert: Dispatch<SetStateAction<boolean>>) {
  if(!existingDevices.includes(deviceId)){
    if (deviceIdWiseData) {
      selectedDevice.push(deviceIdWiseData[deviceId]);

      const deviceLen = selectedDevice.length;

      //console.log('Added device: ', selectedDevice);
      //console.log(deviceLen)

      if(deviceLen==1){
        const submitBtn = document.getElementById('submitBtn') as HTMLInputElement;

        submitBtn.disabled = false;
      }
    }
  }
  else{
    custAlert(true);
  }
};

const removeDevice = function(deviceIdWiseData: ImportedDeviceIdWiseDetailsType | undefined, deviceId: string){
  if (deviceIdWiseData) {
    let deviceLen = selectedDevice.length;

    for(let i=0, len = deviceLen; i<len; i++){
      if(selectedDevice[i].data.deviceId === deviceId){
        selectedDevice.splice(i, 1)
        --deviceLen;
        break;
      }
    }

    //console.log('Removed device: ', selectedDevice);
    //console.log(deviceLen)

    if(!deviceLen){
      const submitBtn = document.getElementById('submitBtn') as HTMLInputElement;

      submitBtn.disabled = true;
    }
  }
}

const checkCompletion = function (deviceCount: number, currentCount: number, close: () => void) {
  if (deviceCount === currentCount) {
    console.log("Completed!!");
    close();
    window.location.reload();
  }
};

const invokeDevices = async function (close: () => void) {
  
  console.log('Clicked on invokeDevices');
  const processId = await mapProcessName({
    processName: "Configuration Item",
  });
  const devicesCount = selectedDevice.length;
  let completedCount = 0;

  for (let i = 0; i < devicesCount; i++) {
    const credentialId = selectedDevice[i].data.deviceCredentialID;
    const osType = selectedDevice[i].data.osType;

    await invokeRelatedCredential(credentialId, osType);

    //console.log('started device with data: ', selectedDevice[i].data, ', processId: ', processId)

    await startProcessV2({
      processId: processId,
      data: selectedDevice[i].data,
      processIdentifierFields: "deviceId,clientId,probeId,hostName,hostIp",
    });

    ++completedCount;
    checkCompletion(devicesCount, completedCount, close);
  }
};

const invokeRelatedCredential = async function (credentialId: string, osType: string) {
  const softwareName = "ITSM";
  const version = "1";
  let processName;
  const predefinedFilters = { taskName: "View credential" };
  const processVariableFilter = { credentialId: credentialId };

  if (osType == "Ssh") {
    processName = "SSH Credential Directory";
  } else if (osType == "Windows") {
    processName = "Windows Credential Directory";
  } else {
    processName = "SNMP Community Credential Directory";
  }

    const softwareId = await getSoftwareIdByNameVersion(softwareName, version);
    const accountId = await getActiveAccountId();
    const allSubsscribedSoftware = await getAllSubscribedSoftwares(accountId);

    //console.log('Current software id: ', softwareId);
    //console.log('All subscribed software id: ', allSubsscribedSoftware);

    return new Promise(async (resolve,reject) =>{
      try{
        let isSubscribed = false;
        for(let i=0, len = allSubsscribedSoftware.length; i<len; i++){
            if(allSubsscribedSoftware[i].SOFTWARE_ID == softwareId){
              isSubscribed = true;
                //reject("Subscription Error")
                break;
            }
        }

        if(!isSubscribed){
          reject("Subscription Error");
        }

        const data = await getMyInstancesV2({
          processName: 'Get ITSM Credentials'
        })

        //console.log('data: ', data);

        const itsmData = await getParameterizedDataForTaskId({
          taskId: data[0].taskId,
          parameters: {
            "targetCredDirectory":processName,
            "credentialId" : credentialId
          }
        })

         // @ts-expect-error : ignore
        if(itsmData.credentialData.length==0){
          throw new Error('Credential not found for the selected device')
        }

        //console.log('itsmData: ', itsmData);

        const credData = await getMyInstancesV2({
          processName: processName,
          predefinedFilters: predefinedFilters,
          processVariableFilters: processVariableFilter
        })

        //console.log('credData : ', credData);

        if(credData.length){
            reject("duplicate");
        }
        else{
          const processIdd = await mapProcessName({
            processName: processName
          })

          //console.log("datatata: ", itsmData.credentialData[0].data)

          // @ts-expect-error : ignore
          console.log('credential data started: ', itsmData.credentialData[0].data, ' processid: ', processIdd);

          await startProcessV2({
            processId: processIdd,
            // @ts-expect-error : ignore
            data: itsmData.credentialData[0].data,
            processIdentifierFields: "credentialId"
          })

          resolve("Credential Started");
        }
      }
    catch(err){
      console.error('error in invokeRelatedCredential: ', err);
    }
  })

};

function getExtraParams() {
  const extraParams: DTExtraParamsProps = {
    grouping: true,
    pageSize: 10,
    pageSizeArray: [10, 15, 20],
  };

  return extraParams;
}

function getColumns(deviceIdWiseData: ImportedDeviceIdWiseDetailsType | undefined, existingDevices: string[], custAlert: Dispatch<SetStateAction<boolean>>) {
  const columnDetailsSchema: DTColumnsProps<ImportedDeviceListType>[] = [
    {
      accessorKey: "data.deviceId",
      header: () => (
        <div style={{ textAlign: "center" }}>
          <input
            id="selectAllDevice"
            name="selecteAllDevices"
            type="checkbox"
          />
        </div>
      ),
      cell: ({ row }) => (
        <span>
          <input
            id={row.original.data.deviceId}
            name="selectedDevice"
            onClick={(e) => {
              //addDevice(deviceIdWiseData, row.original.data.deviceId);
              checkAddOrRemove(e, deviceIdWiseData, row.original.data.deviceId, existingDevices, custAlert);
            }}
            type="checkbox"
          />
        </span>
      ),
      enableGrouping: false,
      enableSorting: false,
    },
    {
      accessorKey: "data.hostName",
      header: "Device Name",
      cell: ({ row }) => <span>{row.original.data.hostName}</span>,
    },
    {
      accessorKey: "data.hostIp",
      header: "Host IP Address",
      cell: ({ row }) => <span>{row.original.data.hostIp}</span>,
    },
    {
      accessorKey: "data.classification",
      header: "Classification",
      cell: ({ row }) => <span>{row.original.data.classification}</span>,
    },
    {
      accessorKey: "data.accountable.userName",
      header: "Discovered By",
      cell: ({ row }) => <span>{row.original.data.accountable.userName}</span>,
    },
    {
      accessorKey: "data.descript",
      header: "Description",
      cell: ({ row }) => <span>{row.original.data.description}</span>,
    },
    {
      accessorKey: "data.macAddress",
      header: "MAC Address",
      cell: ({ row }) => <span>{row.original.data.macAddress}</span>,
    },
    {
      accessorKey: "data.probeId",
      header: "Probe",
      cell: ({ row }) => (
        <span>
          {probleIdMap && probleIdMap[row.original.data.probeId]
            ? probleIdMap[row.original.data.probeId]
            : "N/A"}
        </span>
      ),
    },
  ];

  return columnDetailsSchema;
}

async function fetchDeviceData() {
  const deviceDataInstance = await getMyInstancesV2<ImportedDeviceListType>({
    processName: "Get ITSM Imported Device",
    predefinedFilters: {
      taskName: "Imported Device Data",
    },
  });

  //console.log('Device data: ', deviceDataInstance);

  const deviceData = await getDataForTaskId<ImportedDeviceListType[]>({
    taskId: deviceDataInstance[0].taskId,
  });

  //console.log('Param data: ', deviceData);

  return deviceData;
}

const ImportDevices: FC<ImportDevicesProps> = ({ open, close, existingDevices }) => {
  const [deviceData, setDeviceData] = useState<ImportedDeviceListType[]>();
  const [deviceIdWiseData, setDeviceIdWiseData] = useState<ImportedDeviceIdWiseDetailsType>();
  const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);

  useEffect(() => {
    const probeDataPromise = getAllProbesDetails();
    const deviceDataPromise = fetchDeviceData();

    Promise.all([deviceDataPromise, probeDataPromise]).then(
      ([devicedata_, probeData_]) => {
        //console.log('device data: ', devicedata_);
        //console.log('probe data: ', probeData_);

        probleIdMap = probeData_?.activeProbeDetailsMap;

        // @ts-expect-error : ignore
        setDeviceData(devicedata_.deviceData);

        const deviceDetails: ImportedDeviceIdWiseDetailsType = {};

        // @ts-expect-error : ignore
        devicedata_.deviceData.forEach((device) => {
          deviceDetails[device.data.deviceId] = device;
        });

        setDeviceIdWiseData(deviceDetails);
      }
    ).catch((err)=>{
      console.log("Error in fetching data: ", err);
    });

  }, []);

  const form = useForm<z.infer<typeof importDevicesSchema>>({
    resolver: zodResolver(importDevicesSchema)
  });

  const columns = getColumns(deviceIdWiseData, existingDevices, setCustomAlertVisible);
  const extraParams = getExtraParams();

    // if(!deviceData){
    //   return(
    //       <div className="h-full mb-20">
    //         <LoadingSpinner />
    //       </div>
    //   )
    // }

  const onSubmit = (close: () => void) => {
    invokeDevices(close);
  };

  return (
    <>
      {
        customAlertVisible 
          && <CustomAlertDialog 
                title="Device already present" 
                description="Device is already present, please select another device" 
                cancelText="OK"  
                onCancel={
                  ()=>{
                    setCustomAlertVisible(false)
                  }
                } 
              />
      }
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="overflow-auto min-w-[max-content]">
          <DialogHeader>
            <DialogTitle>Import Devices</DialogTitle>
          </DialogHeader>
          <Separator />
          <DialogDescription>Check atleast one device</DialogDescription>
          <form
            onSubmit={form.handleSubmit(() => { onSubmit(close); })}
            className="space-y-2 h-[fit-content]"
          >
            {/* <DataTable
              data={deviceData}
              columns={columns}
              extraParams={extraParams}
            /> */}

            {
                !deviceData ? (
                    <div className="min-h-16">
                        <LoadingSpinner size={60} />
                    </div>
                ) : <DataTable data={deviceData} columns={columns} extraParams={extraParams} />
            }

            <Separator />

             <DialogFooter>
              <TextButtonWithTooltip
                tooltipContent="Submit"
                type="submit"
                disabled={true}
                id="submitBtn"
              >
                Import
              </TextButtonWithTooltip>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportDevices;
