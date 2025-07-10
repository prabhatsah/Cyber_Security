import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getAllSuppliers } from "../../register/supplier-register-form";
import { getUserGroups } from "@/ikon/utils/actions/users";

export default async function getSupplierId() {
  const currUser = await getCurrentUserId();
  const userGroupDetails = await getUserGroups(currUser);
  console.log(userGroupDetails, "curr user groups");
  const userGroupArray = userGroupDetails.map((group: any) => group.groupName);
  console.log("group arr", userGroupArray);
  const allSuppliers = await getAllSuppliers();
  const pendingOrReviewSuppliers = allSuppliers.filter(
    (supplier) => supplier.status === "Approved"
  );
  let currSupplier = null;
  pendingOrReviewSuppliers.forEach((supplier) => {
    const id = supplier.supplierId;
    const name = supplier.companyName;
    const group = `Supplier_${name}_${id}`;
    if (userGroupArray.includes(group)) currSupplier = id;
  });
  return currSupplier;
}
