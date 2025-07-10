// "use client"
// import { useEffect, useState } from "react";
// import { RenderAppBreadcrumb } from "@/components/ikon-components/app-breadcrumb";
// import { folderNameSearchMap } from "@/lib/actions/getData";

// interface BreadcrumbItemProps {
//     title: string;
//     level: number;
//     href: string;
// }

// // let level = 3;
// // let prev_folder_identifier: string = "";
// export default function DummyComponent({ folder_identifier }: { folder_identifier: string }) {
//     const [level, setLevel] = useState(3);
//     const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemProps>({ title: "", level: 0, href: "" });
//     const [prev_folder_identifier, setPrev_folder_identifier] = useState("");
//     useEffect(() => {
//         let folderName: string;
//         for (let i = 0; i < folderNameSearchMap.length; i++) {
//             if (folderNameSearchMap[i].folder_identifier === folder_identifier) {
//                 folderName = folderNameSearchMap[i].folderName;
//                 let parentId = folderNameSearchMap[i].parentId;
//                 if (prev_folder_identifier === folder_identifier) {
//                     setLevel(level - 2);
//                 }
//                 let next_parentId;
//                 if (parentId === null) {
//                     // level = 3;
//                     setLevel(3);
//                 }
//                 // prev_folder_identifier = parentId;
//                 setPrev_folder_identifier(parentId);
//                 console.log("PrevFolderIdentifier=============>", prev_folder_identifier);
//                 console.log("FolderIdentifier=============>", folder_identifier);
//                 break;
//             }
//         }
//         // let Breadcrumb: any;
//         const createBreadcrumb = () => {
//             console.log("Level=============>", level);
//             console.log("FolderNamewe=============>", folderName);
//             let Breadcrumb = {
//                 level: level,
//                 title: folderName,
//                 href: `/document-management/folders/${folder_identifier}`
//             }
//             setBreadcrumb(Breadcrumb);
//             // level = level + 1;
//             setLevel(level + 1);
//         };
//         createBreadcrumb();
//     }, [folder_identifier]);

//     return (
//         <>
//             <RenderAppBreadcrumb breadcrumb={breadcrumb} />
//         </>
//     );
// }


// "use client";

// import { useEffect, useState, useRef, use } from "react";
// import { RenderAppBreadcrumb } from "@/components/ikon-components/app-breadcrumb";
// // import { folderNameSearchMap } from "@/lib/actions/getData";

// interface BreadcrumbItemProps {
//     title: string;
//     level: number;
//     href: string;
// }
// let level = 3;
// let prevFolderIdentifier = "";
// export default function DummyComponent({ folder_identifier, folderNameSearchMap }: { folder_identifier: string, folderNameSearchMap: any }) {
//     // let level: any;
//     // useEffect(() => {
//     //     const [level, setLevel] = useState(3);
//     //     // level = useRef(3);
//     // }, []);
//     // const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemProps>({
//     //     title: "",
//     //     // level: level.current,
//     //     level: level,
//     //     href: "",
//     // });
//     let breadcrumb: BreadcrumbItemProps;
//     // const [prevFolderIdentifier, setPrevFolderIdentifier] = useState("");

//     // const prevFolderIdentifierRef = useRef("");
//     // console.log("folder_identifier=============>", folder_identifier);
//     useEffect(() => {
//         // console.log("useEffect called=============>", folder_identifier);
//         let folderName = "Default Folder Name"; // Fallback in case no match is found
//         let parentId: string | null = null;
//         // console.log("folderNameSearchMap=============>", folderNameSearchMap);
//         // Find folder details in the search map
//         for (let i = 0; i < folderNameSearchMap.length; i++) {
//             if (folderNameSearchMap[i].folder_identifier === folder_identifier) {
//                 folderName = folderNameSearchMap[i].folderName;
//                 parentId = folderNameSearchMap[i].parentId;
//                 // console.log("Folder Name Found=============>", folderName);
//                 break;
//             }
//         }

//         // Adjust level based on previous folder
//         if (prevFolderIdentifier === folder_identifier) {
//             // setLevel((prevLevel) => prevLevel - 2);
//             level = level - 2;
//         } else if (parentId === null) {
//             console.log("Setting level to 3");
//             // setLevel(3);
//             level = 3;
//         }
//         console.log("Level=============>", level);
//         console.log("FolderName=============>", folderName);
//         // Update breadcrumb
//         // setBreadcrumb({
//         //     level: level,
//         //     title: folderName,
//         //     href: `/document-management/folders/${folder_identifier}`,
//         // });

//         breadcrumb = {
//             level: level,
//             title: folderName,
//             href: `/document-management/folders/${folder_identifier}`,
//         }

//         // Update the previous folder reference
//         // prevFolderIdentifier = parentId || "";
//         // setPrevFolderIdentifier(parentId || "");
//         prevFolderIdentifier = parentId || "";
//         // setLevel((prevLevel) => prevLevel + 1);
//         level = level + 1;
//     }, [folder_identifier]);

//     return (
//         <>
//             <RenderAppBreadcrumb breadcrumb={breadcrumb} />
//         </>
//     );
// }

'use client'
import { useEffect, useState, useRef } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
interface BreadcrumbItemProps {
    title: string;
    level: number;
    href: string;
}

export default function DummyComponent({ folder_identifier, folderNameSearchMap }: { folder_identifier: string, folderNameSearchMap: any }) {
    const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemProps | null>(null);
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const savedLevel = localStorage.getItem('level');
        let level = savedLevel ? parseInt(savedLevel, 10) : 3;
        let prevFolderIdentifier = localStorage.getItem('prevFolderIdentifier') || "";
        let folderName = "Default Folder Name";
        let parentId: string | null = null;

        for (let i = 0; i < folderNameSearchMap.length; i++) {
            if (folderNameSearchMap[i].folder_identifier === folder_identifier) {
                folderName = folderNameSearchMap[i].folderName;
                parentId = folderNameSearchMap[i].parentId;
                break;
            }
        }

        // Adjust level based on previous folder
        if (prevFolderIdentifier === folder_identifier) {
            // setLevel((prevLevel) => prevLevel - 2);
            level = level - 2;
        } else if (parentId === null) {
            // setLevel(3);
            level = 3;
        }

        // setPrevFolderIdentifier(folder_identifier);
        prevFolderIdentifier = parentId || "";

        // Save the current folder_identifier to local storage
        localStorage.setItem('prevFolderIdentifier', prevFolderIdentifier);

        const createBreadcrumb = () => {
            console.log("Level=============>", level);
            console.log("FolderNamewe=============>", folderName);
            const breadcrumb = {
                level: level,
                title: folderName,
                href: `/document-management/folders/${folder_identifier}`
            }
            setBreadcrumb(breadcrumb);
            level = level + 1;
            localStorage.setItem('level', level.toString());
        };
        createBreadcrumb();

        // Save the current level to local storage

        console.log("Level updated to:", level);
    }, [folder_identifier]);


    return breadcrumb ? <RenderAppBreadcrumb breadcrumb={breadcrumb} /> : null;
}
