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

interface SingleRiskActivityItem {
  lastAddedBy: string;
  lastAddedOn: string;
  riskAddedId: string[];
  type: 'risk_addition_from_global';
}

interface RiskLogData {
  lastAddedBy: string;
  lastAddedOn: string;
  riskAddedId: string[];
  type: 'risk_addition_from_global';
  activity: SingleRiskActivityItem[];
}

interface UpdatesPageDetailsProps {
  activityLogDataOfRiskLibrary: Record<string, any>[];
  riskLibraryData: Record<string, any>[];
}
const UpdatesPageDetails: React.FC<UpdatesPageDetailsProps> = ({
  activityLogDataOfRiskLibrary,
  riskLibraryData
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string[] | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  const riskIdToNameMap = riskLibraryData.reduce<Record<string, string>>((acc, curr) => {
    acc[curr.riskId] = curr.riskLibName;
    return acc;
  }, {});

  const openRiskDetailsModal = (riskIds: string[], activityDate: string) => {
    const riskNames = riskIds.map(id => riskIdToNameMap[id] || id);
    setModalContent(riskNames);
    setModalTitle(`Risk Names Added on ${new Date(activityDate).toLocaleDateString()}`);
    setIsModalOpen(true);
  };

  const getBadgeText = (type: SingleRiskActivityItem['type']) => {
    // This function can be extended when you add other update types
    switch (type) {
      case 'risk_addition_from_global':
        return 'Risk Data Update';
      default:
        return 'General Update';
    }
  };

  const getBadgeColorClass = (type: SingleRiskActivityItem['type']) => {
    // This function can be extended when you add other update types
    switch (type) {
      case 'risk_addition_from_global':
        return 'bg-red-600 text-white dark:bg-red-400 dark:text-gray-900';
      default:
        return 'bg-gray-600 text-white dark:bg-gray-400 dark:text-gray-900';
    }
  };
  const updatesToDisplay = activityLogDataOfRiskLibrary[0].activity;

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto">


      <div className="space-y-6">
        {updatesToDisplay.length > 0 ? (
          updatesToDisplay.map((activity, index) => (
            <Card key={index} className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Risk Data Added
                </CardTitle>
                <Badge className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColorClass(activity.type)}`}>
                  {getBadgeText(activity.type)}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                  A batch of {activity.riskAddedId.length} risk IDs were added to the library.
                </CardDescription>
                <Separator className="my-3 bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  {/* <span>
                    Added By: <span className="font-medium text-gray-700 dark:text-gray-200">{activity.lastAddedBy}</span>
                  </span> */}
                  <span>
                    On: <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(activity.lastAddedOn).toLocaleDateString()}</span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center mt-4 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => openRiskDetailsModal(activity.riskAddedId, activity.lastAddedOn)}
                >
                  View {activity.riskAddedId.length} Risk IDs
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No risk library updates to display.</p>
        )}
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
                <Badge key={index} className="w-full py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 break-words">
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
