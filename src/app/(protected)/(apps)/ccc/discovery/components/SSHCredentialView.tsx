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
import Alert from "@/ikon/components/alert-dialog";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import UserAccess from "./userAccess";
import InputToken from "./inputToken";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { toast } from "@/shadcn/hooks/use-toast";

type SSHCredentialViewProps = {
  credentialData: any;
};

const SSHCredentialView = forwardRef<HTMLButtonElement, SSHCredentialViewProps>(
  ({ credentialData }, ref) => {
    const sshSchemaKeys = ["credentialName", "userName", "password", "port"];

    const [deleteCredential, setDeleteCredential] = useState(false);
    const [deletingCredential, setDeletingCredential] = useState<any>({});
    const [changeUserAccess, setChangeUserAccess] = useState(false);
    const [allUsers, setAllUsers] = useState<object[]>([]);
    const [authorizedPersons, setAuthorizedPersons] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>("");
    const [submit,setSubmit] = useState<boolean>(false)

    const { globalCredData, setGlobalCredData } = useGlobalCred();

    const submitUserAccess = useRef(null);
    const submitTokenRef = useRef(null);

    let currentCredentialSchema: Record<string, any> = {};
    let defaultValues: Record<string, any> = {};

    credentialData.forEach((cred: any) => {
      sshSchemaKeys.forEach((key: string) => {
        const fieldName = `${key}_${cred.credentialId}`;
        currentCredentialSchema[fieldName] = z.string();
        defaultValues[fieldName] = cred[key];
      });
    });

    useEffect(() => {
      const getProfile = async () => {
        const profile = await getProfileData();
        setUserId(profile.USER_ID);
      };
      const getAllUsers = async () => {
        const allUsers = await getUserIdWiseUserDetailsMap();
        setAllUsers(Object.values(allUsers));
      };
      getProfile();
      getAllUsers();
    }, []);

    const schema = z.object(currentCredentialSchema);
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues,
    });

    async function saveCredential_(values: z.infer<typeof schema>) {
      const profileData = await getProfileData();
      const processId = await mapProcessName({
        processName: "SSH Credential Directory",
      });
      let cachedData = globalCredData["SSH"]

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
          cachedData = cachedData.map(e=>{
            e.credentialId === cred.credentialId?e=updatedData:e
            return e
          })
          await startProcessV2({
            processId,
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
                cachedData = cachedData.map(e=>{
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
              setGlobalCredData({...globalCredData,SSH:cachedData})
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
                                const updatedCredData = globalCredData["SSH"].filter(
                                  (cred) => cred.credentialId !== deletingCredential.credentialId
                                );
                                setGlobalCredData({ ...globalCredData, SSH: updatedCredData });
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
                  <div className="flex items-end justify-between mb-2">
                    <div className="w-1/2">
                      <FormInput
                        label="Credential Name"
                        name={`credentialName_${cred.credentialId}`}
                        formControl={form.control}
                        disabled={!cred.new}
                      />
                    </div>
                    <div className="w-1/2 flex justify-start items-start  h-[35px]">
                      <IconTextButtonWithTooltip
                      type="button"
                        tooltipContent="Delete Credential"
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
                  <div className="flex items-end gap-4 mb-2">
                    <div className="w-1/4">
                      <FormInput
                        label="SSH Port"
                        disabled={!cred.new}
                        name={`port_${cred.credentialId}`}
                        formControl={form.control}
                        
                      />
                    </div>
                    <div className="w-1/4">
                      <FormInput
                        label="Username"
                        disabled={!cred.new}
                        name={`userName_${cred.credentialId}`}
                        formControl={form.control}
                      />
                    </div>
                    <div className="w-1/4">
                      <FormInput
                        label="Password"
                        type="password"
                        disabled={!cred.new}
                        name={`password_${cred.credentialId}`}
                        formControl={form.control}
                      />
                    </div>
                    <div className="w-1/4 flex items-start h-[34px]">
                      {/* <IconTextButtonWithTooltip tooltipContent="View Credential">
                        <Eye />
                      </IconTextButtonWithTooltip> */}
                      {cred.clientAccess.includes(userId) ? <Dialog>
                        <DialogTrigger asChild>
                          <IconTextButtonWithTooltip tooltipContent="View Credential" type="button">
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
                          <InputToken ref={submitTokenRef} forUser={userId} type={"SSH"} forCredential={cred.credentialId} forKey={''} />
                          <DialogFooter>
                            <Button type="submit" onClick={() => {
                              submitTokenRef.current?.click()
                            }}>Submit Token</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog> : <IconTextButtonWithTooltip type="button" tooltipContent="View Credential" onClick={() => {
                        setAuthorizedPersons(cred.clientAccess)
                      }}>
                        <Eye />
                      </IconTextButtonWithTooltip>}
                    </div>
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

export default SSHCredentialView;
