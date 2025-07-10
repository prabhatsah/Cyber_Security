'use client'

import { Dispatch, FC, SetStateAction } from "react"
import DeviceModalAddForm from "./DeviceModalAddForm";
import { DeviceIdWiseData, DeviceListDataType, params_DC, paramsType_DA, probleIdMapType, ProfileDataType, serviceDetails, serviceIdWiseDetailsType } from "../types";
import DeviceModalEditForm from "./DeviceModalEditForm";
import DeletedDeviceHistoryForm from "./DeletedDeviceHistoryForm";
import DevicePollingIntervalModal from "./DevicePollingIntervalModalForm";
import StartBasicServiceDiscovery from "./StartBasicServiceDiscovery";
import DeviceActivityLog from "./DeviceAcitvityLogModalForm";
import DeviceConfiguration from "./DeviceConfigurationModalForm";
import Device3DModalView from "./Device3DViewModalForm";
import DeviceDiscoveryHistory from "./DeviceDiscoveryHistoryModalForm";

interface CommomModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

interface ShowModalProps extends CommomModalProps{
  profileData: ProfileDataType;
  allActiveProbes: probleIdMapType | undefined;
}

interface ShowModalProps2 extends ShowModalProps {
  taskId: string;
  deviceData: DeviceListDataType | undefined
}

interface ShowModalProps3 extends CommomModalProps{
  profileData: ProfileDataType;
}

interface ShowModalProps4 extends CommomModalProps{
  deviceId: string | undefined;
  serviceIdWiseDetails: {
    [key: string] : serviceDetails
  };
  viewMode: boolean;
}

interface ShowModalProps5 extends CommomModalProps{
  deviceData: DeviceListDataType[];
}

interface ShowModalProps6 extends CommomModalProps{
  params: paramsType_DA
}
interface ShowModalProps7 extends CommomModalProps{
  params: params_DC
}

interface ShowModalProps8 extends CommomModalProps{
  params: {
    modelId : string;
    macAddr : string;
    discoveredBy : string;
    osType : string;
    osName : string;
    hostIp : string;
    deviceCategory : string;
    deviceId : string;
    serviceIdWiseDetails: serviceIdWiseDetailsType;
}
}

interface ShowModalProps9 extends CommomModalProps{
  params?: {
    deviceIdWiseData: DeviceIdWiseData
  }
}

export const ShowModal: FC<ShowModalProps> = ({profileData, allActiveProbes, isModalOpen, setIsModalOpen}) => {
    return(
        <>
            {
              isModalOpen && <DeviceModalAddForm
                open={!!isModalOpen}
                close={
                  () => (
                    setIsModalOpen(false)
                  )
                }
                refresh={
                  () => {
                    window.location.reload()
                  } 
                }
                profile={
                  profileData
                }
                probleIdWiseDetails={
                  allActiveProbes
                }
             />
            }
        </>
    )
}

export const ShowModal2: FC<ShowModalProps2> = ({deviceData, taskId, profileData, allActiveProbes, isModalOpen, setIsModalOpen}) => {
    return(
        <>
            {
              isModalOpen && deviceData && <DeviceModalEditForm
                open={!!isModalOpen}
                close={
                  () => (
                    setIsModalOpen(false)
                  )
                }
                refresh={
                  () => {
                    window.location.reload()
                  } 
                }
                profile={
                  profileData
                }
                probleIdWiseDetails={
                  allActiveProbes
                }
                deviceData={deviceData}
                taskId={taskId}
             />
            }
        </>
    )
}

export const ShowModal3: FC<ShowModalProps3> = ({profileData, isModalOpen, setIsModalOpen}) => {
  return (
    <>
      {
        isModalOpen && <DeletedDeviceHistoryForm
          open={!!isModalOpen}
          close={
            () => (
              setIsModalOpen(false)
            )
          }
          profile={
            profileData
          }
        />
      }
    </>
  )
}

export const ShowModal4: FC<ShowModalProps4> = ({isModalOpen, setIsModalOpen, deviceId, serviceIdWiseDetails, viewMode}) => {
  return (
    <>
      {
        isModalOpen && <DevicePollingIntervalModal
          open={!!isModalOpen} 
          close={
            () => {
              setIsModalOpen(false);
            }
          }
          deviceId={deviceId}
          refresh={
            () => {
              window.location.reload()
            } 
          }
          viewMode={viewMode}
          serviceIdWiseDetails={serviceIdWiseDetails}
        />
      }
    </>
  )
}

export const ShowModal5 : FC<ShowModalProps5> = ({isModalOpen, setIsModalOpen, deviceData}) => {
  return(
    <>
      {
        isModalOpen && <StartBasicServiceDiscovery
        open = {!!isModalOpen} 
        close = {
          () => {
            setIsModalOpen(false);
          }
        }
        deviceData = {deviceData}
        refresh={
          () => {
            window.location.reload()
          } 
        }
        probeIdWiseData={{}}
      />
      }
    </>
  )
}

export const ShowModal6 : FC<ShowModalProps6> = ({isModalOpen, setIsModalOpen, params}) => {
  return(
    <>
      {
        isModalOpen && <DeviceActivityLog
        open = {!!isModalOpen} 
        close = {
          () => {
            setIsModalOpen(false);
          }
        }
        params = {params}
        refresh={
          () => {
            window.location.reload()
          } 
        }
      />
      }
    </>
  )
}

export const ShowModal7 : FC<ShowModalProps7> = ({isModalOpen, setIsModalOpen, params}) => {
  return(
    <>
      {
        isModalOpen && <DeviceConfiguration
        open = {!!isModalOpen} 
        close = {
          () => {
            setIsModalOpen(false);
          }
        }
        params = {params}
        refresh={
          () => {
            window.location.reload()
          } 
        }
      />
      }
    </>
  )
}

export const ShowModal8 : FC<ShowModalProps8> = ({isModalOpen, setIsModalOpen, params}) => {
  return(
    <>
      {
        isModalOpen && <Device3DModalView
        open = {!!isModalOpen} 
        close = {
          () => {
            setIsModalOpen(false);
          }
        }
        params = {params}
        refresh={
          () => {
            window.location.reload()
          } 
        }
      />
      }
    </>
  )
}

export const ShowModal9 : FC<ShowModalProps9> = ({isModalOpen, setIsModalOpen, params}) => {
  return(
    <>
      {
        isModalOpen && <DeviceDiscoveryHistory
        open = {!!isModalOpen} 
        close = {
          () => {
            setIsModalOpen(false);
          }
        }
        params = {params}
      />
      }
    </>
  )
}