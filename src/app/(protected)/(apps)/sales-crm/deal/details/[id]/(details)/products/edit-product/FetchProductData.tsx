import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export async function SelectedProductData(productIdentifier: string) {
    try {
        const data = await getMyInstancesV2<any>({
            processName: "Product",
            predefinedFilters: { taskName: "View State" },
            mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
            //projections:["Data.productIdentifier","Data.productType","Data.productDescription","Data.projectManager"]
        });
        console.log("Product data fetched successfully:", data);
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching product data:", error);
        throw error;
    }
}

