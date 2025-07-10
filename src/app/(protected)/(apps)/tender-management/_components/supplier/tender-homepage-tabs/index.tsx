import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import SupplierHomeComponent from "../supplier-home-component";
import SupplierHomeMyBids from "../home-my-bids";
import ConfigurationTenderPage from "../configuration/page";

interface Props {
  publishedDraftData : any;
  currentAccountBids : any;
}

const TenderHomePageWithTabs = ({
  publishedDraftData,
  currentAccountBids,
} : Props) => {
    return (
      <Tabs defaultValue="allTenders" className="w-full">
        <TabsList variant="solid">
          <TabsTrigger value="allTenders">All Tenders</TabsTrigger>
          <TabsTrigger value="myTenders">My Bids</TabsTrigger>
          <TabsTrigger value="config">Tenders from External Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="allTenders">
          <SupplierHomeComponent data={publishedDraftData} />
        </TabsContent>
        <TabsContent value="myTenders">
          <SupplierHomeMyBids data={currentAccountBids} />
        </TabsContent>
        <TabsContent value="config"><ConfigurationTenderPage /></TabsContent>
      </Tabs>
    );
};

export default TenderHomePageWithTabs