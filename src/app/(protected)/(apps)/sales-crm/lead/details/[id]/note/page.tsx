import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import NotesDataComponent from "../components/NotesDataComponent";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function LeadNoteTab({ params }: { params: { id: string } }) {
    const leadIdentifier = params?.id || "";
    
    const noteInstanceData = await getMyInstancesV2({
        processName: "Lead User Notes",
        predefinedFilters: { taskName: "View Or Edit Note" },
        mongoWhereClause: `this.Data.parentId == "${leadIdentifier}"`,
    })

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Notes',
                    href: `/sales-crm/lead/details/${leadIdentifier}/note`,
                }}
            />
            <NotesDataComponent parentId={leadIdentifier} noteData={noteInstanceData} source='Leads' />
        </>

    );
}