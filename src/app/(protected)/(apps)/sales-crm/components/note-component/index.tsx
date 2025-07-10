"use client";
import { NoteData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { Button } from "@/shadcn/ui/button";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { useState } from "react";
import { PenSquare, Plus } from "lucide-react";
//import NoDataComponent from "@/ikon/component/no-data";
import NotesModal from "./add-note/CreateNoteModalForm";
import EditNotesModal from "./edit-note/EditNoteModalForm";
import NoDataComponent from "@/ikon/components/no-data";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";

export default function NoteComponent({
  noteData: initialNoteData,
  source,
  parentId,
}: {
  noteData: any[];
  source: string;
  parentId: string;
}) {
  const transformedNotes = initialNoteData.map((note) => ({
    id: note.data.id,
    userId: note.data.userId,
    timestamp: note.data.timestamp,
    source: note.data.source,
    note: note.data.note,
  }));

  const [noteData, setNoteData] = useState<NoteData[]>(transformedNotes || []);
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function handleView(note: NoteData) {
    setSelectedNote(note);
  }

  function handleEditNote() {
    setIsEditModalOpen(true);
  }

  function handleAddNote() {
    setSelectedNote(null);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-3 h-full w-full">
      {/* Add Note Button */}
      <div className="flex flex-row items-center justify-end">
        {/* <Button variant={"outline"} size={"sm"} onClick={handleAddNote}>
          <Plus />
        </Button> */}

        <IconTextButtonWithTooltip
          onClick={handleAddNote}
          tooltipContent={"Add Note"}
        >
          <Plus /> Note
        </IconTextButtonWithTooltip>
      </div>

      <div className="flex-grow">
        {noteData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full gap-3">
            {/* Left Panel: Notes List */}
            <div className="md:col-span-1 border-r pe-3 overflow-y-auto flex flex-col gap-3">
              {noteData.map((note) => (
                <Card
                  key={note.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedNote?.id === note.id ? "border-blue-500" : ""
                  }`}
                  onClick={() => handleView(note)}
                >
                  <CardHeader>
                    <CardTitle>{note.userId || "Unknown User"}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {note.timestamp &&
                        format(new Date(note.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 truncate">{note.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Panel: Note Full View */}
            <div className="md:col-span-2 overflow-y-auto">
              {selectedNote ? (
                <Card className="h-full">
                  <CardHeader className="flex flex-row justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {selectedNote.userId || "Unknown User"}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {selectedNote.timestamp &&
                          format(
                            new Date(selectedNote.timestamp),
                            "yyyy-MM-dd HH:mm:ss"
                          )}
                      </p>
                    </div>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={handleEditNote}
                    >
                      <PenSquare />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{selectedNote.note}</p>
                  </CardContent>
                </Card>
              ) : (
                <NoDataComponent text="Select a note to view its content" />
              )}
            </div>
          </div>
        ) : (
          <NoDataComponent text="No notes available" />
        )}
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        source={source}
        parentId={parentId}
      />

      {/* Edit Notes Modal */}
      <EditNotesModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        selectedNote={selectedNote}
      />
    </div>
  );
}
