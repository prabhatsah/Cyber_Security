import React from "react";
import { Form } from "@/shadcn/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import * as zod from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { AddContactFormSchema } from "../add-contact-components/contact-data-definitions";
import { countryMap } from "@/app/(protected)/(apps)/sales-crm/lead/country_details";
import { startLeadUserContactsProcess } from "../add-contact-components/startContact";
import { getProfileData } from "@/ikon/utils/actions/auth";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { TextButton } from "@/ikon/components/buttons";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    source: string;
    identifier: string;
    accountId: string | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, source, identifier, accountId }) => {
    const form = useForm({
        resolver: zod.zodResolver(AddContactFormSchema),
        defaultValues: { firstName: "", middleName: "", lastName: "", email: "", phoneNo: "", mobileNo: "", department: "", fax: "", address1: "", city: "", state: "", pinCode: "", country: "" },
    });

    //const handleSubmit = (values: Record<string, any>) => {
    const handleSubmit = async (values: Record<string, any>) => {
        const profileData = await getProfileData();
        const newContact = {
            firstName: values.firstName,
            middleName: values.middleName,
            lastName: values.lastName,
            email: values.email,
            phoneNo: values.phoneNo,
            mobileNo: values.mobileNo,
            department: values.department,
            fax: values.fax,
            address1: values.address1,
            city: values.city,
            state: values.state,
            pinCode: values.pinCode,
            country: values.country,
            contactIdentifier: v4(),
            currentUserLogin: profileData?.USER_LOGIN,
            isDefault: false,
            source: source,
            ...(source === "Leads" && { leadIdentifier: identifier }),
            ...(source === "Deals" && { dealIdentifier: identifier } && { accountIdentifier: accountId }),
            ...(source === "Accounts"  && { accountIdentifier: accountId }),
        };

        try {
            await startLeadUserContactsProcess(newContact);
            onClose();
        } catch (error) {
            console.error("Error starting the process:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
            <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Create Contact</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-3">
                        {/* Contact Information */}
                        <h1>Contact Information</h1>
                        <div className="grid grid-cols-3 gap-3">
                            <FormInput formControl={form.control} name={"firstName"} placeholder="Enter first name" label="First Name*" />
                            <FormInput formControl={form.control} name={"middleName"} placeholder="Enter middle name" label="Middle Name" />
                            <FormInput formControl={form.control} name={"lastName"} placeholder="Enter last name" label="Last Name*" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormInput formControl={form.control} name={"email"} placeholder="Enter Email" label="Email*" />
                            <FormInput formControl={form.control} name={"phoneNo"} placeholder="Enter phone number" label="Phone Number" />
                            <FormInput formControl={form.control} name={"mobileNo"} placeholder="Enter mobile number" label="Mobile Number*" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput formControl={form.control} name={"department"} placeholder="Enter department" label="Department" />
                            <FormInput formControl={form.control} name={"fax"} placeholder="Enter fax number" label="Fax" />
                        </div>

                        {/* Address Information */}
                        <h1>Address Information</h1>
                        <FormTextarea formControl={form.control} name={"address1"} placeholder={"Enter contact address"} label="Contact Address" />

                        <div className="grid grid-cols-4 gap-4">
                            <FormInput formControl={form.control} name={"city"} placeholder="Enter city" label="City" />
                            <FormInput formControl={form.control} name={"state"} placeholder="Enter state" label="State" />
                            <FormInput formControl={form.control} name={"pinCode"} placeholder="Enter pincode" label="Pincode" />
                            <FormComboboxInput items={countryMap} formControl={form.control} name={"country"} placeholder={"Choose Country"} label="Country"/>
                        </div>

                        <DialogFooter>
                            {/* <Button type="submit">
                                Submit
                            </Button> */}
                            <TextButton type="submit">Submit</TextButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ContactModal;
