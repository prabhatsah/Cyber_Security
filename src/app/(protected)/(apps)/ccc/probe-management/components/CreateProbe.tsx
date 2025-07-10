'use client'
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import { getMyInstancesV2,getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService"; // Adjust the import path as needed
import { toast } from '@/shadcn/hooks/use-toast';
import { Button } from '@/shadcn/ui/button';
import FormInput from '@/ikon/components/form-fields/input';
import { forwardRef } from "react";

interface propType{
    action:'create' | 'edit',
    probeName?:string,
    probeId?:string
}

const CreateEditProbeForm = forwardRef<HTMLButtonElement,propType & { closeRef?: React.RefObject<HTMLButtonElement> }>(({action,probeName,probeId,closeRef},ref) => {
    
    const schema = z.object(probeId && probeId?{
        probeName: z.string().min(1,'Please Provide Probe Name'),
        probeId: z.string()

    }:{
        probeName: z.string().min(1,'Please Provide Probe Name')
    });
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: probeName  && probeId?{
            probeName:probeName,
            probeId:probeId
        }:{

        }
    });

    console.log(form.formState)
    async function createProbe(values: z.infer<typeof schema>) {
        debugger
        
        getMyInstancesV2({
            processName:'Probe Management Process',
            predefinedFilters:{taskName:'Create/Edit Probe'}
        }).then((response)=>{
            getParameterizedDataForTaskId({
                taskId:response[0].taskId,
                parameters:values.probeId && values.probeName?{
                    actionType:action,
                    probeName:values.probeName,
                    probeId:values.probeId
                }:{
                    actionType:action,
                    probeName:values.probeName
                }
            }).then(()=>{
                closeRef?.current.click()
                toast({
                    title:"Success",
                    description:`${values.probeName} ${action === 'create' ? 'created':'edited'} successfully`
                })
            })
        })
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(createProbe)}>
                    <FormInput name={"probeName"} formControl={form.control} label={'Probe Name'} />
                    {action === 'edit' && <FormInput name={"probeId"} formControl={form.control} label={'Probe Id'} disabled/>}


                    <Button className='hidden' ref={ref}>save</Button>
                    
                </form>
                
            </Form>
        </>
    )
})

export default CreateEditProbeForm