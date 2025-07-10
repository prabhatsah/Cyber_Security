import { ArrowLeft } from "lucide-react";
import AnalyzerComponent from "../components/analyzer-component";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function AnalyzerPage({ params }: PageProps) {
  return (
    <>
      <div className="flex flex-col gap-2 w-full h-[90dvh] p-4 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Link href={"/tender-management/" + params.id}>
            <ArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Analyze Tender</h1>
        </div>

        <p className="text-sm text-gray-500">
          Analyze the tender document here.
        </p>
        <AnalyzerComponent id={params.id} />
      </div>
    </>
  );
}
