import uploadedRfpData from "../../_utils/common/get-all-upload-data";
import TenderHomeComponent from "../../home";

export default async function TenderHome(){
    
    
const rfpData = await uploadedRfpData();
    return (
        <>
       
            <TenderHomeComponent rfpData={rfpData}/>
        </>
    )
}
