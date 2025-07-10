// // "use client";

// // import React, { useState } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// //   DialogDescription
// // } from "@/shadcn/ui/dialog";
// // import { Button } from "@/shadcn/ui/button";
// // import PolicyForm from "./PolicyForm"; // Assuming your main form file is named PolicyForm.tsx

// // const OpenPolicyFormButton = () => {
// //   const [open, setOpen] = useState(false);

// //   return (
// //     <Dialog open={open} onOpenChange={setOpen}>
// //       <DialogTrigger asChild>
// //         <Button>Create New Policy</Button>
// //       </DialogTrigger>
// //       <DialogContent className="max-w-6xl h-[80%] flex flex-col">
// //         <DialogHeader>
// //           <DialogTitle>Create New Policy</DialogTitle>
// //           <DialogDescription>
// //             Please fill out all the steps to create a new policy.
// //           </DialogDescription>
// //         </DialogHeader>
// //         <div className="flex-1 mt-4 min-h-0">
// //           <PolicyForm onClose={() => setOpen(false)} />
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // export default OpenPolicyFormButton;

// // src/app/components/PolicyFormDialog.tsx

// // src/components/PolicyFormDialog.tsx

// "use client";

// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/shadcn/ui/dialog";
// import { Button } from "@/shadcn/ui/button";
// import PolicyForm, { type FullFormData } from "./PolicyForm";

// type Props = {
//   onSavePolicy: (data: FullFormData) => void;
// };

// // export default function PolicyFormDialog({ onSavePolicy }: Props) {
// export default function PolicyFormDialog(){
//   const [open, setOpen] = useState(false);

//   // const handleFormSubmit = (data: FullFormData) => {
//   //   onSavePolicy(data);
//   //   setOpen(false);
//   // };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>Create New Policy</Button>
//       </DialogTrigger>
//       {/* <DialogContent className="max-w-7xl h-[80%]  flex flex-col"> */}
//       <DialogContent className="!max-w-none w-[80vw] h-[90vh] p-6 pt-4 flex flex-col">
//         <DialogHeader>
//           <DialogTitle>Create New Policy</DialogTitle>
//           <DialogDescription>
//             Please fill out all the steps to create a new policy.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex-1 mt-4 min-h-0">
//           {/* <PolicyForm onFormSubmit={handleFormSubmit} editPolicyData={null} /> */}
//           <PolicyForm editPolicyData={null} />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// src/app/components/PolicyFormDialog.tsx
"use client";

import React from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/shadcn/ui/dialog";
import PolicyForm, { type FullFormData } from "./PolicyForm";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: FullFormData) => void; // To handle saving data
    editPolicyData: FullFormData | null;
};

export default function PolicyFormDialog({ open, onOpenChange, onSave, editPolicyData }: Props) {
    const handleFormSubmit = (data: FullFormData) => {
        onSave(data);
        onOpenChange(false); // Close dialog on save
    };
    
    // Determine if it's an edit or create operation
    const isEditMode = editPolicyData !== null;
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-none w-[80vw] h-[90vh] p-6 pt-4 flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Policy" : "Create New Policy"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode 
                            ? "Update the details of the existing policy." 
                            : "Please fill out all the steps to create a new policy."
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 mt-4 min-h-0">
                    <PolicyForm 
                        onFormSubmit={handleFormSubmit} 
                        editPolicyData={editPolicyData} 
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};