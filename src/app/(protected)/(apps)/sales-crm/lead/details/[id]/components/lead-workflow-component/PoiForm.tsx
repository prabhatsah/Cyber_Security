"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";

import { Textarea } from "@/shadcn/ui/textarea";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { POIFormSchema } from "./PoiFormSchema";
import { getProfileData } from "@/ikon/utils/actions/auth";
//import { VIEW_DATE_TIME_FORMAT } from "@/config/const";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";

interface POIModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: string;
  leadIdentifier?: string;
}

interface FormData {
  remarks: string;
  email: string;
  contactNumber: string;
  
}



const POIModal: React.FC<POIModalProps> = ({
  isOpen,
  onClose,
  stage,
  leadIdentifier,
}) => {
  const [commentObj, setCommentObj] = useState<any>(null); // Store data
 
  const form = useForm<z.infer<typeof POIFormSchema>>({
    resolver: zodResolver(POIFormSchema),
    defaultValues: {
        remarks: "",
        updatedBy : "",
        updatedOn : ""
    },
  });

 
 

  async function handleOnSubmit(
    data: z.infer<typeof POIFormSchema>
  ): Promise<void> {
    debugger;
    const profileData = await getProfileData();
  //  console.log("Form Data Submitted:", profileData);
    console.log("Form Data Submitted:", data);
    data["updatedBy"] = profileData.USER_ID;
    data["updatedOn"] = format(new Date(), VIEW_DATE_TIME_FORMAT) 
    if(stage == "Discovery"){
        var taskName = "Lead"
        var transitionName = "Proceed To Discovery"
        var leadStatus = "Discovery Created"
    }
    else{
        var taskName = "Discovery"
        var transitionName = "Discovery To Opportunity"
        var leadStatus = "Opportunity Created From Discovery"
    }
    try {
        const leadPipelineData = await getMyInstancesV2({
            processName: "Leads Pipeline",
            predefinedFilters: { taskName: taskName },
            mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
          });
        console.log(leadPipelineData)
        let leadData = leadPipelineData[0]?.data || []; 
        leadData.leadStatus = leadStatus
        if(data.remarks != ""){
            var commentsLog = leadData.commentsLog ? leadData.commentsLog : [];
            commentsLog.push(data)
            leadData.commentsLog = commentsLog
        }
        const taskId = leadPipelineData[0]?.taskId || ""
        console.log(leadData)
        const result = await invokeAction({
          taskId: taskId,
          transitionName: transitionName,
          data: leadData,
          processInstanceIdentifierField: "leadIdentifier",
        });
        console.log(result)
    } catch (error) {
        console.error("Failed to invoke action:", error);
      }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Point of Interest</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="grid gap-1.5 col-span-2">
                  
                  <FormControl>
                    <Textarea
                      {...field}
                      id="remarks"
                      placeholder="Enter Point of Interest"
                      
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

    
            <DialogFooter className="col-span-2 flex justify-end mt-4">
              <Button type="submit" className="">
              Proceed to {stage}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default POIModal;
