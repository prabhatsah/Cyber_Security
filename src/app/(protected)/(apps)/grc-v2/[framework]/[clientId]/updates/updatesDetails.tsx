"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';
import { Separator } from '@/shadcn/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shadcn/ui/dialog'; // Shadcn Dialog imports
import { Button } from '@/shadcn/ui/button'; // Shadcn Button import for modal close

// --- New Data Structures to support different update types ---

// Specific content for Risk Library activity
interface RiskLibraryActivityContent {
  lastAddedBy: string;
  lastAddedOn: string; // ISO string format
  riskAddedId: string[];
}

// Data structure for a Risk Library update item's content
interface RiskUpdateContent {
  summary: string; // A short summary for the main card display
  activity: RiskLibraryActivityContent[]; // The list of activities within this update
}

// Interface for general updates' content (e.g., system, global, assets, user management)
interface GeneralUpdateContent {
  data: string; // The full description of the update
}

// Main Update Item interface, supporting different content types based on 'type'
interface UpdateItem {
  id: string;
  updatedBy: string;
  updatedOn: string; // Date string for the overall update entry
  type: 'risk-data' | 'asset-update' | 'user-management' | 'system-update' | 'global-update'; // Specific types for badges
  content: RiskUpdateContent | GeneralUpdateContent; // Union type for update details
}

// --- Mock Data with varied types and structures ---
const mockUpdates: UpdateItem[] = [
  {
    id: '1-risk-update',
    updatedBy: 'Risk Management Team',
    updatedOn: '2025-06-16',
    type: 'risk-data',
    content: {
      summary: 'Several new risks and associated details were integrated into the Risk Library.',
      activity: [
        {
          lastAddedBy: '5b932638-29c6-4a0c-868c-11480b45abab', // User ID
          lastAddedOn: '2025-06-16T10:42:48.799Z',
          riskAddedId: [
            "e1e2b5fc-3740-4059-9cf9-8a6f5927ef93", "09f85a53-da48-4f8e-a470-dff1a5edd3e0",
            "d2b340be-1fa1-4128-ad39-7e167550641a", "84a79faa-d52c-4c6f-9ee6-abe9b1d0ae40",
            "82baa087-d03e-4aaa-aae9-109b909126fe", "10187ec0-92af-419d-9b06-9f1cddb7cb5a",
            "60b7761a-7e7e-440d-af43-918b6d6d1d03", "f5bade3b-421a-45a5-9eb8-dc57c1ab11fb",
          ],
        },
        {
          lastAddedBy: '5b932638-29c6-4a0c-868c-11480b45abab',
          lastAddedOn: '2025-06-16T10:50:20.603Z',
          riskAddedId: [
            "97ff4ca6-81bc-4cd1-9d3b-f6bf18757956", "44ba4e81-2995-4a83-8bb7-9965095478c1",
            "512347e7-9f23-4998-ba7e-37f9faee4a22", "cf9ad29e-4898-413c-abd4-6444d1911058",
            "9bc0b7f3-6070-4af2-891d-af1d1cc0b676", "0c85edfa-89de-4b4f-953e-b2568dbd6e23"
          ],
        },
      ],
    },
  },
  {
    id: '2-system-update',
    updatedBy: 'System Admin',
    updatedOn: '2024-06-15',
    type: 'system-update',
    content: {
      data: 'Implemented new user authentication flow with two-factor authentication (2FA) for enhanced security across the platform.',
    },
  },
  {
    id: '3-global-update',
    updatedBy: 'External Data Source',
    updatedOn: '2024-06-14',
    type: 'global-update',
    content: {
      data: 'Integration of the latest climate data API for real-time environmental monitoring, enhancing global compliance.',
    },
  },
  {
    id: '4-asset-update',
    updatedBy: 'Asset Management',
    updatedOn: '2024-06-18',
    type: 'asset-update',
    content: {
      data: 'New asset categorization system deployed, improving search and filtering capabilities for all hardware assets.',
    },
  },
  {
    id: '5-user-management-update',
    updatedBy: 'HR Systems',
    updatedOn: '2024-06-15',
    type: 'user-management',
    content: {
      data: 'User profile editing page updated with new validation rules and enhanced UI/UX for better user experience.',
    },
  },
];

