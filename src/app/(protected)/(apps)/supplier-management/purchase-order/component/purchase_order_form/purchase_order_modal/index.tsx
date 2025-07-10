import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { Checkbox } from "@/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { Form } from "@/shadcn/ui/form";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButton } from "@/ikon/components/buttons";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { format } from "date-fns";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { poSchema } from "../purchase_schema";
import { startPurchaseOrderData } from "../purchase_invoke";

type POFormValues = z.infer<typeof poSchema>;

interface PurchaseOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseData: any;
}

interface ItemProps {
  itemImage: Record<string, any>;
  itemIdentifier: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  itemDescription: string;
  vendorId: string;
  category: string;
  categoryText: string;
  subCategory: string;
  itemUnit: string;
  currency: string;
  isDeleted: boolean;
  requiredItem?: string;
}

interface SelectedItemProps {
  itemId: string;
  itemName: string;
  itemUnit: string;
  itemPrice: number;
  vendor: string;
  requiredItem?: string;
}

interface VendorProps {
  contactId: string;
  contactFirstName: string;
  contactMiddleName?: string;
  contactLastName: string;
  contactFullName: string;
  contactPhnNumber: string;
  contactAltPhnNumber?: string;
  contactEmail: string;
  contactAltEmail?: string;
  contactOrganisation: string;
  source: string;
  defaultTags: string;
  vendorName: string;
  vendorAddress: string;
  vendorState: string;
  vendorPinCode: string;
  vendorCity: string;
  vendorCountry: string;
}

interface ItemTableProps {
  itemId: string;
  itemName: string;
}

