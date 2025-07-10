import { Tooltip } from "@/ikon/components/tooltip";
import { IconTextButton, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Hourglass, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription,DialogHeader, DialogFooter } from "@/shadcn/ui/dialog";
import { Input } from "postcss";
import { Button } from "react-day-picker";
import { Label } from "recharts";
import StartDiscoveryForm from '../components/StartDiscoveryForm'
import { useRef, useState } from "react";
import { useDiscovery } from "./context/DiscoveryContext";


export default function StartDiscovery(){
    
    //refs for the buttons
    const addIpRangeRef = useRef<HTMLButtonElement>(null)
    const addRouterForMACDiscoveryRef = useRef<HTMLButtonElement>(null)
    const startDiscoveryRef = useRef<HTMLButtonElement>(null)

    // const {discoveryStarted} = useDiscovery()

    return (
        <>
           
                <Dialog>
                    <DialogTrigger asChild>
                        <IconTextButtonWithTooltip tooltipContent={`Start Discovery`}>
                            <Hourglass />
                        </IconTextButtonWithTooltip>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1305px]">
                        <DialogHeader>
                            <DialogTitle>Discovery Details</DialogTitle>

                        </DialogHeader>
                        <div className="sm:max-w-[1255px]">



                            <StartDiscoveryForm IpRangeref={addIpRangeRef} macDiscoveryRef={addRouterForMACDiscoveryRef} startDiscoveryRef={startDiscoveryRef} />
                        </div>

                        <DialogFooter>
                            <IconTextButton type="button" onClick={() => {
                                addIpRangeRef.current.click()
                            }} > <Plus />Add IP Range </IconTextButton>
                            <IconTextButton type="button" onClick={() => {
                                addRouterForMACDiscoveryRef.current.click()
                            }} > <Plus />Add Router For MAC Discovery </IconTextButton>
                            <IconTextButton type="submit" onClick={() => {
                                console.log('clicked')
                                debugger
                                startDiscoveryRef.current.click()
                            }} > <Hourglass />Start dDiscovery </IconTextButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            
        </>
    )
}


// "use client";

// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// import { useToast } from "@/hooks/use-toast";

// // Define the form schema with Zod
// const formSchema = z.object({
//   router: z.string().min(1, { message: "Router is required" }),
//   ipRange: z.string().min(1, { message: "IP Range is required" }),
//   credentials: z.array(z.string()).min(1, { message: "At least one credential must be selected" }),
//   probe: z.string().min(1, { message: "Probe selection is required" }),
// });

// // Define credential options
// const credentialOptions = {
//   windows: [
//     { id: "test1", label: "test" },
//     { id: "test2", label: "test" },
//     { id: "test3", label: "test" },
//     { id: "test4", label: "test" },
//     { id: "demo", label: "demo" },
//   ],
//   ssh: [
//     { id: "vpm-dev", label: "VPM-DEV application server and mysql" },
//     { id: "ikoncloud-db", label: "IkonCloud-dev DB Server" },
//     { id: "ikoncloud-app", label: "IkonCloud-dev Application Server" },
//     { id: "ikoncloud-mariadb", label: "IkonCloud Production MariaDB Server" },
//     { id: "ikoncloud-db-prod", label: "IkonCloud Production DB Server" },
//   ],
//   snmp: [],
// };

// // Define probe options
// const probeOptions = [
//   { value: "ping", label: "Ping" },
//   { value: "snmp", label: "SNMP" },
//   { value: "ssh", label: "SSH" },
//   { value: "wmi", label: "WMI" },
//   { value: "http", label: "HTTP" },
// ];

// export default function DiscoveryForm() {
//   const [open, setOpen] = useState(false);
//   const [ipRanges, setIpRanges] = useState<string[]>([]);
//   const [routers, setRouters] = useState<string[]>([]);
//   const [selectedCredentials, setSelectedCredentials] = useState({
//     windows: [] as string[],
//     ssh: [] as string[],
//     snmp: [] as string[],
//   });
//   const { toast } = useToast();

//   // Initialize form
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       router: "",
//       ipRange: "",
//       credentials: [],
//       probe: "",
//     },
//   });

//   // Handle form submission
//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values);
//     // Here you would typically send the data to your backend
//     toast({
//       title: "Discovery Started",
//       description: "Discovery process has been initiated with the provided configuration.",
//     });
//     setOpen(false);
//   }

//   // Add IP Range
//   const addIpRange = () => {
//     const ipRange = form.getValues("ipRange");
//     if (ipRange) {
//       setIpRanges([...ipRanges, ipRange]);
//       form.setValue("ipRange", "");
//     }
//   };

//   // Add Router
//   const addRouter = () => {
//     const router = form.getValues("router");
//     if (router) {
//       setRouters([...routers, router]);
//       form.setValue("router", "");
//     }
//   };

