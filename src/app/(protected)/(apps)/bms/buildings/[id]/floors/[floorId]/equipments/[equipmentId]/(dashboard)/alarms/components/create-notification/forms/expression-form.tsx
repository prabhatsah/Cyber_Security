"use client"

import { Form, UseFormReturn } from "react-hook-form"
import InputFormField from '../../../../../../../../../../../components/form-components/InputFormField'
import TextareaFormField from '../../../../../../../../../../../components/form-components/TextareaFormField'
import SelectFormField from '../../../../../../../../../../../components/form-components/SelectFormField'
import { getDetailsForDropdowns, selectDeviceChange } from '../../../action'
import { useEffect, useState } from "react"
import { useAlarms } from "../../../context/alarmsContext"

const getSelectDeviceNameConfig = (devices: any[]) => {
    return devices.map((device) => ({
        label: device.hostName,
        value: device.hostIp,
    }))
}
const getServiceLabelConfig = (services: any[]) => {
    return services.map((service) => ({
        label: service.metricsName,
        value: service.serviceId,
    }))
}
const getServiceLabelConfig2 = (services: any[]) => {
    return services.map((service) => ({
        label: service,
        value: service,
    }))
}
const getServiceOperatorConfig = (conditionType: any) => {
    if (conditionType === "targetDevice") {
        return [
            { label: "=", value: "equal" },
            { label: "!=", value: "not_equal" },
        ]
    } else {
        return [
            { label: "=", value: "equal" },
            { label: "!=", value: "not_equal" },
            { label: ">", value: "greater_than" },
            { label: ">=", value: "greater_than_equal" },
            { label: "<", value: "less_than" },
            { label: "<=", value: "less_than_equal" },
        ]
    }
}

export function ExpressionForm({ form, onClose }: { form: UseFormReturn<any>; onClose: () => void }) {
    const { editData } = useAlarms()
    const [services, setServices] = useState<any[]>([]);
    const [serviceList, setServiceList] = useState<any[]>([]);
    const [devices, setDevices] = useState<any[]>([]);
    const [conditionType, setConditionType] = useState<string>('targetDevice');
    const [deviceIp, setDeviceIp] = useState<string>('');

    let serviceLabelConfig = getServiceLabelConfig(services);
    let serviceLabelConfig2 = getServiceLabelConfig2(serviceList);
    const selectDeviceNameConfig = getSelectDeviceNameConfig(devices);
    const serviceOperatorConfig = getServiceOperatorConfig(conditionType);
    const conditionTypeSelectConfig = [
        { label: "Condition by Service Status", value: "targetDevice" },
        { label: "Condition by Value", value: "probeDevice" },
    ]
    const subServiceLabelConfig = [
        { label: "any", value: "any" },
    ]
    const serviceStatusConfig = [
        { label: "Critical", value: "critical" },
        { label: "Warning", value: "warning" },
        { label: "Normal", value: "normal" },
    ]
    let associations = undefined;
    let obj: any = {
        // "id" : id ? id : uuid(),
        // "uid" : ref.uid,
        "isAssociation": associations ? true : false,
        "services": services,
        "devices": devices,
        // "expressionName": id && ref.exprList[id].expName ? ref.exprList[id].expName : "Expression Name"
    }

    useEffect(() => {
        if (editData) {
            setConditionType(editData.expType);
            setDeviceIp(editData.device);
        }
    }, [editData]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getDetailsForDropdowns()
            // let allServices = obj.associations ? Object.keys(serviceMap) : Object.values(data.serviceIdWiseDetails);
            // let allDevices = obj.associations ? Object.keys(deviceMap) : Object.values(data.deviceIdWiseDetails);
            obj.services = Object.values(data.serviceIdWiseDetails);
            obj.devices = Object.values(data.deviceIdWiseDetails);
            setServices(obj.services);
            setDevices(obj.devices);
            // console.log(data);
        }
        fetchData()
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            if(deviceIp) {
                const serviceArr = await selectDeviceChange(deviceIp, devices);
                setServiceList(serviceArr ?? []);
                console.log(serviceArr);
            }
        }
        if (deviceIp) fetchData();
    }, [deviceIp, devices])

    return (
        <form className="space-y-2">
            <InputFormField form={form} name="expName" label="Expression Name" iconName="shield-alert" required={false} />
            <SelectFormField form={form} name="expType" label="Condition Type" iconName="braces" selectConfig={conditionTypeSelectConfig} setSelectedState={setConditionType} required={true} />
            <SelectFormField form={form} name="device" label="Device Name" iconName="hard-drive" selectConfig={selectDeviceNameConfig} setSelectedState={setDeviceIp} required={true} />
            {deviceIp === "" ? <SelectFormField form={form} name="service" label="Select Service" iconName="stars" selectConfig={serviceLabelConfig} required={true} /> :
                <SelectFormField form={form} name="service" label="Select Service" iconName="stars" selectConfig={serviceLabelConfig2} required={true} />}
            {conditionType !== "probeDevice" ? <SelectFormField form={form} name="subService" label="Select Sub Service" iconName="stars" selectConfig={subServiceLabelConfig} required={true} /> : null}
            <SelectFormField form={form} name="operand" label="Select Operator" iconName="sliders" selectConfig={serviceOperatorConfig} required={true} />
            {conditionType === "probeDevice" ? <InputFormField form={form} dataType="number" name="value" label="Enter a value" iconName="edit" required={true} /> :
                <SelectFormField form={form} name="serviceProperty" label="Select Status" iconName="info" selectConfig={serviceStatusConfig} required={true} />
            }
        </form>
    )
}
