// "use client"
// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
// import { Input } from "@/shadcn/ui/input"
// import { Button } from "@/shadcn/ui/button";
// import { useForm } from "react-hook-form";

// interface OrgModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const OrgModal: React.FC<OrgModalProps> =  ({ isOpen, onClose }) => {
    
//     interface FormData {
//       name: string;
//       region: string;
//       workingHours: string;
//     }
    
//     const {
//       register,
//       handleSubmit,
//       formState: { errors },
//     } = useForm<FormData>();

//     const [region, setRegion] = useState<string | null>(null);
//     const [name, setName] = useState<string | null>(null);
//     const [workingHours, setWorkingHours] = useState<string | null>(null);

        
//   const handleOnSubmit = async (data: any) => {
  
//     if (!data.leadIdentifier) {
//       data.leadIdentifier = generateUUID();
//     }
  
//     data.leadStatus = "Proposal Prepared";
  
//     const organisationDetails = {
//       organisationName: data.organisationName,
//       email: data.email || '',
//       orgContactNo: data.orgContactNo || '',
//       noOfEmployees: data.noOfEmployees || '',
//       website: data.website || '',
//       city: data.city || '',
//       state: data.state || '',
//       postalCode: data.postalCode || '',
//       street: data.street || '',
//       landmark: data.landMark || '',
//       sector: sector?.value || '',
//       source: source?.value || '',
//       country: countryLead?.value || '', 
//     };
  
//     // Check and assign the account manager
//     if (data.accMngr === undefined) {
//       data.accMngr = accMngr?.value;
//     }
  
//     // Ensure teamMember is an array, and if not, initialize it as an empty array
//     if (!data.teamMember || !Array.isArray(data.teamMember)) {
//       data.teamMember = [];
//     }
  
//     // Process team members and push their values into the teamMember array
//     if (teamMember && Array.isArray(teamMember)) {
//       for (let member of teamMember) {
//         if (member && member.value !== undefined) {
//           data.teamMember.push(member.value);
//         }
//       }
//     }
  
//     // Map team information
//     const teamInformation = {
//       salesManager: data.accMngr || '', // Ensure salesManager is assigned
//       salesteam: data.teamMember || [], // Array of selected team members
//     };
  
//     // Combine everything into the final formData structure
//     const formData = {
//       leadIdentifier: data.leadIdentifier,
//       leadStatus: data.leadStatus,
//       organisationDetails,
//       teamInformation,
//       updatedOn: new Date().toISOString(), // Current timestamp
//     };
  
//     console.log('Final form data:', formData);
//     await startOrgData(formData);
    
//     onClose(); 
//   };
  

//     const generateUUID = () => {
//       return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
//         const random = (Math.random() * 16) | 0;
//         const value = char === 'x' ? random : (random & 0x3) | 0x8;
//         return value.toString(16);
//       });
//     };
    


//     const handleOnError = (errors: any) => {
//       if (errors.organizationName) {
//         alert(errors.organizationName.message);
//       }
//     };
   	
//     const tabArray: TabArray[] = [
//       {
//         tabName: "Lead Details",
//         tabId: "tab-lead",
//         default: true,
//         tabContent: (
         
//           <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
          
//             <div className="grid col-span-2 items-center gap-1.5">
//               <Label htmlFor="organizationId">Organization Name *</Label>
//               <Input type="text" id="organizationId" placeholder="Enter organization name" 
//               {...register('organisationName', {
//                 required: 'Organization name is required',
//                 minLength: {
//                   value: 1,
//                   message: 'Please Enter Organization Name',
//                 },
//               })}
//             />
              
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="emailId">Email</Label>
//               <Input type="email" id="emailId" placeholder="Enter Email" {...register('email')}/>
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="contactId">Contact Number</Label>
//               <Input type="number" id="contactId" placeholder="Enter Contact Number" {...register('orgContactNo')}/>
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="employeeTotalId">Number of Employees</Label>
//               <Input type="number" id="employeeTotalId" placeholder="Enter Number of Employees" {...register('noOfEmployees')}/>
//             </div>
            