//   // Toggle credential selection
//   const toggleCredential = (type: keyof typeof selectedCredentials, id: string) => {
//     setSelectedCredentials(prev => {
//       const newSelection = { ...prev };
//       if (newSelection[type].includes(id)) {
//         newSelection[type] = newSelection[type].filter(item => item !== id);
//       } else {
//         newSelection[type] = [...newSelection[type], id];
//       }
      
//       // Update the form's credentials field
//       const allCredentials = [
//         ...newSelection.windows,
//         ...newSelection.ssh,
//         ...newSelection.snmp
//       ];
//       form.setValue("credentials", allCredentials);
      
//       return newSelection;
//     });
//   };

//   return (
//     <div className="w-full">
//       <Button 
//         onClick={() => setOpen(true)}
//         className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-sm transition-colors"
//       >
//         Open Discovery Form
//       </Button>

//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-[900px] p-6 bg-white rounded-lg shadow-lg">
//           <DialogHeader className="pb-4 border-b border-gray-200">
//             <DialogTitle className="text-xl font-bold text-gray-900">Discovery Details</DialogTitle>
//           </DialogHeader>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
//               {/* Router For MAC Discovery */}
//               <div className="space-y-2">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Router For MAC Discovery{" "}
//                   <span className="text-red-500 text-sm font-normal">
//                     {routers.length === 0 ? "(Please add to display fields)" : ""}
//                   </span>
//                 </h3>
//                 <FormField
//                   control={form.control}
//                   name="router"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Input 
//                           placeholder="Enter router address" 
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500 text-sm" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* IP Range */}
//               <div className="space-y-2">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   IP Range{" "}
//                   <span className="text-red-500 text-sm font-normal">
//                     {ipRanges.length === 0 ? "(Please add to display fields)" : ""}
//                   </span>
//                 </h3>
//                 <FormField
//                   control={form.control}
//                   name="ipRange"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Input 
//                           placeholder="Enter IP range (e.g., 192.168.1.0/24)" 
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500 text-sm" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Choose Credentials */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium text-gray-900">Choose Credentials</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {/* Windows Credentials */}
//                   <div className="border border-gray-300 rounded-md p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <Checkbox 
//                           id="windows" 
//                           className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                           checked={selectedCredentials.windows.length > 0}
//                           onCheckedChange={(checked) => {
//                             if (checked) {
//                               // Select all windows credentials
//                               const allIds = credentialOptions.windows.map(c => c.id);
//                               setSelectedCredentials({...selectedCredentials, windows: allIds});
//                               form.setValue("credentials", [...selectedCredentials.ssh, ...selectedCredentials.snmp, ...allIds]);
//                             } else {
//                               // Deselect all windows credentials
//                               setSelectedCredentials({...selectedCredentials, windows: []});
//                               form.setValue("credentials", [...selectedCredentials.ssh, ...selectedCredentials.snmp]);
//                             }
//                           }}
//                         />
//                         <label htmlFor="windows" className="font-medium text-gray-900">WINDOWS</label>
//                       </div>
//                       <span className="text-sm text-gray-600">{selectedCredentials.windows.length}</span>
//                     </div>
//                     <Input 
//                       className="mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//                       placeholder="Search..." 
//                     />
//                     <h4 className="font-medium mb-2 flex items-center justify-between text-gray-900">
//                       Credentials
//                       <span className="text-blue-600">▼</span>
//                     </h4>
//                     <ScrollArea className="h-40 border border-gray-200 rounded-md">
//                       <div className="space-y-2 p-2">
//                         {credentialOptions.windows.map((cred) => (
//                           <div key={cred.id} className="flex items-center space-x-2">
//                             <Checkbox 
//                               id={`windows-${cred.id}`} 
//                               className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                               checked={selectedCredentials.windows.includes(cred.id)}
//                               onCheckedChange={() => toggleCredential("windows", cred.id)}
//                             />
//                             <label htmlFor={`windows-${cred.id}`} className="text-gray-700">{cred.label}</label>
//                           </div>
//                         ))}
//                       </div>
//                     </ScrollArea>
//                   </div>

