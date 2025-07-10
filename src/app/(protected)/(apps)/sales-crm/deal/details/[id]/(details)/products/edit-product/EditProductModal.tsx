import React, { useEffect, useState } from "react";
import { SelectedProductData } from "./FetchProductData";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/shadcn/ui/button";
import { invokeProductProcess } from "./invokeProduct";
import { projectManagers } from "../../../../component/create-deal/components/deal_form_definition/projectManagerMap";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIdentifier: string;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, productIdentifier }) => {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: { projectManager: "", productDescription: "", productType: "" },
  });
  const productType = form.watch("productType");

  // Fetch product data when the modal is opened
  useEffect(() => {
    if (isOpen && productIdentifier) {
      fetchProductData();
    }
  }, [isOpen, productIdentifier]);

  // Update form values once data is fetched
  useEffect(() => {
    if (productData && productData.length > 0) {
      form.reset({
        projectManager: productData[0]?.data?.projectManager || "",
        productType: productData[0]?.data?.productType || "",
        productDescription: productData[0]?.data?.productDescription || "",
      });
      setLoading(false);
    }
  }, [productData, form]);

  const fetchProductData = async () => {
    setLoading(true);
    const data = await SelectedProductData(productIdentifier);
    setProductData(data);
  };

  const handleSubmit = async (data: Record<string, string>) => {
    if (!productIdentifier || !productData) return;

    const updatedProduct = {
      ...productData[0].data,
      ...data,
    };

    try {
      await invokeProductProcess(updatedProduct);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()}>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">

                {/* Product Type Field */}
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Product Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professional Service">Professional Service</SelectItem>
                            <SelectItem value="User License">User License</SelectItem>
                            <SelectItem value="Service Level Agreement">Service Level Agreement</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormComboboxInput
                  items={[
                    { value: "Professional Service", label: "Professional Service" },
                    { value: "User License", label: "User License" },
                    { value: "Service Level Agreement", label: "Service Level Agreement" },
                  ]}
                  formControl={form.control}
                  name={"productType"}
                  placeholder={"Choose Product Type"}
                  onValueChange={field.onChange}
                /> */}

                {/* Project Manager Field */}
                {productType === "Professional Service" && (
                  <FormField
                    control={form.control}
                    name="projectManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Manager</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Project Manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectManagers.map((option: any) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                )}
              </div>

              {/* Product Description Field */}
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter product description here" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