//             <div>
//               <Select2
//                 label="Sector"
//                 options={[{ value: "finance", label: "Finance" }, { value: "technology", label: "Technology" }]}
//                 isMulti={false}
//                 placeholder="Choose sector"
//                 allowCreate
//                 menuPlacement="bottom"     
//                 onChange={(selected) => setSector(selected as OptionType)}
//                 validation={true}
//               />
//             </div>
//             <div>
//               <Select2
//                 label="Source"
//                 options={[{ value: "online", label: "Online" }, { value: "referral", label: "Referral" }]}
//                 isMulti={false}
//                 placeholder="Choose source"
//                 allowCreate
//                 menuPlacement="bottom"     
//                 onChange={(selected) => setSource(selected as OptionType)}
                
//               />
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="websiteId">Website</Label>
//               <Input type="text" id="websiteId" placeholder="Enter Website" {...register('website')}/>
//             </div>
//             <div className="grid gap-1.5 col-span-2">
//               <Label htmlFor="streetId">Street</Label>
//               <Textarea placeholder="Enter Street Name" />
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="cityId">City</Label>
//               <Input type="text" id="cityId" placeholder="Enter City" {...register('city')}/>
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="stateId">State</Label>
//               <Input type="text" id="stateId" placeholder="Enter State" {...register('state')}/>
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="zipId">ZIP/Postal Code</Label>
//               <Input type="text" id="zipId" placeholder="Enter ZIP/Postal Code" {...register('postalCode')}/>
//             </div>
            
