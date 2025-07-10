import ResponseTemplateEditor from "@/app/(protected)/(apps)/tender-management/_components/supplier/response-template-editor-page";


interface PageProps {
  params: { templateId: string };
}

export default function Page({ params }: PageProps) {
  return <ResponseTemplateEditor id={params.templateId} />;
}
