import { renderContentForSideMenu } from "./actions";
import ClientPage from "./ClientPage";
import { FolderIdentifier } from "./types";

export default async function MyDrive() {
  const documentData = await renderContentForSideMenu(null, 'my-drive');
  const folderIdentifier: FolderIdentifier = {
    parent : 'my-drive',
    folder_identifier : null
  }

  return <ClientPage documentData={documentData} folderIdentifier={folderIdentifier}/>;
}