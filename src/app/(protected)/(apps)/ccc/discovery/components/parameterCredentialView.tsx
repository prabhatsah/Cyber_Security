import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Eye, FileLock, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useRef, useState } from "react";

import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";

import { getProfileData } from "@/ikon/utils/actions/auth";
import { deleteProcessInstance, getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { useGlobalCred } from "../actions/context/credContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import InputToken from "./inputToken";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import UserAccess from "./userAccess";
import  Alert  from "@/ikon/components/alert-dialog";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { toast } from "@/shadcn/hooks/use-toast";

type ParameterCredentialViewProps = {
  credentialData: any;
};

const ParameterCredentialView = forwardRef<HTMLButtonElement, ParameterCredentialViewProps>(
  ({ credentialData }, ref) => {
    // Parameter schema keys
    const parameterSchemaKeys = ["key", "value", "selectValueType"];

    let currentCredentialSchema: Record<string, any> = {};
    let defaultValues: Record<string, any> = {};

    //contexts
    const { globalCredData, setGlobalCredData } = useGlobalCred();

    //states
    const [allUsers, setAllUsers] = useState<object[]>([]);
    const [userId, setUserId] = useState<string>("");
    const [authorizedPersons, setAuthorizedPersons] = useState<string[]>([]);
    const [commands,setCommands] = useState<Object[]>([])
    const [changeUserAccess, setChangeUserAccess] = useState(false);
    const [deleteCredential, setDeleteCredential] = useState(false);
    const [deletingCredential, setDeletingCredential] = useState<any>({});
    const [submit,setSubmit] = useState<boolean>(false)
    //refs
    const submitTokenRef = useRef(null)
    const submitUserAccess = useRef(null)

    // Define schema and default values for each credential entry
    credentialData.forEach((cred: any) => {
      const mainField = `credentialName_${cred.credentialId}`;
      currentCredentialSchema[mainField] = z.string();
      defaultValues[mainField] = cred.credentialName;

      const associated_commands_field = `associated_commands_${cred.credentialId}`
      currentCredentialSchema[associated_commands_field] = z.array(z.string())
      defaultValues[associated_commands_field] = cred.associatedMetrics
      cred.ApiCredProperties.forEach((prop: any) => {
        parameterSchemaKeys.forEach((key: string) => {
          const fieldName = `${key}_${cred.credentialId}_${prop.uniqueIdForInput}`;
          currentCredentialSchema[fieldName] = z.string();
          defaultValues[fieldName] = prop[key];
        });
      });
    });

    const schema = z.object(currentCredentialSchema);
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues,
    });
    debugger
    console.log(form.formState)
    useEffect(() => {
      const getProfile = async () => {
        const profile = await getProfileData();
        setUserId(profile.USER_ID);
      };//getting profile data
      const getAllUsers = async () => {
        const allUsers = await getUserIdWiseUserDetailsMap();
        setAllUsers(Object.values(allUsers));
      };//getting all the users
      const getCommands = async()=>{
        const commandData = await getMyInstancesV2({
          processName:'Command Catalog',
          predefinedFilters:{taskName:'View Commands'}
        })
        setCommands(commandData.map(e=>e.data))
      }//getting commands
      

      getProfile();
      getAllUsers();
      getCommands();

    }, []);

    async function saveCredential_(values: z.infer<typeof schema>) {
      const profileData = await getProfileData();
      const processId = await mapProcessName({
        processName: "Parameter Credential Directory",
      });
      let cachedData = globalCredData["Parameter"];
      // Process each credential and its ApiCredProperties.
      credentialData.forEach(async (cred: any) => {
        if (cred.new) {
          const updatedMainData = {
            credentialId: cred.credentialId.toString(),
            credentialName: values[`credentialName_${cred.credentialId}`],//cred.credentialName,
            clientAccess: [profileData.USER_ID],
            associatedMetrics:values[`associated_commands_${cred.credentialId}`]
          };
          // Process ApiCredProperties if needed
          const updatedApiProps = cred.ApiCredProperties.map((prop: any) => {
            const updatedProp: any = {};
            parameterSchemaKeys.forEach((key: string) => {
              updatedProp[key] = values[`${key}_${cred.credentialId}_${prop.uniqueIdForInput}`]; 
            });
            return updatedProp;
          });
          cachedData = cachedData.map(e=>{
            e = e.credentialId === cred.credentialId?  {
              updatedMainData,
              ApiCredProperties: updatedApiProps
            }: e
            return e 
            
          })
          await startProcessV2({
            processId,
            data: { ...updatedMainData, ApiCredProperties: updatedApiProps },
            processIdentifierFields: "clientId,credentialId",
          });
        }
        if (cred.updated) {
          debugger
          // const updatedData = {
          //   credentialId: cred.credentialId,
          //   credentialName: cred.credentialName, //values[`credentialName_${cred.credentialId}`],
          //   userName: cred.userName, //values[`userName_${cred.credentialId}`],
          //   password: cred.password, //values[`password_${cred.credentialId}`],
          //   clientAccess: cred.clientAccess,
          // };
          const updatedMainData = {
            credentialId: cred.credentialId,
            credentialName: cred.credentialName, //values[`credentialName_${cred.credentialId}`],
            userName: cred.userName, //values[`userName_${cred.credentialId}`],
            password: cred.password, //values[`password_${cred.credentialId}`],
            clientAccess: cred.clientAccess,
            associatedMetrics:cred.associatedMetrics
            
          };
          // Process ApiCredProperties if needed
          // const updatedApiProps = cred.ApiCredProperties.map((prop: any) => {
          //   const updatedProp: any = {};
          //   parameterSchemaKeys.forEach((key: string) => {
          //     updatedProp[key] = cred.credentialId.ApiCredProperties[key] //values[`${key}_${cred.credentialId}_${prop.uniqueIdForInput}`]; 
          //   });
          //   return updatedProp;
          // });

          //invokeAction
          cachedData = cachedData.map(e => {
            e = e.credentialId === cred.credentialId ? {
              updatedMainData,
              ApiCredProperties: cred.ApiCredProperties,
            } : e
            return e

          })

          await invokeAction({
            taskId: cred.taskId,
            transitionName: "Update View Credential",
            data: {...updatedMainData, ApiCredProperties: cred.ApiCredProperties},
            processInstanceIdentifierField: "clientId,credentialId",
          });
        }
      });
    }

    const {handleSubmit} = useForm()

    return (
      <>
       {deleteCredential && (
          <Alert
            cancelText="No"
            confirmText="Yes"
            title={`Are you sure you want to delete ${deletingCredential.credentialName}?`}
            onConfirm={() => {
              setDeleteCredential(false);
              deleteProcessInstance({
                processInstanceId:deletingCredential.processInstanceId
              }).then(()=>{
                const updatedCredData = globalCredData["SNMP"].filter(
                  (cred) => cred.credentialId !== deletingCredential.credentialId
                );
                setGlobalCredData({ ...globalCredData, Parameter: updatedCredData });
                toast({
                  title:'Success',
                  description:`${deletingCredential.credentialName} deleted successfully`
                })
              }).catch(()=>{
                
              })
              
            }}
            onCancel={() => {
              setDeletingCredential({});
              setDeleteCredential(false);
            }}
          />
        )}
        {form.formState.isValid && submit && <Alert cancelText="No" confirmText="Yes" title={"Do you want to save the changes?"} onConfirm={
                ()=>{
                    
                        handleSubmit(saveCredential_)()
                    
                }
            } onCancel={()=>{
                setSubmit(false)
            } }
            />} 
      {authorizedPersons.length > 0 && !authorizedPersons.includes(userId) && (
          <Alert
            title={"Sorry! You don't have access"}
            description={`Please contact the following: 
              ${authorizedPersons
                .map((user) =>
                  allUsers.find((userData: any) => userData.userId === user)?.userName
                )
                .join(", ")}`}
            onConfirm={() => {
              setAuthorizedPersons([]);
            }}
            confirmText="Ok"
          />
        )}
      <Form {...form}>
        <form>
          <div className="w-full space-y-4">
            {credentialData.map((cred: any, index: number) => (
              <div key={index} className="border rounded-md p-2 shadow-sm">
                <div className="flex justify-end relative z-50">
                  <IconTextButtonWithTooltip
                    tooltipContent="Add Credential Property"
                    type="button"
                    disabled={!cred.new}
                    onClick={() => {
                      const currentCredentialData = globalCredData["Parameter"];
                      const updatedAPIcredData = currentCredentialData.map((e) => {
                        if (e.credentialId === cred.credentialId) {
                          e.ApiCredProperties.push({
                            uniqueIdForInput: new Date().getTime(),
                            key: null,
                            value: null,
                            selectValueType: null,
                          });
                        }
                        return e;
                      });
                      setGlobalCredData({
                        ...globalCredData,
                        Parameter: updatedAPIcredData,
                      });
                    }}
                  >
                    <Plus />
                  </IconTextButtonWithTooltip>
                </div>
                <div className="w-full flex justify-between items-end">
                  <div className="w-1/2">
                    <FormInput
                      label="Credential Name"
                      name={`credentialName_${cred.credentialId}`}
                      disabled={!cred.new}
                      formControl={form.control}
                    />
                  </div>
                  <div className="w-1/2 h-[36px] flex justify-start">
                  <IconTextButtonWithTooltip
                        tooltipContent="Delete Credential"
                        type="button"
                        className="me-2 ms-2"
                        onClick={() => {
                          setDeletingCredential(cred);
                          setDeleteCredential(true);
                        }}
                      >
                        <Trash2 />
                      </IconTextButtonWithTooltip>

                      <Dialog>
                        <DialogTrigger asChild>
                          <IconTextButtonWithTooltip
                          type="button"
                            tooltipContent="User Access"
                            onClick={() => setChangeUserAccess(true)}
                          >
                            <FileLock />
                          </IconTextButtonWithTooltip>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>User Access</DialogTitle>
                            <DialogDescription>
                              Make changes to user access for credential here.
                            </DialogDescription>
                          </DialogHeader>
                          <UserAccess
                            currentAccess={cred.clientAccess}
                            type="SSH"
                            forCredential={cred.credentialId}
                            ref={submitUserAccess}
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              onClick={() => {
                                submitUserAccess.current?.click();
                              }}
                            >
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </div>
                </div>
                

                {cred.ApiCredProperties.map((prop: any, idx: number) => (
                  <div key={idx} className="mt-2 flex flex-col gap-2 mb-2">
                    <div className="flex items-end gap-4">
                      <div className="w-1/4">
                        <FormInput
                          label="Key"
                          name={`key_${cred.credentialId}_${prop.uniqueIdForInput}`}
                          disabled={!cred.new}
                          formControl={form.control}
                        />
                      </div>
                      <div className="w-1/4">
                        <FormInput
                          label="Value"
                          name={`value_${cred.credentialId}_${prop.uniqueIdForInput}`}
                          disabled={!cred.new}
                          formControl={form.control}
                          type={prop.selectValueType}
                        />
                      </div>
                      <div className="w-1/4">
                        <FormComboboxInput
                          label="Type"
                          name={`selectValueType_${cred.credentialId}_${prop.uniqueIdForInput}`}
                          formControl={form.control}
                          disabled={!cred.new}
                          items={[
                            { value: "text", label: "Text" },
                            { value: "password", label: "Password" },
                          ]}
                          onSelect={(currentValue) => {
                            let currentTypeWiseCredData = globalCredData["Parameter"];
                            currentTypeWiseCredData.forEach((e) => {
                              if (cred.credentialId === e.credentialId)
                                cred.ApiCredProperties = cred.ApiCredProperties.map((each: any) => {
                                  if (each.uniqueIdForInput === prop.uniqueIdForInput)
                                    each.selectValueType = currentValue;
                                  return each;
                                });
                            });
                            setGlobalCredData({
                              ...globalCredData,
                            });
                            form.setValue(`selectValueType_${cred.credentialId}_${prop.uniqueIdForInput}`, currentValue);
                          }}
                        />
                      </div>
                      <div className="w-1/4 h-[35px] flex items-start">
                        {cred.clientAccess.includes(userId) ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <IconTextButtonWithTooltip tooltipContent="View Credential" type="button">
                                <Eye />
                              </IconTextButtonWithTooltip>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Input Token</DialogTitle>
                                <DialogDescription>Input Token to view credential</DialogDescription>
                              </DialogHeader>
                                <InputToken ref={submitTokenRef} forUser={userId} type={"Parameter"} forCredential={cred.credentialId} forKey={prop.key} />
                              <DialogFooter>
                                <Button
                                  type="submit"
                                  onClick={() => {
                                    submitTokenRef.current?.click();
                                  }}
                                >
                                  Submit Token
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <IconTextButtonWithTooltip type="button" tooltipContent="View Credential" onClick={() => { setAuthorizedPersons(cred.clientAccess); }}>
                            <Eye />
                          </IconTextButtonWithTooltip>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="w-[50%] pt-2">
                  <FormMultiComboboxInput placeholder="Select Associated commands" name={`associated_commands_${cred.credentialId}`} items={
                    commands.map(e=>{
                      //debugger
                      //console.log(commands)
                      return{
                        label:e.commandName,
                        value:e.commandId
                      }
                    })
                  } formControl={form.control} defaultValue={cred.associatedMetrics} onSelect={(value)=>{
                      // const currentCredData = globalCredData['Parameter']
                      const updatedParameterCredData = globalCredData['Parameter'].map(e=>{
                        if(e.credentialId == cred.credentialId){
                          debugger
                          e.associatedMetrics = value
                          e.updated = true
                        }
                         
                        return e
                      })
                      setGlobalCredData({
                        ...globalCredData,
                        Parameter:updatedParameterCredData
                      })
                      form.setValue(`associated_commands_${cred.credentialId}`, value);
                  }}/>
                </div>
              </div>
            ))}
          </div>
          <Button type="button" className="hidden" ref={ref} onClick={()=>{
            setSubmit(true)
          }}>
            Save
          </Button>
        </form>
      </Form>
      </>
    );
  }
);

export default ParameterCredentialView;
