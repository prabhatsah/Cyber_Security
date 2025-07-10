"use client";

//Ikon Components & functions
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { InstanceV2Props } from "@/ikon/utils/api/processRuntimeService/type";
import { IconTextButton } from "@/ikon/components/buttons";
import { LoadingSpinner } from '@/ikon/components/loading-spinner'
import { getProfileData } from "@/ikon/utils/actions/auth";

// Shadcn Components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";


// Lucide Components
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";


// React Hooks
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Custom Types
import { DeviceListDataType, probleIdMapType, DeviceIdWiseDetailsType, ProfileDataType, RoleMembershipInfoType, RoleType } from "./types";


// Custom Components
import { DeviceContext } from "./contexts/DeviceContext";
import DeviceModalViewForm from "./components/DeviceModalViewForm";
import DeviceModalAddEditForm from "./components/DeviceModalEditForm";
import DeviceModalAddForm from "./components/DeviceModalAddForm";
import { TableToolButton_Add, TableToolButton_Upload, TableToolButton_Import } from "./components/TableToolButtons";


// Preloader functions
import { getAllProbesDetails } from "../utils/preloader_functions";
import CustomAlertDialog from "@/ikon/components/alert-dialog";
import UploadDeviceFile from "./components/UploadDeviceFile";
import ImportDevices from "./components/ImportDevices";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import RoleMembershipInfo from "@/app/(protected)/(base-app)/setting/users/components/roleMembershipInfo";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";

