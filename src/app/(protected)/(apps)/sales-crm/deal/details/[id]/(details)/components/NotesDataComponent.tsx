import NoteComponent from "@/app/(protected)/(apps)/sales-crm/components/note-component";

interface NotesDataComponentProps {
  parentId: string;
  noteData: any;
  source: string;
}

const NotesDataComponent: React.FC<NotesDataComponentProps> = ({
  parentId,
  source,
  noteData,
}) => {
  return (
    <NoteComponent noteData={noteData} source={source} parentId={parentId}/>
  );
};

export default NotesDataComponent;
