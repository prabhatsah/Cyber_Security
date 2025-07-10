//import PageTitle from "@/components/layout/PageTitle";
//import Header from "@/components/layout/Header";
import BuildingList from "../components/Buildings/BuildingList";
import { Building, Plus } from "lucide-react";
import { getBuildings } from "../lib/data";
import { Button } from "@/shadcn/ui/button";
import Link from "next/link";

export default async function BuildingsPage() {
  const buildings = await getBuildings();

  return (
    <>
    {/*   <Header /> */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
       {/*  <PageTitle
          title="Buildings"
          description="Manage all your building locations"
          action={{
            label: "Add Building",
            href: "/buildings/new",
            icon: <Plus className="mr-2 h-4 w-4" />,
          }}
        /> */}
         <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Buildings</h1>
            <p className="text-muted-foreground">Manage all your building locations</p>
          </div>
          <Button asChild>
            <Link href="building-management/new" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Link>
          </Button>
        </div>

        <BuildingList buildings={buildings} />
      </main>
    </>
  );
}