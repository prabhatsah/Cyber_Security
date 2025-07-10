import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
import { getCurrentUserId } from '@/ikon/utils/actions/auth';
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { getMyInstancesV2, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Form } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';

const notiPriorityMap = [
    { value: "1", label: "Low" },
    { value: "2", label: "Medium" },
    { value: "3", label: "High" },
]

const voTypeMap = [
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },

]

export const variationOrderFormSchema = z.object({
    TITLE: z.string().min(1, { message: 'Please Enter a Title' }),
    DATE_OF_INITIATION: z.coerce.date({ required_error: "Date of Initiation is required." }),
    PRIORITY: z.string().min(1, { message: "Please select Notification Priority" }),
    TYPE: z.string().min(1, { message: "Please select a type" }),
    ESTIMATED_INCOME_ON_FTE: z.string().min(1, { message: "Please Enter Estimated Income on Fte" }),
    REASON: z.string().optional()
})

export default function VariationOrderForm({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const form = useForm<z.infer<typeof variationOrderFormSchema>>({
        resolver: zodResolver(variationOrderFormSchema),
        defaultValues: {
            TITLE: "",
            DATE_OF_INITIATION: new Date(),
            PRIORITY: "1",
            TYPE: "internal",
            ESTIMATED_INCOME_ON_FTE: "",
            REASON: ""
        }
    })

    const params = useParams();
    const projectIdentifier = params?.projectIdentifierId;

    const [loading, setLoading] = useState<boolean>(false);

    const [rfcValue, setRfcValue] = useState<string>('');
    const [managerName, setManagerName] = useState<string | null>('');
    const [projectName, setProjectName] = useState<string>('');
    const [currentUserName, setCurrentUserName] = useState<string | null>('');
    const [currentUserId,setCurrentUserId] = useState<string |null>('');
    const [managerId,setManagerId] = useState<string |null>('');

    const [productIdentifier,setProductIdentifier] = useState<string|null>('');

    console.log(projectIdentifier);
    useEffect(() => {
        async function loadInitialDetails() {
            try {
                setLoading(true);
                if (projectIdentifier) {

                    const productOfProjectInstance = await getMyInstancesV2<any>({
                        processName: "Product of Project",
                        predefinedFilters: { taskName: "View State" },
                        mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
                    });
                    const productOfProjectData = productOfProjectInstance[0]?.data || null;
                    setProductIdentifier(productOfProjectData?.productIdentifier)

                    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

                    const managerId = productOfProjectData ? productOfProjectData.projectManager : "";
                    setManagerId(managerId);
                    const managerName = managerId ? userIdWiseUserDetailsMap[managerId].userName : "";

                    const currUserId = await getCurrentUserId();
                    setCurrentUserId(currUserId);
                    const currentUserName = currUserId ? userIdWiseUserDetailsMap[currUserId].userName : "";

                    const projectName = productOfProjectData?.projectName;

                    const time = new Date().getTime();
                    const currentYear = format(time, 'yyyy');
                    const rfcValue = `VO/${currentYear}/${time.toString().slice(-5)}`;

                    console.log(rfcValue);
                    console.log(projectName);
                    console.log(managerName);
                    console.log(currentUserName);
                    setRfcValue(rfcValue);
                    setManagerName(managerName);
                    setProjectName(projectName);
                    setCurrentUserName(currentUserName);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadInitialDetails();
    }, [])

    async function saveVariationOrderForm(data: z.infer<typeof variationOrderFormSchema>){
        console.log(data)

        const notiObj = {
			projectIdentifier : projectIdentifier,
			notiIdentifier : v4(),
			activeStatus : true,
			productIdentifier : productIdentifier,
			titleNoti : data.TITLE,
			isChangeStarted : false,
			isChangeRejected : false,
			voType : data.TYPE,
			submittedBy : currentUserId,
			rfcRef : rfcValue,
			estimatedImpactOnSchedule : parseFloat(data.ESTIMATED_INCOME_ON_FTE),
			description : data.REASON,
			notiStatus : "Noti Created",
			notiPriority : data.PRIORITY,
			createdDate : format(data.DATE_OF_INITIATION,"yyyy-MM-dd"),
			pm_pd_comments : "",
			approvedStatus : "Notification Initiated",
			projectManager : managerId,
			projectName : projectName,
			updatedOn : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
			updatedBy : currentUserId,
		}

        console.log(notiObj);

        const processId = await mapProcessName({ processName: "Change Notification" });

        console.log(processId);

        await startProcessV2({
            processId,
            data: notiObj,
            processIdentifierFields: "notiIdentifier,projectIdentifier,productIdentifier,activeStatus",
          });

        console.log("Saved Successful");
        setOpen(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[50%]">
                    <DialogHeader>
                        <DialogTitle>Create Notification</DialogTitle>
                    </DialogHeader>
                    <div className='h-[40vh] overflow-auto'>
                        {
                            loading ? <LoadingSpinner size={60} /> :
                                <div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
                                        <div>
                                            VO Ref : {rfcValue}
                                        </div>
                                        <div>

                                            Project Name :  {projectName}
                                        </div>
                                        <div>
                                            Project Manager :  {managerName}
                                        </div>
                                        <div>
                                            Submitted By : {currentUserName}
                                        </div>
                                    </div>
                                    <Form {...form}>
                                        <form>
                                            <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                                                <div className='col-span-1 md:col-span-2'>
                                                    <FormInput formControl={form.control} name={"TITLE"} label={"Title"} placeholder={"Enter Title"} />
                                                </div>
                                                <div className='col-span-1 md:col-span-2'>
                                                    <FormDateInput formControl={form.control} name={"DATE_OF_INITIATION"} label={"Date of Initiation"} placeholder={"Enter Date of Initiation"} />
                                                </div>
                                                <div className='col-span-1 md:col-span-1'>
                                                    <FormComboboxInput items={notiPriorityMap} formControl={form.control} name={"PRIORITY"} label={"Priority"} placeholder={"Priority"} />
                                                </div>
                                                <div className='col-span-1 md:col-span-1'>
                                                    <FormComboboxInput items={voTypeMap} formControl={form.control} name={"TYPE"} label={"Type"} placeholder={"Type"} />
                                                </div>
                                                <div className='col-span-1 md:col-span-2'>
                                                    <FormInput formControl={form.control} name={"ESTIMATED_INCOME_ON_FTE"} label={"Estimate Income On Fte"} placeholder={"Estimate Income On Fte"} />
                                                </div>
                                                <div className='col-span-1 md:col-span-4 '>
                                                    <FormTextarea formControl={form.control} name={"REASON"} label={"Reason"} placeholder={"Reason"} />
                                                </div>
                                            </div>
                                        </form>
                                    </Form>

                                </div>
                        }
                    </div>
                    <DialogFooter>
                        {!loading && <Button type="button" onClick={form.handleSubmit(saveVariationOrderForm)}>Save</Button>}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    )
}