//                   {/* SSH Credentials */}
//                   <div className="border border-gray-300 rounded-md p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <Checkbox 
//                           id="ssh" 
//                           className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                           checked={selectedCredentials.ssh.length > 0}
//                           onCheckedChange={(checked) => {
//                             if (checked) {
//                               // Select all ssh credentials
//                               const allIds = credentialOptions.ssh.map(c => c.id);
//                               setSelectedCredentials({...selectedCredentials, ssh: allIds});
//                               form.setValue("credentials", [...selectedCredentials.windows, ...selectedCredentials.snmp, ...allIds]);
//                             } else {
//                               // Deselect all ssh credentials
//                               setSelectedCredentials({...selectedCredentials, ssh: []});
//                               form.setValue("credentials", [...selectedCredentials.windows, ...selectedCredentials.snmp]);
//                             }
//                           }}
//                         />
//                         <label htmlFor="ssh" className="font-medium text-gray-900">SSH</label>
//                       </div>
//                       <span className="text-sm text-gray-600">{selectedCredentials.ssh.length}</span>
//                     </div>
//                     <Input 
//                       className="mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//                       placeholder="Search..." 
//                     />
//                     <h4 className="font-medium mb-2 flex items-center justify-between text-gray-900">
//                       Credentials
//                       <span className="text-blue-600">▼</span>
//                     </h4>
//                     <ScrollArea className="h-40 border border-gray-200 rounded-md">
//                       <div className="space-y-2 p-2">
//                         {credentialOptions.ssh.map((cred) => (
//                           <div key={cred.id} className="flex items-center space-x-2">
//                             <Checkbox 
//                               id={`ssh-${cred.id}`} 
//                               className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                               checked={selectedCredentials.ssh.includes(cred.id)}
//                               onCheckedChange={() => toggleCredential("ssh", cred.id)}
//                             />
//                             <label htmlFor={`ssh-${cred.id}`} className="text-gray-700">{cred.label}</label>
//                           </div>
//                         ))}
//                       </div>
//                     </ScrollArea>
//                     <Pagination className="mt-2">
//                       <PaginationContent>
//                         <PaginationItem>
//                           <PaginationPrevious href="#" className="text-blue-600 hover:text-blue-800" />
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationLink href="#" isActive className="bg-blue-600 text-white">1</PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationLink href="#" className="text-gray-700 hover:bg-gray-100">2</PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                           <PaginationNext href="#" className="text-blue-600 hover:text-blue-800" />
//                         </PaginationItem>
//                       </PaginationContent>
//                     </Pagination>
//                   </div>

//                   {/* SNMP Credentials */}
//                   <div className="border border-gray-300 rounded-md p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <Checkbox 
//                           id="snmp" 
//                           className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                           checked={selectedCredentials.snmp.length > 0}
//                           onCheckedChange={(checked) => {
//                             if (checked) {
//                               // Select all snmp credentials
//                               const allIds = credentialOptions.snmp.map(c => c.id);
//                               setSelectedCredentials({...selectedCredentials, snmp: allIds});
//                               form.setValue("credentials", [...selectedCredentials.windows, ...selectedCredentials.ssh, ...allIds]);
//                             } else {
//                               // Deselect all snmp credentials
//                               setSelectedCredentials({...selectedCredentials, snmp: []});
//                               form.setValue("credentials", [...selectedCredentials.windows, ...selectedCredentials.ssh]);
//                             }
//                           }}
//                         />
//                         <label htmlFor="snmp" className="font-medium text-gray-900">SNMP</label>
//                       </div>
//                       <span className="text-sm text-gray-600">{selectedCredentials.snmp.length}</span>
//                     </div>
//                     <Input 
//                       className="mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//                       placeholder="Search..." 
//                     />
//                     <h4 className="font-medium mb-2 flex items-center justify-between text-gray-900">
//                       Credentials
//                       <span className="text-blue-600">▼</span>
//                     </h4>
//                     <div className="h-40 flex items-center justify-center text-gray-500 border border-gray-200 rounded-md">
//                       No data available in table
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Probe Selection */}
//               <div>
//                 <FormField
//                   control={form.control}
//                   name="probe"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-medium text-gray-900">
//                         Probe <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                             <SelectValue placeholder="Select a probe" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
//                           {probeOptions.map((option) => (
//                             <SelectItem key={option.value} value={option.value} className="hover:bg-gray-100">
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage className="text-red-500 text-sm" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition-colors"
//                   onClick={addIpRange}
//                 >
//                   + Add IP Range
//                 </Button>
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition-colors"
//                   onClick={addRouter}
//                 >
//                   + Add Router for MAC Discovery
//                 </Button>
//                 <Button 
//                   type="submit" 
//                   className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition-colors"
//                 >
//                   🚀 Start Discovery
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       {/* Display added IP Ranges and Routers */}
//       {(ipRanges.length > 0 || routers.length > 0) && (
//         <div className="mt-8 space-y-4 p-6 bg-white rounded-lg shadow-md">
//           {ipRanges.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-2 text-gray-900">Added IP Ranges:</h3>
//               <ul className="list-disc pl-5 text-gray-700">
//                 {ipRanges.map((range, index) => (
//                   <li key={index} className="mb-1">{range}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
          
//           {routers.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-2 text-gray-900">Added Routers:</h3>
//               <ul className="list-disc pl-5 text-gray-700">
//                 {routers.map((router, index) => (
//                   <li key={index} className="mb-1">{router}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }