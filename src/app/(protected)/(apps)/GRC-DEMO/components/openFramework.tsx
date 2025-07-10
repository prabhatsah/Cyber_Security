"use client";
import { Button } from '@/shadcn/ui/button';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import CreateFramework from './createFramework';
import FrameworkCreationForm, { FrameworkDraftData } from './frameworkCreationForm';
import UploadComponent from './uploadSection';
import { RadioGroup, RadioGroupItem } from '@/shadcn/ui/radio-group';
import { Label } from '@/shadcn/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
// import UploadComponent from './UploadComponent'; 

type UserOption = {
  value: string;
  label: string;
};

export default function OpenFramework({
  allUsers,
  frameworkDraftData,
}: {
  allUsers: UserOption[];
  frameworkDraftData: FrameworkDraftData | null;
}) {
  const [openFramework, setOpenFramework] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("edit");

  const handleContinue = () => {
    if (selectedOption === "scratch") {
      setOpenFramework(true)
    } else {
      setUploadDialogOpen(true)
    }
    setCustomAlertVisible(false);
  };

  return (
    <>
      <div className="flex gap-2">
        {/* <Button onClick={() => setOpenFramework(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Framework
        </Button> */}

        <Button onClick={() => setCustomAlertVisible(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Framework
        </Button>

        {/* <Button onClick={() => setUploadDialogOpen(true)}>
          Upload Framework
        </Button> */}
      </div>

      <UploadComponent
        uploadDialogOpen={uploadDialogOpen}
        setUploadDialogOpen={setUploadDialogOpen}
        allUsers={allUsers}
      />

      {openFramework && (
        <FrameworkCreationForm
          open={openFramework}
          setOpen={setOpenFramework}
          userMap={allUsers}
          frameworkDraftData={null}
        />
      )}

      {customAlertVisible && (
        // <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        //   <div className="bg-[#2c2c2e] p-6 rounded-3xl w-full max-w-md">
        //     <h3 className="text-lg font-semibold mb-2">
        //       Please choose how you'd like to add a new framework:
        //     </h3>
        //     <br></br>
        //     <RadioGroup
        //       value={selectedOption}
        //       onValueChange={setSelectedOption}
        //       className="space-y-2 mb-6"
        //     >
        //       <div className="flex items-center space-x-2">
        //         <RadioGroupItem value="edit" id="edit" />
        //         <Label htmlFor="edit">
        //           Upload from a file
        //         </Label>
        //       </div>
        //       <div className="flex items-center space-x-2">
        //         <RadioGroupItem value="scratch" id="scratch" />
        //         <Label htmlFor="scratch">Enter details manually</Label>
        //       </div>
        //     </RadioGroup>

        //     <div className="flex justify-end space-x-2">
        //       <Button
        //         variant="outline"
        //         onClick={() => setCustomAlertVisible(false)}
        //       >
        //         Cancel
        //       </Button>
        //       <Button onClick={handleContinue}>Proceed</Button>
        //     </div>
        //   </div>
        // </div>


        // <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-4">

        //   <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700 text-white transform transition-all duration-300 scale-100 opacity-100">

        //     <h3 id="choose-framework-title" className="font-extrabold mb-8 text-3xl text-center">
        //       Choose how to add a new framework
        //     </h3>


        //     <RadioGroup
        //       value={selectedOption}
        //       onValueChange={setSelectedOption}
        //       className="space-y-4 mb-6"
        //     >

        //       <div
        //         className={`
        //       flex items-center space-x-4 rounded-xl px-6 py-4 border
        //       bg-gray-700/60 hover:bg-gray-600/80 transition-all duration-200 cursor-pointer shadow-lg`}
        //         onClick={() => setSelectedOption('edit')} // Added onClick to the div for easier selection
        //       >
        //         <RadioGroupItem value="edit" id="edit" />
        //         <Label htmlFor="edit" className="cursor-pointer text-lg font-medium text-gray-200">
        //           Upload from a file
        //         </Label>
        //       </div>


        //       <div
        //         className={`
        //       flex items-center space-x-4 rounded-xl px-6 py-4 border
        //       bg-gray-700/60 hover:bg-gray-600/80 transition-all duration-200 cursor-pointer shadow-lg `}
        //         onClick={() => setSelectedOption('scratch')} // Added onClick to the div for easier selection
        //       >
        //         <RadioGroupItem value="scratch" id="scratch" />
        //         <Label htmlFor="scratch" className="cursor-pointer text-lg font-medium text-gray-200">
        //           Enter details manually
        //         </Label>
        //       </div>
        //     </RadioGroup>


        //     <div className="flex justify-end space-x-4 mt-8">

        //       <Button
        //         variant="outline"
        //         onClick={() => setCustomAlertVisible(false)}
        //       >
        //         Cancel
        //       </Button>

        //       <Button onClick={handleContinue}>Proceed</Button>
        //     </div>
        //   </div>
        // </div>

        <div className="fixed inset-0 bg-gray-900/70  flex items-center justify-center z-50 p-4">
          <div className="relative bg-zinc-900 border border-zinc-700 p-10 rounded-2xl w-full max-w-md shadow-2xl shadow-zinc-800/50 text-white transform transition-all duration-500 ease-out scale-100 opacity-100">
            <div className="mb-10">
              <h3 id="choose-framework-title" className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 tracking-tight drop-shadow-md">
                Choose how to add a new framework
              </h3>
              <p className="text-base text-gray-400 text-center mt-3">
                Select an option to proceed for adding a new framework.
              </p>
            </div>

            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-5 mb-8"
            >
              <div
                className={`
              flex items-center space-x-4 rounded-xl px-6 py-4 border transition-all duration-200 ease-in-out shadow-md cursor-pointer
              bg-zinc-800/70 hover:bg-zinc-700/50
              ${selectedOption === 'edit' ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-zinc-700'}
            `}
                onClick={() => setSelectedOption('edit')}
              >
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit" className="cursor-pointer text-lg font-medium text-zinc-100">
                  Upload from a file
                </Label>
              </div>

              <div
                className={`
              flex items-center space-x-4 rounded-xl px-6 py-4 border transition-all duration-200 ease-in-out shadow-md cursor-pointer
              bg-zinc-800/70 hover:bg-zinc-700/50
              ${selectedOption === 'scratch' ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-zinc-700'}
            `}
                onClick={() => setSelectedOption('scratch')}
              >
                <RadioGroupItem value="scratch" id="scratch" />
                <Label htmlFor="scratch" className="cursor-pointer text-lg font-medium text-zinc-100">
                  Enter details manually
                </Label>
              </div>
            </RadioGroup>

            <div className="flex justify-end space-x-4 mt-10">
              <Button
                variant="outline"
                onClick={() => setCustomAlertVisible(false)}
                className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
              >
                Cancel
              </Button>
              <Button 
              onClick={handleContinue}
              className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
              >Proceed</Button>
            </div>
          </div>
        </div>

      )}
    </>
  );
}
