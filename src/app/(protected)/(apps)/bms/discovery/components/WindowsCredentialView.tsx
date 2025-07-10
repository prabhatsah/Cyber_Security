import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Eye, FileLock, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useRef, useState } from "react";

import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import FormInput from "@/ikon/components/form-fields/input";

import { getProfileData } from "@/ikon/utils/actions/auth";
import { deleteProcessInstance, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { useGlobalCred } from "../actions/context/credContext";
import  Alert  from "@/ikon/components/alert-dialog";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import UserAccess from "./userAccess";
import InputToken from "./inputToken";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";


type WindowsCredentialViewProps = {
  credentialData: any;
};

const WindowsCredentialView = forwardRef<HTMLButtonElement, WindowsCredentialViewProps>(
  ({ credentialData }, ref) => {
    // Windows specific schema keys
    debugger
    const winSchemaKeys = ["credentialName", "userName", "password"];

    const [deleteCredential,setDeleteCredential] = useState(false)
    const [deleteingCredential,setDeleteingCredential] = useState({})

    const [changeUserAcess,setChangeUserAccess] = useState(false)
    const [allUsers,setAllUsers] = useState<object[]>([])
    const [AuthorizedPersons,setAuthorizedPersons] = useState<string[]>([])
    const [userId,setUserId] = useState<string>('')
    
    //contexts
    const {globalCredData,setGlobalCredData} = useGlobalCred()

    //refs
    const submitUserAccess = useRef(null)
    const submitTokenRef = useRef(null)

    let currentCredentialSchema: Record<string, any> = {};
    let defaultValues: Record<string, any> = {};

    credentialData.forEach((cred: any) => {
      winSchemaKeys.forEach((key: string) => {
        const fieldName = `${key}_${cred.credentialId}`;
        currentCredentialSchema[fieldName] = z.string();
        defaultValues[fieldName] = cred[key];
      });
    });

    useEffect(()=>{
      const getProfile = async()=>{
        const profile = await getProfileData()
        setUserId(profile.USER_ID)
      }
      const getAllUsers = async ()=>{
        const allUsers = await getUserIdWiseUserDetailsMap()
        const users = Object.values(allUsers)
        debugger
        setAllUsers(users)
      }
      getProfile()
      getAllUsers()
    },[])

    const schema = z.object(currentCredentialSchema);
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues,
      
    });
    

    async function saveCredential(values: z.infer<typeof schema>) {
      debugger
      const profileData = await getProfileData();
      
      const processId_WIN = await mapProcessName({
        processName: "Windows Credential Directory",
      });

      let cachedData_WIN = globalCredData['Windows']
      //saving windows data
      globalCredData['Windows'].forEach(async (cred: any) => {
        if(cred.new)
        {
          //filtering data according to need
          const updatedData = {
            credentialId: cred.credentialId,
            credentialName: values[`credentialName_${cred.credentialId}`],
            userName: values[`userName_${cred.credentialId}`],
            password: values[`password_${cred.credentialId}`],
            clientAccess: [profileData.USER_ID],
          };
          //saving to global state //
            cachedData_WIN = cachedData_WIN.map(e=>{
              e.credentialId === cred.credentialId?e=updatedData:e
              return e
            })
          //end
          await startProcessV2({
            processId:processId_WIN,
            data: updatedData,
            processIdentifierFields: "clientId,credentialId",
          });
      }
      if(cred.updated){
        const updatedData = {
          credentialId: cred.credentialId,
          credentialName: cred.credentialName, //values[`credentialName_${cred.credentialId}`],
          userName: cred.userName, //values[`userName_${cred.credentialId}`],
          password: cred.password, //values[`password_${cred.credentialId}`],
          clientAccess: cred.clientAccess,
        };
        //invokeAction
        cachedData_SSH = cachedData_SSH.map(e=>{
          e.credentialId === cred.credentialId?e=updatedData:e
          return e
        })
        
        await invokeAction({
          taskId: cred.taskId,
          transitionName: "Update View Credential",
          data: updatedData,
          processInstanceIdentifierField: "clientId,credentialId",
        });
      }
    });
      // globalCredData['Windows'].forEach(async (cred: any) => {
      //     if(cred.new)
      //     {
      //       //filtering data according to need
      //       const updatedData = {
      //         credentialId: cred.credentialId.toString(),
      //         credentialName: cred.credentialName, //values[`credentialName_${cred.credentialId}`],
      //         userName: cred.userName, //values[`userName_${cred.credentialId}`],
      //         password: cred.password, //values[`password_${cred.credentialId}`],
      //         clientAccess: [profileData.USER_ID],
      //       };
      //       await startProcessV2({
      //         processId,
      //         data: updatedData,
      //         processIdentifierFields: "clientId,credentialId",
      //       });
      //   }
      //   if(cred.updated){
      //     const updatedData = {
      //       credentialId: cred.credentialId,
      //       credentialName: cred.credentialName, //values[`credentialName_${cred.credentialId}`],
      //       userName: cred.userName, //values[`userName_${cred.credentialId}`],
      //       password: cred.password, //values[`password_${cred.credentialId}`],
      //       clientAccess: cred.clientAccess,
      //     };
      //     //invokeAction
          
      //     // await invokeAction({
      //     //   ,
      //     //   data: updatedData,
      //     //   processIdentifierFields: "clientId,credentialId",
      //     // });
      //   }
      // });
      setGlobalCredData({...globalCredData,Windows:cachedData_WIN})
      //end

      //saving ssh data
      const processId_SSH = await mapProcessName({
        processName: "SSH Credential Directory",
      });
      let cachedData_SSH = globalCredData["SSH"]

      credentialData.forEach(async (cred: any) => {
        if (cred.new) {
          const updatedData = {
            credentialId: cred.credentialId.toString(),
            credentialName: values[`credentialName_${cred.credentialId}`],
            userName: values[`userName_${cred.credentialId}`],
            password: values[`password_${cred.credentialId}`],
            port: values[`port_${cred.credentialId}`],
            clientAccess: [profileData.USER_ID],
          };
          cachedData_SSH = cachedData_SSH.map(e=>{
            e.credentialId === cred.credentialId?e=updatedData:e
            return e
          })
          await startProcessV2({
            processId:processId_SSH,
            data: updatedData,
            processIdentifierFields: "clientId,credentialId",
          });
        }
        if(cred.updated){
                const updatedData = {
                  credentialId: cred.credentialId,
                  credentialName: cred.credentialName, //values[`credentialName_${cred.credentialId}`],
                  userName: cred.userName, //values[`userName_${cred.credentialId}`],
                  password: cred.password, //values[`password_${cred.credentialId}`],
                  clientAccess: cred.clientAccess,
                };
                //invokeAction
                cachedData_SSH = cachedData_SSH.map(e=>{
                  e.credentialId === cred.credentialId?e=updatedData:e
                  return e
                })
                
                await invokeAction({
                  taskId: cred.taskId,
                  transitionName: "Update View Credential",
                  data: updatedData,
                  processInstanceIdentifierField: "clientId,credentialId",
                });
              }
              setGlobalCredData({...globalCredData,SSH:cachedData_SSH})

              //end

              //Saving SNMP data 
              const processId_SNMP = await mapProcessName({
                processName: "SNMP Community Credential Directory",
              });
              let cachedData_SNMP = globalCredData['SNMP']
        
              credentialData.forEach(async (cred: any) => {
                if (cred.new) {
                  const updatedData = {
                    credentialId: cred.credentialId.toString(),
                    credentialName: values[`credentialName_${cred.credentialId}`],
                    version: values[`version_${cred.credentialId}`],
                    communityString: values[`communityString_${cred.credentialId}`],
                    port: values[`port_${cred.credentialId}`],
                    clientAccess: profileData.USER_ID,
                  };
                  cachedData_SNMP = cachedData_SNMP.map(e => {
                    e.credentialId === cred.credentialId ? e = updatedData : e
                    return e
                  })
                  await startProcessV2({
                    processId:processId_SNMP,
                    data: updatedData,
                    processIdentifierFields: "clientId,credentialId",
                  });
                }
                if (cred.updated) {
                  const updatedData = {
                    credentialId: cred.credentialId,
                    credentialName: cred.credentialName, //values[`credentialName_${cred.credentialId}`],
                    userName: cred.userName, //values[`userName_${cred.credentialId}`],
                    password: cred.password, //values[`password_${cred.credentialId}`],
                    clientAccess: cred.clientAccess,
                  };
                  //invokeAction
                  cachedData_SNMP = cachedData_SNMP.map(e => {
                    e.credentialId === cred.credentialId ? e = updatedData : e
                    return e
                  })
        
                  await invokeAction({
                    taskId: cred.taskId,
                    transitionName: "Update View Credential",
                    data: updatedData,
                    processInstanceIdentifierField: "clientId,credentialId",
                  });
                }
                setGlobalCredData({...globalCredData,SNMP:cachedData_SNMP})
              });
              //end

              //saving parameter credentials
              const parameterSchemaKeys = ["key", "value", "selectValueType"];
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
                    data: {updatedMainData, ApiCredProperties: cred.ApiCredProperties},
                    processInstanceIdentifierField: "clientId,credentialId",
                  });
                }
              });
              //end
      });
    }

    
    return (
      <>
        {deleteCredential &&
          <Alert cancelText="No"
            confirmText="Yes"
            title={`Are you sure You want to delete ${deleteingCredential.credentialName} ?`} onConfirm={() => {
              setDeleteCredential(false)
              const currentGlobalCredData = globalCredData['Windows']
              debugger
              //delete processIntance 
                deleteProcessInstance({
                  processInstanceId:deleteingCredential.processInstanceId
                })
              //
              const globalCredDataAfterDeletion = currentGlobalCredData.filter(e=>e.credentialId != deleteingCredential.credentialId)
              setGlobalCredData({
                ...globalCredData,
                Windows: globalCredDataAfterDeletion
              })
              
            }}
            onCancel={() => {
              setDeleteingCredential({})
              setDeleteCredential(false)
            }} />}
            {
              
              AuthorizedPersons.length>0 && !AuthorizedPersons.includes(userId)?<Alert title={"Sorry!You don't have Access"} 
              
              description={`Please Contact the following : 
                ${AuthorizedPersons.map(e=>{
                return allUsers.filter(eachuser =>eachuser.userId === e)[0].userName
              })}`}
              onConfirm={()=>{
                setAuthorizedPersons([])
              }} 
              confirmText="Ok"/>:null
            }
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveCredential)}>
            <div className="w-full space-y-4">
            
              {credentialData.map((cred: any, index: number) => (
                <div key={index} className="border rounded-md p-2 shadow-sm">
                  
                  <div className="flex items-end justify-between mb-2">

                    <div className="w-1/2">
                      <FormInput
                        label="Credential Name"
                        name={`credentialName_${cred.credentialId}`}
                        formControl={form.control}
                        disabled={!cred.new}

                      //   onChange={(event)=>{
                      //     let currentTypeWiseCredData = globalCredData['Windows']
                      //     debugger
                      //     currentTypeWiseCredData = currentTypeWiseCredData.map(e=>{
                      //         if(e.credentialId == cred.credentialId)
                      //             cred.credentialName = event.target.value
                      //         return cred
                      //     })
                      //     setGlobalCredData({
                      //       ...globalCredData,

                      //     })
                      //     form.setValue(`credentialName_${cred.credentialId}`,event.target.value)

                      // }}
                      />
                    </div>

                    <div className="flex justify-start items-center w-1/2 h-[38px]">
                      <IconTextButtonWithTooltip className="me-2 ms-2" tooltipContent="Delete Credential" onClick={() => {
                        debugger
                        
                        setDeleteingCredential(cred)
                        setDeleteCredential(true)

                      }}>
                        <Trash2 />
                      </IconTextButtonWithTooltip>

                      <Dialog>
                        <DialogTrigger asChild>
                          <IconTextButtonWithTooltip tooltipContent="User Access" onClick={() => {
                            debugger
                            setChangeUserAccess(true)

                          }}>
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
                            <UserAccess currentAccess={cred.clientAccess} type='Windows' forCredential={cred.credentialId} ref={submitUserAccess} />
                          <DialogFooter>
                            <Button type="button" onClick={() => {
                              submitUserAccess?.current.click()
                            }}>Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                  </div>
                  <div className="flex items-end gap-4 mb-2">
                    <div className="w-1/3">
                      <FormInput
                        label="Username"
                        disabled={!cred.new}
                        name={`userName_${cred.credentialId}`}
                        formControl={form.control}
                      //   onChange={(event)=>{
                      //     let currentTypeWiseCredData = globalCredData['Windows']
                      //     currentTypeWiseCredData = currentTypeWiseCredData.map(e=>{
                      //         if(e.credentialId == cred.credentialId)
                      //             cred.userName = event.target.value
                      //         return cred
                      //     })
                      //     setGlobalCredData({
                      //       ...globalCredData,
                            
                      //     })
                      //     form.setValue(`userName_${cred.credentialId}`,event.target.value)

                      // }}
                      />
                    </div>
                    <div className="w-1/3">
                      <FormInput
                        label="Password"
                        type="password"
                        disabled={!cred.new}
                        name={`password_${cred.credentialId}`}
                        formControl={form.control}
                      //   onChange={(event)=>{
                      //     debugger
                      //     let currentTypeWiseCredData = globalCredData['Windows']
                      //     currentTypeWiseCredData = currentTypeWiseCredData.map(e=>{
                      //         if(e.credentialId == cred.credentialId)
                      //             cred.password = event.target.value
                      //         return cred
                      //     })
                      //     setGlobalCredData({
                      //       ...globalCredData
                            
                      //     })
                      //     form.setValue(`password_${cred.credentialId}`,event.target.value)

                      // }}
                      />
                    </div>
                    <div className="w-1/3 flex items-start h-[35px]">
                      {cred.clientAccess.includes(userId)?<Dialog>
                        <DialogTrigger asChild>
                          <IconTextButtonWithTooltip tooltipContent="View Credential">
                            <Eye />
                          </IconTextButtonWithTooltip>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Input Token</DialogTitle>
                            <DialogDescription>
                              Input Token to view credential
                            </DialogDescription>
                          </DialogHeader>
                          <InputToken ref={submitTokenRef} forUser={userId} type={"Windows"} forCredential={cred.credentialId} forKey={''}/>
                          <DialogFooter>
                            <Button type="submit" onClick={()=>{
                              submitTokenRef.current?.click()
                            }}>Submit Token</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>:<IconTextButtonWithTooltip tooltipContent="View Credential" onClick={()=>{
                          setAuthorizedPersons(cred.clientAccess)
                      }}>
                            <Eye />
                          </IconTextButtonWithTooltip>}
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button type="submit" className="hidden" ref={ref}>
              Save
            </Button>
          </form>
        </Form>
      </>
    );
  }
);

export default WindowsCredentialView;
