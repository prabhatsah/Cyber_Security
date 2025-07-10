
import ProjectDetailsComponent from "./components/project-details-component";
import ProjectWorkflowLayout from "./components/project-workflow-componet";
import TabComponentProjectDetails from "./components/tabComponent";

export default async function ProjectLayout({ children, params }: { children: React.ReactNode, params: { projectIdentifierId: string, id: string } }) {
    const projectIdentifier = params.projectIdentifierId || "";
    
    const dealIdentifier = params.id || "";
    console.log("identifier of product ", projectIdentifier);
    console.log("dealIdentifier ", dealIdentifier);
    return (
        <div className="w-full h-full overflow-auto overflow-x-hidden" id="productMainTemplateDiv">
            <div className="h-full flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-1/4 h-full">
                    <div className="flex flex-col gap-3 h-full">
                        {await ProjectDetailsComponent({ projectIdentifier: projectIdentifier })}
                        {await ProjectWorkflowLayout({ projectIdentifier: projectIdentifier })}
                    </div>
                </div>
                <div className="w-full lg:w-3/4 h-full flex flex-col gap-3">
                    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
                        <TabComponentProjectDetails projectIdentifier={projectIdentifier} dealIdentifier={dealIdentifier}>
                            {children}
                        </TabComponentProjectDetails>
                    </div>
                </div>
            </div>
            {/* <EditLeadModalWrapper dealIdentifier={dealIdentifier} /> */}
        </div>
    )
}