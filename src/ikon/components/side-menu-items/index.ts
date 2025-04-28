import { Folder, Star, Share2, Trash2, File } from "lucide-react";

interface MenuItem {
    title: string;
    iconClass: React.ComponentType;
    submenu: MenuItem[];
    href?: string;
}

function createSideMenu(data: any): MenuItem[] {
    const menuItems: MenuItem[] = [
        {
            title: 'My Drive',
            iconClass: Folder,
            href: '/document-management/my-drive',
            submenu: [],
        },
        {
            title: 'Shared with me',
            iconClass: Share2,
            href: '/document-management/shared-with-me',
            submenu: [],
        },
        {
            title: 'Starred',
            iconClass: Star,
            href: '/document-management/starred',
            submenu: [],
        },
        {
            title: 'Trash',
            iconClass: Trash2,
            href: '/document-management/trash',
            submenu: [],
        },
    ];
    let parentFolderList = data.documentData;
    if (Array.isArray(parentFolderList)) {
        for (let i = 0; i < parentFolderList.length; i++) {
            if(parentFolderList[i].type === 'folder') 
                menuItems[0].submenu.push({title: parentFolderList[i].name, iconClass: Folder, href: `/document-management/folders/${parentFolderList[i].folder_identifier}`, submenu: []});
        }
    }
    return menuItems;
}

export {createSideMenu};