import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService"


export default async function LoadCategoryData() {

  const vendorCategoryInstance = await getMyInstancesV2({
    processName: "Vendor Category",
    predefinedFilters: { taskName: "Edit Asset Configuration" },
  })
  console.log(vendorCategoryInstance);
  let assetData: { categoryId: string; category: any; subcategory: string }[] = [];
  let categoryData = {};

  if (vendorCategoryInstance && vendorCategoryInstance[0].data) {
    const vendorCategoryData: { categoryData?: string, assetData?: string } = vendorCategoryInstance[0]?.data;
    categoryData = vendorCategoryData?.categoryData || {};
    assetData = Array.isArray(vendorCategoryData?.assetData) ? vendorCategoryData.assetData : [];
  }

  if (assetData.length) {
    Object.entries(categoryData).forEach(([key, category]) => {
      const exists = assetData.some(item => item.categoryId === key);
      if (!exists) {
        assetData.push({
          categoryId: key,
          category: category,
          subcategory: "---"
        });
      }
    });
    return assetData
  }

  return [];
}


export async function GetCategoryData() {
  const vendorCategoryInstance = await getMyInstancesV2({
    processName: "Vendor Category",
    predefinedFilters: { taskName: "Edit Asset Configuration" },
  })

  let categoryDatas: Record<string, string> = {};
  if (vendorCategoryInstance && vendorCategoryInstance[0].data) {
    const vendorCategoryData: { categoryData?: Record<string, string> } = vendorCategoryInstance[0]?.data;
    categoryDatas = vendorCategoryData?.categoryData || {};
  }
  const categoryDataDropdown = Object.keys(categoryDatas).length ? Object.keys(categoryDatas).map((categoryData) => ({
    label: categoryDatas[categoryData],
    value: categoryData
  })
  ) : [];
  return categoryDataDropdown;
}