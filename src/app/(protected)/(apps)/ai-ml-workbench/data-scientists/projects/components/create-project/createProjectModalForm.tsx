"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { startProjectData } from "../invoke_create_project";
import { useRouter } from "next/navigation";
import { Assignment } from "../../../../components/type";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { TabArray } from "@/ikon/components/tabs/type";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import Tabs from "@/ikon/components/tabs";
import { Button } from "@/shadcn/ui/button";
import { Select } from "@/app/(protected)/(apps)/ai-workforce/components/ui/Select";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { Form } from "@/shadcn/ui/form";
import { projectSchema } from "../create-project-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// interface FormData {
//   projectId: string;
//   projectName: string;
//   assignmentId: string;
//   projectDescription: string;
//   assignmentDetails: {
//     assignmentId: string;
//     assignmentName: string;
//     assignmentDescription: string;
//     goalsArray: {
//       goalId: string;
//       goalName: string;
//       goalDescription: string;
//     }[];
//     datasetArray: {
//       tableName: string;
//       datasetName: string;
//     }[];
//     createdOn: string;
//     createdBy: string;
//     status: string;
//     pastStateList: string[];
//     activityLogsData: {
//       action: string;
//       actionString: string;
//       dateOfAction: string;
//       userId: string;
//       userName: string;
//       assignedToId?: string; // Optional, as not all logs have it
//     }[];
//     assignedBy: string;
//     assigneeName: string;
//     assigneeId: string;
//     assigneeTime: string;
//     assignHistory: {
//       assigneeId: string;
//       assigneeName: string;
//       assigneeTime: string;
//       assignedBy: string;
//     }[];
//   };
// }

// interface FormData {
//   projectId: string;
//   projectName: string;
//   assignmentId: string;
//   projectDescription: string;
//   assignmentDetails: {
//     assignmentId: string;
//     assignmentName: string;
//     assignmentDescription: string;
//     goalsArray: {
//       goalId: string;
//       goalName: string;
//       goalDescription: string;
//       modelDeatils?: {  // Optional as it's present in JSON but missing in the given type
//         name: string;
//         modelId: string;
//         status: string;
//         Accuracy: string;
//         Precision: string;
//         Recall: string;
//         updatedOn: string;
//       }[];
//     }[];
//     datasetArray: {
//       tableName: string;
//       datasetName: string;
//     }[];
//     createdOn: string;
//     createdBy: string;
//     status: string;
//     pastStateList: string[];
//     activityLogsData: {
//       action: string;
//       actionString: string;
//       dateOfAction: string;
//       userId: string;
//       userName: string;
//       assignedToId?: string; // Optional, as not all logs have it
//     }[];
//     assignedBy: string;
//     assigneeName: string;
//     assigneeId: string;
//     assigneeTime: string;
//     assignHistory: {
//       assigneeId: string;
//       assigneeName: string;
//       assigneeTime: string;
//       assignedBy: string;
//     }[];
//     pastProjectStatus?: string; // Optional because it’s in JSON but missing in the given type
//     projectCreatedDate?: string;
//     lockStatus?: string;
//   };
// }

interface FormData {
  projectId: string;
  projectName: string;
  assignmentId: string;
  projectDescription: string;
  assignmentDetails: Assignment;
}

interface UserDetails {
  userActive: boolean;
  userName: string;
}

interface AssignmentOptions {
  value: string;
  label: string;
}

interface OptionType {
  value: string;
  label: string;
  __isNew__?: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const [assignments, setAssignments] = useState<Assignment[] | undefined>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      assignment: "",
      projectName: "",
      projectDescription: "",
    },
  });

  const fetchAssignmentsDetails = async () => {
    const userId: string = (await getProfileData()).USER_ID;

    const assignmentDetails = await getMyInstancesV2<Assignment>({
      processName: "Assignments",
      predefinedFilters: { taskName: "Assignment View Activity" },
      mongoWhereClause: `this.Data.assigneeId == "${userId}"`,
    });
    console.log(assignmentDetails);
    setAssignments(assignmentDetails.map((e: any) => e.data));
  };

  useEffect(() => {
    fetchAssignmentsDetails();
  }, []);

  console.log("Assignments111111111", assignments);

  const handleOnSubmit = async (data: any) => {
    console.log("-------------", data);

    // Generate projectIdentifier if not already provided
    if (!data.projectId) {
      data.projectId = generateUUID();
    }

    // Combine everything into the final formData structure
    const formData = {
      projectId: data.projectId,
      projectName: data.projectName,
      assignmentId: data.assignment,
      projectDescription: data.projectDescription,
      assignmentDetails: {},
    };

    try {
      await startProjectData(formData);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  };

  const handleOnError = (errors: any) => {
    if (errors.organizationName) {
      alert(errors.organizationName.message);
    }
  };

  const assignmentOptions: AssignmentOptions[] =
    assignments?.map((item) => ({
      value: item.assignmentId,
      label: item.assignmentName,
    })) || [];

  console.log(assignmentOptions);

  const tabArray: TabArray[] = [
    {
      tabName: "Assignment Details",
      tabId: "tab-assignment",
      default: true,
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="col-span-2">
            <FormComboboxInput
              formControl={form.control}
              name="assignment"
              items={assignmentOptions}
              label="Assignment"
              placeholder="Select Assignment"
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Project Details",
      tabId: "tab-project",
      default: false,
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-1.5 col-span-2">
            <FormInput
              formControl={form.control}
              name="projectName"
              label="Project Name"
              placeholder="Enter Project Name"
            />
          </div>
          <div className="grid gap-1.5 col-span-2">
            <FormTextarea
              formControl={form.control}
              name="projectDescription"
              label="Project Description"
              placeholder="Enter Project Description"
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Dataset Details",
      tabId: "tab-dataset",
      default: false,
      tabContent: (
        <>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto"></div>
        </>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit, handleOnError)}>
            <div className="">
              <Tabs
                tabArray={tabArray}
                tabListClass="py-6 px-3"
                tabListButtonClass="text-md"
                tabListInnerClass="justify-between items-center"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
