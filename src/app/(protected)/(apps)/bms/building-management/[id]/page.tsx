export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
//import PageTitle from "@/components/layout/PageTitle";
//import Header from "@/components/layout/Header";
import BuildingDetails from "../../components/Buildings/BuildingDetails";
import { Pencil } from "lucide-react";
import { getBuildingById, getBuildings } from "../../lib/data";
//import { getBuildingById,getAllBuildings, getBuildings } from "../../lib/data";

interface BuildingPageProps {
  params: {
    id: string;
  };
}

/* // Generate static paths for all building IDs
export async function generateStaticParams() {
  //const buildings = getAllBuildings();
  debugger;
  const buildings = await getBuildings();
  
  return buildings.map((building) => ({
    id: building.id,
  }));
}

export async function getDynamicBuildingData() {
  //const buildings = getAllBuildings();
  debugger;
  const buildings = await getBuildings();
  
  return buildings.map((building) => ({
    id: building.id,
  }));
} */

export  default async function BuildingPage({ params }: BuildingPageProps) {
  const building = await getBuildingById(params.id);
  debugger;

  if (!building) {
    notFound();
  }

  return (
    <>
     {/*  <Header /> */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
       {/*  <PageTitle
          title={building.name}
          description={`Building Code: ${building.buildingCode}`}
          action={{
            label: "Edit Building",
            href: `/building-management/${params.id}/edit`,
            icon: <Pencil className="mr-2 h-4 w-4" />,
          }}
        /> */}

        <BuildingDetails building={building} />
      </main>
    </>
  );
}