const UpdatesPageDetails: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string[] | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  const openRiskDetailsModal = (activity: RiskLibraryActivityContent[]) => {
    // Flatten all riskAddedId from all activities for this update
    const allRiskIds = activity.flatMap(act => act.riskAddedId);
    setModalContent(allRiskIds);
    setModalTitle('Detailed Risk IDs Added');
    setIsModalOpen(true);
  };

  const getBadgeText = (type: UpdateItem['type']) => {
    switch (type) {
      case 'risk-data':
        return 'Risk Data Update';
      case 'asset-update':
        return 'Asset Update';
      case 'user-management':
        return 'User Management';
      case 'system-update':
        return 'System Update';
      case 'global-update':
        return 'Global Environment';
      default:
        return 'General Update';
    }
  };

  const getBadgeColorClass = (type: UpdateItem['type']) => {
    switch (type) {
      case 'risk-data':
        return 'bg-red-600 text-white dark:bg-red-400 dark:text-gray-900';
      case 'asset-update':
        return 'bg-purple-600 text-white dark:bg-purple-400 dark:text-gray-900';
      case 'user-management':
        return 'bg-yellow-600 text-white dark:bg-yellow-400 dark:text-gray-900';
      case 'system-update':
        return 'bg-blue-600 text-white dark:bg-blue-400 dark:text-gray-900';
      case 'global-update':
        return 'bg-green-600 text-white dark:bg-green-400 dark:text-gray-900';
      default:
        return 'bg-gray-600 text-white dark:bg-gray-400 dark:text-gray-900';
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6  overflow-y-auto h-[700] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      <div className="space-y-6">
        {mockUpdates.map((update) => (
          <Card key={update.id} className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {/* Dynamically display title based on update type */}
                {update.type === 'risk-data'
                  ? (update.content as RiskUpdateContent).summary
                  : (update.content as GeneralUpdateContent).data.substring(0, 70) + ((update.content as GeneralUpdateContent).data.length > 70 ? '...' : '')
                }
              </CardTitle>
              <Badge className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColorClass(update.type)}`}>
                {getBadgeText(update.type)}
              </Badge>
            </CardHeader>
            <CardContent>
              {/* Conditional rendering for content description or details button */}
              {update.type === 'risk-data' ? (
                <div className="space-y-3">
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Overview: {(update.content as RiskUpdateContent).summary}
                  </CardDescription>
                  <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Latest Activity: Added by <span className="font-medium text-gray-700 dark:text-gray-200">
                    {(update.content as RiskUpdateContent).activity[0]?.lastAddedBy || 'N/A'}
                    </span> on <span className="font-medium text-gray-700 dark:text-gray-200">
                    {new Date((update.content as RiskUpdateContent).activity[0]?.lastAddedOn || '').toLocaleDateString()}
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    className="w-full justify-center text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                    onClick={() => openRiskDetailsModal((update.content as RiskUpdateContent).activity)}
                  >
                    View All Risk IDs ({
                      (update.content as RiskUpdateContent).activity.reduce((acc, current) => acc + current.riskAddedId.length, 0)
                    })
                  </Button>
                </div>
              ) : (
                <>
                  <CardDescription className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                    {(update.content as GeneralUpdateContent).data}
                  </CardDescription>
                  <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Updated By: <span className="font-medium text-gray-700 dark:text-gray-200">{update.updatedBy}</span>
                    </span>
                    <span>
                      On: <span className="font-medium text-gray-700 dark:text-gray-200">{update.updatedOn}</span>
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{modalTitle}</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Below are the unique identifiers for the items added.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto space-y-2 p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
            {modalContent && modalContent.length > 0 ? (
              modalContent.map((id, index) => (
                <Badge key={index} className="w-full text-center py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 break-words">
                  {id}
                </Badge>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No IDs to display.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdatesPageDetails;



// "use client";
// import React, { useState } from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shadcn/ui/card';
// import { Badge } from '@/shadcn/ui/badge';
// import { Separator } from '@/shadcn/ui/separator';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/shadcn/ui/dialog'; // Shadcn Dialog imports
// import { Button } from '@/shadcn/ui/button'; // Shadcn Button import for modal close

// interface SingleRiskActivityItem {
//   lastAddedBy: string;
//   lastAddedOn: string;
//   riskAddedId: string[];
//   type: 'risk_addition_from_global';
// }

// interface RiskLogData {
//   lastAddedBy: string;
//   lastAddedOn: string;
//   riskAddedId: string[];
//   type: 'risk_addition_from_global';
//   activity: SingleRiskActivityItem[];
// }

// interface UpdatesPageDetailsProps {
//   activityLogDataOfRiskLibrary: Record<string, any>[];
//   riskLibraryData: Record<string, any>[];
// }
// const UpdatesPageDetails: React.FC<UpdatesPageDetailsProps> = ({
//   activityLogDataOfRiskLibrary,
//   riskLibraryData
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState<string[] | null>(null);
//   const [modalTitle, setModalTitle] = useState('');

//   const riskIdToNameMap = riskLibraryData.reduce<Record<string, string>>((acc, curr) => {
//     acc[curr.riskId] = curr.riskLibName;
//     return acc;
//   }, {});

//   const openRiskDetailsModal = (riskIds: string[], activityDate: string) => {
//     const riskNames = riskIds.map(id => riskIdToNameMap[id] || id);
//     setModalContent(riskNames);
//     setModalTitle(`Risk Names Added on ${new Date(activityDate).toLocaleDateString()}`);
//     setIsModalOpen(true);
//   };

//   const getBadgeText = (type: SingleRiskActivityItem['type']) => {
//     // This function can be extended when you add other update types
//     switch (type) {
//       case 'risk_addition_from_global':
//         return 'Risk Data Update';
//       default:
//         return 'General Update';
//     }
//   };

//   const getBadgeColorClass = (type: SingleRiskActivityItem['type']) => {
//     // This function can be extended when you add other update types
//     switch (type) {
//       case 'risk_addition_from_global':
//         return 'bg-red-600 text-white dark:bg-red-400 dark:text-gray-900';
//       default:
//         return 'bg-gray-600 text-white dark:bg-gray-400 dark:text-gray-900';
//     }
//   };
//   const updatesToDisplay = activityLogDataOfRiskLibrary[0].activity;

//   return (
//     <div className="container mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto">


//       <div className="space-y-6">
//         {updatesToDisplay.length > 0 ? (
//           updatesToDisplay.map((activity, index) => (
//             <Card key={index} className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                   Risk Data Added
//                 </CardTitle>
//                 <Badge className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColorClass(activity.type)}`}>
//                   {getBadgeText(activity.type)}
//                 </Badge>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
//                   A batch of {activity.riskAddedId.length} risk IDs were added to the library.
//                 </CardDescription>
//                 <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
//                 <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
//                   {/* <span>
//                     Added By: <span className="font-medium text-gray-700 dark:text-gray-200">{activity.lastAddedBy}</span>
//                   </span> */}
//                   <span>
//                     On: <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(activity.lastAddedOn).toLocaleDateString()}</span>
//                   </span>
//                 </div>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-center mt-4 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
//                   onClick={() => openRiskDetailsModal(activity.riskAddedId, activity.lastAddedOn)}
//                 >
//                   View {activity.riskAddedId.length} Risk IDs
//                 </Button>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 dark:text-gray-400">No risk library updates to display.</p>
//         )}
//       </div>

//       {/* Details Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-bold">{modalTitle}</DialogTitle>
//             <DialogDescription className="text-gray-600 dark:text-gray-400">
//               Below are the unique identifiers for the items added.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="max-h-60 overflow-y-auto space-y-2 p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
//             {modalContent && modalContent.length > 0 ? (
//               modalContent.map((id, index) => (
//                 <Badge key={index} className="w-full py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 break-words">
//                   {id}
//                 </Badge>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 dark:text-gray-400">No IDs to display.</p>
//             )}
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               onClick={() => setIsModalOpen(false)}
//               className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//             >
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default UpdatesPageDetails;

