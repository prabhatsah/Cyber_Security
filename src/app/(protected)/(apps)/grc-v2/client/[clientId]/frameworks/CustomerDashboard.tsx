'use client';
import FrameworkOverview from './FrameworkOverview';
import { Button } from '@/shadcn/ui/button';
import { useState } from 'react';
import UploadFramework from './uploadFramework';
import { Upload } from 'lucide-react';


export default function CustomerDashboard({ clientId, subscribedList, availableList, assetsData, allUsers, profileData }: {clientId: string, subscribedList: any[], availableList: any[], assetsData: Record<string, string>[], allUsers: Record<string, string>[], profileData: string}) {

  const [openForm, setOpenForm] = useState<boolean>(false);
  function uploadFramework() {
    setOpenForm(true);
  }

  return (
    <div className="space-y-8 h-full">
      <div className="flex justify-between items-start">
        {/* <div>
          <h2 className="text-3xl font-bold text-white mb-2">Subscriber's Dashboard</h2>
          <p className="text-gray-400">Monitor compliance progress, device health, and security posture</p>
        </div>
        <div>
          <Button variant='outline' className="flex items-center space-x-2"
            onClick={() => uploadFramework()}
          >
            <Upload />
          </Button>
        </div> */}
      </div>

        <div className='h-[95%] overflow-y-auto'>
            <FrameworkOverview
              clientId={clientId}
              subscribedList={subscribedList}
              availableList={availableList}
            // userId={selectedClient} // Pass the currently selected client's ID
            />
        </div>

        {openForm && (
          <UploadFramework uploadDialogOpen={openForm} setUploadDialogOpen={setOpenForm}/>
        )}
    </div>
  );
}