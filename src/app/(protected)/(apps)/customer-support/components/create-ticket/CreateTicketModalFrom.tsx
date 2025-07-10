"use client";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { se } from "date-fns/locale";
// import form from "@/app/(protected)/examples/form/page";
import * as zod from "@hookform/resolvers/zod";
import { AddTicketFormSchema } from "./ticket-data-defination";
import { getProfileData, getTicket } from "@/ikon/utils/actions/auth";
import { startCustomerSupportTicketProcess } from "./start-ticket-instance/index";
import { usePathname } from "next/navigation";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import { makeActivityLogsData } from "../../all-tickets/details/ticket-details/components/ActivityLogs";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTicketModalForm: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
}) => {

  const [baseURL, setBaseURL] = useState("");
  useEffect(() => {
    // Get the full URL (like 'http://localhost:3000' or 'https://ikoncloud-dev.keross.com')
    const fullURL = window.location.origin;
    
    // Get the domain (hostname) part
    const domain = fullURL.split("//")[1].split("/")[0];
    
    // Set the base URL (domain part)
    setBaseURL(domain);
  }, []);

  const form = useForm({
    resolver: zod.zodResolver(AddTicketFormSchema),
    defaultValues: {
      subject: "",
      accountName: "",
      application: "",
      issueDate: "",
      type: "",
      priority: "",
      supportMessage: "",
      mobile: "",
      clientUploadedResources: [],
    },
  });

  interface FormData {
    subject: string;
    accountName: string;
    application: string;
    ticketNo: number;
    issueDate: string;
    mobile: string;
    updatedCompanyName: string;
    priority: string;
    status: string;
    type: string;
    supportMessage: string;
    clientUploadedResources: []; //function
    timeZone: string;
    activityLogsData: string;
    serverName: string;
    requestedFrom: string;
    dateCreated: string;
    email: string;
    userName: string;
    creatorId: string;
    name: string;
    uploadfile: [];
  }

  interface OptionType {
    value: string;
    label: string;
  }
  const userNameRef = useRef("");
  const userIdRef = useRef("");
  const userLoginRef = useRef("");
  const userEmailRef = useRef("");

  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await getProfileData();
      userNameRef.current = data.USER_NAME;
      userIdRef.current = data.USER_ID;
      userLoginRef.current = data.USER_LOGIN;
      userEmailRef.current = data.USER_EMAIL;
      console.log("hey bro -> data d" + data);
      console.log(data);
    };
    fetchProfileData();
  }, []);

  console.log("hey bro -> " + userIdRef.current);

  // const ticket = await getTicket();
  // const url =
  // `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
  // `&resourceId=${encodeURIComponent(data.resourceId)}` +
  // `&resourceName=${encodeURIComponent(data.resourceName)}` +
  // `&resourceType=${encodeURIComponent(data.resourceType)}`;

  //window.open(encodeURI(url), "_blank");
  const handleUpload = async (file: File) => {
    const ticket = await getTicket();
    try {
      const resourceData = await singleFileUpload(file);
      const url = `${DOWNLOAD_URL}?ticket=${ticket}&resourceId=${resourceData.resourceId}&resourceName=${resourceData.resourceName}&resourceType=${resourceData.resourceType}`;
      return {
        url,
        resourceId: resourceData.resourceId,
        resourceName: resourceData.resourceName,
        resourceType: resourceData.resourceType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        username: userNameRef.current,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      console.log("Form values before processing:", values);

      // Get the files from form values (an array of files)
      const files = values.clientUploadedResources;
      let uploadedResources: {
        resourceId: string;
        resourceName: string | undefined;
        resourceType: string | undefined;
        resourceSize: any;
        uploadDate: Date;
        username: string;
        userId: string;
        inputControl: string;
      }[] = [];

      // Only process if files exist
      if (files && files.length > 0) {
        console.log("Files found, starting upload...");

        // Process each file
        for (const file of files) {
          const resourceData = await singleFileUpload(file);
          console.log("File upload response:", resourceData);

          uploadedResources.push({
            resourceId: resourceData.resourceId,
            resourceName: resourceData.resourceName,
            resourceType: resourceData.resourceType,
            resourceSize: file.size,
            uploadDate: new Date(),
            username: userNameRef.current,
            userId: userIdRef.current,
            inputControl: "filePuload",
          });
        }
      }

      console.log("Uploaded resources:", uploadedResources);

      let urlSubString = values.requestedFrom;
      console.log("Form values:", values);

      // Use a regular expression to extract the domain name (excluding the protocol and path)
      // let extractedDomain = urlSubString.replace(/^https?:\/\//, '').split('/')[0];

      // let serverName;
      // if (!extractedDomain) {
      //     serverName = "Unknown Server";
      // } else if (extractedDomain === "ikoncloud-dev.keross.com") {
      //     serverName = "Dev Server";
      // } else if (extractedDomain === "ikoncloud.keross.com") {
      //     serverName = "Production Server";
      // } else if (extractedDomain === "demo.ikon.keross.com") {
      //     serverName = "Demo Server";
      // } else if (extractedDomain === "ikoncloud-uat.keross.com") {
      //     serverName = "UAT Server";
      // } else if (extractedDomain === "14.98.103.203") {
      //     serverName = "203 Server";
      // } else if (extractedDomain === "49.249.177.28") {
      //     serverName = "49 Server";
      // } else {
      //     serverName = "New Server";
      // }

      // console.log(serverName);
      function convertToISTFormat(utcDate: string): string {
        // Create a Date object from the UTC string
        const date = new Date(utcDate);

        // Get the IST time zone (Asia/Kolkata)
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        };

        // Format the date to IST
        const formattedDate = date
          .toLocaleString("en-IN", options)
          .replace(",", "");

        // Extract the milliseconds manually
        const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

        // Example of returning a formatted date in the desired format
        const dateParts = formattedDate.split(" "); // Split into date and time with timezone
        const [dateStr, timeStr, tz] = dateParts;
        const [day, month, year] = dateStr.split("/");
        const [hour, minute, second] = timeStr.split(":");

        // Format output with the correct timezone offset
        return `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}${
          tz === "IST" ? "+0530" : ""
        }`;
      }

      // Example usage:
      const issueDate = values.issueDate; // UTC
      const formattedDate = convertToISTFormat(issueDate);
      console.log(formattedDate); // Output: "2025-04-07T23:00:00.000+0530"

      const ticketNoDate = new Date().getTime();
      const ticketNo = ticketNoDate.toString();
      // Create postComment logs
      const postCommentLogs = await makeActivityLogsData({
        ticketNo,
        action: "creation",
        argsList: [],
      });

      const newTicket = {
        ticketNo: ticketNoDate,
        name: userNameRef.current,
        creatorId: userIdRef.current,
        userName: userLoginRef.current,
        email: userEmailRef.current,
        dateCreated: new Date(),
        requestedFrom: "ikoncloud-dev.keross.com",
        serverName: "Dev Server",
        subject: values.subject,
        accountId: values.accountId,
        accountName: values.accountName,
        applicationId: values.applicationId,
        applicationName: values.application,
        issueDate: formattedDate,
        mobile: values.mobile,
        priority: values.priority,
        status: "New",
        type: values.type,
        supportMessage: values.supportMessage,
        updatedCompanyName: "",
        clientUploadedResources: uploadedResources, //resource
        timeZone: "TMZ_" + new Date().toISOString(),
        activityLogsData: postCommentLogs,
      };

      await startCustomerSupportTicketProcess(newTicket);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error starting the process:", error);
    }
  };

  const pathName = usePathname();
  const info = [
    { label: "Ticket No.", value: new Date().getTime() },
    { label: "Name", value: userNameRef.current },
    { label: "Requested From", value: baseURL },
    { label: "User Name", value: userLoginRef.current },
    { label: "Server Name", value: "Admin" },
    { label: "Email Id", value: userEmailRef.current },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create Ticket</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-3"
          >
            <div className="w-full">
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                {info.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <span className="font-medium">{item.label} :</span>
                    <span className="font-small">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Subject
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the Subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Account Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Account Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="application"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Application Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Application name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormDateInput
                formControl={form.control}
                name={"issueDate"}
                label="Issue Date *"
                placeholder="Please Enter Issue Date"
              />

              {/* <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        placeholder="Enter Issue Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter mobile number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bugs">Bugs</SelectItem>
                          <SelectItem value="Feature">Feature</SelectItem>
                          <SelectItem value="Incident">Incident</SelectItem>
                          <SelectItem value="Service Request">
                            Service Request
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Priority<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="supportMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="supportMessage"
                      placeholder="Enter Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientUploadedResources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Files</FormLabel>
                  <FormControl>
                    <div>
                      {!field.value || field.value.length === 0 ? (
                        // Centered initial Add Files
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-10">
                          <label className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-gray-700">
                            <span className="text-4xl mb-2">＋</span>
                            <span className="text-sm font-medium">
                              Add Files
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) => {
                                const newFiles = e.target.files
                                  ? Array.from(e.target.files)
                                  : [];
                                field.onChange(newFiles);
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        // File preview + add more tile
                        <div className="flex flex-wrap gap-1.5">
                          {field.value.map((file: File, index: number) => (
                            <div
                              key={index}
                              className="relative w-48 border rounded-md p-3 bg-white shadow-sm dark:bg-[#1e1e1e] dark:border-gray-700"
                            >
                              <button
                                type="button"
                                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                                onClick={() => {
                                  const newFiles = [...(field.value ?? [])];
                                  newFiles.splice(index, 1);
                                  field.onChange(newFiles);
                                }}
                              >
                                ×
                              </button>
                              <div className="truncate w-full text-sm font-medium text-gray-800 dark:text-white">
                                📄 {file.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024).toFixed(2)} KB
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-green-500 h-1.5 rounded-full w-full" />
                              </div>
                            </div>
                          ))}
                          {/* Add more tile */}
                          <label className="w-48 h-24 cursor-pointer border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-md text-gray-500 dark:text-gray-300 dark:border-gray-600">
                            <span className="text-3xl">＋</span>
                            <span className="text-sm">Add Files</span>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) => {
                                const newFiles = e.target.files
                                  ? Array.from(e.target.files)
                                  : [];
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
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModalForm;
function moment(arg0: Date) {
  throw new Error("Function not implemented.");
}
