import { renderContentForSideMenu } from "../actions";
import ClientPage from "../ClientPage";

export default async function SharedWithMePage() {
  const documentData = await renderContentForSideMenu(null, 'shared-with-me');
  const folderIdentifier = {
    parent : 'shared-with-me',
    folder_identifier : null
  }

  return <ClientPage documentData={documentData} folderIdentifier={folderIdentifier}/>;
}