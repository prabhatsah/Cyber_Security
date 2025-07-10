import { Card } from "@/shadcn/ui/card";

import { IconButton, IconButtonWithTooltip, IconTextButton } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import TreeView from "../components/treeview-component";
import { CreateEpic } from "../components/create-epic";
import CustomAlertDialog from "@/ikon/components/alert-dialog";
import { CreateSprint } from "../components/create-sprint";



export default async function IssueLayout({ children, params }: { children: React.ReactNode, params: { projectIdentifierId: string, id: string } }) {
    const projectIdentifier = params.projectIdentifierId || "";
    const treeData = [
        {
          id: '1',
          label: 'User Authentication',
          description: 'Implement secure user authentication system',
          status: 'IN_PROGRESS',
          children: [
            {
              id: '1.1',
              label: 'Sprint 1 - Auth Basics',
              dateRange: '4/1/2024 - 4/15/2024',
              status: 'ACTIVE',
              children: [
                {
                  id: '1.1.1',
                  label: 'Design Homepage',
                  description: 'Create new homepage design',
                  status: 'IN_PROGRESS',
                  plannedHours: 20,
                  actualHours: 15,
                  children: [
                    {
                      id: '1.1.1.1',
                      label: 'Create Wireframes',
                      description: 'Design initial wireframes',
                      status: 'COMPLETED',
                      plannedHours: 8,
                      actualHours: 10
                    },
                    {
                      id: '1.1.1.2',
                      label: 'Design Components',
                      description: 'Create reusable components',
                      status: 'IN_PROGRESS',
                      plannedHours: 12,
                      actualHours: 5
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
            id: '2',
            label: 'User Authentication 2',
            description: 'Implement secure user authentication system',
            status: 'IN_PROGRESS',
            children: [
              {
                id: '2.1',
                label: 'Sprint 1 - Auth Basics',
                dateRange: '4/1/2024 - 4/15/2024',
                status: 'ACTIVE',
                children: [
                  {
                    id: '2.1.1',
                    label: 'Design Homepage',
                    description: 'Create new homepage design',
                    status: 'IN_PROGRESS',
                    plannedHours: 20,
                    actualHours: 15,
                    children: [
                      {
                        id: '2.1.1.1',
                        label: 'Create Wireframes',
                        description: 'Design initial wireframes',
                        status: 'COMPLETED',
                        plannedHours: 8,
                        actualHours: 10
                      },
                      {
                        id: '2.1.1.2',
                        label: 'Design Components',
                        description: 'Create reusable components',
                        status: 'IN_PROGRESS',
                        plannedHours: 12,
                        actualHours: 5
                      }
                    ]
                  }
                ]
              }
            ]
          }
      ];    
    console.log("projectIdentifier ", projectIdentifier);
    
    return (
        <div className="items-center justify-center p-4">
          <Card className="p-6 w-full">
            <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold mb-4">Project Tasks</h1>
            <div className="flex items-center space-x-2">
              <CreateEpic projectIdentifier={projectIdentifier}/>
             <CreateSprint projectIdentifier={projectIdentifier}/>
                {/* <IconTextButton variant="outline">
              <Plus/> Sprint
                </IconTextButton> */}
                <IconTextButton variant="outline">
              <Plus/> Task
                </IconTextButton>
                <IconTextButton variant="outline">
              <Plus/> Subtask
                </IconTextButton>
              </div>
              </div> 
            
            <TreeView data={treeData} />
          </Card>
        </div>
      );
}