//             <div>
//               <Select2
//                 label="Country"
//                 options={[
//                   { value: "afghanistan", label: "Afghanistan" },
//                   { value: "albania", label: "Albania" },
//                   { value: "algeria", label: "Algeria" },
//                   { value: "andorra", label: "Andorra" },
//                   { value: "angola", label: "Angola" },
//                   { value: "antigua_and_barbuda", label: "Antigua and Barbuda" },
//                   { value: "argentina", label: "Argentina" },
//                   { value: "armenia", label: "Armenia" },
//                   { value: "australia", label: "Australia" },
//                   { value: "austria", label: "Austria" },
//                   { value: "azerbaijan", label: "Azerbaijan" },
//                   { value: "bahamas", label: "Bahamas" },
//                   { value: "bahrain", label: "Bahrain" },
//                   { value: "bangladesh", label: "Bangladesh" },
//                   { value: "barbados", label: "Barbados" },
//                   { value: "belarus", label: "Belarus" },
//                   { value: "belgium", label: "Belgium" },
//                   { value: "belize", label: "Belize" },
//                   { value: "benin", label: "Benin" },
//                   { value: "bhutan", label: "Bhutan" },
//                   { value: "bolivia", label: "Bolivia" },
//                   { value: "bosnia_and_herzegovina", label: "Bosnia and Herzegovina" },
//                   { value: "botswana", label: "Botswana" },
//                   { value: "brazil", label: "Brazil" },
//                   { value: "brunei", label: "Brunei" },
//                   { value: "bulgaria", label: "Bulgaria" },
//                   { value: "burkina_faso", label: "Burkina Faso" },
//                   { value: "burundi", label: "Burundi" },
//                   { value: "cabo_verde", label: "Cabo Verde" },
//                   { value: "cambodia", label: "Cambodia" },
//                   { value: "cameroon", label: "Cameroon" },
//                   { value: "canada", label: "Canada" },
//                   { value: "central_african_republic", label: "Central African Republic" },
//                   { value: "chad", label: "Chad" },
//                   { value: "chile", label: "Chile" },
//                   { value: "china", label: "China" },
//                   { value: "colombia", label: "Colombia" },
//                   { value: "comoros", label: "Comoros" },
//                   { value: "congo", label: "Congo" },
//                   { value: "costa_rica", label: "Costa Rica" },
//                   { value: "croatia", label: "Croatia" },
//                   { value: "cuba", label: "Cuba" },
//                   { value: "cyprus", label: "Cyprus" },
//                   { value: "czechia", label: "Czechia" },
//                   { value: "denmark", label: "Denmark" },
//                   { value: "djibouti", label: "Djibouti" },
//                   { value: "dominica", label: "Dominica" },
//                   { value: "dominican_republic", label: "Dominican Republic" },
//                   { value: "ecuador", label: "Ecuador" },
//                   { value: "egypt", label: "Egypt" },
//                   { value: "el_salvador", label: "El Salvador" },
//                   { value: "equatorial_guinea", label: "Equatorial Guinea" },
//                   { value: "eritrea", label: "Eritrea" },
//                   { value: "estonia", label: "Estonia" },
//                   { value: "eswatini", label: "Eswatini" },
//                   { value: "ethiopia", label: "Ethiopia" },
//                   { value: "fiji", label: "Fiji" },
//                   { value: "finland", label: "Finland" },
//                   { value: "france", label: "France" },
//                   { value: "gabon", label: "Gabon" },
//                   { value: "gambia", label: "Gambia" },
//                   { value: "georgia", label: "Georgia" },
//                   { value: "germany", label: "Germany" },
//                   { value: "ghana", label: "Ghana" },
//                   { value: "greece", label: "Greece" },
//                   { value: "grenada", label: "Grenada" },
//                   { value: "guatemala", label: "Guatemala" },
//                   { value: "guinea", label: "Guinea" },
//                   { value: "guinea_bissau", label: "Guinea-Bissau" },
//                   { value: "guyana", label: "Guyana" },
//                   { value: "haiti", label: "Haiti" },
//                   { value: "honduras", label: "Honduras" },
//                   { value: "hungary", label: "Hungary" },
//                   { value: "iceland", label: "Iceland" },
//                   { value: "india", label: "India" },
//                   { value: "indonesia", label: "Indonesia" },
//                   { value: "iran", label: "Iran" },
//                   { value: "iraq", label: "Iraq" },
//                   { value: "ireland", label: "Ireland" },
//                   { value: "israel", label: "Israel" },
//                   { value: "italy", label: "Italy" },
//                   { value: "jamaica", label: "Jamaica" },
//                   { value: "japan", label: "Japan" },
//                   { value: "jordan", label: "Jordan" },
//                   { value: "kazakhstan", label: "Kazakhstan" },
//                   { value: "kenya", label: "Kenya" },
//                   { value: "kiribati", label: "Kiribati" },
//                   { value: "kosovo", label: "Kosovo" },
//                   { value: "kuwait", label: "Kuwait" },
//                   { value: "kyrgyzstan", label: "Kyrgyzstan" },
//                   { value: "laos", label: "Laos" },
//                   { value: "latvia", label: "Latvia" },
//                   { value: "lebanon", label: "Lebanon" },
//                   { value: "lesotho", label: "Lesotho" },
//                   { value: "liberia", label: "Liberia" },
//                   { value: "libya", label: "Libya" },
//                   { value: "liechtenstein", label: "Liechtenstein" },
//                   { value: "lithuania", label: "Lithuania" },
//                   { value: "luxembourg", label: "Luxembourg" },
//                   { value: "madagascar", label: "Madagascar" },
//                   { value: "malawi", label: "Malawi" },
//                   { value: "malaysia", label: "Malaysia" },
//                   { value: "maldives", label: "Maldives" },
//                   { value: "mali", label: "Mali" },
//                   { value: "malta", label: "Malta" },
//                   { value: "marshall_islands", label: "Marshall Islands" },
//                   { value: "mauritania", label: "Mauritania" },
//                   { value: "mauritius", label: "Mauritius" },
//                   { value: "mexico", label: "Mexico" },
//                   { value: "micronesia", label: "Micronesia" },
//                   { value: "moldova", label: "Moldova" },
//                   { value: "monaco", label: "Monaco" },
//                   { value: "mongolia", label: "Mongolia" },
//                   { value: "montenegro", label: "Montenegro" },
//                   { value: "morocco", label: "Morocco" },
//                   { value: "mozambique", label: "Mozambique" },
//                   { value: "myanmar", label: "Myanmar" },
//                   { value: "namibia", label: "Namibia" },
//                   { value: "nauru", label: "Nauru" },
//                   { value: "nepal", label: "Nepal" },
//                   { value: "netherlands", label: "Netherlands" },
//                   { value: "new_zealand", label: "New Zealand" },
//                   { value: "nicaragua", label: "Nicaragua" },
//                   { value: "niger", label: "Niger" },
//                   { value: "nigeria", label: "Nigeria" },
//                   { value: "north_korea", label: "North Korea" },
//                   { value: "north_macedonia", label: "North Macedonia" },
//                   { value: "norway", label: "Norway" },
//                   { value: "oman", label: "Oman" },
//                   { value: "pakistan", label: "Pakistan" },
//                   { value: "palau", label: "Palau" },
//                   { value: "panama", label: "Panama" },
//                   { value: "papua_new_guinea", label: "Papua New Guinea" },
//                   { value: "paraguay", label: "Paraguay" },
//                   { value: "peru", label: "Peru" },
//                   { value: "philippines", label: "Philippines" },
//                   { value: "poland", label: "Poland" },
//                   { value: "portugal", label: "Portugal" },
//                   { value: "qatar", label: "Qatar" },
//                   { value: "romania", label: "Romania" },
//                   { value: "russia", label: "Russia" },
//                   { value: "rwanda", label: "Rwanda" },
//                   { value: "saint_kitts_and_nevis", label: "Saint Kitts and Nevis" },
//                   { value: "saint_lucia", label: "Saint Lucia" },
//                   { value: "saint_vincent_and_the_grenadines", label: "Saint Vincent and the Grenadines" },
//                   { value: "samoa", label: "Samoa" },
//                   { value: "san_marino", label: "San Marino" },
//                   { value: "sao_tome_and_principe", label: "Sao Tome and Principe" },
//                   { value: "saudi_arabia", label: "Saudi Arabia" },
//                   { value: "senegal", label: "Senegal" },
//                   { value: "serbia", label: "Serbia" },
//                   { value: "seychelles", label: "Seychelles" },
//                   { value: "sierra_leone", label: "Sierra Leone" },
//                   { value: "singapore", label: "Singapore" },
//                   { value: "slovakia", label: "Slovakia" },
//                   { value: "slovenia", label: "Slovenia" },
//                   { value: "solomon_islands", label: "Solomon Islands" },
//                   { value: "somalia", label: "Somalia" },
//                   { value: "south_africa", label: "South Africa" },
//                   { value: "south_korea", label: "South Korea" },
//                   { value: "south_sudan", label: "South Sudan" },
//                   { value: "spain", label: "Spain" },
//                   { value: "sri_lanka", label: "Sri Lanka" },
//                   { value: "sudan", label: "Sudan" },
//                   { value: "suriname", label: "Suriname" },
//                   { value: "sweden", label: "Sweden" },
//                   { value: "switzerland", label: "Switzerland" },
//                   { value: "syria", label: "Syria" },
//                   { value: "taiwan", label: "Taiwan" },
//                   { value: "tajikistan", label: "Tajikistan" },
//                   { value: "tanzania", label: "Tanzania" },
//                   { value: "thailand", label: "Thailand" },
//                   { value: "timor_leste", label: "Timor-Leste" },
//                   { value: "togo", label: "Togo" },
//                   { value: "tonga", label: "Tonga" },
//                   { value: "trinidad_and_tobago", label: "Trinidad and Tobago" },
//                   { value: "tunisia", label: "Tunisia" },
//                   { value: "turkey", label: "Turkey" },
//                   { value: "turkmenistan", label: "Turkmenistan" },
//                   { value: "tuvalu", label: "Tuvalu" },
//                   { value: "uganda", label: "Uganda" },
//                   { value: "ukraine", label: "Ukraine" },
//                   { value: "united_arab_emirates", label: "United Arab Emirates" },
//                   { value: "united_kingdom", label: "United Kingdom" },
//                   { value: "united_states", label: "United States" },
//                   { value: "uruguay", label: "Uruguay" },
//                   { value: "uzbekistan", label: "Uzbekistan" },
//                   { value: "vanuatu", label: "Vanuatu" },
//                   { value: "vatican_city", label: "Vatican City" },
//                   { value: "venezuela", label: "Venezuela" },
//                   { value: "vietnam", label: "Vietnam" },
//                   { value: "yemen", label: "Yemen" },
//                   { value: "zambia", label: "Zambia" },
//                   { value: "zimbabwe", label: "Zimbabwe" },
//                 ]}
//                 isMulti={false}
//                 placeholder="Choose country"
//                 allowCreate
//                 menuPlacement={"top"}      
//                 onChange={(selected) => setCountryLead(selected as OptionType)}     
//               />
//             </div>
//             <div className="grid gap-1.5">
//               <Label htmlFor="landMarkId">Landmark</Label>
//               <Input type="text" id="landMarkId" placeholder="Enter Landmark" {...register('landMark')}/>
//             </div>
            
