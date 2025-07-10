
import FormInput from "@/ikon/components/form-fields/input";
import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { Form } from "@/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CredentialType } from "../type";
import { toast } from "@/shadcn/hooks/use-toast";
import  Alert  from "@/ikon/components/alert-dialog";
import { set } from "date-fns";

interface InputTokenProps{
    forUser:string,
    forCredential:string,
    forKey:string,
    type:CredentialType
}


const InputToken = forwardRef<HTMLButtonElement, InputTokenProps>((props, ref) => {

    const[password,setShowPassword] = useState<string>('')

    const InputTokenSchema = z.object({
        token: z.string().min(1, "Please provide Token to Proceed")
    })
    //const schema = z.object(InputTokenSchema);
    var typeWiseCredentialStorage = {
        SSH: "SSH Credential Directory",
        Windows: "Windows Credential Directory",
        SNMP: "SNMP Community Credential Directory",
        Parameter: "Parameter Credential Directory",
    }
    const form = useForm<z.infer<typeof InputTokenSchema>>({
        resolver: zodResolver(InputTokenSchema),
        defaultValues: {
            token: ''
        },

    });
    async function submitUserToken(values:z.infer<typeof InputTokenSchema>){

        const insatnce = await getMyInstancesV2({
            processName:'User Token',
            predefinedFilters:{taskName : "Token Generated"},
            processVariableFilters:{"id":props.forUser},
        })
        const params = {
            submittedToken : values.token,
            credentialId: props.forCredential,
            credentialKey: props.forKey,
            credentialProcess:typeWiseCredentialStorage[props.type] ,
           };
        const fetchData: { password?: string,error?:string } = await getParameterizedDataForTaskId({
            taskId:insatnce[0].taskId,
            parameters:params,

        })

        if(!fetchData.password)
            toast({
                title: "System Issue",
                description: "Please Contact Support Team",
            })
        else{
            setShowPassword(fetchData.password)
            toast({
                title: "Password Generated Successfully",
                description: "Please note down the password",
            })
        }
            

        
    }
    return (
        <>
            {password!==''?<Alert title={"Your Password"} description={password} onConfirm={()=>{
                setShowPassword('')
            }} confirmText="Ok" />:''}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitUserToken)}>
                    {/* Add your form fields here */}
                    <FormInput name={"token"} formControl={form.control} label={'Access Token'}/>
                    <Button className="hidden" ref={ref}>Submit Token </Button>
                </form>
                
            </Form>
        </>
    );
})
export default InputToken;
// export default function InputToken(){
//     const InputTokenSchema = {
//         token: z.string().min(1, "Please provide Token to Proceed")
//     }
//     const schema = z.object(InputTokenSchema);
//     const form = useForm<z.infer<typeof schema>>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             token: ''
//         },

//     });
//     async function submitUserToken(values:z.infer<typeof schema>){

//     }
//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(submitUserToken)}>
//                 {/* Add your form fields here */}
//                 <FormInput name={"token"} formControl={form.control} label={'Access Token'}/>
//             </form>
//             <IconTextButton className="hidden"> <Save/>Submit Token </IconTextButton>
//         </Form>
//     );
// }