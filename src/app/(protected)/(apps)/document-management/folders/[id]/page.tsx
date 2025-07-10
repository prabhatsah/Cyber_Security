import ClientPage from '../../ClientPage';
import DummyComponent from './dummy';
import { showFolderAndFileForSelectedFolder, getFolderNameSearchMap } from "../../actions";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";


let level = 3;
let prev_folder_identifier: string = "";
export default async function ChildTable({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const folder_identifier = (await params)?.id || "";
    const documentData = await showFolderAndFileForSelectedFolder(folder_identifier);
    const folderNameSearchMap: any = await getFolderNameSearchMap();
    const folderIdentifier = {
        parent: 'my-drive',
        folder_identifier: folder_identifier
    }
    let folderName: string;
    for (let i = 0; i < folderNameSearchMap.length; i++) {
        if (folderNameSearchMap[i].folder_identifier === folder_identifier) {
            folderName = folderNameSearchMap[i].folderName;
            let parentId = folderNameSearchMap[i].parentId;
            if (prev_folder_identifier === folder_identifier) {
                level = level - 2;
            }
            let next_parentId;
            if (parentId === null) {
                level = 3;
            }
            prev_folder_identifier = parentId;
            console.log("PrevFolderIdentifier=============>", prev_folder_identifier);
            console.log("FolderIdentifier=============>", folder_identifier);
            break;
        }
    }

    // const Breadcrumbs: any[] = [];
    // const createBreadcrumb = () => {
    //     console.log("Level=============>", level);
    //     console.log("FolderNamewe=============>", folderName);
    //     Breadcrumbs.push({
    //         level: level,
    //         title: folderName,
    //         href: `/document-management/folders/${folder_identifier}`
    //     });
    //     level = level + 1;
    // };
    let Breadcrumb: any;
    const createBreadcrumb = () => {
        console.log("Level=============>", level);
        console.log("FolderNamewe=============>", folderName);
        Breadcrumb = {
            level: level,
            title: folderName,
            href: `/document-management/folders/${folder_identifier}`
        };
        level = level + 1;
    };
    createBreadcrumb();

    return (
        <>
            <RenderAppBreadcrumb breadcrumb={Breadcrumb}/>
            {/* <RenderAppBreadcrumb breadcrumbs={Breadcrumbs} lastLevel={2} /> */}
            {/* <DummyComponent folder_identifier={folder_identifier} folderNameSearchMap={folderNameSearchMap}/> */}
            <ClientPage documentData={documentData} folderIdentifier={folderIdentifier} />
        </>
    );
}