//           </div>
//         ),
//       },
//       {
//         tabName: "Contact Details",
//         tabId: "tab-contact",
//         default: false,
//         tabContent: <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
//           <div className="grid gap-1.5">
//               <Label htmlFor="firstNameId">First Name</Label>
//               <Input type="text" id="firstNameId" placeholder="Enter First Name" {...register('firstName')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="middleNameId">Middle Name</Label>
//               <Input type="text" id="middleNameId" placeholder="Enter Middle Name" {...register('middleName')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="lastNameId">Last Name</Label>
//               <Input type="text" id="lastNameId" placeholder="Enter Last Name" {...register('lastName')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="emailId">Email</Label>
//               <Input type="email" id="emailId" placeholder="Enter Email" {...register('email')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="numberId">Phone Number Name</Label>
//               <Input type="number" id="numberId" placeholder="Enter Phone Number" {...register('phoneNum')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="mobileId">Mobile Number</Label>
//               <Input type="number" id="mobileId" placeholder="Enter Mobile Number" {...register('mobNo')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="departmentId">Department</Label>
//               <Input type="text" id="departmentId" placeholder="Enter Department" {...register('department')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="faxId">Fax</Label>
//               <Input type="text" id="faxId" placeholder="Enter Fax" {...register('fax')}/>
//           </div>
        
