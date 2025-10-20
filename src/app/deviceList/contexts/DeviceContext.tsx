// contexts/DeviceContext.tsx
import { createContext, Dispatch, SetStateAction } from "react";
import { InstanceV2Props } from "@/ikon/utils/api/processRuntimeService/type";
import { DeviceListDataType } from "../types";

type DeviceIdWiseDetailsType = {
  [key: string]: InstanceV2Props<DeviceListDataType>;
};

interface DeviceContextType {
  deviceIdWiseData?: DeviceIdWiseDetailsType;
  setDeviceIdWiseData: Dispatch<SetStateAction<DeviceIdWiseDetailsType | undefined>>;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);