import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getDateTimeFormat } from "@/ikon/utils/actions/format";
import ConfigureProjectModal from "./components/configureProjectModal";
import { addMonths, format, isAfter, parseISO, isBefore as dfIsBefore } from "date-fns";
import { GlowingEffect } from "@/ikon/components/glowing-effect";

const calculateTaskEndDate = (
    startDate: string,
    duration: number
): string => {
    const taskStart = parseISO(startDate);
    const wholeMonths = Math.floor(duration);
    const fractionalMonths = duration % 1;

    let taskEnd = addMonths(taskStart, wholeMonths);
    taskEnd = new Date(
        taskEnd.setDate(taskEnd.getDate() + fractionalMonths * 30)
    );

    return format(taskEnd, "yyyy-MM-dd");
};

function getProjectStartEndDate(data) {
    if (data && data.task.length) {
        let endDateList = data.task.map(task => calculateTaskEndDate(task.taskStart, task.taskDuration));
        let endDate = endDateList[0];
        let startDate = data.task[0].taskStart;

        for (let i = 0; i < data.task?.length; i++) {
            if (isAfter(parseISO(endDateList[i]), parseISO(endDate))) {
                endDate = endDateList[i];
            }
            if (dfIsBefore(parseISO(data.task[i].taskStart), parseISO(startDate))) {
                startDate = data.task[i].taskStart;
            }
        }

        return {
            startDate: format(parseISO(startDate), 'dd-MMM-yyyy'),
            endDate: format(parseISO(endDate), 'dd-MMM-yyyy')
        };
    }
}

export default async function ProjectDetailsComponent({ projectIdentifier }: { projectIdentifier: string }): Promise<ReactNode> {
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    const projectData = await getMyInstancesV2<any>({
        processName: "Product of Project",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
    });

    const projectIdWiseProductData = projectData[0]?.data;

    console.log(projectIdWiseProductData.scheduleData);

    const startEndDate = getProjectStartEndDate(projectIdWiseProductData.scheduleData);

    console.log(startEndDate);
    // debugger;

    const configurationProjectInst = await getMyInstancesV2<any>({
        processName: "Project",
        predefinedFilters: { taskName: "View State" },
        processVariableFilters: { "projectIdentifier": projectIdentifier }
    })

    const configureProjectData = configurationProjectInst[0]?.data;

    // console.log(configureProjectData);
    return (

        <Card className="flex flex-col">
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 4,
                    title: projectIdWiseProductData?.projectName || "n/a",
                    href: `/projects/${projectIdentifier}`,
                }}
            />
            <CardHeader className="flex flex-row justify-between items-center border-b py-1">
                <CardTitle className="self-center">{projectIdWiseProductData?.projectName}</CardTitle>
                <ConfigureProjectModal projectIdWiseProductData={projectIdWiseProductData} configureProjectData={configureProjectData} projectIdentifier={projectIdentifier} />
                {/* <DropdownMenuWithEditDeal dealIdentifier={dealIdentifier} />  */}
            </CardHeader>
            <CardContent className="grid gap-2 p-0 overflow-hidden">
                <div className="flex flex-col flex-grow overflow-auto">
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Manager :{" "}
                        {configureProjectData.projectManager ? userIdWiseUserDetailsMap[configureProjectData.projectManager].userName : "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Manager Delegate :{" "}
                        {configureProjectData.projectManagerDelegates ? userIdWiseUserDetailsMap[configureProjectData.projectManagerDelegates].userName : "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Status : {projectIdWiseProductData?.projectStatus || "n/a"}
                    </span>
                    {/* <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Product Description :{" "}
                        {projectIdWiseProductData?.productDescription || "n/a"}
                    </span> */}
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Updated on : {getDateTimeFormat(projectIdWiseProductData?.updatedOn) || "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Start Date : {startEndDate?.startDate || "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        End Date : {startEndDate?.endDate || "n/a"}
                    </span>
                </div>
            </CardContent>
        </Card >
    )
}