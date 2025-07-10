import MySuppliersComponent from "../../../_components/buyer/my-suppliers/my-suppliers-component"
import getMyAwardedSuppliers from "../../../_utils/buyer/my-suppliers/get-awarded-suppliers"
import { getRegisteredSuppliers } from "../../../_utils/buyer/my-suppliers/get-registered-suppliers"

export default async function Page(){
    
    //const suppliers = await getRegisteredSuppliers()
    const suppliers = await getMyAwardedSuppliers()
    console.log('suppliers', suppliers)
    return (
        <>
            <MySuppliersComponent suppliers={suppliers}/>
        </>
    )
}