const PurchaseOrderModal: React.FC<PurchaseOrderDetailsProps> = ({
  isOpen,
  onClose,
  purchaseData,
}) => {
  const form = useForm<POFormValues>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      selectedPO: "",
      deliveryDate: new Date(),
      vendor: "",
      paymentTerms: "",
      vat: "",
      currency: "USD",
      billingAmount: "",
      discountPercent: "",
      discountedAmount: "",
      vatPercent: "",
      vatAmount: "",
      finalAmount: "",
      remark: "",
    },
  });

  const { watch, setValue } = form;
  const [vendorItem, setVendorItem] = useState([]);
  const [selectedItemPO, setSelectedItemPO] = useState([]);
  const [vendor, setVendor] = useState<VendorProps[]>([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);
  const [item, setItem] = useState([]);
  const [selectedItems, setSelectedItems] = useState<ItemProps[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [selectedPOValue, setSelectedPOValue] = useState<string | null>(null);
  const [itemTable, setItemTable] = useState<ItemTableProps[]>([]);

  const billingAmount = watch("billingAmount");
  const discountPercent = watch("discountPercent");
  const vatPercent = watch("vatPercent");

  const fetchVendorData = async () => {
    try {
      const vendorInsData = await getMyInstancesV2({
        processName: "Global Contacts",
        predefinedFilters: { taskName: "View" },
        projections: ["Data"],
      });

      const vendorData: any = vendorInsData.map((e: any) => e.data);
      console.log("vendorData", vendorData);
      setVendor(vendorData);

      const vendorItems = vendorData.map((vendor: { vendorName: any }) => ({
        value: vendor.vendorName,
        label: vendor.vendorName,
      }));
      setVendorItem(vendorItems);

      const itemsInsData = await getMyInstancesV2({
        processName: "Vendable Item",
        predefinedFilters: { taskName: "View Item" },
        projections: ["Data"],
      });

      const itemsData: any = itemsInsData.map((e: any) => e.data);
      console.log("itemsData", itemsData);
      setItem(itemsData);
    } catch (error) {
      console.error("Error fetching Vendor Data:", error);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  useEffect(() => {
    console.log("Purchase data ", purchaseData);
    const purchaseOrderOptions = purchaseData.purchaseData.map(
      (po: { purchaseOrderId: any }) => ({
        value: po.purchaseOrderId,
        label: po.purchaseOrderId,
      })
    );
    setPurchaseOrderItems(purchaseOrderOptions);
    //console.log("Purchase data in code ", purchaseOrderOptions);
  }, [purchaseData]);

  useEffect(() => {
    calculateFinalBillingAmountWithoutItem();
  }, [billingAmount, discountPercent, vatPercent]);

  const calculateFinalBillingAmountWithoutItem = () => {
    if (!billingAmount || isNaN(Number(billingAmount))) return;

    const billing = Number(billingAmount);
    const discount = discountPercent ? Number(discountPercent) : 0;
    const vat = vatPercent ? Number(vatPercent) : 0;

    const discountedAmount = ((billing * discount) / 100).toFixed(2);
    const remainingAmount = billing - Number(discountedAmount);

    const vatAmount = ((remainingAmount * vat) / 100).toFixed(2);

    const finalAmount = (remainingAmount + Number(vatAmount)).toFixed(2);

    setValue("discountedAmount", discountedAmount);
    setValue("vatAmount", vatAmount);
    setValue("finalAmount", finalAmount);
  };
  const [isNewPO, setIsNewPO] = useState(true);
  const [withItem, setWithItem] = useState(true);

  const [addItemsChecked, setAddItemsChecked] = useState(false);

  const handleAddItems = () => {
    setAddItemsChecked(!addItemsChecked);
    console.log("Add Items checkbox clicked");
  };

  const handleSelectedPO = async (value: string) => {
    setSelectedPOValue(value);

    console.log("selected po ", value);
    for (var i in purchaseData.purchaseData) {
      if (selectedPOValue == purchaseData.purchaseData[i].purchaseOrderId) {
        var itemId = Object.values(
          purchaseData.purchaseData[i].purchaseOrderObj
        )[0]?.itemId;
        console.log(itemId);
        setSelectedItemPO(purchaseData.purchaseData[i].purchaseOrderObj);
      }
    }

    const itemsInsData = await getMyInstancesV2({
      processName: "Vendable Item",
      predefinedFilters: { taskName: "View Item" },
      projections: ["Data"],
    });

    const filteredItems = itemsInsData.filter(
      (item: any) => item.data.itemId === itemId
    );
    var itemName = filteredItems[0]?.data?.itemName;
    var itemTableArray = [
      {
        itemId: itemId,
        itemName: itemName,
      },
    ];
    console.log("item table ", itemTableArray);
    setItemTable(itemTableArray);
  };

  const handleCheckboxChange = (row: ItemProps, checked: boolean) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, row]
        : prev.filter((item) => item.itemId !== row.itemId)
    );
  };

  const handleInputChange = (rowId: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [rowId]: value }));
  };

  const onSubmit = async (data: POFormValues) => {
    console.log("Purchase data ", purchaseData);
    console.log("selected items  ", selectedItems);

    const profileData = await getProfileData();
    var filteredData = {};

    if (!isNewPO) {
      const filteredDataPurchase =
        purchaseData.purchaseData.find(
          (item: { purchaseOrderId: string | undefined }) =>
            item.purchaseOrderId === data.selectedPO
        ) || {};

      console.log(filteredData);

      filteredData = {
        ...filteredDataPurchase,
        purchaseOrderIdentifier: uuid(),
        purchaser: profileData.USER_NAME,
        creationDate: format(new Date(), "yyyy-MM-dd"),
        purchaseOrderId: `PO-${Date.now()}`,
        delivaryDate: format(data.deliveryDate, "yyyy-MM-dd"),
        note: data.remark,
      };

      console.log("previous po ", filteredData);
    } else {
      var vendorname = data.vendor;
      var vendor_Address = "";
      var vendor_contact_name = "";
      var vendor_contact_phoneNumber = "";
      var vendor_contact_email = "";
      var organition_name = "";
      for (let each in vendor) {
        if (vendor[each]["vendorName"] == vendorname) {
          vendor_Address +=
            vendor[each]["vendorAddress"] +
            " , " +
            vendor[each]["vendorState"] +
            " , " +
            vendor[each]["vendorPinCode"];
          vendor_contact_name =
            vendor[each]["contactFirstName"] +
            " , " +
            vendor[each]["contactMiddleName"] +
            " , " +
            vendor[each]["contactLastName"];
          vendor_contact_phoneNumber = vendor[each]["contactPhnNumber"];
          vendor_contact_email = vendor[each]["contactEmail"];
          organition_name = vendor[each]["contactOrganisation"];
        }
      }
      if (!withItem) {
        filteredData = {
          purchaseOrderIdentifier: uuid(),
          purchaser: profileData.USER_NAME,
          creationDate: format(new Date(), "yyyy-MM-dd"),
          purchaseOrderId: "PO-" + Number(new Date()),
          purchaseOrderObj: [],
          deliveryDate: format(data.deliveryDate, "yyyy-MM-dd"),
          vendor: data.vendor,
          "payment-terms": data.paymentTerms,
          vatOrGst: data.vat,
          billingCurrency_manually: data.currency ?? "",
          purchaseOrderName: data?.namePo,
          note: data.remark,
          purchaseOrderStatus: "Created",
          vendorAddress: vendor_Address,
          vendorContactName: vendor_contact_name,
          vendorContactPhonenumber: vendor_contact_phoneNumber,
          vendorContactEmail: vendor_contact_email,
          organizationName: organition_name,
          createPurchaseFrom: "manually",
          POWithoutItem: true,
          billingAmtWithoughtItem: data.billingAmount,
          discountPercentWithoughtItem: data.discountPercent,
          discountedAmtWithoughtItem: data.discountedAmount,
          vatOrGstPercentWithoughtItem: data.vatPercent,
          vatOrGstAmtWithoughtItem: data.vatAmount,
          finalAmountWithoughtItem: data.finalAmount,
        };

        console.log("without itemm ", filteredData);
      } else {
        let purchaseItemObj: Record<
          string,
          { itemId: string; quantity: number; item: string; }
        > = {};

        selectedItems.forEach((item) => {
          purchaseItemObj[item.itemId] = {
            itemId: item.itemId,
            quantity: item.itemQuantity,
            item: item.itemName,
          };
        });

        filteredData = {
          purchaseOrderIdentifier: uuid(),
          purchaser: profileData.USER_NAME,
          creationDate: moment().format("YYYY-MM-DD"),
          purchaseOrderId: "PO-" + Number(new Date()),
          purchaseOrderObj: Object.values(purchaseItemObj),
          delivaryDate: format(data.deliveryDate, "yyyy-MM-dd"),
          vendor: data.vendor,
          "payment-terms": data.paymentTerms,
          "selVatGst-manually": data.vat,
          billingCurrency_manually: data.currency,
          purchaseOrderName: data.namePo,
          note: data.remark,
          purchaseOrderStatus: "Created",
          vendorAddress: vendor_Address,
          vendorContactName: vendor_contact_name,
          vendorContactPhonenumber: vendor_contact_phoneNumber,
          vendorContactEmail: vendor_contact_email,
          organitionName: organition_name,
          createPurchaseFrom: "manually",
          POWithoughtItem: false,
          finalAmount: data.finalAmount,
        };
        console.log("with itemm ", filteredData);
      }
    }
    await startPurchaseOrderData(filteredData);
    console.log("Form Submitted", filteredData);
    onClose();
  };

  const columns: ColumnDef<ItemProps>[] = [
    {
      id: "select",
      header: () => <div style={{ textAlign: "center" }}>Select</div>,
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedItems.some(
            (item) => item.itemId === row.original.itemId
          )}
          onChange={(e) =>
            handleCheckboxChange(row?.original, e.target.checked)
          }
        />
      ),
    },
    {
      accessorKey: "itemId",
      header: () => <div style={{ textAlign: "center" }}>Item Id</div>,
      cell: ({ row }) => <span>{row.original?.itemId || "n/a"}</span>,
    },
    {
      accessorKey: "itemName",
      header: () => <div style={{ textAlign: "center" }}>Item</div>,
      cell: ({ row }) => <span>{row.original?.itemName}</span>,
    },
    {
      accessorKey: "itemUnit",
      header: () => <div style={{ textAlign: "center" }}>Available Stock</div>,
      cell: ({ row }) => <span>{row.original?.itemUnit}</span>,
    },
    {
      accessorKey: "itemPrice",
      header: () => (
        <div style={{ textAlign: "center" }}>Last Purchase Price</div>
      ),
      cell: ({ row }) => <span>{row.original?.itemPrice}</span>,
    },
    {
      accessorKey: "requiredItem",
      header: () => <div style={{ textAlign: "center" }}>Required Item</div>,
      cell: ({ row }) => (
        <input
          type="number"
          value={inputValues[row.original.itemId] || ""}
          onChange={(e) =>
            handleInputChange(row.original.itemId, e.target.value)
          }
        />
      ),
    },
  ];

  const columnsOfItem: ColumnDef<ItemTableProps>[] = [
    {
      accessorKey: "itemId",
      header: () => <div style={{ textAlign: "center" }}>Item Id</div>,
      cell: ({ row }) => <span>{row.original?.itemId || "n/a"}</span>,
    },
    {
      accessorKey: "itemName",
      header: () => <div style={{ textAlign: "center" }}>Item</div>,
      cell: ({ row }) => <span>{row.original?.itemName}</span>,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Items</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="grid gap-1.5">
                <div className="flex gap-2 items-center">
                  <Checkbox
                    checked={isNewPO}
                    onCheckedChange={() => setIsNewPO(true)}
                  />
                  <label>New PO</label>
                  <Checkbox
                    checked={!isNewPO}
                    onCheckedChange={() => setIsNewPO(false)}
                  />
                  <label>Copy From Previous PO</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              {isNewPO ? (
                <FormComboboxInput
                  name={"vendor"}
                  items={vendorItem}
                  formControl={form.control}
                  placeholder="Select Vendor"
                  label="Vendor *"
                />
              ) : (
                <div className="grid gap-1.5">
                  <FormComboboxInput
                    name="selectedPO"
                    items={purchaseOrderItems}
                    formControl={form.control}
                    placeholder="Select PO"
                    label="Select PO *"
                    onSelect={(value) => handleSelectedPO(value)}
                  />
                </div>
              )}
              <div>
                <FormDateInput
                  name={"deliveryDate"}
                  formControl={form.control}
                  label="Delivery Date *"
                  placeholder="Please Enter Delivery Date"
                />
              </div>

              {isNewPO && (
                <>
                  <FormComboboxInput
                    name={"paymentTerms"}
                    items={[
                      { value: "Prepayment", label: "Prepayment" },
                      { value: "Postpayment", label: "Postpayment" },
                    ]}
                    formControl={form.control}
                    placeholder="Select Payment Terms"
                    label="Payment Terms"
                  />
                  <FormComboboxInput
                    name={"vat"}
                    items={[
                      { value: "VAT", label: "VAT" },
                      { value: "GST", label: "GST" },
                    ]}
                    formControl={form.control}
                    placeholder="Select VAT/GST"
                    label="Select VAT/GST"
                  />
                  <FormComboboxInput
                    name={"currency"}
                    items={[
                      { value: "USD", label: "USD" },
                      { value: "GBP", label: "GBP" },
                      { value: "INR", label: "INR" },
                      { value: "QAR", label: "QAR" },
                      { value: "SAR", label: "SAR" },
                      { value: "AED", label: "AED" },
                    ]}
                    formControl={form.control}
                    placeholder="Select Currency"
                    label="Select Currency"
                  />
                </>
              )}
            </div>
            {isNewPO && (
              <div className="mb-2">
                <label className="text-sm font-medium">
                  Select order with item or without item *
                </label>
                <div className="flex gap-2 mt-2 items-center justify-between">
                  <div className="flex gap-2">
                    <Checkbox
                      checked={withItem}
                      onCheckedChange={() => setWithItem(true)}
                    />
                    <label>Item</label>
                    <Checkbox
                      checked={!withItem}
                      onCheckedChange={() => setWithItem(false)}
                    />
                    <label>Without Item</label>
                  </div>
                  {withItem && (
                    <div className="right flex gap-2">
                      <Checkbox
                        checked={addItemsChecked}
                        onCheckedChange={handleAddItems}
                      />
                      <label>Add Items</label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {addItemsChecked && isNewPO && withItem &&(
              <div className="grid grid-cols-1 mb-2">
                <DataTable columns={columns} data={item} />
              </div>
            )}

            {!withItem && (
              <>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <FormInput
                    name={"namePo"}
                    formControl={form.control}
                    placeholder="Enter Name(PO)"
                    label="Name(PO) *"
                  />
                  <FormInput
                    name={"billingAmount"}
                    formControl={form.control}
                    placeholder="Enter Billing Amount"
                    label="Billing Amount"
                  />
                  <FormInput
                    name={"discountPercent"}
                    formControl={form.control}
                    placeholder="Enter Discount"
                    label="Discount(%) *"
                  />
                  <FormInput
                    name={"discountedAmount"}
                    formControl={form.control}
                    placeholder="Enter Discounted Amount"
                    label="Discounted Amount *"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-2">
                  <FormInput
                    name={"vatPercent"}
                    formControl={form.control}
                    placeholder="Enter VAT(%)"
                    label="VAT(%) *"
                  />
                  <FormInput
                    name={"vatAmount"}
                    formControl={form.control}
                    label="VAT Amount *"
                    disabled
                  />
                  <FormInput
                    name={"finalAmount"}
                    formControl={form.control}
                    label="Final Amount *"
                    disabled
                  />
                </div>
              </>
            )}

            {selectedPOValue && (
              <div className="grid grid-cols-1 mb-2">
                <DataTable columns={columnsOfItem} data={itemTable} />
              </div>
            )}

            <div className="mb-2">
              <FormTextarea
                name={"remark"}
                formControl={form.control}
                label="Remark"
                placeholder="Enter Remark"
              />
            </div>

            <DialogFooter>
              <TextButton id="create-button" type="submit">
                Create
              </TextButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderModal;