/* Global functions and variables : START */
  type DeviceModalType = 'view' | 'edit' | 'add' | 'fileUpload' | 'importDevice';

  type ParamsType = {
    profile: ProfileDataType,
    probleIdWiseDetails: probleIdMapType | undefined,
    clientId: string
  }

  let probleIdMap: probleIdMapType | undefined;
  let profile : ProfileDataType;

  type accessType = {
    canAddDevice: boolean,
    setCanAddDevice : Dispatch<SetStateAction<boolean>>
  }

  let existingDevices: string[];

  // Datatable related functions : START
  function getExtraParams(showDeviceInfo: (deviceId: string | null) => void, modaltype: (type: DeviceModalType) => void, access: accessType){
    const extraParams: DTExtraParamsProps = {
        grouping: true,
        extraTools: [
          <TableToolButton_Add key='deviceAddButton' classes={access.canAddDevice ? '' : 'hidden'} onclick={()=>{showDeviceInfo('1'); modaltype('add') }} />,
          <TableToolButton_Upload key='deviceUploadButton' classes={access.canAddDevice ? '' : 'hidden'} onclick={()=>{showDeviceInfo('1'); modaltype('fileUpload') }} />,
          <TableToolButton_Import key='deviceImportButton' classes={access.canAddDevice ? '' : 'hidden'} onclick={()=>{showDeviceInfo('1'); modaltype('importDevice') }} />
        ],
        pageSize: 10,
        pageSizeArray: [10, 15, 20, 25, 50, 100],
    };

    return extraParams;
  }

  function getColumns(showDeviceInfo: (deviceId: string) => void, modaltype: (type: DeviceModalType) => void, deleteConfirmation:(ip: string) => void, access: accessType) {
    const columnDetailsSchema: DTColumnsProps<DeviceListDataType>[] = [
      
      {
          accessorKey: "data.hostName",
          header: 'Device Name',
          cell: ({ row }) => (
            <span>{row.original.data.hostName}</span>
          ),
      },
      {
          accessorKey: "data.hostIp",
          header: 'Host IP Address',
          cell: ({ row }) => (
            <span>{row.original.data.hostIp}</span>
          ),
      },
      {
          accessorKey: "data.classification",
          header: 'Classification',
          cell: ({ row }) => (
            <span>{row.original.data.classification}</span>
          ),
      },
      {
          accessorKey: "data.os",
          header: 'OS',
          cell: ({ row }) => (
            <span>{ trimNewline(row.original.data.os)}</span>
          ),
      },
      {
          accessorKey: "data.accountable.userName",
          header: 'Discovered By',
          cell: ({ row }) => (
            <span>{row.original.data.accountable.userName ? row.original.data.accountable.userName : 'N/A'}</span>
          ),
      },
      {
          accessorKey: "",
          header: 'Probe',
          cell: ({ row }) => (
            <span>{probleIdMap && probleIdMap[row.original.data.probeId] ? probleIdMap[row.original.data.probeId] : "N/A"}</span>
          ),
      },
      {
          accessorKey: "data.discoverDateAndTime",
          header: 'Discovered Time',
          cell: ({ row }) => (
            <span>{getFormattedDate(row.original.data.discoverDateAndTime)}</span>
          ),
      },
      {
          accessorKey: "data.dryRunAccessable",
          header: 'Test device',
          cell: ({ row }) => (
            <span>{row.original.data.dryRunAccessable}</span>
          ),
      },
      {
          accessorKey: "data.deviceId",
          header: 'Action',
          enableGrouping: false,
          enableSorting: false,
          cell: ({row}) => (
            <span>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <IconTextButton variant="ghost" size="icon">
                      <MoreHorizontal className="w-5 h-5" />
                      </IconTextButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem  onClick={() => { showDeviceInfo(row.original.data.deviceId); modaltype('view') }}><Eye /> View</DropdownMenuItem>
                      <DropdownMenuItem className={access.canAddDevice ? '' : 'hidden'}  onClick={() => { showDeviceInfo(row.original.data.deviceId); modaltype('edit') }}><Pencil /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className={access.canAddDevice ? '' : 'hidden'}  onClick={() => { deleteConfirmation(row.original.data.hostIp) }}><Trash2 /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </span>
          ),
      }
      
    ];

    return columnDetailsSchema;
  }
  // Datatable related functions : END


  // Data related function : START
  async function fetchDeviceData() {
    try{
      const deviceData = await getMyInstancesV2<DeviceListDataType>({
        processName: "Configuration Item",
        predefinedFilters: {
          taskName: "Update CI Acivity"
        }
      });
  
      //console.log('Device data: ', deviceData);
  
      return deviceData;
    }
    catch(err){
      console.error('error in fetchDeviceData: ', err)
      return [];
    }
  }

  async function fetchRoleData(access: accessType){
    const softwareName = "CCC";
    const version = "1";
    const softwareId = await getSoftwareIdByNameVersion(softwareName, version);
    const roleData = await RoleMembershipInfo({
      userId: profile.USER_ID
    }) as RoleMembershipInfoType[];

    const currentRole = roleData ? roleData.filter(role => role.SOFTWARE_ID == softwareId) : [];

    if(currentRole.length){
      setAccessControl(currentRole[0].ROLE_NAME, access)
    }

    return roleData;
  }
  
  // Data related function : END

  // Utility functions : START
  function trimNewline(input: string | null) {
    if (input) {
      const trimmed = input.replace(/\\n|\\l/g, "").trim();
      return trimmed;
    }
    else{
      return "";
    }
    
  }

  function getFormattedDate(date: string) {
      const d = new Date(date);

      return d.getFullYear() +
        "-" + String(d.getMonth() + 1).padStart(2, "0") +
        "-" + String(d.getDate()).padStart(2, "0") +
        " " + String(d.getHours()).padStart(2, "0") +
        ":" + String(d.getMinutes()).padStart(2, "0") +
        ":" + String(d.getSeconds()).padStart(2, "0");
  }
  // Utility functions: END

  // Access control : START

  function setAccessControl(roles: RoleType, access: accessType){
    const setAccessForSysAdmin = () => {
        console.log('set access for sys admin');
    }
    
    const setAccessForSysView = () => {
      console.log('set access for sys viewer')

      access.setCanAddDevice(false);
    }

    const setAccessForCmdAdmin = () => {
      console.log('set access for cmd admin')
      access.setCanAddDevice(false);
    }

    const setAccessForAssetAdmin = () => {
      console.log('set access for asset admin')
    }

    switch(roles){
      case 'System Viewer':
        setAccessForSysView();
        break;

      case 'System Administrator':
        setAccessForSysAdmin();
        break;
        
      case 'Command Administrator':
        setAccessForCmdAdmin();
        break;
        
      case 'Asset Administrator':
        setAccessForAssetAdmin();
        break;  
    }

  }

  // Access control : END

