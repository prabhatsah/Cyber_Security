"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shadcn/ui/form";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { projectManagers } from "@/app/(protected)/(apps)/sales-crm/deal/details/component/create-deal/components/deal_form_definition/projectManagerMap";
import { productSchema } from "../add_product_schema";
import { startProductData } from "../invoke_product";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButton } from "@/ikon/components/buttons";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealIdentifier: string;
}

interface NewProductDetails {
  [key: string]: {
    productIdentifier: string;
    productType: string;
    projectManager: string;
    productDescription: string;
  };
}

//type DealFormValues = z.infer<typeof dealSchema>;

const CreateProductDetailsForm: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  dealIdentifier,
}) => {
  console.log("deal identifier main form ", dealIdentifier);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [prjMngrCome, setPrjMngrCome] = useState(false);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [dealsData, setDealsData] = useState<any[]>([]);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching deal instances...");
        const dealInsData = await getMyInstancesV2({
          processName: "Deal",
          predefinedFilters: { taskName: "Add New Product" },
          mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
          projections: ["Data"],
        });
        console.log("deals fetched all daat :", dealInsData);
        var data = dealInsData;
        var taskId = dealInsData[0].taskId;
        setDealsData(data);
        setTaskId(taskId);
        console.log("deals fetched:", dealsData);

        const productInsData = await getMyInstancesV2({
          processName: "Dynamic Product Add",
          predefinedFilters: { taskName: "View State" },
          projections: ["Data"],
        });
        console.log("Products fetched all daat :", productInsData);
        setProductsData(productInsData.map((e: any) => e.data));
        console.log("Products fetched:", productsData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [dealIdentifier]);

  const formattedProduct = productsData.map(
    (product: {
      productName: any;
      productIdentifier: any;
      accountIdentifier: any;
      accountName: any;
    }) => ({
      value: product?.productIdentifier,
      label: product?.productName,
    })
  );

  const productData = [
    { value: "Professional Service", label: "Professional Service" },
    { value: "User License", label: "User License" },
    { value: "Service Level Agreement", label: "Service Level Agreement" },
    ...formattedProduct,
  ];

  const handleProductChange = (value: any) => {
    setSelectedProduct(value);
    if (value == "Professional Service") {
      const productDetails = dealsData[0].data.productDetails;
      for (const key in productDetails) {
        if (productDetails[key].productType === "Professional Service") {
          alert("Do not select 'Professional Services'");
          break;
        } else {
          setPrjMngrCome(true);
        }
      }
    } else {
      setPrjMngrCome(false);
    }
  };

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productDetails: {},
    },
  });

  const prepareProductData = (
    newData: { productDetails: any },
    dealsData: any[]
  ) => {
    const dealsDataDetails = dealsData[0].data;
    const productDetails = newData.productDetails;

    const productIdentifierKey = Object.keys(productDetails)[0];
    const productInfo = productDetails[productIdentifierKey];

    const preparedData = {
      dealName: dealsDataDetails.dealName,
      dynamicProductIdentifier: productIdentifierKey,
      productIdentifier: productInfo.productIdentifier,
      leadIdentifier: "",
      productStatus: "Product Created",
      dynamicProductData: {
        className: "Undefined",
      },
      updatedOn: new Date().toISOString(),
      dealStatus: dealsDataDetails.dealStatus,
      dealIdentifier: dealsDataDetails.dealIdentifier,
      quotation: {},
      productType: productInfo.productType,
      productDescription: productInfo.productDescription,
      projectManager: productInfo.projectManager,
    };

    return preparedData;
  };

  const handleOnSubmit = async (data: z.infer<typeof productSchema>) => {
    console.log("Form Data Submitted: ", data);

    const productIdentifier = v4();

    const newData = {
      ...data,
      productDetails: {
        [productIdentifier]: {
          productIdentifier: productIdentifier,
          productType: data.productDetails?.productType,
          projectManager: data.productDetails?.projectManager,
          productDescription: data.productDetails?.productDescription,
        },
      },
    };
    console.log("Final form data:", newData);

    const updatedDealsData = {
      ...dealsData[0].data.productDetails,
      ...newData.productDetails,
    };

    dealsData[0].data.productDetails = updatedDealsData;

    console.log("Updated Deals product Data:", updatedDealsData);
    console.log("Deals Data:", dealsData);

    const productData = prepareProductData(newData, dealsData);
    console.log("Prepared Product Data:", productData);

    await startProductData(productData, dealsData[0].data, taskId);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} id="deal-form">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  {/* <div className="mt-2">
                    <Label htmlFor="productName">
                      Product Name <b className="text-danger">&nbsp;*</b>
                    </Label>
                    <FormField
                      control={form.control}
                      name="productDetails.productType"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              handleProductChange(value);
                              field.onChange(value);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger
                              
                              >
                                <SelectValue placeholder="Select Product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productData.map((option: any) => (
                                <SelectItem
                                  key={option.productIdentifier}
                                  value={option.productName}
                                >
                                  {option.productName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}

                  <FormComboboxInput
                    items={productData}
                    formControl={form.control}
                    name={"productDetails.productType"}
                    label="Product Name *"
                    placeholder={"Select Product"}
                    onSelect={(value) => handleProductChange(value)}
                  />
                </div>

                <div
                  className={`grid gap-1.5 ${prjMngrCome ? "block" : "hidden"}`}
                >
                  {/* <div className="mt-2">
                    <Label htmlFor="projectManagerName">
                      Project Manager <b className="text-danger">&nbsp;*</b>
                    </Label>
                    <FormField
                      control={form.control}
                      name="productDetails.projectManager"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger
                              
                              >
                                <SelectValue placeholder="Select Project Manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projectManagers.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}

                  <FormComboboxInput
                    items={projectManagers}
                    formControl={form.control}
                    name={"productDetails.projectManager"}
                    label="Project Manager *"
                    placeholder={"Select Project Manager"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-1.5">
                  {/* <div className="mt-2">
                    <Label htmlFor="productDes" className="font-semibold">
                      Product Description
                    </Label>
                    <Controller
                      name="productDetails.productDescription"
                      control={form.control}
                      render={({ field }) => (
                        <Textarea
                          id="productDes"
                          placeholder="Enter product description here"
                          {...field}
                        />
                      )}
                    />
                  </div> */}

                  <FormTextarea
                    name={"productDetails.productDescription"}
                    formControl={form.control}
                    placeholder="Enter product description here"
                    label="Product Description"
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          {/* <Button type="submit" form="deal-form">
            Create
          </Button> */}
          <TextButton type="submit">Create</TextButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDetailsForm;
