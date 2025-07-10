import { format, parse } from 'date-fns';

export default function RoleWiseFtData({forecastedProductData,baselineProductData}:{forecastedProductData:any,baselineProductData:any}) {
    var productType = forecastedProductData.productType ? forecastedProductData.productType : (baselineProductData.productType ? baselineProductData.productType : "");
    console.log(productType);
  
    if (productType == "Professional Service") {
  
      const baselineResourceDataWithAllocation = baselineProductData.resourceDataWithAllocation == undefined ? [] : baselineProductData.resourceDataWithAllocation;
      const forecastedResourceDataWithAllocation = forecastedProductData.resourceDataWithAllocation == undefined ? [] : forecastedProductData.resourceDataWithAllocation;
  
      const baselineRevenueDateMap = new Map();
      const forcastedRevenueDateMap = new Map();
      const baselineTotalFteRoleMap = new Map();
      const forecastTotalFteRoleMap = new Map();
      const fteBillingTypeMapRoleMap = new Map();
      const roleWiseFteData = [];
  
      for (const resObj of baselineResourceDataWithAllocation) {
        const role = resObj.role;
        const prevTotalFte_t = baselineTotalFteRoleMap.get(role);
        const prevTotalFte = prevTotalFte_t == undefined ? 0 : prevTotalFte_t;
        const allocation = resObj.allocation;
        let totalFte = 0;
        
        for (const [monthYear, fte] of Object.entries(allocation)) {
          const dateObj = parse(monthYear, "MMM_y", new Date());
          const date = format(dateObj, "yyyy-MM");
          baselineRevenueDateMap.set(date, 0);
          totalFte += fte;
        }
        
        baselineTotalFteRoleMap.set(role, prevTotalFte + totalFte);
      }
  
      console.log(baselineTotalFteRoleMap);
  
      for (const resObj of forecastedResourceDataWithAllocation) {
        const role = resObj.role;
        const prevTotalFte_t = forecastTotalFteRoleMap.get(role);
        const prevTotalFte = prevTotalFte_t == undefined ? 0 : prevTotalFte_t;
        const allocation = resObj.allocation;
        let totalFte = 0;
  
        for (const [monthYear, fte] of Object.entries(allocation)) {
          const dateObj = parse(monthYear, "MMM_y", new Date());
          const date = format(dateObj, "yyyy-MM");
          forcastedRevenueDateMap.set(date, 0);
          totalFte += fte;
        }
  
        forecastTotalFteRoleMap.set(role, prevTotalFte + totalFte);
      }
  
      console.log(forecastTotalFteRoleMap);
  
      const roleNameSet = [...baselineTotalFteRoleMap.keys(), ...forecastTotalFteRoleMap.keys()];
  
      console.log(roleNameSet);
  
      for (const roleName of roleNameSet) {
        const fteResourceTypeMap = new Map();
        const baselineFte = baselineTotalFteRoleMap.get(roleName);
        const forecastFte = forecastTotalFteRoleMap.get(roleName);
        fteResourceTypeMap.set("baseline", baselineFte == undefined ? 0 : baselineFte);
        fteResourceTypeMap.set("forecast", forecastFte == undefined ? 0 : forecastFte);
        fteBillingTypeMapRoleMap.set(roleName, fteResourceTypeMap);
      }
  
      for (const [role, fteBillingTypeMap] of fteBillingTypeMapRoleMap) {
        const baselineFte_t = fteBillingTypeMap.get("baseline");
        const baselineFte = baselineFte_t == undefined ? 0 : baselineFte_t;
        const forecastFte_t = fteBillingTypeMap.get("forecast");
        const forecastFte = forecastFte_t == undefined ? 0 : forecastFte_t;
        const totalFte = baselineFte + forecastFte;
        const baselineFtePercentage = (totalFte == 0 ? "0" : ((baselineFte/totalFte)*100).toFixed(2)) + "%";
        const forecastFtePercentage = (totalFte == 0 ? "0" : ((forecastFte/totalFte)*100).toFixed(2)) + "%";
        
        roleWiseFteData.push({
          role: role,
          baseline: baselineFte,
          forecast: forecastFte,
          baselineStr: baselineFte.toFixed(2),
          forecastStr: forecastFte.toFixed(2),
          baselinePercentage: baselineFtePercentage,
          forecastPercentage: forecastFtePercentage
        });
      }
  
      return roleWiseFteData;
    }
    return [];
}
