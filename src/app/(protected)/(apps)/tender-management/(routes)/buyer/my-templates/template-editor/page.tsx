import TemplateEditor from "../../../../_components/buyer/my-templates/template-editor-page";


interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <TemplateEditor id={params.id} />;
}
