import { renderContentForSideMenu } from "../actions";
import ClientPage from "../ClientPage";

export default async function StarredPage() {
  const documentData = await renderContentForSideMenu(null, 'starred');
  const folderIdentifier = {
    parent : 'starred',
    folder_identifier : null
  }
  return <ClientPage documentData={documentData} folderIdentifier={folderIdentifier}/>;
}
