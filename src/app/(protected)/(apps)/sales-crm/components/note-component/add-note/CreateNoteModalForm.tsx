import { Form } from "@/shadcn/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddNoteFormSchema } from "../add-note-components/note-data-definitions";
import { v4 } from "uuid";
import { startLeadUserNotesProcess } from "../add-note-components/startNote";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { startTransition } from "react";
import router from "next/router";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButton } from "@/ikon/components/buttons";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  parentId: string
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, source, parentId }) => {
  //const router = useRouter();
  //const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(AddNoteFormSchema),
    defaultValues: {
      note: "",
    },
  });



  const handleSubmit = async (values: { note: string }) => {
    const profileData = await getProfileData();
    const newNote = {
      id: v4(),
      timestamp: new Date().toISOString(),
      note: values.note,
      source: source,
      //userId: profileData?.USER_ID,
      userId: profileData?.USER_NAME,
      parentId: parentId
    };

    try {
      await startLeadUserNotesProcess(newNote);
      onClose();
      startTransition(() => {
        router.reload();
      });
    } catch (error) {
      console.error("Error starting the process:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Add Notes</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
            {/* <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Note <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter Note"
                      id="note"
                      className={form.formState.errors.note ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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

export default NotesModal;