//           <div className="grid gap-1.5">
//               <Label htmlFor="address1Id">Address 1</Label>
//               <Textarea placeholder="Enter Address1" {...register('address1')}/>
//               {/* <Input type="text" id="address1Id" placeholder="Enter Address1" /> */}
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="address2Id">Address 2</Label>
//               <Textarea placeholder="Enter Address2" {...register('address2')}/>
//               {/* <Input type="text" id="address2Id" placeholder="Enter Address2" /> */}
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="cityId">City</Label>
//               <Input type="text" id="cityId" placeholder="Enter City" {...register('city')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="stateId">State</Label>
//               <Input type="text" id="stateId" placeholder="Enter State" {...register('state')}/>
//           </div>
//           <div className="grid gap-1.5">
//               <Label htmlFor="pinCodeId">Pin Code</Label>
//               <Input type="text" id="pinCodeId" placeholder="Enter Pin Code" {...register('pinCode')}/>
//           </div>
        
      
//           <div>
//           <Select2
//               label="Country"
//               options={[
//                 { value: "afghanistan", label: "Afghanistan" },
//                 { value: "albania", label: "Albania" },
//                 { value: "algeria", label: "Algeria" },
//                 { value: "andorra", label: "Andorra" },
//                 { value: "angola", label: "Angola" },
//                 { value: "antigua_and_barbuda", label: "Antigua and Barbuda" },
//                 { value: "argentina", label: "Argentina" },
//                 { value: "armenia", label: "Armenia" },
//                 { value: "australia", label: "Australia" },
//                 { value: "austria", label: "Austria" },
//                 { value: "azerbaijan", label: "Azerbaijan" },
//                 { value: "bahamas", label: "Bahamas" },
//                 { value: "bahrain", label: "Bahrain" },
//                 { value: "bangladesh", label: "Bangladesh" },
//                 { value: "barbados", label: "Barbados" },
//                 { value: "belarus", label: "Belarus" },
//                 { value: "belgium", label: "Belgium" },
//                 { value: "belize", label: "Belize" },
//                 { value: "benin", label: "Benin" },
//                 { value: "bhutan", label: "Bhutan" },
//                 { value: "bolivia", label: "Bolivia" },
//                 { value: "bosnia_and_herzegovina", label: "Bosnia and Herzegovina" },
//                 { value: "botswana", label: "Botswana" },
//                 { value: "brazil", label: "Brazil" },
//                 { value: "brunei", label: "Brunei" },
//                 { value: "bulgaria", label: "Bulgaria" },
//                 { value: "burkina_faso", label: "Burkina Faso" },
//                 { value: "burundi", label: "Burundi" },
//                 { value: "cabo_verde", label: "Cabo Verde" },
//                 { value: "cambodia", label: "Cambodia" },
//                 { value: "cameroon", label: "Cameroon" },
//                 { value: "canada", label: "Canada" },
//                 { value: "central_african_republic", label: "Central African Republic" },
//                 { value: "chad", label: "Chad" },
//                 { value: "chile", label: "Chile" },
//                 { value: "china", label: "China" },
//                 { value: "colombia", label: "Colombia" },
//                 { value: "comoros", label: "Comoros" },
//                 { value: "congo", label: "Congo" },
//                 { value: "costa_rica", label: "Costa Rica" },
//                 { value: "croatia", label: "Croatia" },
//                 { value: "cuba", label: "Cuba" },
//                 { value: "cyprus", label: "Cyprus" },
//                 { value: "czechia", label: "Czechia" },
//                 { value: "denmark", label: "Denmark" },
//                 { value: "djibouti", label: "Djibouti" },
//                 { value: "dominica", label: "Dominica" },
//                 { value: "dominican_republic", label: "Dominican Republic" },
//                 { value: "ecuador", label: "Ecuador" },
//                 { value: "egypt", label: "Egypt" },
//                 { value: "el_salvador", label: "El Salvador" },
//                 { value: "equatorial_guinea", label: "Equatorial Guinea" },
//                 { value: "eritrea", label: "Eritrea" },
//                 { value: "estonia", label: "Estonia" },
//                 { value: "eswatini", label: "Eswatini" },
//                 { value: "ethiopia", label: "Ethiopia" },
//                 { value: "fiji", label: "Fiji" },
//                 { value: "finland", label: "Finland" },
//                 { value: "france", label: "France" },
//                 { value: "gabon", label: "Gabon" },
//                 { value: "gambia", label: "Gambia" },
//                 { value: "georgia", label: "Georgia" },
//                 { value: "germany", label: "Germany" },
//                 { value: "ghana", label: "Ghana" },
//                 { value: "greece", label: "Greece" },
//                 { value: "grenada", label: "Grenada" },
//                 { value: "guatemala", label: "Guatemala" },
//                 { value: "guinea", label: "Guinea" },
//                 { value: "guinea_bissau", label: "Guinea-Bissau" },
//                 { value: "guyana", label: "Guyana" },
//                 { value: "haiti", label: "Haiti" },
//                 { value: "honduras", label: "Honduras" },
//                 { value: "hungary", label: "Hungary" },
//                 { value: "iceland", label: "Iceland" },
//                 { value: "india", label: "India" },
//                 { value: "indonesia", label: "Indonesia" },
//                 { value: "iran", label: "Iran" },
//                 { value: "iraq", label: "Iraq" },
//                 { value: "ireland", label: "Ireland" },
//                 { value: "israel", label: "Israel" },
//                 { value: "italy", label: "Italy" },
//                 { value: "jamaica", label: "Jamaica" },
//                 { value: "japan", label: "Japan" },
//                 { value: "jordan", label: "Jordan" },
//                 { value: "kazakhstan", label: "Kazakhstan" },
//                 { value: "kenya", label: "Kenya" },
//                 { value: "kiribati", label: "Kiribati" },
//                 { value: "kosovo", label: "Kosovo" },
//                 { value: "kuwait", label: "Kuwait" },
//                 { value: "kyrgyzstan", label: "Kyrgyzstan" },
//                 { value: "laos", label: "Laos" },
//                 { value: "latvia", label: "Latvia" },
//                 { value: "lebanon", label: "Lebanon" },
//                 { value: "lesotho", label: "Lesotho" },
//                 { value: "liberia", label: "Liberia" },
//                 { value: "libya", label: "Libya" },
//                 { value: "liechtenstein", label: "Liechtenstein" },
//                 { value: "lithuania", label: "Lithuania" },
//                 { value: "luxembourg", label: "Luxembourg" },
//                 { value: "madagascar", label: "Madagascar" },
//                 { value: "malawi", label: "Malawi" },
//                 { value: "malaysia", label: "Malaysia" },
//                 { value: "maldives", label: "Maldives" },
//                 { value: "mali", label: "Mali" },
//                 { value: "malta", label: "Malta" },
//                 { value: "marshall_islands", label: "Marshall Islands" },
//                 { value: "mauritania", label: "Mauritania" },
//                 { value: "mauritius", label: "Mauritius" },
//                 { value: "mexico", label: "Mexico" },
//                 { value: "micronesia", label: "Micronesia" },
//                 { value: "moldova", label: "Moldova" },
//                 { value: "monaco", label: "Monaco" },
//                 { value: "mongolia", label: "Mongolia" },
//                 { value: "montenegro", label: "Montenegro" },
//                 { value: "morocco", label: "Morocco" },
//                 { value: "mozambique", label: "Mozambique" },
//                 { value: "myanmar", label: "Myanmar" },
//                 { value: "namibia", label: "Namibia" },
//                 { value: "nauru", label: "Nauru" },
//                 { value: "nepal", label: "Nepal" },
//                 { value: "netherlands", label: "Netherlands" },
//                 { value: "new_zealand", label: "New Zealand" },
//                 { value: "nicaragua", label: "Nicaragua" },
//                 { value: "niger", label: "Niger" },
//                 { value: "nigeria", label: "Nigeria" },
//                 { value: "north_korea", label: "North Korea" },
//                 { value: "north_macedonia", label: "North Macedonia" },
//                 { value: "norway", label: "Norway" },
//                 { value: "oman", label: "Oman" },
//                 { value: "pakistan", label: "Pakistan" },
//                 { value: "palau", label: "Palau" },
//                 { value: "panama", label: "Panama" },
//                 { value: "papua_new_guinea", label: "Papua New Guinea" },
//                 { value: "paraguay", label: "Paraguay" },
//                 { value: "peru", label: "Peru" },
//                 { value: "philippines", label: "Philippines" },
//                 { value: "poland", label: "Poland" },
//                 { value: "portugal", label: "Portugal" },
//                 { value: "qatar", label: "Qatar" },
//                 { value: "romania", label: "Romania" },
//                 { value: "russia", label: "Russia" },
//                 { value: "rwanda", label: "Rwanda" },
//                 { value: "saint_kitts_and_nevis", label: "Saint Kitts and Nevis" },
//                 { value: "saint_lucia", label: "Saint Lucia" },
//                 { value: "saint_vincent_and_the_grenadines", label: "Saint Vincent and the Grenadines" },
//                 { value: "samoa", label: "Samoa" },
//                 { value: "san_marino", label: "San Marino" },
//                 { value: "sao_tome_and_principe", label: "Sao Tome and Principe" },
//                 { value: "saudi_arabia", label: "Saudi Arabia" },
//                 { value: "senegal", label: "Senegal" },
//                 { value: "serbia", label: "Serbia" },
//                 { value: "seychelles", label: "Seychelles" },
//                 { value: "sierra_leone", label: "Sierra Leone" },
//                 { value: "singapore", label: "Singapore" },
//                 { value: "slovakia", label: "Slovakia" },
//                 { value: "slovenia", label: "Slovenia" },
//                 { value: "solomon_islands", label: "Solomon Islands" },
//                 { value: "somalia", label: "Somalia" },
//                 { value: "south_africa", label: "South Africa" },
//                 { value: "south_korea", label: "South Korea" },
//                 { value: "south_sudan", label: "South Sudan" },
//                 { value: "spain", label: "Spain" },
//                 { value: "sri_lanka", label: "Sri Lanka" },
//                 { value: "sudan", label: "Sudan" },
//                 { value: "suriname", label: "Suriname" },
//                 { value: "sweden", label: "Sweden" },
//                 { value: "switzerland", label: "Switzerland" },
//                 { value: "syria", label: "Syria" },
//                 { value: "taiwan", label: "Taiwan" },
//                 { value: "tajikistan", label: "Tajikistan" },
//                 { value: "tanzania", label: "Tanzania" },
//                 { value: "thailand", label: "Thailand" },
//                 { value: "timor_leste", label: "Timor-Leste" },
//                 { value: "togo", label: "Togo" },
//                 { value: "tonga", label: "Tonga" },
//                 { value: "trinidad_and_tobago", label: "Trinidad and Tobago" },
//                 { value: "tunisia", label: "Tunisia" },
//                 { value: "turkey", label: "Turkey" },
//                 { value: "turkmenistan", label: "Turkmenistan" },
//                 { value: "tuvalu", label: "Tuvalu" },
//                 { value: "uganda", label: "Uganda" },
//                 { value: "ukraine", label: "Ukraine" },
//                 { value: "united_arab_emirates", label: "United Arab Emirates" },
//                 { value: "united_kingdom", label: "United Kingdom" },
//                 { value: "united_states", label: "United States" },
//                 { value: "uruguay", label: "Uruguay" },
//                 { value: "uzbekistan", label: "Uzbekistan" },
//                 { value: "vanuatu", label: "Vanuatu" },
//                 { value: "vatican_city", label: "Vatican City" },
//                 { value: "venezuela", label: "Venezuela" },
//                 { value: "vietnam", label: "Vietnam" },
//                 { value: "yemen", label: "Yemen" },
//                 { value: "zambia", label: "Zambia" },
//                 { value: "zimbabwe", label: "Zimbabwe" },
//               ]}
//               isMulti={false}
//               placeholder="Choose country"
//               allowCreate
//               menuPlacement={"top"}   
//               onChange={(selected) => setCountryContact(selected as OptionType)}      
//           />
//           </div>
//       </div>,
//       },
//       {
//         tabName: "Team Details",
//         tabId: "tab-team",
//         default: false,
//         tabContent: (
//           <>
//               <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
//                   <div className="grid gap-1.5 col-span-2">
//                       <Select2
//                         label="Account Manager"
//                         //options={salesManagerOptions}
//                         options={[
//                           { value: "Anushri Dutta", label: "Anushri Dutta" },
//                           { value: "Prity Karmakar", label: "Prity Karmakar" },
//                         ]}
//                         isMulti={false}
//                         placeholder="Choose Account Manager"
//                         allowCreate
//                         menuPlacement="bottom" 
//                         onChange={(selected) => setAccMngr(selected as OptionType)}                      
//                       />
//                   </div>
                  
//                   <div className="grid gap-1.5 col-span-2">
//                       <Select2
//                           label="Sales Team Member"
//                           //options={teamMemberOptions}
//                           options={[
//                             { value: "Anushri Dutta", label: "Anushri Dutta" },
//                             { value: "Prity Karmakar", label: "Prity Karmakar" },
//                           ]}
//                           isMulti={true}
//                           placeholder="Choose Team Member"
//                           allowCreate
//                           menuPlacement="bottom"             
//                           onChange={(selected) => setTeamMember(selected as OptionType)}
//                       />
//                   </div>
//               </div>
//           </>
          
//         ),
//       },
//     ];

//     return (
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent className="max-w-5xl">
//           <DialogHeader>
//             <DialogTitle>Add Lead</DialogTitle>
//           </DialogHeader>
//           <div className="">
//           <form >
//             <TabContainer tabArray={tabArray} tabListClass='py-6 px-3' tabListButtonClass='text-md' tabListInnerClass='justify-between items-center'/>
//             </form>
//           </div>
//           <DialogFooter>
//           <Button type="button"  className="bg-blue-500 text-white" onClick={handleSubmit(handleOnSubmit, handleOnError)}>
//             Submit
//           </Button>
            
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     );
// };

// export default OrgModal;



