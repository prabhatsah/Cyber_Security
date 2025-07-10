import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/ui/tabs";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Button } from "@/shadcn/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/shadcn/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editBuyerRegistrationData, getBuyerRegistrationData } from "../../../../_utils/register/supplier-register-form";

const buyerSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  businessType: z.string().optional(),
  industry: z.string().optional(),
  yearEstablished: z.number().optional(),
  numberOfEmployees: z.number().optional(),
  annualRevenue: z.string().optional(),
  website: z.string().optional(),

  primaryContactName: z.string().min(1, "Primary Contact Name is required"),
  jobTitle: z.string().optional(),
  email: z.string().email("Invalid Email Address"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  altContactPerson: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  country: z.string().optional(),

  productsPurchased: z.string().optional(),
  averageOrderValue: z.string().optional(),
  procurementFrequency: z.string().optional(),
  paymentTerms: z.string().optional(),
  preferredCurrencies: z.string().optional(),
  requiredCertifications: z.string().optional(),

  username: z.string().optional(),
  password: z.string().optional(),
  securityQuestions: z.string().optional(),

  businessRegCert: z.any().optional(),
  taxId: z.string().optional(),
  bankingInfo: z.string().optional(),
});

type BuyerFormData = z.infer<typeof buyerSchema>;

interface BuyerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | null;
}

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return <p className={cn("text-red-500 text-sm mt-1")}>{message}</p>;
};

