import * as React from "react";
//import content from "./shared-ed-content";
import {
  Editor,
  EditorMountEvent,
  EditorTools,
  ProseMirror,
  EditorUtils
} from "@progress/kendo-react-editor";
import { InsertImage } from "./insertImageTool";
import { insertImagePlugin } from "./insertImagePlugin";
import { insertImageFiles } from "./utils";
import { AnyARecord } from "node:dns";

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
  ViewHtml,
  InsertTable,
  Pdf,
} = EditorTools;

const KendoEditor = React.forwardRef(
  (
    {
      initialContent = "",
      onChange,
      height = 450
    }: { initialContent: string; onChange: any, height: number },
    ref
  ) => {
    const editorRef = React.useRef(null);
    React.useImperativeHandle(ref, () => ({
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
    }));

    const onImageInsert = (args) => {
      const { files, view, event } = args;
      const nodeType = view.state.schema.nodes.image;

      const position =
        event.type === "drop"
          ? view.posAtCoords({ left: event.clientX, top: event.clientY })
          : null;

      insertImageFiles({ view, files, nodeType, position });

      return files.length > 0;
    };

    const onMount = (event: EditorMountEvent) => {
      const state = event.viewProps.state;
      const plugins = [...state.plugins, insertImagePlugin(onImageInsert)];

      return new ProseMirror.EditorView(
        { mount: event.dom },
        {
          ...event.viewProps,
          state: ProseMirror.EditorState.create({ doc: state.doc, plugins }),
        }
      );
    };

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
          [InsertImage],
        ]}
        defaultContent={initialContent}
        contentStyle={{ height: height }}
        onMount={onMount}
      />
    );
  }
);

export default KendoEditor;
