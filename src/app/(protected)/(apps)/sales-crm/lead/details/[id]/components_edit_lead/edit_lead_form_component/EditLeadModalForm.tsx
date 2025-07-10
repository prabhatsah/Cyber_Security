// import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
// import { Input } from "@/shadcn/ui/input";
// import { Label } from "@/shadcn/ui/label";
// import Select2 from "@/ikon/components/form-components/Select2WithLabel/SelectTwoFormField";
// import { Button } from "@/shadcn/ui/button";
// // import { useAppSelector } from "@/store/store";
// // import { selectGlobalAccountId } from "@/store/redux/slices/globalsSlice";
// import { useForm } from "react-hook-form";
// import { useGetMyInstancesV2Query } from "@/store/api/processRuntimeServiceAPI";
// import { Textarea } from "@/shadcn/ui/textarea";

// interface LeadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   leadIdentifier?: string;
// }

// interface FormData {
//   organizationName: string;
//   email: string;
//   contactNumber: number;
//   noOfEmployee: number;
//   website: string;
//   city: string;
//   state: string;
//   pinCode: string;
//   street: string;
//   sector: string;
//   source: string;
//   country: string;
// }

// interface OptionType {
//   value: string;
//   label: string;
// }

// const EditLeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, leadIdentifier }) => {
//   const accountId = useAppSelector(selectGlobalAccountId);

//   const { data: leadData } = useGetMyInstancesV2Query({
//     processName: "Leads Pipeline",
//     projections: ["Data"],
//     predefinedFilters: { taskName: "View State" },
//     accountId: accountId,
//     mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
//   });

//   const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

//   const [sector, setSector] = useState<OptionType | null>(null);
//   const [source, setSource] = useState<OptionType | null>(null);
//   const [country, setCountry] = useState<OptionType | undefined>({
//     value: "zambia",
//     label: "Zambia",
//   });
  

//   useEffect(() => {
//     if (leadData && leadData.length > 0) {
//       const defaultValues: FormData = {
//         organizationName: leadData?.[0]?.data?.organisationDetails?.organisationName || "",
//         email: leadData?.[0]?.data?.organisationDetails?.email || "",
//         contactNumber: leadData?.[0]?.data?.organisationDetails?.orgContactNo || 0,
//         noOfEmployee: leadData?.[0]?.data?.organisationDetails?.noOfEmployees || 0,
//         website: leadData?.[0]?.data?.organisationDetails?.website || "",
//         city: leadData?.[0]?.data?.organisationDetails?.city || "",
//         state: leadData?.[0]?.data?.organisationDetails?.state || "",
//         pinCode: leadData?.[0]?.data?.organisationDetails?.postalCode || "",
//         street: leadData?.[0]?.data?.organisationDetails?.street || "",
//         sector: leadData?.[0]?.data?.organisationDetails?.sector || "",
//         source: leadData?.[0]?.data?.organisationDetails?.source || "",
//         country: leadData?.[0]?.data?.organisationDetails?.country || "",
//       };

//       reset(defaultValues);

//       if (defaultValues.sector) setSector({ value: defaultValues.sector, label: defaultValues.sector });
//       if (defaultValues.source) setSource({ value: defaultValues.source, label: defaultValues.source });
//       if (defaultValues.country) setCountry({ value: defaultValues.country, label: defaultValues.country });
//     }
//   }, [leadData, reset]);

//   const handleOnSubmit = (data: FormData) => {
//     console.log("Form Data Submitted:", data, { sector, source, country });
//     onClose();
//   };

