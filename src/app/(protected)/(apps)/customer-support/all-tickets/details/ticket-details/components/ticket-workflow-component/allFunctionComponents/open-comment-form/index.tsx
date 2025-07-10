"use client";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAllUserData } from "@/app/(protected)/(apps)/customer-support/components/fetchUserData";
import { saveCommentData } from "./saveCommentData";
import { z } from "zod";
import { multipleFileUpload } from "@/ikon/utils/api/file-upload";
import FilePreviewCard from "./FilePreviewCard";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNo: string;
}

export const AddCommentFormSchema = z.object({
  writeComment: z.string().optional(), // Or .min(1, "Comment is required")
  uploadedResources: z.array(z.instanceof(File)).optional(),
});

const PostCommentModalForm: React.FC<TicketModalProps> = ({ isOpen, onClose, ticketNo }) => {
  const form = useForm({
    resolver: zodResolver(AddCommentFormSchema),
    defaultValues: {
      writeComment: "",
      uploadedResources: [],
    },
  });

  const [userData, setUserData] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllUserData();
      setUserData(data);
      setUserId(data.profileData.USER_ID);
      setUserName(data.profileData.USER_NAME);
    };
    fetchData();
  }, []); // Empty dependency array to run this once on mount

  const handleSubmit = async (values: Record<string, any>) => {
    console.log("Form Values:", values);
    console.log("Ticket No:", ticketNo);

    // Check for user data

    if (!userData || !userId) {
      console.error("User data or ID is not available");
      return;
    }

    const files: File[] = values.uploadedResources || [];
    let uploadedResources: {
      resourceId: string;
      resourceName: string | undefined;
      resourceType: string | undefined;
      resourceSize: number | undefined;
      uploadDate: Date; // Change to Date
      userName: string | null; // Change to userName
      userId: string;
      inputControl: string;
    }[] = [];

    if (files.length > 0) {
      try {
        const fileInfos = await multipleFileUpload(files);
        console.log("Multiple File Upload Infos:", fileInfos);
  
        uploadedResources = files.map((file, index) => { // Use files array
          const uploadDate = new Date();
        //  const dynamicId = Math.random().toString(36).substring(2, 15);
          const inputControlId = `fileUpload${crypto.randomUUID()}`;
  
          return {
            resourceId: fileInfos[index].resourceId, // Use fileInfos to get resourceId
            resourceName: fileInfos[index].resourceName, // Use fileInfos to get resourceName
            resourceType: fileInfos[index].resourceType, // Use fileInfos to get resourceType
            resourceSize: file.size, // Get resourceSize from the File object
    
            uploadDate: uploadDate, // Use the Date object directly
            userName: userName, // Use userName from state
            userId: userId, // Use userId from state
            inputControl: inputControlId,
          };
        });
  
        console.log("Formatted Uploaded Resources:", uploadedResources);
  
        await saveCommentData(ticketNo, uploadedResources as any);
        onClose(); // Close the modal after submission
        window.location.reload();
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Ticket [{ticketNo}] - Post Comment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="writeComment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea {...field} id="writeComment" placeholder="Write Comment" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<Controller
  name="uploadedResources"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Upload Files</FormLabel>
      <FormControl>
        <div>
          {(!field.value || field.value.length === 0) ? (
            // Initial centered "Add Files" button only
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-10">
              <label className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-gray-700">
                <span className="text-4xl mb-2">＋</span>
                <span className="text-sm font-medium">Add Files</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const newFiles = e.target.files ? Array.from(e.target.files) : [];
                    field.onChange(newFiles);
                  }}
                />
              </label>
            </div>
          ) : (
            // Show file previews and add more
            <div className="flex flex-wrap gap-4">
              {field.value.map((file: File, index: number) => (
                <FilePreviewCard
                  key={index}
                  file={file}
                  onRemove={() => {
                    const newFiles = [...field.value];
                    newFiles.splice(index, 1);
                    field.onChange(newFiles);
                  }}
                />
              ))}

              {/* Add more button */}
              <label className="w-48 h-24 cursor-pointer border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-md text-gray-500 dark:text-gray-300 dark:border-gray-600">
                <span className="text-3xl">＋</span>
                <span className="text-sm">Add Files</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const newFiles = e.target.files ? Array.from(e.target.files) : [];
                    const existingFiles = field.value || [];
                    field.onChange([...existingFiles, ...newFiles]);
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>



            </div>
            <DialogFooter>
              {/* <Button type="submit">Update</Button> */}
              <Button 
  type="submit" 
  disabled={form.formState.isSubmitting}
>
  {form.formState.isSubmitting ? "Submitting..." : "Update"}
</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentModalForm;