import { LoadingSpinner } from '@/ikon/components/loading-spinner'
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users'
import { cn } from '@/shadcn/lib/utils'
import { Button } from '@/shadcn/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shadcn/ui/command'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getUserMapForCurrentAccount } from '../../../../components/getProjectManagerDetails'
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input'
import FormDateInput from '@/ikon/components/form-fields/date-input'
import FormTextarea from '@/ikon/components/form-fields/textarea'
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService'

type ManagerDetails = {
    userId: string;
    userName: string;
    userActive: boolean;
};

type UserMap = Record<string, ManagerDetails>;

type SelectOption = {
    value: string;
    label: string;
};


export function ConfigureForm({ configureProjectData, projectIdentifier, setOpen }: { configureProjectData: Record<string, any>, projectIdentifier: string, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    console.log(configureProjectData);
    const [userMap, setUserMap] = useState<any>(null);
    const [projectMg, setProjMg] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const allUserDetailMap = async () => {
            try {
                setLoading(true);
                const userDetailsMap = await getUserIdWiseUserDetailsMap();
                const userMapObj = Object.values(userDetailsMap)
                    .filter((user) => user.userActive)
                    .map((activeUser) => {
                        return ({
                            label: activeUser.userName,
                            value: activeUser.userId
                        })
                    });
                setUserMap(userMapObj);
                const usersProjectManagerGroup: UserMap = await getUserMapForCurrentAccount({
                    groups: ["Project Manager"],
                });

                const activeUsersPMGrp: SelectOption[] = Object.values(usersProjectManagerGroup)
                    .filter((managerDetails) => managerDetails?.userActive)
                    .map((activeManagerDetails) => ({
                        value: activeManagerDetails.userId,
                        label: activeManagerDetails.userName
                    }));

                setProjMg(activeUsersPMGrp)


            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        allUserDetailMap();
    }, [])
    console.log(userMap);
    console.log(projectMg);

    const configureFormSchema = z.object({
        PROJECT_TEAM_MEMBER: z
            .array(z.string(), {
                required_error: "Please Select atleast One Team Member",
                invalid_type_error: "Must be an array of strings"
            })
            .min(1, "At least one value is required"),
        MANAGER_NAME: z
            .string()
            .min(2, { message: 'Select Manager Name' })
            .trim(),
        PROJECT_MANAGER_DELEGATE: z
            .string()
            .min(2, { message: 'Select Project Delegate Name' })
            .trim(),
        PROJECT_START_DATE: z.coerce.date({
            required_error: "Start date is required.",
        }),
        DESCRIPTION: z.string().optional(),

    })

    const form = useForm<z.infer<typeof configureFormSchema>>({
        resolver: zodResolver(configureFormSchema),
        defaultValues: {
            PROJECT_TEAM_MEMBER: configureProjectData?.projectTeam || [],
            MANAGER_NAME: configureProjectData?.projectManager || '',
            PROJECT_MANAGER_DELEGATE: configureProjectData?.projectManagerDelegates || '',
            PROJECT_START_DATE: configureProjectData?.projectStartDate || undefined,
            DESCRIPTION: configureProjectData?.projectDescription || ''
        }
    })

    async function onSubmit(data: z.infer<typeof configureFormSchema>) {
        console.log(data)

        const projectInstance = await getMyInstancesV2({
            processName: "Project",
            predefinedFilters: { taskName: "Edit State" },
            processVariableFilters: { projectIdentifier: projectIdentifier }
        })
        console.log(projectInstance)

        const projectInstanceData = projectInstance[0]?.data || {};
        const projectInstanceTaskId = projectInstance[0]?.taskId;
        console.log(projectInstanceData);
        console.log(projectInstanceTaskId);
        const projectData = {
            ...projectInstanceData,
            projectStartDate: data.PROJECT_START_DATE,
            projectTeam: data.PROJECT_TEAM_MEMBER,
            projectManager: data.MANAGER_NAME,
            projectManagerDelegates: data.PROJECT_MANAGER_DELEGATE,
            projectDescription: data.DESCRIPTION,
            projectTeamUnderProjectManager: [],
            projectTeamUnderProjectManagerDelegates: []

        };

        if (projectData.participants == undefined) { projectData.participants = {}; }
        projectData.participants["Scrum_Team_" + projectIdentifier] = data.PROJECT_TEAM_MEMBER;

        console.log(projectData)

        await invokeAction({
            taskId: projectInstanceTaskId,
            transitionName: "Update Edit",
            data: projectData,
            processInstanceIdentifierField: "projectIdentifier"
        })

        console.log("Succesfully Saved");
        setOpen(false);
    }


    return (
        <>
            {
                loading ?
                    <LoadingSpinner size={60} />
                    :
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className='flex flex-col gap-3 m-2'>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="PROJECT_TEAM_MEMBER"
                                        render={({ field }) => (
                                            <FormItem >
                                                <FormLabel>Project Team</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    `w-full justify-between ${field.value?.length>9? 'h-20': 'h-10'}`,
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <div className="w-full flex flex-wrap gap-2">
                                                                    {field.value?.length > 0
                                                                        ? field.value.map((value) => {
                                                                            const label = userMap?.find((user: any) => user.value === value)?.label;
                                                                            return label ? <span key={value}>{label}</span> : null;
                                                                        })
                                                                        : "Select Users"}
                                                                </div>
                                                                <ChevronsUpDown className="opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Search Users"
                                                                className="h-9"
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>No User found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {userMap && userMap.map((user: any) => (
                                                                        <CommandItem
                                                                            value={user.label}
                                                                            key={user.value}
                                                                            onSelect={() => {
                                                                                const currentValues = field.value || [];
                                                                                console.log(currentValues)
                                                                                if (currentValues.includes(user.value)) {
                                                                                    form.setValue(
                                                                                        "PROJECT_TEAM_MEMBER",
                                                                                        currentValues.filter((val) => val !== user.value)
                                                                                    );
                                                                                } else {
                                                                                    form.setValue("PROJECT_TEAM_MEMBER", [
                                                                                        ...currentValues,
                                                                                        user.value,
                                                                                    ]);
                                                                                }
                                                                                form.trigger("PROJECT_TEAM_MEMBER");
                                                                            }}
                                                                        >
                                                                            {user.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    field.value?.includes(user.value)
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='flex flex-row justify-between gap-3'>
                                    {
                                        projectMg &&
                                        <>
                                            <div className='flex-grow'>
                                                <FormComboboxInput items={projectMg} formControl={form.control} name={"MANAGER_NAME"} placeholder={"Choose Manager Name"} label={"Manager Name"} />
                                            </div>
                                            <div className='flex-grow'>
                                                <FormComboboxInput items={projectMg} formControl={form.control} name={"PROJECT_MANAGER_DELEGATE"} placeholder={"Choose Project Manager Delegate Name"} label={"Project Manager Delegate Name"} />
                                            </div>
                                        </>
                                    }
                                    <div className='flex-grow'>
                                        <FormDateInput formControl={form.control} name={"PROJECT_START_DATE"} label={"Project Start Date"} placeholder={"Enter Project Start Date"} />
                                    </div>
                                </div>
                                <div className='grow'>
                                    <FormTextarea formControl={form.control} name={"DESCRIPTION"} label={"Description"} placeholder={"Description"} />
                                </div>
                            </div>
                            <div className='flex flex-row-reverse'>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </Form>
            }
        </>
    )
}


export default function ConfigureProjectForm({ open, setOpen, configureProjectData, projectIdentifier }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, configureProjectData: Record<string, any>, projectIdentifier: string }) {
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[60%]">
                    <DialogHeader>
                        <DialogTitle>Configure Project</DialogTitle>
                    </DialogHeader>
                    <div className="h-[35vh] overflow-auto">
                        {/* Configure Modal Form */}
                        <ConfigureForm configureProjectData={configureProjectData} projectIdentifier={projectIdentifier} setOpen={setOpen} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