//   const handleOnError = (errors: any) => {
//     if (errors.organizationName) {
//       alert(errors.organizationName.message);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-5xl">
//         <DialogHeader>
//           <DialogTitle>Edit Lead</DialogTitle>
//         </DialogHeader>
//         <div>
//           <form>
//             <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
//               <div className="grid col-span-2 items-center gap-1.5">
//                 <Label htmlFor="organizationId">Organization Name *</Label>
//                 <Input
//                   type="text"
//                   id="organizationId"
//                   placeholder="Enter organization name"
//                   {...register('organizationName', {
//                     required: 'Organization name is required',
//                     minLength: { value: 1, message: 'Please Enter Organization Name' },
//                   })}
//                 />
//               </div>
//               <div className="grid gap-1.5">
//                 <Label htmlFor="emailId">Email</Label>
//                 <Input type="email" id="emailId" placeholder="Enter Email" {...register('email')} />
//               </div>
//               <div className="grid gap-1.5">
//                 <Label htmlFor="contactId">Contact Number</Label>
//                 <Input type="number" id="contactId" placeholder="Enter Contact Number" {...register('contactNumber')} />
//               </div>
//               <div className="grid gap-1.5">
//                 <Label htmlFor="employeeTotalId">Number of Employees</Label>
//                 <Input type="number" id="employeeTotalId" placeholder="Enter Number of Employees" {...register('noOfEmployee')} />
//               </div>

              
//               <Select2
//                 label="Sector"
//                 options={[
//                   { value: "finance", label: "Finance" },
//                   { value: "technology", label: "Technology" }
//                 ]}
//                 isMulti={false}
//                 placeholder="Choose sector"
//                 allowCreate
//                 menuPlacement="bottom"
//                 defaultValue={sector ?? undefined}
//                 onChange={(selected) => setSector(selected as OptionType)}
//               />

             
//               <Select2
//                 label="Source"
//                 options={[
//                   { value: "online", label: "Online" },
//                   { value: "referral", label: "Referral" }
//                 ]}
//                 isMulti={false}
//                 placeholder="Choose source"
//                 allowCreate
//                 menuPlacement="bottom"
//                 defaultValue={source ?? undefined}
//                 onChange={(selected) => setSource(selected as OptionType)}
//               />


// <div className="grid gap-1.5">
//             <Label htmlFor="websiteId">Website</Label>
//             <Input type="text" id="websiteId" placeholder="Enter Website" {...register('website')}/>
//           </div>
        
          
      
