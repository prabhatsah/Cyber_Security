"use client"

import { UseFormReturn } from "react-hook-form"
import InputFormField from '../../../../../../../../../../../components/form-components/InputFormField'
import TextareaFormField from '../../../../../../../../../../../components/form-components/TextareaFormField'

export function BasicDettailsForm({ form }: { form: UseFormReturn<any> }) {
    const { viewMode } = useAlarms();
    return (
        <form className="space-y-2">
            <InputFormField form={form} name="notification_name" label="Rule Name" iconName="sticky-note" viewMode={viewMode} required={true} />
            <InputFormField form={form} dataType="number" name="threshold_breach_count" label="Threshold Breach Count" iconName="shield-alert" viewMode={viewMode} required={true} />
            <InputFormField form={form} dataType="number" name="frequency_of_occurence" label="Frequency of Occurence" iconName="list" viewMode={viewMode} required={true} />
            <InputFormField form={form} dataType="number" name="notification_evaluation_interval" label="Evaluation Interval" iconName="hourglass" viewMode={viewMode} required={true} />
            <TextareaFormField form={form} name="description" label="Description" iconName="file-text" viewMode={viewMode} required={true} />
        </form >
    )
}
