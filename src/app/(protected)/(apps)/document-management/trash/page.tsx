import { renderContentForSideMenu } from "../actions";
import ClientPage from "../ClientPage";

export default async function TrashPage() {
  const documentData = await renderContentForSideMenu(null, 'trash');

  const folderIdentifier = {
    parent : 'trash',
    folder_identifier : null
  }

  return <ClientPage documentData={documentData} folderIdentifier={folderIdentifier}/>;
}