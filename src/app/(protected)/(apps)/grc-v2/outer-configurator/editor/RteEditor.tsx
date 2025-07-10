"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaListUl,
  FaHeading,
} from "react-icons/fa";
import { useState } from "react";
import "./editor.css";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Blockquote from "@tiptap/extension-blockquote";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Heading1,
  Bold,
  Italic,
  List,
  ListOrdered,
  Table2,
  Columns2,
  Columns4,
  Minus,
  Plus,
  PlusSquare,
  Trash2,
  Merge,
  Split,
  PaintBucket,
  XCircle,
  UnderlineIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/shadcn/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shadcn/ui/select";
import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import { useRef } from "react";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
// const generatePDF = (htmlContent) => {
//   const container = document.createElement("div");
//   container.innerHTML = htmlContent;
//   container.style.position = "fixed";
//   container.style.left = "-9999px";
//   container.style.top = "0";
//   container.style.width = "800px"; // approximate width for A4 scaling
//   document.body.appendChild(container);

//   setTimeout(() => {
//     html2canvas(container, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");

//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();

//       const imgProps = pdf.getImageProperties(imgData);
//       const imgWidth = pdfWidth;
//       const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

//       let heightLeft = imgHeight;
//       let position = 0;

//       // First page
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;

//       // Additional pages
//       while (heightLeft > 0) {
//         position -= pdfHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;
//       }

//       pdf.save("document.pdf");

