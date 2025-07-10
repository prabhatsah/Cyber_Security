"use client";
import { ContactData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { useState } from "react";
import { PenSquare, Plus } from "lucide-react";
import NoDataComponent from "@/ikon/components/no-data";
import EditContactModal from "./edit-contact/EditContactModalForm";
import ContactModal from "./add-contact/CreateContactModalForm";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";

export default function ContactComponent({
  contactData: initialContactData,
  source,
  identifier,
  accountId,
}: {
  contactData: any[];
  source: string;
  identifier: string;
  accountId: string | null;
}) {
  const transformedContacts = initialContactData.map((contact) => ({
    contactIdentifier: contact.data.contactIdentifier || "",
    firstName: contact.data.firstName || "",
    middleName: contact.data.middleName || "",
    lastName: contact.data.lastName || "",
    email: contact.data.email || "",
    phoneNo: contact.data.phoneNo || "",
    mobileNo: contact.data.mobileNo || "",
    department: contact.data.department || "",
    fax: contact.data.fax || "",
    address1: contact.data.address1 || "",
    city: contact.data.city || "",
    state: contact.data.state || "",
    pinCode: contact.data.pinCode || "",
    country: contact.data.country || "",
    isDefault: contact.data.isDefault ?? false,
    source: contact.data.source || "",
    currentUserLogin: contact.data.currentUserLogin || "Unknown",
  }));

  const [contactData, setContactData] = useState<ContactData[]>(
    transformedContacts || []
  );
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function handleView(contact: ContactData) {
    setSelectedContact(contact);
  }

  function handleEdit() {
    setIsEditModalOpen(true);
  }

  function handleAddContact() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-3 h-full w-full">
      {/* Add Contact Button */}
      <div className="flex flex-row items-center justify-end">
        {/* <Button variant={"outline"} size={"sm"} onClick={handleAddContact}>
          <Plus />
        </Button> */}
        <IconTextButtonWithTooltip
          onClick={handleAddContact}
          tooltipContent={"Add Contact"}
        >
          <Plus /> Contact
        </IconTextButtonWithTooltip>
      </div>

      {/* Contacts List and View */}
      <div className="flex-grow">
        {contactData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full gap-3">
            {/* Left Panel: Contacts List */}
            <div className="md:col-span-1 border-r pe-3 overflow-y-auto flex flex-col gap-3">
              {contactData.map((contact) => (
                <Card
                  key={contact.contactIdentifier}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedContact?.contactIdentifier ===
                    contact.contactIdentifier
                      ? "border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleView(contact)}
                >
                  <CardHeader>
                    <CardTitle>
                      {contact.firstName} {contact.middleName || ""}{" "}
                      {contact.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    <p className="text-sm text-gray-500">{contact.phoneNo}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Right Panel: Contact Full View */}
            <div className="md:col-span-2 overflow-y-auto">
              {selectedContact ? (
                <Card className="h-full">
                  <CardHeader className="flex flex-row justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {selectedContact.firstName}{" "}
                        {selectedContact.middleName || ""}{" "}
                        {selectedContact.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {selectedContact.email}
                      </p>
                    </div>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={handleEdit}
                    >
                      <PenSquare />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      <strong>Email:</strong> {selectedContact.email}
                    </p>
                    {selectedContact.phoneNo && (
                      <p className="text-gray-700 mb-2">
                        <strong>Phone:</strong> {selectedContact.phoneNo}
                      </p>
                    )}
                    {selectedContact.department && (
                      <p className="text-gray-700 mb-2">
                        <strong>Department:</strong>{" "}
                        {selectedContact.department}
                      </p>
                    )}
                    {(selectedContact.address1 ||
                      selectedContact.city ||
                      selectedContact.state ||
                      selectedContact.pinCode ||
                      selectedContact.country) && (
                      <div className="text-gray-700 mb-2">
                        <strong>Address:</strong>
                        <p>{selectedContact.address1 || "N/A"}</p>
                        <p>
                          {selectedContact.city || "N/A"},{" "}
                          {selectedContact.state || "N/A"} -{" "}
                          {selectedContact.pinCode || "N/A"}
                        </p>
                        <p>{selectedContact.country || "N/A"}</p>
                      </div>
                    )}
                    {selectedContact.isDefault !== undefined && (
                      <p className="text-gray-700">
                        <strong>Default Contact:</strong>{" "}
                        {selectedContact.isDefault ? "Yes" : "No"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <NoDataComponent text="Select a contact to view its details" />
              )}
            </div>
          </div>
        ) : (
          <NoDataComponent text="No contacts available" />
        )}
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        source={source}
        identifier={identifier}
        accountId={accountId}
      />
      <EditContactModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        selectedContact={selectedContact}
      />
    </div>
  );
}