export default function BuyerRegistrationModal({
  isOpen,
  onClose,
  accountId,
}: BuyerRegistrationModalProps) {
  const [step, setStep] = useState(0);
  const router = useRouter();
    const [isPending, startTransition] = useTransition();

  const formWizardSteps = [
    "Basic Information",
    "Contact Details",
    "Procurement Information",
    "Documents",
  ];

  const form = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      companyName: "",
      businessType: "",
      industry: "",
      yearEstablished: 0,
      numberOfEmployees: 0,
      annualRevenue: "",
      website: "",
      primaryContactName: "",
      jobTitle: "",
      email: "",
      phoneNumber: "",
      altContactPerson: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      productsPurchased: "",
      averageOrderValue: "",
      procurementFrequency: "",
      paymentTerms: "",
      preferredCurrencies: "",
      requiredCertifications: "",
      username: "",
      password: "",
      securityQuestions: "",
      taxId: "",
      bankingInfo: "",
    },
  });

  useEffect(
      () => {
        const fetchDraftData = async () => {
          if (accountId && isOpen) {
            //setIsLoading(true);
            try {
              const formData: any = await getBuyerRegistrationData(accountId);
  
              // Populate form fields with fetched data
              if (formData) {
                Object.entries(formData).forEach(([key, value]) =>
                  form.setValue(key as keyof BuyerFormData, value)
                );
              }
            } catch (error) {
              console.error("Error fetching draft data:", error);
            } finally {
              //setIsLoading(false);
            }
          } else {
            // Reset form when dialog opens without a draft ID
            form.reset();
          }
        };
  
        fetchDraftData();
      },
      [
        /*draftId, isOpen, setValue, reset*/
      ]
    );

  const onSubmit =async (data: BuyerFormData) => {
    console.log("Form Submitted: ", data);
    try {
      if (accountId) {
        console.log("update existing data");
        // const payload = { ...data, accountId: accountId };
        await editBuyerRegistrationData(accountId, data);
        toast.success("Details Saved.");
      }
    } catch (error) {
      console.error("Error submitting supplier data:", error);
      toast.error("An error occurred. Please try again.");
    }
    onClose();
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Buyer Registration</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={formWizardSteps[step]}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-5">
            {formWizardSteps.map((currStep, index) => (
              <TabsTrigger
                key={currStep}
                value={currStep}
                onClick={() => setStep(index)}
              >
                {currStep}
              </TabsTrigger>
            ))}
          </TabsList>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 flex flex-col space-y-4"
            >
              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="Basic Information">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Company/Organization Name */}
                    <div>
                      <Label htmlFor="companyName">
                        Company/Organization Name
                      </Label>
                      <Input
                        id="companyName"
                        {...form.register("companyName")}
                      />
                      <FormError
                        message={form.formState.errors.companyName?.message}
                      />
                    </div>

                    {/* Business Type */}
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("businessType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Business Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Corporation">
                            Corporation
                          </SelectItem>
                          <SelectItem value="LLC">LLC</SelectItem>
                          <SelectItem value="Partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="Sole Proprietorship">
                            Sole Proprietorship
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormError
                        message={form.formState.errors.businessType?.message}
                      />
                    </div>

                    {/* Industry/Sector */}
                    <div>
                      <Label htmlFor="industry">Industry/Sector</Label>
                      <Input id="industry" {...form.register("industry")} />
                      <FormError
                        message={form.formState.errors.industry?.message}
                      />
                    </div>

                    {/* Year Established */}
                    <div>
                      <Label htmlFor="yearEstablished">Year Established</Label>
                      <Input
                        id="yearEstablished"
                        type="number"
                        {...form.register("yearEstablished", {
                          valueAsNumber: true,
                        })}
                      />
                      <FormError
                        message={form.formState.errors.yearEstablished?.message}
                      />
                    </div>

                    {/* Number of Employees */}
                    <div>
                      <Label htmlFor="numberOfEmployees">
                        Number of Employees
                      </Label>
                      <Input
                        id="numberOfEmployees"
                        type="number"
                        {...form.register("numberOfEmployees", {
                          valueAsNumber: true,
                        })}
                      />
                      <FormError
                        message={
                          form.formState.errors.numberOfEmployees?.message
                        }
                      />
                    </div>

                    {/* Annual Revenue Range */}
                    <div>
                      <Label htmlFor="annualRevenue">
                        Annual Revenue Range
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("annualRevenue", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Revenue Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<1M">Less than $1M</SelectItem>
                          <SelectItem value="1M-10M">$1M - $10M</SelectItem>
                          <SelectItem value="10M-50M">$10M - $50M</SelectItem>
                          <SelectItem value="50M+">More than $50M</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormError
                        message={form.formState.errors.annualRevenue?.message}
                      />
                    </div>

                    {/* Company Website */}
                    <div className="col-span-3">
                      <Label htmlFor="website">Company Website</Label>
                      <Input id="website" {...form.register("website")} />
                      <FormError
                        message={form.formState.errors.website?.message}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Contact Details">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryContactName">
                        Primary Contact Name
                      </Label>
                      <Input
                        id="primaryContactName"
                        {...form.register("primaryContactName")}
                      />
                      <FormError
                        message={
                          form.formState.errors.primaryContactName?.message
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input id="jobTitle" {...form.register("jobTitle")} />
                      <FormError
                        message={form.formState.errors.jobTitle?.message}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                      />
                      <FormError
                        message={form.formState.errors.email?.message}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        {...form.register("phoneNumber")}
                      />
                      <FormError
                        message={form.formState.errors.phoneNumber?.message}
                      />
                    </div>

                    <div>
                      <Label htmlFor="altContactPerson">
                        Alternative Contact Person
                      </Label>
                      <Input
                        id="altContactPerson"
                        {...form.register("altContactPerson")}
                      />
                      <FormError
                        message={
                          form.formState.errors.altContactPerson?.message
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Address</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="street">Street</Label>
                        <Input id="street" {...form.register("street")} />
                        <FormError
                          message={form.formState.errors.street?.message}
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...form.register("city")} />
                        <FormError
                          message={form.formState.errors.city?.message}
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input id="state" {...form.register("state")} />
                        <FormError
                          message={form.formState.errors.state?.message}
                        />
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input id="zipCode" {...form.register("zipCode")} />
                        <FormError
                          message={form.formState.errors.zipCode?.message}
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...form.register("country")} />
                        <FormError
                          message={form.formState.errors.country?.message}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Procurement Information">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="productsPurchased">
                        Typical Products/Services Purchased
                      </Label>
                      <Input
                        id="productsPurchased"
                        {...form.register("productsPurchased")}
                      />
                      <FormError
                        message={
                          form.formState.errors.productsPurchased?.message
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="averageOrderValue">
                        Average Order Value
                      </Label>
                      <Input
                        id="averageOrderValue"
                        {...form.register("averageOrderValue")}
                      />
                      <FormError
                        message={
                          form.formState.errors.averageOrderValue?.message
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="procurementFrequency">
                        Procurement Frequency
                      </Label>
                      <Input
                        id="procurementFrequency"
                        {...form.register("procurementFrequency")}
                      />
                      <FormError
                        message={
                          form.formState.errors.procurementFrequency?.message
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="paymentTerms">
                        Payment Terms Preference
                      </Label>
                      <Input
                        id="paymentTerms"
                        {...form.register("paymentTerms")}
                      />
                      <FormError
                        message={form.formState.errors.paymentTerms?.message}
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredCurrencies">
                        Preferred Currencies
                      </Label>
                      <Input
                        id="preferredCurrencies"
                        {...form.register("preferredCurrencies")}
                      />
                      <FormError
                        message={
                          form.formState.errors.preferredCurrencies?.message
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="requiredCertifications">
                        Required Certifications from Suppliers
                      </Label>
                      <Input
                        id="requiredCertifications"
                        {...form.register("requiredCertifications")}
                      />
                      <FormError
                        message={
                          form.formState.errors.requiredCertifications?.message
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Documents">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="businessRegCert">
                        Business Registration Certificate
                      </Label>
                      <Input
                        id="businessRegCert"
                        type="file"
                        {...form.register("businessRegCert")}
                      />
                      <FormError
                        message={undefined}
                      />
                    </div>

                    <div>
                      <Label htmlFor="taxId">Tax ID/VAT Number</Label>
                      <Input id="taxId" {...form.register("taxId")} />
                      <FormError
                        message={form.formState.errors.taxId?.message}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankingInfo">
                        Banking Information for Payments
                      </Label>
                      <Input
                        id="bankingInfo"
                        {...form.register("bankingInfo")}
                      />
                      <FormError
                        message={form.formState.errors.bankingInfo?.message}
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  //   onClick={}
                  disabled={step === 1}
                >
                  Back
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </FormProvider>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
