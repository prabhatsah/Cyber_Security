import { Dialog } from "@/shadcn/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import  MultiSelect from "@/ikon/components/form-fields/multi-combobox-input";
import { Form } from "@/shadcn/ui/form";
import { useEffect,useState } from "react";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";
import { forwardRef } from 'react';
import { Button } from "@/shadcn/ui/button";
import { useGlobalCred } from "../actions/context/credContext";
import { CredentialType } from "../type";

interface UserAccessProps {
  currentAccess: string[];
  forCredential:string,
  type: CredentialType,
}

const UserAccess = forwardRef<HTMLButtonElement, UserAccessProps>((props, ref) => {
    debugger
    const [users, setUsers] = useState<UserIdWiseUserDetailsMapProps[]>([])
    const [access,setAccess] = useState<string[]>([])
        const userAccessSchema = {
            userAccess: z.array(z.string()).min(1, "At least one user access is required")
        }
        const schema = z.object(userAccessSchema);
        const form = useForm<z.infer<typeof schema>>({
            resolver: zodResolver(schema),
            defaultValues: {
                userAccess:props.currentAccess
            },
    
        });
        //using context to get and set cred properties
        const {globalCredData,setGlobalCredData} = useGlobalCred()

        useEffect(()=>{
            //getting all users
            const getAllusers = async()=>{
                const users = await getUserIdWiseUserDetailsMap() as unknown as UserIdWiseUserDetailsMapProps[]
                debugger
                setUsers(Object.values(users))
               
            }
            getAllusers();
        },[])
        //values: z.infer<typeof schema>, event: React.FormEvent
        async function saveUserAccess() {
            //event.preventDefault(); // Prevent form submission from bubbling up
        
            const currentCredData = globalCredData[props.type];
            const updatedData = currentCredData.map((e) => {
              if (e.credentialId === props.forCredential) {
                e.clientAccess = access;
                e.updated = true;
              }
              return e;
            });
        
            setGlobalCredData({
              ...globalCredData,
              [props.type]: updatedData,
            });
          }
        return (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(saveUserAccess)}>
                <MultiSelect name={"userAccess"} items={users.map(eachuser =>{
                    return {
                        label: eachuser.userName.toString(),
                        value: eachuser.userId.toString()
                    }
                })} formControl={form.control} label={`User Access`} defaultValue={props.currentAccess}
                onSelect={(value: string | string[])=>{
                    debugger
                    setAccess(Array.isArray(value) ? value : [value])

                }}
                />
                <Button type="button" className="hidden" ref={ref} onClick={saveUserAccess}>save</Button>
              </form>
              
             </Form> 
        )
});



export default UserAccess;