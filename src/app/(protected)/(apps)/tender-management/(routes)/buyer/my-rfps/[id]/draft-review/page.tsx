import TemplateEditor from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-templates/template-editor-page";


interface PageProps {
  params: { draftId: string };
}

export default function Page({ params }: PageProps) {
  return <DraftReview id={params.draftId} />;
}
