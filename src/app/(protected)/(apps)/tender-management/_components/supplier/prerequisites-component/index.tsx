import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import React, { useRef, useState } from 'react'
import ReadOnlyEditor from '../../read-only-text-editor';
import { getTicket } from '@/ikon/utils/actions/auth';
import { DOWNLOAD_URL } from '@/ikon/utils/config/urls';
import { Download, Eye } from "lucide-react";

const viewFile = async (data: any) => {
  console.log("View File", data);
  const ticket: any = await getTicket();

  /* const url =
           `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
           `&resourceId=${encodeURIComponent(data.resourceId)}` +
           `&resourceName=${encodeURIComponent(data.resourceName)}` +
           `&resourceType=${encodeURIComponent(data.resourceType)}`;*/

  //window.open(encodeURI(url), "_blank");
  let link = "";
  if (
    data.resourceType == "image/jpeg" ||
    data.resourceType == "image/png" ||
    data.resourceType == "text/plain" ||
    data.resourceType == "application/pdf" ||
    data.resourceType == "video/mp4" ||
    data.resourceType == "image/gif"
  ) {
    var pdf_newTab = window.open();
    link =
      `${DOWNLOAD_URL}?ticket=${ticket}` +
      `&resourceId=${data.resourceId}` +
      `&resourceType=${data.resourceType}`;
    pdf_newTab.document.write(
      `<iframe id='viewdocId' width='100%' height='100%' src=''></iframe><script>var iframe = document.getElementById('viewdocId'); iframe.src = '${link}'</script>`
    );
  } else {
    link =
      `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
      `&resourceId=${encodeURIComponent(data.resourceId)}` +
      `&resourceName=${encodeURIComponent(data.resourceName)}` +
      `&resourceType=${encodeURIComponent(data.resourceType)}`;
    window.open(encodeURI(link), "_blank");
  }
};

const PrerequisiteComponent = ({data} : {data : any}) => {
    console.log("prerequise tab data", data);
     const responseRef = useRef(null);
     const [files, setFiles] = useState(data?.[0]?.preRequisites || []);

  return (
    <>
      <Tabs defaultValue="editor">
        <TabsList className="w-full">
          <TabsTrigger value="editor">Prerequisite Overview</TabsTrigger>
          <TabsTrigger value="documents">Supporting Document</TabsTrigger>
        </TabsList>
        <div className="">
          <TabsContent
            value="editor"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <ReadOnlyEditor
              value={data[0]?.analysedData ? data[0].analysedData : "No Data"}
              height={688}
              onChange={() => {}}
              ref={responseRef}
            />
          </TabsContent>
          <TabsContent
            value="documents"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500 border rounded-lg p-2 h-[78dvh] overflow-y-auto"
          >
            <div className="space-y-4">
              {files.length === 0 ? (
                <div className="text-center text-gray-500 p-4 border rounded-md">
                  No files available
                </div>
              ) : (
                files.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border p-2 rounded-md shadow-sm"
                  >
                    <span className="text-sm">{file.fields.text}</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm">{file.fields.fileName}</span>
                      <button
                        onClick={() => viewFile(file.fields.file)}
                        className="p-1 hover:text-blue-600"
                        title="Download"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

export default PrerequisiteComponent;
