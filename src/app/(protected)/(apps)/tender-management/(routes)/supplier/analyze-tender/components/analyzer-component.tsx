"use client";

import { Button } from "@/shadcn/ui/button";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shadcn/ui/form";
import ReadOnlyEditor from "../../../../_components/read-only-text-editor";
import analyzeTender, { invokeWorkflowAction } from "./analyzer-functions";
import DynamicForm from "./dynamic-prerequisite-form";
import { getPublishedDraftById } from "../../../../_utils/supplier/get-published-draft-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { toast } from "sonner";
import { getAccount } from "@/ikon/utils/actions/account";
import getParticularBidData from "../../../../_components/supplier/get-particular-bid-data";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";

// Define types for prerequisite rows
interface FormRow {
  id: string;
  text: string;
  fileName?: string | null;
  fileUrl?: string | null;
  fileType?: string | null;
  Size?: number | null;
}

export default function AnalyzerComponent({ id }: { id: string }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [prerequisites, setPrerequisites] = useState<FormRow[]>([]);
  const [fileObjects, setFileObjects] = useState<{ [key: string]: File }>({});
  const [fetchedPrerequisites, setFetchedPrerequisites] = useState<FormRow[]>(
    []
  );
  const [dataLoaded, setDataLoaded] = useState(false);

  const editorRef = useRef<{ setHtml: (html: string) => void } | null>(null);
  const form = useForm({ defaultValues: { file: null } });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = await getAccount();
        setAccountId(account.ACCOUNT_ID);

        const data = await getParticularBidData(id, account.ACCOUNT_ID);
        setResponse(data[0]?.analysedData || "No response available");

        if (data?.[0]?.preRequisites?.length > 0) {
          const mappedRows = data[0].preRequisites.map((item: any) => ({
            id: item.id,
            text: item.fields.text,
            fileName: item.fields?.file?.resourceName || null,
            fileId : item.fields?.file?.resourceId,
            fileUrl: item.fields?.file?.resourceId
              ? `/your-download-endpoint/${item.fields.file.resourceId}`
              : null,
            fileType: item.fields?.file?.resourceType || null,
            Size: item.fields?.file?.resourceSize || null,
          }));

          setPrerequisites(mappedRows);
          setFetchedPrerequisites(mappedRows);
        }
        setDataLoaded(true);
      } catch (error) {
        console.log("Failed to fetch data:", error);
        setDataLoaded(true);
      }
    };

    fetchData();
  }, [id]);

  const setContentHandler = (html: string) => {
    editorRef.current?.setHtml(html);
  };

const handleAnalyze = async () => {
  if (!file) return;

  setIsAnalyzing(true);
  try {
    const tenderDetails = await getPublishedDraftById(id);
    const responseAnalysis = await analyzeTender(file, tenderDetails);

    // Update both the editor content and the response state
    setContentHandler(responseAnalysis);
    setResponse(responseAnalysis);
  } catch (error) {
    console.error("Error analyzing:", error);
    toast.error("Analysis failed");
  } finally {
    setIsAnalyzing(false);
  }
};

  const handleFinalSave = async () => {
    setIsSaving(true);

    try {
      const processedRows = await Promise.all(
        prerequisites.map(async (row) => {
          const rowData: any = {
            id: row.id,
            fields: {
              text: row.text,
            },
          };

          const file = fileObjects[row.id];
          if (file) {
            try {
              const uploadResult = await singleFileUpload(file);
              rowData.fields.file = uploadResult || null;
              rowData.fields.fileName = uploadResult?.resourceName || null;
            } catch (error) {
              console.error("Error uploading file:", error);
              rowData.fields.file = null;
            }
          } else {
            const original = fetchedPrerequisites.find((p) => p.id === row.id);
            if (original?.fileName && original?.fileUrl) {
              rowData.fields.file = {
                resourceName: original.fileName,
                resourceId: original.fileUrl.split("/").pop(),
                resourceType: original.fileType,
                resourceSize: original.Size,
              };
              rowData.fields.fileName = original.fileName;
            } else {
              rowData.fields.file = null;
              rowData.fields.fileName = null;
            }
          }

          return rowData;
        })
      );

      const allProvided = processedRows.every(
        (row) => row.fields.file?.resourceId
      );

      await invokeWorkflowAction(
        id,
        accountId,
        "Project Details",
        "edit project",
        {
          preRequisites: processedRows,
          allPrerequisiteProvided: allProvided,
          analysedData : response,
        }
      );

      toast.success("Saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-6"
      >
        <div className="grid grid-cols-3 gap-6 overflow-y">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] ?? null;
                      field.onChange(selectedFile);
                      setFile(selectedFile);
                    }}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-gray-600">
                  {form.watch("file")?.name || "No file uploaded"}
                </p>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
          <Button
            onClick={handleFinalSave}
            disabled={isSaving}
            variant="outline"
          >
            {isSaving ? "Saving..." : "Save Data"}
          </Button>
        </div>

        <Tabs defaultValue="prerequisite" className="w-full">
          <TabsList className="grid w-full grid-cols-2" variant="solid">
            <TabsTrigger value="prerequisite">Prerequisite</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="prerequisite">
            {response ? (
              <ReadOnlyEditor
                value={response}
                height={500}
                onChange={() => {}}
                ref={editorRef}
              />
            ) : (
              <p>Loading response...</p>
            )}
          </TabsContent>
          <TabsContent value="documents">
            <DynamicForm
              tenderId={id}
              rows={prerequisites}
              setRows={setPrerequisites}
              fileObjects={fileObjects}
              setFileObjects={setFileObjects}
              dataLoaded={dataLoaded}
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
