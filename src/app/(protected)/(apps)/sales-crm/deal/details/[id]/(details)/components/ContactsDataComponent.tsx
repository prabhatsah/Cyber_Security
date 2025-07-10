"use client"
import ContactComponent from "../../../../../components/contact-component";


interface ContactsDataComponentProps {
    accountId: string | null;
    dealIdentifier: string;
    source: string;
    contactData: any;
  }
  
  const ContactsDataComponent: React.FC<ContactsDataComponentProps> = ({
    accountId,
    dealIdentifier,
    source,
    contactData,
  }) => {
    
    return (
        <ContactComponent contactData={contactData} source={source} identifier={dealIdentifier} accountId={accountId}/>
    );
  };
  
  export default ContactsDataComponent;
  