/* Global functions and variables : END */

// Main Component
export default function DeviceList() {
    const [deviceData, setDeviceData] = useState<InstanceV2Props<DeviceListDataType>[]>();
    const [deviceIdWiseData, setDeviceIdWiseData] = useState<DeviceIdWiseDetailsType | undefined>(undefined);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<DeviceModalType>('view');

    const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
    const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

    const [profileData, setProfileData] = useState<ProfileDataType>();
    const [canAddDevice, setCanAddDevice] = useState<boolean>(true);

    const [accountId, setAccountId] = useState<string>('');

    const showModal = function(deviceId: string | null, deviceIdWiseData : DeviceIdWiseDetailsType | undefined, modalType: DeviceModalType, params: ParamsType){
  
      if(deviceId && deviceIdWiseData){
        switch(modalType){
          case 'view':
            return(
              <DeviceModalViewForm
                deviceData={deviceIdWiseData[deviceId]}
                open={!!selectedDeviceId}
                close={() => setSelectedDeviceId(null)}
                profile={params.profile}
                probleIdWiseDetails={params.probleIdWiseDetails}
                clientId={params.clientId}
              />
            )
          
          case 'edit':
            return(
              <DeviceModalAddEditForm
                deviceData={deviceIdWiseData[deviceId]}
                open={!!selectedDeviceId}
                close={() => setSelectedDeviceId(null)}
                //refresh={() => setRefreshCount((prev)=>++prev)}
                refresh={() => {window.location.reload()} }
                profile={params.profile}
                probleIdWiseDetails={params.probleIdWiseDetails}
              />
            )

          case 'add':
            return(
              <DeviceModalAddForm
                open={!!selectedDeviceId}
                close={() => setSelectedDeviceId(null)}
                //refresh={() => setRefreshCount((prev)=>++prev)}
                refresh={() => {window.location.reload()} }
                profile={params.profile}
                probleIdWiseDetails={params.probleIdWiseDetails}
                clientId={params.clientId}
              />
            )
            
            
          case 'fileUpload':
            return(
              <UploadDeviceFile
                open={!!selectedDeviceId}
                close={() => setSelectedDeviceId(null)}
                //refresh={() => setRefreshCount((prev)=>++prev)}
                refresh={() => {window.location.reload()} }
                file = ''
              />
            )
            
          case 'importDevice':
            return(
                <ImportDevices
                    open={!!selectedDeviceId}
                    close={() => setSelectedDeviceId(null)}
                    //refresh={() => setRefreshCount((prev)=>++prev)}
                    refresh={() => {window.location.reload()} }
                    existingDevices={existingDevices}
                    clientId={params.clientId}
                />
            )  
        }
      }
    }

    const deleteConfirmation = function(ip: string){
      //console.log('clicked deleteConfirmation');
      
      setCustomAlertVisible(true);
      setDeviceToDelete(ip);
    }

    const handleDelete = async function(){
        const deviceIP = deviceToDelete;

        console.log('Device ip to delete: ', deviceIP);
        setCustomAlertVisible(false);

        try{

            const data = await getMyInstancesV2<DeviceListDataType>({
                    processName: 'Configuration Item',
                    predefinedFilters: {
                        taskName: 'Delete Activity'
                    },
                    processVariableFilters : {
                        'hostIp' : deviceIP
                    }
                });

            console.log('Fetched data: ', data);

            // @ts-expect-error : ignore
            data[0].softDeletedOn = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');


            const data2 = await invokeAction({
                taskId : data[0].taskId,
                transitionName: 'Update Delete Activity',
                processInstanceIdentifierField: '',
                data: data[0].data
            })

            console.log('Device deleted: ', data2);

            const extractedData = data.map((obj)=>(
                {
                    // @ts-expect-error : ignore
                    hostName: obj.data.hostName,
                    // @ts-expect-error : ignore
                    hostIp: obj.data.hostIp,
                    // @ts-expect-error : ignore
                    description: obj.data.description,
                    // @ts-expect-error : ignore
                    os: obj.data.os,
                    // @ts-expect-error : ignore
                    type: obj.data.type,
                    status: "Ongoing",
                    deleteDataAndTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
                    // @ts-expect-error : ignore
                    deviceId: obj.data.deviceId,
                    // @ts-expect-error : ignore
                    clientId: obj.data.clientId,
                    accountable: {
                        userId:  profileData ? profileData.USER_ID : 'N/A',
                        userName: profileData ? profileData.USER_NAME : 'N/A',
                    },
                }
            ))

            const deleteData = {
                [extractedData[0].deviceId] : extractedData[0]
            }

            const deleteDeviceHistoryData = {
                "deleteDeviceData": deleteData
            }

            console.log('delete device data: ', deleteDeviceHistoryData);

            const processId = await mapProcessName({
                processName: "Device Delete History Process CCC"
            })

            const data3 = await startProcessV2({
                processId: processId,
                processIdentifierFields: "probeId,clientId,deviceId",
                data: deleteDeviceHistoryData
            });

            console.log('Device Delete History Process CCC started', data3);

            window.location.reload();
        }
        catch(err){
            console.error('Error in handleDelete: ', err);
        }
    }

    
    const access = {
      canAddDevice: canAddDevice,
      setCanAddDevice: setCanAddDevice
    } as accessType
   
    const extraParams = getExtraParams(setSelectedDeviceId, setModalType, access);
    const columns = getColumns(setSelectedDeviceId, setModalType, deleteConfirmation, access);

    useEffect(
        ()=>{
              try{
                const promise1 = getAllProbesDetails();
                const promise2 = fetchDeviceData();
                const profileData_ = getProfileData();
                const accountData = getActiveAccountId();

                Promise.all([
                    promise1,
                    promise2,
                    profileData_,
                    accountData
                ]).then(([data1, data2, profileData, accountData])=>{
                    const getCurrentAccountId_ = accountData;

                    setAccountId(getCurrentAccountId_);

                    //console.log('probe data: ', data1);
                    probleIdMap = data1?.activeProbeDetailsMap;

                    //console.log('Profile data: ', profileData);
                    profile = profileData as ProfileDataType;

                    setProfileData(profile);

                    //console.log('probeid map: ', probleIdMap)

                    const deviceDetails: DeviceIdWiseDetailsType = {};
                    existingDevices = [];
                    data2.forEach((device)=>{
                        {/* @ts-expect-error : data hallucination */ }
                        deviceDetails[device.data.deviceId] = device;
                        {/* @ts-expect-error : data hallucination */ }
                        existingDevices.push(device.data.deviceId);
                    })

                    const roleData = fetchRoleData(access);

                    roleData.then(()=>{
                      //console.log('role data: ', data);

                      setDeviceData(data2);
                      setDeviceIdWiseData(deviceDetails);
                    });

                })

              }catch(err){
                  console.error('error in useEffect DeviceList: ', err)
              }

            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
    );

    const params : ParamsType = {
      profile: profile,
      probleIdWiseDetails: probleIdMap,
      clientId: accountId
    }

    if(!deviceData){
        return(
            <div className="h-full">
              <LoadingSpinner />
            </div>
        )
    }

    //console.log('SelectedDeviceId: ', selectedDeviceId, ', ModalType: ', modalType);

    return(
      <>
          <RenderAppBreadcrumb
            breadcrumb={{ level: 2, title: "Device List", href: "/deviceList" }}
           />

          <DeviceContext.Provider value={{deviceIdWiseData, setDeviceIdWiseData}}>

            {
              showModal(selectedDeviceId, deviceIdWiseData, modalType, params)
            }

          </DeviceContext.Provider>

          {
            customAlertVisible && <CustomAlertDialog title="Are you absolutely sure?" description="This action cannot be undone. This will permanently delete selected device" cancelText="Cancel" confirmText='Confirm' onConfirm={()=>{setCustomAlertVisible(true); handleDelete() }} onCancel={()=>{setCustomAlertVisible(false)}} />
          }

          {/* @ts-expect-error : data hallucination */ }
          <DataTable  data={deviceData} columns={columns} extraParams={extraParams}/>
            
      </>
    )
}
