import React from 'react'
import LoadCategoryData, { GetCategoryData } from './components/loadCategoryData'
import CategoryDataTable from './components/categoryDataTable';

export default async function Category() {
  const vendorCategoryData :{ categoryId: string; category: any; subcategory: string }[] = await LoadCategoryData();
  console.log(vendorCategoryData);
  const categoryDataDropdown = await GetCategoryData();
  console.log(categoryDataDropdown);
  return (
    <div>
        <CategoryDataTable vendorCategoryData={vendorCategoryData} categoryDataDropdown={categoryDataDropdown}/>
    </div>
  )
}
