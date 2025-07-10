import TemplateEditor from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-templates/template-editor-page";


interface PageProps {
  params: { templateId: string };
}

export default function Page({ params }: PageProps) {
  return <TemplateEditor id={params.templateId} />;
}