//             <h1>Address Information</h1>
//             <div className="grid gap-1.5 col-span-2">
//                 <Label htmlFor="streetId">Street</Label>
//                 <Textarea placeholder="Enter Street" {...register('street')}/>
//             </div>
//             <div className="grid gap-1.5">
//                 <Label htmlFor="cityId">City</Label>
//                 <Input type="text" id="cityId" placeholder="Enter City" {...register('city')}/>
//             </div>
//             <div className="grid gap-1.5">
//                 <Label htmlFor="stateId">State</Label>
//                 <Input type="text" id="stateId" placeholder="Enter State" {...register('state')}/>
//             </div>
//             <div className="grid gap-1.5">
//                 <Label htmlFor="pinCodeId">Pin Code</Label>
//                 <Input type="text" id="pinCodeId" placeholder="Enter Pin Code" {...register('pinCode')}/>
//             </div>

              
//               <Select2
//                 label="Country"
//                 options={[
//                     { value: "afghanistan", label: "Afghanistan" },
//                     { value: "albania", label: "Albania" },
//                     { value: "algeria", label: "Algeria" },
//                     { value: "andorra", label: "Andorra" },
//                     { value: "angola", label: "Angola" },
//                     { value: "antigua_and_barbuda", label: "Antigua and Barbuda" },
//                     { value: "argentina", label: "Argentina" },
//                     { value: "armenia", label: "Armenia" },
//                     { value: "australia", label: "Australia" },
//                     { value: "austria", label: "Austria" },
//                     { value: "azerbaijan", label: "Azerbaijan" },
//                     { value: "bahamas", label: "Bahamas" },
//                     { value: "bahrain", label: "Bahrain" },
//                     { value: "bangladesh", label: "Bangladesh" },
//                     { value: "barbados", label: "Barbados" },
//                     { value: "belarus", label: "Belarus" },
//                     { value: "belgium", label: "Belgium" },
//                     { value: "belize", label: "Belize" },
//                     { value: "benin", label: "Benin" },
//                     { value: "bhutan", label: "Bhutan" },
//                     { value: "bolivia", label: "Bolivia" },
//                     { value: "bosnia_and_herzegovina", label: "Bosnia and Herzegovina" },
//                     { value: "botswana", label: "Botswana" },
//                     { value: "brazil", label: "Brazil" },
//                     { value: "brunei", label: "Brunei" },
//                     { value: "bulgaria", label: "Bulgaria" },
//                     { value: "burkina_faso", label: "Burkina Faso" },
//                     { value: "burundi", label: "Burundi" },
//                     { value: "cabo_verde", label: "Cabo Verde" },
//                     { value: "cambodia", label: "Cambodia" },
//                     { value: "cameroon", label: "Cameroon" },
//                     { value: "canada", label: "Canada" },
//                     { value: "central_african_republic", label: "Central African Republic" },
//                     { value: "chad", label: "Chad" },
//                     { value: "chile", label: "Chile" },
//                     { value: "china", label: "China" },
//                     { value: "colombia", label: "Colombia" },
//                     { value: "comoros", label: "Comoros" },
//                     { value: "congo", label: "Congo" },
//                     { value: "costa_rica", label: "Costa Rica" },
//                     { value: "croatia", label: "Croatia" },
//                     { value: "cuba", label: "Cuba" },
//                     { value: "cyprus", label: "Cyprus" },
//                     { value: "czechia", label: "Czechia" },
//                     { value: "denmark", label: "Denmark" },
//                     { value: "djibouti", label: "Djibouti" },
//                     { value: "dominica", label: "Dominica" },
//                     { value: "dominican_republic", label: "Dominican Republic" },
//                     { value: "ecuador", label: "Ecuador" },
//                     { value: "egypt", label: "Egypt" },
//                     { value: "el_salvador", label: "El Salvador" },
//                     { value: "equatorial_guinea", label: "Equatorial Guinea" },
//                     { value: "eritrea", label: "Eritrea" },
//                     { value: "estonia", label: "Estonia" },
//                     { value: "eswatini", label: "Eswatini" },
//                     { value: "ethiopia", label: "Ethiopia" },
//                     { value: "fiji", label: "Fiji" },
//                     { value: "finland", label: "Finland" },
//                     { value: "france", label: "France" },
//                     { value: "gabon", label: "Gabon" },
//                     { value: "gambia", label: "Gambia" },
//                     { value: "georgia", label: "Georgia" },
//                     { value: "germany", label: "Germany" },
//                     { value: "ghana", label: "Ghana" },
//                     { value: "greece", label: "Greece" },
//                     { value: "grenada", label: "Grenada" },
//                     { value: "guatemala", label: "Guatemala" },
//                     { value: "guinea", label: "Guinea" },
//                     { value: "guinea_bissau", label: "Guinea-Bissau" },
//                     { value: "guyana", label: "Guyana" },
//                     { value: "haiti", label: "Haiti" },
//                     { value: "honduras", label: "Honduras" },
//                     { value: "hungary", label: "Hungary" },
//                     { value: "iceland", label: "Iceland" },
//                     { value: "india", label: "India" },
//                     { value: "indonesia", label: "Indonesia" },
//                     { value: "iran", label: "Iran" },
//                     { value: "iraq", label: "Iraq" },
//                     { value: "ireland", label: "Ireland" },
//                     { value: "israel", label: "Israel" },
//                     { value: "italy", label: "Italy" },
//                     { value: "jamaica", label: "Jamaica" },
//                     { value: "japan", label: "Japan" },
//                     { value: "jordan", label: "Jordan" },
//                     { value: "kazakhstan", label: "Kazakhstan" },
//                     { value: "kenya", label: "Kenya" },
//                     { value: "kiribati", label: "Kiribati" },
//                     { value: "kosovo", label: "Kosovo" },
//                     { value: "kuwait", label: "Kuwait" },
//                     { value: "kyrgyzstan", label: "Kyrgyzstan" },
//                     { value: "laos", label: "Laos" },
//                     { value: "latvia", label: "Latvia" },
//                     { value: "lebanon", label: "Lebanon" },
//                     { value: "lesotho", label: "Lesotho" },
//                     { value: "liberia", label: "Liberia" },
//                     { value: "libya", label: "Libya" },
//                     { value: "liechtenstein", label: "Liechtenstein" },
//                     { value: "lithuania", label: "Lithuania" },
//                     { value: "luxembourg", label: "Luxembourg" },
//                     { value: "madagascar", label: "Madagascar" },
//                     { value: "malawi", label: "Malawi" },
//                     { value: "malaysia", label: "Malaysia" },
//                     { value: "maldives", label: "Maldives" },
//                     { value: "mali", label: "Mali" },
//                     { value: "malta", label: "Malta" },
//                     { value: "marshall_islands", label: "Marshall Islands" },
//                     { value: "mauritania", label: "Mauritania" },
//                     { value: "mauritius", label: "Mauritius" },
//                     { value: "mexico", label: "Mexico" },
//                     { value: "micronesia", label: "Micronesia" },
//                     { value: "moldova", label: "Moldova" },
//                     { value: "monaco", label: "Monaco" },
//                     { value: "mongolia", label: "Mongolia" },
//                     { value: "montenegro", label: "Montenegro" },
//                     { value: "morocco", label: "Morocco" },
//                     { value: "mozambique", label: "Mozambique" },
//                     { value: "myanmar", label: "Myanmar" },
//                     { value: "namibia", label: "Namibia" },
//                     { value: "nauru", label: "Nauru" },
//                     { value: "nepal", label: "Nepal" },
//                     { value: "netherlands", label: "Netherlands" },
//                     { value: "new_zealand", label: "New Zealand" },
//                     { value: "nicaragua", label: "Nicaragua" },
//                     { value: "niger", label: "Niger" },
//                     { value: "nigeria", label: "Nigeria" },
//                     { value: "north_korea", label: "North Korea" },
//                     { value: "north_macedonia", label: "North Macedonia" },
//                     { value: "norway", label: "Norway" },
//                     { value: "oman", label: "Oman" },
//                     { value: "pakistan", label: "Pakistan" },
//                     { value: "palau", label: "Palau" },
//                     { value: "panama", label: "Panama" },
//                     { value: "papua_new_guinea", label: "Papua New Guinea" },
//                     { value: "paraguay", label: "Paraguay" },
//                     { value: "peru", label: "Peru" },
//                     { value: "philippines", label: "Philippines" },
//                     { value: "poland", label: "Poland" },
//                     { value: "portugal", label: "Portugal" },
//                     { value: "qatar", label: "Qatar" },
//                     { value: "romania", label: "Romania" },
//                     { value: "russia", label: "Russia" },
//                     { value: "rwanda", label: "Rwanda" },
//                     { value: "saint_kitts_and_nevis", label: "Saint Kitts and Nevis" },
//                     { value: "saint_lucia", label: "Saint Lucia" },
//                     { value: "saint_vincent_and_the_grenadines", label: "Saint Vincent and the Grenadines" },
//                     { value: "samoa", label: "Samoa" },
//                     { value: "san_marino", label: "San Marino" },
//                     { value: "sao_tome_and_principe", label: "Sao Tome and Principe" },
//                     { value: "saudi_arabia", label: "Saudi Arabia" },
//                     { value: "senegal", label: "Senegal" },
//                     { value: "serbia", label: "Serbia" },
//                     { value: "seychelles", label: "Seychelles" },
//                     { value: "sierra_leone", label: "Sierra Leone" },
//                     { value: "singapore", label: "Singapore" },
//                     { value: "slovakia", label: "Slovakia" },
//                     { value: "slovenia", label: "Slovenia" },
//                     { value: "solomon_islands", label: "Solomon Islands" },
//                     { value: "somalia", label: "Somalia" },
//                     { value: "south_africa", label: "South Africa" },
//                     { value: "south_korea", label: "South Korea" },
//                     { value: "south_sudan", label: "South Sudan" },
//                     { value: "spain", label: "Spain" },
//                     { value: "sri_lanka", label: "Sri Lanka" },
//                     { value: "sudan", label: "Sudan" },
//                     { value: "suriname", label: "Suriname" },
//                     { value: "sweden", label: "Sweden" },
//                     { value: "switzerland", label: "Switzerland" },
//                     { value: "syria", label: "Syria" },
//                     { value: "taiwan", label: "Taiwan" },
//                     { value: "tajikistan", label: "Tajikistan" },
//                     { value: "tanzania", label: "Tanzania" },
//                     { value: "thailand", label: "Thailand" },
//                     { value: "timor_leste", label: "Timor-Leste" },
//                     { value: "togo", label: "Togo" },
//                     { value: "tonga", label: "Tonga" },
//                     { value: "trinidad_and_tobago", label: "Trinidad and Tobago" },
//                     { value: "tunisia", label: "Tunisia" },
//                     { value: "turkey", label: "Turkey" },
//                     { value: "turkmenistan", label: "Turkmenistan" },
//                     { value: "tuvalu", label: "Tuvalu" },
//                     { value: "uganda", label: "Uganda" },
//                     { value: "ukraine", label: "Ukraine" },
//                     { value: "united_arab_emirates", label: "United Arab Emirates" },
//                     { value: "united_kingdom", label: "United Kingdom" },
//                     { value: "united_states", label: "United States" },
//                     { value: "uruguay", label: "Uruguay" },
//                     { value: "uzbekistan", label: "Uzbekistan" },
//                     { value: "vanuatu", label: "Vanuatu" },
//                     { value: "vatican_city", label: "Vatican City" },
//                     { value: "venezuela", label: "Venezuela" },
//                     { value: "vietnam", label: "Vietnam" },
//                     { value: "yemen", label: "Yemen" },
//                     { value: "zambia", label: "Zambia" },
//                     { value: "zimbabwe", label: "Zimbabwe" },
//                 ]}
//                 isMulti={false}
//                 placeholder="Choose country"
//                 allowCreate
//                 menuPlacement="top"
//                 defaultValue={country}
//                 onChange={(selected) => setCountry(selected as OptionType)}
//               />
//             </div>
//           </form>
//         </div>
//         <DialogFooter>
//           <Button
//             type="button"
//             className="bg-blue-500 text-white"
//             onClick={handleSubmit(handleOnSubmit, handleOnError)}
//           >
//             Submit
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditLeadModal;
