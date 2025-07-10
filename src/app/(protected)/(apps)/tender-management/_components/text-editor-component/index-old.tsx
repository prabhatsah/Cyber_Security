// import { Editor, EditorTools } from "@progress/kendo-react-editor";
// import { useState } from "react";

// const {
//   Bold,
//   Italic,
//   Underline,
//   Strikethrough,
//   Subscript,
//   Superscript,
//   ForeColor,
//   BackColor,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Indent,
//   Outdent,
//   OrderedList,
//   UnorderedList,
//   Undo,
//   Redo,
//   Link,
//   Unlink,
//   InsertTable,
//   InsertFile,
//   Pdf,
// } = EditorTools;

// const KendoEditor = ({ value, onChange, height = 300 }) => {
//   const [content, setContent] = useState(value || "");

//   const handleChange = (e) => {
//     setContent(e.value);
//     if (onChange) onChange(e.value);
//   };

//   return (
//     <Editor
//       tools={[
//         [Bold, Italic, Underline, Strikethrough],
//         [Subscript, Superscript],
//         [ForeColor, BackColor],
//         [AlignLeft, AlignCenter, AlignRight, AlignJustify],
//         [Indent, Outdent],
//         [OrderedList, UnorderedList],
//         [InsertTable],
//         [Link, Unlink],
//         [InsertFile, Pdf],
//         [Undo, Redo],
//       ]}
//       contentStyle={{ height }}
//       value={content}
//       onChange={handleChange}
//     />
//   );
// };

// export default KendoEditor;

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Editor, EditorTools, EditorUtils } from "@progress/kendo-react-editor";

const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  ForeColor,
  BackColor,
  FontSize,
  FontName,
  FormatBlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  OrderedList,
  UnorderedList,
  Indent,
  Outdent,
  Undo,
  Redo,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  Pdf,
} = EditorTools;

const KendoEditor = forwardRef(
  (
    {
      initialContent = "",
      onChange,
      onPdfExport,
    }: { initialContent: string; onChange: any; onPdfExport: any },
    ref
  ) => {
    const editorRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getHtml: () => {
        // return editorRef.current
        //   ? editorRef.current.view.state.doc.textContent
        //   : "";
        if (editorRef?.current) {
          const view = editorRef.current.view;
          if (view) {
            console.log(EditorUtils.getHtml(view.state));
            return EditorUtils.getHtml(view.state);
          }
        }
      },
      setHtml: (html: string) => {
        if (editorRef.current) {
          const view = editorRef.current.view;
          if (view) {
            EditorUtils.setHtml(view, html);
          }
        }
      },
      exportPdf: () => {
        if (editorRef.current) {
          const html = EditorUtils.getHtml(editorRef.current.view.state);
          if (onPdfExport) {
            onPdfExport(html);
          }
        }
      },
    }));

    // const handleMount = (event: any) => {
    //   const editor = event.sender;
    //   editorRef.current = editor;

    //   // Modify inserted images
    //   setTimeout(() => {
    //     const editorContent = editor.body;
    //     const images = editorContent.querySelectorAll("img");
    //     images.forEach((img) => {
    //       img.setAttribute("crossorigin", "anonymous");
    //     });
    //   }, 500);
    // };

    return (
      <Editor
        ref={editorRef}
        tools={[
          [Bold, Italic, Underline, Strikethrough],
          [Subscript, Superscript],
          [ForeColor, BackColor],
          [FontSize, FontName, FormatBlock],
          [AlignLeft, AlignCenter, AlignRight, AlignJustify],
          [OrderedList, UnorderedList, Indent, Outdent],
          [Undo, Redo],
          [Link, Unlink, InsertImage, ViewHtml, InsertTable, Pdf],
        ]}
        contentStyle={{ height: 300 }}
        defaultContent={initialContent}
        onChange={(e) => onChange && onChange(e.html)}
        // popupMountContainer={document.body}
        // onMount={handleMount}
      />
    );
  }
);

export default KendoEditor;
