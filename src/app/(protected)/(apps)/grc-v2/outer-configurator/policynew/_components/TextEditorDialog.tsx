"use client";

import React from "react";
import "@progress/kendo-theme-default/dist/all.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import "./kendoTextEditor.css";

const TextEditorDialog = ({ open, onOpenChange }: any) => {
  const {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    FontSize,
    FontName,
    FormatBlock,
    Link,
    Unlink,
    InsertImage,
    ViewHtml,
    InsertTable,
    AddRowBefore,
    AddRowAfter,
    AddColumnBefore,
    AddColumnAfter,
    DeleteRow,
    DeleteColumn,
    DeleteTable,
    MergeCells,
    SplitCell,
  } = EditorTools;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[90vh] max-w-[90vw] w-full flex flex-col"
        // style={{ position: "relative", zIndex: "10" }}
      >
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <Editor
          tools={[
            [Bold, Italic, Underline, Strikethrough],
            [Subscript, Superscript],
            [AlignLeft, AlignCenter, AlignRight, AlignJustify],
            [Indent, Outdent],
            [OrderedList, UnorderedList],
            FontSize,
            FontName,
            FormatBlock,
            [Undo, Redo],
            [Link, Unlink, InsertImage, ViewHtml],
            [InsertTable],
            [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
            [DeleteRow, DeleteColumn, DeleteTable],
            [MergeCells, SplitCell],
          ]}
          contentStyle={{ height: 630 }}
          defaultContent={"hi"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TextEditorDialog;
