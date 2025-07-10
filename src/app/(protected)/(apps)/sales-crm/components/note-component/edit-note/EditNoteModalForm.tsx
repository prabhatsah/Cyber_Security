import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditNoteFormSchema } from "../edit-note-components/note-data-definitions";
import { invokeLeadUserNotesProcess } from "../edit-note-components/invokeNote";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButton } from "@/ikon/components/buttons";

interface EditNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  parentId: string;
  selectedNote: { id: string; note: string; userId: string; source: string; parentId: string } | null;
}

const EditNotesModal: React.FC<EditNotesModalProps> = ({ isOpen, onClose, selectedNote }) => {
  const form = useForm({
    resolver: zodResolver(EditNoteFormSchema),
    defaultValues: {
      note: "",
    },
  });

  useEffect(() => {
    if (selectedNote) {
      form.reset({ note: selectedNote.note });
    }
  }, [selectedNote, form]);

  const handleSubmit = async (data: { note: string }) => {
    if (!selectedNote) return;

    const editNote = {
      id: selectedNote.id,
      timestamp: new Date().toISOString(),
      note: data.note,
      source: selectedNote.source,
      userId: selectedNote.userId,
      parentId: selectedNote.parentId,
    };

    try {
      await invokeLeadUserNotesProcess(editNote);
      console.log("Note successfully updated:", editNote);
      onClose();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
            <FormTextarea formControl={form.control} name={"note"} placeholder={"Enter Note"} label="Note"/>
            <DialogFooter>
              {/* <Button type="submit">
                Save
              </Button> */}
              <TextButton type="submit">Save</TextButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNotesModal;
