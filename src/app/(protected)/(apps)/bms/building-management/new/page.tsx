"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
//import Header from "@/components/layout/Header";
//import PageTitle from "@/components/layout/PageTitle";
import MultiStepForm from "../../components/wizard/MultiStepForm";
import BuildingBasicInfoForm from "../../components/forms/BuildingBasicInfoForm";
import BuildingDetailsForm from "../../components/forms/BuildingDetailsForm";
import AddressForm from "../../components/forms/AddressForm";
import ContactsForm from "../../components/forms/ContactsForm";
import SubLocationsForm from "../../components/forms/SubLocationsForm";
import { Building, BuildingFormData } from "../../lib/types";
import {
  buildingBasicInfoSchema,
  buildingDetailsSchema,
  buildingAddressSchema,
  buildingContactSchema,
  buildingSubLocationSchema,
} from "../../lib/validation";
import { createBuilding } from "../../lib/data";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export default function NewBuildingPage() {
  const router = useRouter();
  const basicInfoFormRef = useRef(null);
  const detailsFormRef = useRef(null);
  const addressFormRef = useRef(null);
  const contactsFormRef = useRef(null);
  const subLocationsFormRef = useRef(null);

  const [formData, setFormData] = useState<Partial<BuildingFormData>>({
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
    subLocations: [],
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      latitude: 0,
      longitude: 0,
    },
    name: "",
    buildingCode: "",
    type: "office",
    floorArea: 0,
    constructionYear: new Date().getFullYear(),
    floors: 1,
  });

  useEffect(() => {
    (window as any).debugFormData = () => {
      console.log("Current form data:", formData);
    };
  }, [formData]);

  const handleBasicInfoSubmit = (values: z.infer<typeof buildingBasicInfoSchema>) => {
    console.log("Basic Info Submit handler called with:", values);
    setFormData((prev) => {
      const updated = { ...prev, ...values };
      console.log("Updated form data after basic info:", updated);
      return updated;
    });
  };

  const handleDetailsSubmit = (values: z.infer<typeof buildingDetailsSchema>) => {
    console.log("Details Submit handler called with:", values);
    setFormData((prev) => {
      const updated = { ...prev, ...values };
      console.log("Updated form data after details:", updated);
      return updated;
    });
  };

  const handleAddressSubmit = (values: z.infer<typeof buildingAddressSchema>) => {
    console.log("Address Submit handler called with:", values);
    setFormData((prev) => {
      const updated = {
        ...prev,
        address: values.address
      };
      console.log("Updated form data after address:", updated);
      return updated;
    });
  };

  const handleContactsSubmit = (values: z.infer<typeof buildingContactSchema>) => {
    console.log("Contacts Submit handler called with:", values);
    setFormData((prev) => {
      const updated = { ...prev, ...values };
      console.log("Updated form data after contacts:", updated);
      return updated;
    });
  };

  const handleSubLocationsSubmit = (values: z.infer<typeof buildingSubLocationSchema>) => {
    console.log("SubLocations Submit handler called with:", values);
    setFormData((prev) => {
      const updated = { ...prev, ...values };
      console.log("Updated form data after sublocations:", updated);
      return updated;
    });
  };

  const handleFormSubmit = async () => {
    try {
      console.log("Final form data before submission:", formData);
      
      if (!formData.name || !formData.buildingCode) {
        toast.error("Missing required information", {
          description: "Please complete all required fields before submitting.",
        });
        return;
      }

      const newBuilding = createBuilding(formData as BuildingFormData);
      console.log("New building created:", newBuilding);

      try {
        const processId = await mapProcessName({ processName: "Building" });
        await startProcessV2({
          processId,
          data: newBuilding,
          processIdentifierFields: "buildingCode"
        });
        console.log("Process started successfully");
      } catch (processError) {
        console.error("Error starting process:", processError);
      }
      
      toast.success("Building created successfully!", {
        description: "Your new building has been added to the system.",
      });
      
      router.push("/bms/building-management");
    } catch (error) {
      toast.error("Failed to create building", {
        description: "There was an error creating the building. Please try again.",
      });
      console.error("Error creating building:", error);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!", {
      description: "Your building draft has been saved. You can continue later.",
    });
  };

  const steps = [
    {
      id: "basic-info",
      title: "Basic Info",
      description: "Building name and type",
      content: (
        <BuildingBasicInfoForm
          defaultValues={formData}
          onSubmit={handleBasicInfoSubmit}
          ref={basicInfoFormRef}
        />
      ),
    },
    {
      id: "building-details",
      title: "Building Details",
      description: "Size, year, and floors",
      content: (
        <BuildingDetailsForm
          defaultValues={formData}
          onSubmit={handleDetailsSubmit}
          ref={detailsFormRef}
        />
      ),
    },
    {
      id: "address",
      title: "Address",
      description: "Location information",
      content: (
        <AddressForm
          defaultValues={formData}
          onSubmit={handleAddressSubmit}
          ref={addressFormRef}
        />
      ),
    },
    {
      id: "contacts",
      title: "Contacts",
      description: "Building personnel",
      content: (
        <ContactsForm
          defaultValues={formData}
          onSubmit={handleContactsSubmit}
          ref={contactsFormRef}
        />
      ),
    },
    {
      id: "sub-locations",
      title: "Sub-Locations",
      description: "Internal areas",
      content: (
        <SubLocationsForm
          defaultValues={formData}
          onSubmit={handleSubLocationsSubmit}
          ref={subLocationsFormRef}
        />
      ),
    },
  ];

  useEffect(() => {
    console.log("NewBuildingPage mounted");
    
    (window as any).triggerFormSubmit = (stepId: string) => {
      console.log(`Trying to submit form at step: ${stepId}`);
    };
    
    return () => {
      delete (window as any).triggerFormSubmit;
      delete (window as any).debugFormData;
    };
  }, []);

  return (
    <>
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/*   <PageTitle
          title="Register New Building"
          description="Add a new building to your portfolio"
        /> */}

        <MultiStepForm
          steps={steps}
          onSubmit={handleFormSubmit}
          onSaveDraft={handleSaveDraft}
        />
      </main>
    </>
  );
}