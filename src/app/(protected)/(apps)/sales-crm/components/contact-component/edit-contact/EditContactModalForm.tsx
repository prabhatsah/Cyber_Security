import React, { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/shadcn/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddContactFormSchema } from "../add-contact-components/contact-data-definitions";
import { invokeContactProcess } from "../add-contact-components/invokeContact/invokeContact";
import { countryMap } from "../../../lead/country_details";
import { TextButton } from "@/ikon/components/buttons";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContact: { firstName: string; middleName: string; lastName: string; email: string; phoneNo: string; mobileNo: string; department: string; fax: string; address1: string; city: string; state: string; pinCode: string; country: string; contactIdentifier: string; source: string; leadIdentifier: string; } | null;
}

const EditContactModal: React.FC<EditContactModalProps> = ({ isOpen, onClose, selectedContact }) => {
  const form = useForm({
    resolver: zodResolver(AddContactFormSchema),
    defaultValues: { firstName: "", middleName: "", lastName: "", email: "", phoneNo: "", mobileNo: "", department: "", fax: "", address1: "", city: "", state: "", pinCode: "", country: "", }
  });

  useEffect(() => {
    if (selectedContact) {
      form.reset({
        firstName: selectedContact.firstName || "",
        middleName: selectedContact.middleName || "",
        lastName: selectedContact.lastName || "",
        email: selectedContact.email || "",
        phoneNo: selectedContact.phoneNo || "",
        mobileNo: selectedContact.mobileNo || "",
        department: selectedContact.department || "",
        fax: selectedContact.fax || "",
        address1: selectedContact.address1 || "",
        city: selectedContact.city || "",
        state: selectedContact.state || "",
        pinCode: selectedContact.pinCode || "",
        country: selectedContact.country || "",
      });
    }
  }, [selectedContact, form]);

  const handleSubmit = async (data: Record<string, string>) => {
    if (!selectedContact) return;

    const editContact = {
      ...selectedContact, // Retain existing contact data
      ...data, // Override with updated form data
    };

    try {
      await invokeContactProcess(editContact);
      console.log("Contact successfully updated:", editContact);
      onClose();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-3">
            {/* Contact Information */}
            <h1>Contact Information</h1>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter first name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter middle name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number*</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter mobile number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter department" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter fax number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Information */}
            <h1>Address Information</h1>
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter contact address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter pincode" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryMap.map((option: any) => (
                            <SelectItem key={option.value} value={option.label}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              {/* <Button type="submit">Submit</Button> */}
              <TextButton type="submit">Submit</TextButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactModal;