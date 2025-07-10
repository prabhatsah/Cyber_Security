import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import NotesDataComponent from "../components/NotesDataComponent";

export default async function DealNoteTab({ params }: { params: { id: string } }) {
    const dealIdentifier = params?.id || "";
    
    const noteInstanceData = await getMyInstancesV2({
        processName: "Lead User Notes",
        predefinedFilters: { taskName: "View Or Edit Note" },
        mongoWhereClause: `this.Data.parentId == "${dealIdentifier}"`,
    })

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Notes',
                    href: `/sales-crm/deal/details/${dealIdentifier}/note`,
                }}
            />
            <NotesDataComponent parentId={dealIdentifier} noteData={noteInstanceData} source='Deals' />
        </>

    );
}