//       document.body.removeChild(container);
//     });
//   }, 100);
// };
const Tiptap = ({ contentData }) => {
  console.log("contentData----", contentData);
  const [headingLevel, setHeadingLevel] = useState(1);
  const editorRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Document,
      Paragraph,
      Text,
      BulletList,
      ListItem,
      // Blockquote,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      Color,
      FontFamily,
    ],
    content: contentData.jsonData ?? "",
    editorProps: {
      attributes: {
        class:
          "p-3 prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px]",
      },
    },
    // onUpdate: ({ editor }) => {
    //   requestAnimationFrame(() => {
    //     const container = editorRef.current?.querySelector(".ProseMirror");
    //     if (!container) return;

    //     // TESTING: Use 5 lines as page height instead of A4
    //     const LINE_HEIGHT = 24; // Approximate line height in pixels
    //     const TEST_PAGE_HEIGHT = LINE_HEIGHT * 5; // 5 lines

    //     // Clear previous breaks
    //     container
    //       .querySelectorAll(".page-break-line")
    //       .forEach((el) => el.remove());

    //     // Track accumulated height
    //     let accumulatedHeight = 0;

    //     // Process each top-level node
    //     Array.from(container.childNodes).forEach((node) => {
    //       if (!(node instanceof HTMLElement)) return;

    //       // ✅ SKIP already-inserted break lines
    //       if (node.classList.contains("page-break-line")) return;

    //       accumulatedHeight += node.offsetHeight;

    //       if (accumulatedHeight >= TEST_PAGE_HEIGHT) {
    //         const hr = document.createElement("hr");
    //         hr.className = "page-break-line";
    //         node.after(hr);
    //         accumulatedHeight = 0;
    //       }
    //     });

    //     console.log("Added page breaks after every ~5 lines");
    //   });
    // },

    transformPastedHTML(html) {
      const container = document.createElement("div");
      container.innerHTML = html;

      container.querySelectorAll("*").forEach((el) => {
        el.style.color = "white";
      });

      return container.innerHTML;
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }
  Paragraph.configure({
    HTMLAttributes: {
      class: "my-custom-class",
    },
  });
  const generatePDF = async (htmlContent) => {
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.position = "fixed";
    container.style.padding = "10px";
    container.style.marginBottom = "1rem"; // overridden by below
    container.style.paddingBottom = "1rem"; // overridden by below
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "800px"; // approximate width for A4 scaling
    container.style.color = "black"; // <-- force text color
    container.style.background = "white"; // ensure readable backgroun
    document.body.appendChild(container);

    setTimeout(() => {
      html2canvas(container, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Additional pages
        while (heightLeft > 0) {
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save("document.pdf");

        document.body.removeChild(container);
      });
    }, 100);
  };
  const saveContent = async () => {
    if (editor) {
      console.log(editor.getJSON());
      let jsonData = editor.getJSON();
      let modifiedData = jsonData;
      let policyName = jsonData?.content[0]?.content[0]?.text;
      const finalData = {
        jsonData: modifiedData,
        policyName,
        updatedAt: new Date().toISOString(),
        updatedBy: await getCurrentUserId(),
      };
      console.log("html below-----", editor.getHTML());
      // await generatePDF(editor.getHTML());

      const Clause = `this.Data.policyName == '${finalData.policyName}'`;
      let existingInstances = await getMyInstancesV2({
        processName: "Policy Editor",
        predefinedFilters: { taskName: "edit policy editor" },
        mongoWhereClause: Clause,
      });

      if (existingInstances && existingInstances.length > 0) {
        const { taskId } = existingInstances[0];

        if (taskId) {
          await invokeAction({
            taskId,
            transitionName: "update edit policy editor",
            data: finalData,
            processInstanceIdentifierField: "",
          });
          toast.success("Edited Successfully", { duration: 4000 });
        } else {
          console.warn("No taskId found in the existing instance");
        }
      } else {
        const findingProcessId = await mapProcessName({
          processName: "Policy Editor",
        });

        if (findingProcessId) {
          await startProcessV2({
            processId: findingProcessId,
            data: finalData,
            processIdentifierFields: "",
          });
          toast.success("Saved Successfully", { duration: 4000 });
        } else {
          toast.error("Something went wrong!", { duration: 4000 });
          console.error(
            "Could not find a valid process ID for 'Policy Editor'"
          );
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col ">
        <div className="w-full">
          <Label className="text-2xl font-bold">Editor</Label>
          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              {/* Heading Dropdown */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Select
                      value={String(headingLevel)}
                      onValueChange={(value) => {
                        const level = Number(value);
                        setHeadingLevel(level);
                        editor.chain().focus().toggleHeading({ level }).run();
                      }}
                    >
                      <SelectTrigger className="w-10 h-10 p-2 flex items-center justify-center">
                        <Heading1 />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((level) => (
                          <SelectItem key={level} value={String(level)}>
                            H{level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Select Heading Level</TooltipContent>
              </Tooltip>

              {/* Bold */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  >
                    <Bold />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>

              {/* Italic */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  >
                    <Italic />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>

              {/* Underline */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                  >
                    <UnderlineIcon />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Underline</TooltipContent>
              </Tooltip>

              {/* Bullet List */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                  >
                    <List />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              {/* Ordered List */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                  >
                    <ListOrdered />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Ordered List</TooltipContent>
              </Tooltip>

              {/* Table Actions */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                    }
                  >
                    <Table2 />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Table</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor.chain().focus().addColumnBefore().run()
                    }
                  >
                    <Columns2 />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Column Before</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor.chain().focus().addColumnAfter().run()
                    }
                  >
                    <Columns4 />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Column After</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                  >
                    <Minus />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Delete Column</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                  >
                    <PlusSquare />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Row Before</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                  >
                    <Plus />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Row After</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().deleteRow().run()}
                  >
                    <Minus />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Delete Row</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().deleteTable().run()}
                  >
                    <Trash2 />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Delete Table</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().mergeCells().run()}
                  >
                    <Merge />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Merge Cells</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().splitCell().run()}
                  >
                    <Split />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Split Cell</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().mergeOrSplit().run()}
                  >
                    <Merge />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Merge or Split</TooltipContent>
              </Tooltip>

              {/* Color Red */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor.chain().focus().setColor("#f00").run()
                    }
                  >
                    <PaintBucket className="text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Text Color Red</TooltipContent>
              </Tooltip>

              {/* Color Blue */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      editor.chain().focus().setColor("#00f").run()
                    }
                  >
                    <PaintBucket className="text-blue-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Text Color Blue</TooltipContent>
              </Tooltip>

              {/* Clear Color */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => editor.chain().focus().unsetColor().run()}
                  >
                    <XCircle />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Clear Color</TooltipContent>
              </Tooltip>

              {/* Color Picker */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <input
                    type="color"
                    onChange={(e) =>
                      editor.chain().focus().setColor(e.target.value).run()
                    }
                    className="h-8 w-8 p-0 cursor-pointer border rounded"
                  />
                </TooltipTrigger>
                <TooltipContent>Custom Text Color</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <div ref={editorRef} id="editor-pdf-content" className="pdf-content2">
            <EditorContent
              editor={editor}
              className="mt-2 border rounded-lg p-2 h-[660px] overflow-y-auto"
            />
          </div>

          <div className="flex justify-end mt-2">
            <Button onClick={saveContent} variant="default">
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tiptap;
