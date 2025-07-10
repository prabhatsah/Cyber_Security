"use client"

import ContactComponent from "../../../../components/contact-component";

interface ContactsDataComponentProps {
    accountId: string | null;
    leadIdentifier: string;
    source: string;
    contactData: any;
  }
  
  const ContactsDataComponent: React.FC<ContactsDataComponentProps> = ({
    leadIdentifier,
    source,
    contactData,
  }) => {
    
    return (
        <ContactComponent contactData={contactData} source={source} identifier={leadIdentifier} accountId=""/>
    );
  };
  
  export default ContactsDataComponent;
  