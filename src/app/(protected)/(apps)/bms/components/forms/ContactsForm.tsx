"use client";

import React, { useRef, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buildingContactSchema } from "../../lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/shadcn/ui/card";

type ContactFormValues = z.infer<typeof buildingContactSchema>;

interface ContactsFormProps {
  defaultValues?: ContactFormValues;
  onSubmit: (values: ContactFormValues) => void;
}

const ContactsForm = ({ defaultValues, onSubmit }: ContactsFormProps) => {
  // Create a ref to access the form from outside
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(buildingContactSchema),
    defaultValues: defaultValues || {
      contacts: [
        {
          id: `contact-${Date.now()}`,
          name: "",
          role: "",
          email: "",
          phone: "",
          isPrimary: true,
        },
      ],
    },
  });

  // Create a function to manually trigger form submission
  useEffect(() => {
    // Expose the submit function to the window for debugging
    (window as any).submitContactsForm = () => {
      console.log("Contacts manual form submission triggered");
      form.handleSubmit(handleFormSubmit)();
    };
  }, [form]);

  const handleFormSubmit = (values: ContactFormValues) => {
    console.log("Contacts form submitting with data:", values);
    onSubmit(values);
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const handleAddContact = () => {
    append({
      id: `contact-${Date.now()}`,
      name: "",
      role: "",
      email: "",
      phone: "",
      isPrimary: false,
    });
  };

  const handleRemoveContact = (index: number) => {
    // If we're removing the primary contact, make the first remaining contact primary
    const currentContacts = form.getValues().contacts;
    if (currentContacts[index].isPrimary && currentContacts.length > 1) {
      // Find the first non-removed contact
      const nextPrimaryIndex = index === 0 ? 1 : 0;
      form.setValue(`contacts.${nextPrimaryIndex}.isPrimary`, true);
    }
    remove(index);
  };

  const handlePrimaryChange = (index: number, checked: boolean) => {
    if (checked) {
      // Uncheck all other primary contacts
      const contacts = form.getValues().contacts;
      contacts.forEach((_, i) => {
        if (i !== index) {
          form.setValue(`contacts.${i}.isPrimary`, false);
        }
      });
    } else {
      // If unchecking, make sure at least one contact is primary
      const contacts = form.getValues().contacts;
      const hasPrimary = contacts.some((contact, i) => i !== index && contact.isPrimary);
      if (!hasPrimary && contacts.length > 0) {
        // Make the first contact primary
        const nextPrimaryIndex = index === 0 ? 1 : 0;
        if (nextPrimaryIndex < contacts.length) {
          form.setValue(`contacts.${nextPrimaryIndex}.isPrimary`, true);
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`contacts.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact role" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`contacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`contacts.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-1 flex items-end justify-between sm:col-span-2">
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.isPrimary`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                handlePrimaryChange(index, checked as boolean);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Primary Contact
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveContact(index)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddContact}
          className="mt-4 w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Contact
        </Button>

        {/* Add a hidden submit button */}
        <button 
          type="submit" 
          id="contacts-form-submit" 
          style={{ display: 'none' }}
        >
          Submit
        </button>
        
        {/* Add a visible submit button for debugging */}
        <button 
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => {
            console.log("Contacts submit button clicked");
            form.handleSubmit(handleFormSubmit)();
          }}
        >
          Submit
        </button>
      </form>
    </Form>
  );
};

export default ContactsForm;