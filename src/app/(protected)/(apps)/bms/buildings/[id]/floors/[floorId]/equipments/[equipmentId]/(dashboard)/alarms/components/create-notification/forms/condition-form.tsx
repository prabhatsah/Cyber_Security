"use client"

import InputFormField from "@/app/(protected)/(apps)/bms/components/form-components/InputFormField";
import SelectFormField from "@/app/(protected)/(apps)/bms/components/form-components/SelectFormField";
import { Form, type UseFormReturn } from "react-hook-form"
import { useAlarms } from "../../../context/alarmsContext";

const getOperandConfig = (expressionInfo: any[], conditionInfo: any[], editConditionData: any | null) => {
    let configArr = [];
    for (let i = 0; i < expressionInfo.length; i++) {
        configArr.push({ label: expressionInfo[i].expName, value: expressionInfo[i].id });
    }
    for (let i = 0; i < conditionInfo.length; i++) {
        if (editConditionData && editConditionData.id === conditionInfo[i].id) {
            continue; // Skip the current condition if it matches the editConditionData id
        }
        configArr.push({ label: conditionInfo[i].conditionName, value: conditionInfo[i].id });
    }
    return configArr;
}

export function ConditionForm({ form, onClose }: { form: UseFormReturn<any>; onClose: () => void }) {
    const { expressionInfo, conditionInfo, editConditionData} = useAlarms()
    const operatorSelectConfig = [
        { label: "AND", value: "and" },
        { label: "OR", value: "or" },
    ]
    const operandConfig = getOperandConfig(expressionInfo, conditionInfo, editConditionData);

    return (
        <form className="space-y-2">
            <InputFormField form={form} name="conditionName" label="Condition Name" iconName="shield-alert" required={false} />
            <SelectFormField form={form} name="conditionOperand1" label="Operand 1" iconName="user" selectConfig={operandConfig} required={true} />
            <InputFormField form={form} name="thresholdCountAlertOperand1" label="Enter Value" iconName="list" required={false} />
            <SelectFormField form={form} name="conditionOperator" label="Operator" iconName="user" selectConfig={operatorSelectConfig} required={true} />
            <SelectFormField form={form} name="conditionOperand2" label="Operand 2" iconName="user" selectConfig={operandConfig} required={true} />
            <InputFormField form={form} name="thresholdCountAlertOperand2" label="Enter Value" iconName="list" required={false} />
        </form>
    )
}
