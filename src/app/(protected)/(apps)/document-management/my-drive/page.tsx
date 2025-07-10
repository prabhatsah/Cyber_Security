import { renderContentForSideMenu } from "../actions";
import ClientPage from "../ClientPage";

export default async function MyDrive() {
  const documentData = await renderContentForSideMenu(null, 'my-drive');

  const folderIdentifier = {
    parent : 'my-drive',
    folder_identifier : null
  }

  return <ClientPage documentData={documentData} folderIdentifier={folderIdentifier}/>;
}