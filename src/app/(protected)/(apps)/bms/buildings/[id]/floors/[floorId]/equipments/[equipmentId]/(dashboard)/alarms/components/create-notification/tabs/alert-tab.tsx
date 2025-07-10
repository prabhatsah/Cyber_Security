import { Form } from "@/shadcn/ui/form"
import { UseFormReturn } from "react-hook-form"
import InputFormField from '../../../../../../../../../../../components/form-components/InputFormField'
import TextareaFormField from '../../../../../../../../../../../components/form-components/TextareaFormField'
import SelectFormField from '../../../../../../../../../../../components/form-components/SelectFormField'
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { useEffect, useState } from "react"
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { fetchCommandCatalogData, getCommandData, setAPICredential } from "../../../action"; // Ensure this function returns a Promise<any[]> or update its implementation.
import { useAlarms } from "../../../context/alarmsContext"
import { AlertTabSkeleton } from "@/app/(protected)/(apps)/bms/alarms/components/skeleton/alert-tab-skeleton"
type DeletedCredHistoryTableDataType = {
    deletedBy: string,
    deletedOn: string,
    credentialName: string,
    credentialType: string,
    updatedOn: string,
    services: string,
    createdOn: string // Added createdOn property
}
export function AlertTab({ form }: { form: UseFormReturn<any> }) {
    const [userData, setUserData] = useState<any[]>([]);
    const [commandCatalogConfig, setCommandCatalogConfig] = useState<any[]>([]);
    const [apiCredentialConfig, setApiCredentialConfig] = useState<any[]>([]);
    const [commandCatalog, setCommandCatalog] = useState<string>('');
    const [commandActionType, setCommandActionType] = useState<string>('commandActionNo');
    const { editAlertData, viewMode } = useAlarms();
    let alertActionTypeConfig = [
        { label: "Email", value: "radioEmail" },
        { label: "Ticket", value: "radioTicket" },
        { label: "Both Email and Ticket", value: "radioBoth" },
    ]
    let commandActionTypeConfig = [
        { label: "Yes", value: "commandActionYes" },
        { label: "No", value: "commandActionNo" },
    ]
    useEffect(() => {
        if (editAlertData?.associatedCommandId) {
            setCommandActionType("commandActionYes");
            form.setValue("commandActionType", "commandActionYes");
            setCommandCatalog(editAlertData.associatedCommandId);
            form.setValue("apiId", editAlertData.apiId);
        }
    }, [editAlertData]);
    useEffect(() => {
        // API call to get deleted credential history
        getMyInstancesV2<DeletedCredHistoryTableDataType>({
            processName: 'Credential Delete History Process',
            predefinedFilters: { taskName: "View Delete Credential History" },
        }).then((instances) => {
            getUserIdWiseUserDetailsMap().then((res) => {
                let tempArr: any[] = [], tempObj: any = {};
                for (const item of Object.values(res)) {
                    tempObj['value'] = item.userId;
                    tempObj['label'] = item.userName;
                    tempArr.push(tempObj);
                    tempObj = {};
                }
                setUserData(tempArr);
            }).catch((error) => {
                console.log("Error in fetching user map", error)
            })

        }).catch((error) => {
            console.log("Error in fetching deleted credential history", error)
        })

    }, [])
    useEffect(() => {
        if (commandActionType === "commandActionYes") {
            async function getCommandCatalogData() {
                let commandAndCredentialData = await fetchCommandCatalogData();
                let commandCatalogData = commandAndCredentialData.commandCatalogData;
                let credentialDirectoryMongodata = commandAndCredentialData.credentialDirectoryMongodata;
                let commandDataConfig = getCommandData(commandCatalogData, credentialDirectoryMongodata);
                setCommandCatalogConfig(commandDataConfig);
                // console.log("Command Catalog Data Config", commandDataConfig);
                // console.log("commandCatalogConfig", commandCatalogConfig);
                if (commandCatalog) {
                    let apiCredentialConfiguration = setAPICredential(commandCatalog, commandCatalogData, credentialDirectoryMongodata);
                    console.log( "apiCredentialConfiguration", apiCredentialConfiguration);
                    setApiCredentialConfig(apiCredentialConfiguration);
                }
            }
            getCommandCatalogData();
        }
    }, [commandActionType, commandCatalog]);
    if (userData.length === 0) {
        return <AlertTabSkeleton />
    }
    return (
        <>
            {<Form {...form}>
                <form className="space-y-2">
                    <SelectFormField form={form} name="alertActionType" label="Alert Type" iconName="braces" selectConfig={alertActionTypeConfig} viewMode={viewMode} required={true} />
                    <SelectFormField form={form} name="commandActionType" label="Act upon event?" iconName="braces" selectConfig={commandActionTypeConfig} setSelectedState={setCommandActionType} viewMode={viewMode} required={true} />
                    {commandActionType === "commandActionYes" &&
                        <>
                            <SelectFormField form={form} name="associatedCommandId" label="Command Catalog" iconName="braces" selectConfig={commandCatalogConfig} setSelectedState={setCommandCatalog} viewMode={viewMode} required={true} />
                            <SelectFormField form={form} name="apiId" label="API Credential" iconName="braces" selectConfig={apiCredentialConfig} viewMode={viewMode} required={true} />
                        </>
                    }
                    <InputFormField form={form} name="alertSubject" label="Subject" iconName="book" viewMode={viewMode} required={true} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormMultiComboboxInput
                            formControl={form.control}
                            name="userSelected"
                            label="Select Users"
                            placeholder="Choose Users"
                            items={userData}
                            onSelect={(selectedValues) => console.log("Selected Values:", selectedValues)}
                            disabled={viewMode}
                        // formDescription="You can select multiple options."
                        />
                        <FormMultiComboboxInput
                            formControl={form.control}
                            name="recipientGroup"
                            label="Select Recipient Group"
                            placeholder="Choose Recipient Group"
                            items={
                                [
                                    {
                                        value: 'clientEditor_',
                                        label: "Editor"
                                    },
                                    {
                                        value: 'clientViewer_',
                                        label: "Viewer"
                                    }
                                ]
                            }
                            onSelect={(selectedValues) => console.log("Selected Values:", selectedValues)}
                            disabled={viewMode}
                        // formDescription="You can select multiple options."
                        />
                    </div>
                    {/* <RecipientGroupDatatable form={form} /> */}
                    {/* <UserAccessDatatable form={form} /> */}
                    <InputFormField form={form} name="alertAddress" label="Email Address" iconName="mail" viewMode={viewMode} required={true} />
                    <TextareaFormField form={form} name="alertEmailBody" label="Email Body" iconName="file-text" viewMode={viewMode} required={true} />
                </form>
            </Form>
            }
        </>
    )
}
