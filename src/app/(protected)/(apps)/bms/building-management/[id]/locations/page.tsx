import { notFound } from "next/navigation";
import Link from "next/link";
//import PageTitle from "@/components/layout/PageTitle";
//import Header from "@/components/layout/Header";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { Separator } from "@/shadcn/ui/separator";
import { ArrowLeft, MapPin, Plus, Ruler } from "lucide-react";
import { getBuildingById,getBuildings } from "../../../lib/data";

// Generate static paths for all building IDs
/* export async function generateStaticParams() {
  // Get all buildings
  const buildings = await getBuildings();
  
  // Return an array of objects with the id parameter
  return buildings.map((building) => ({
    id: building.id,
  }));
} */

interface LocationsPageProps {
  params: {
    id: string;
  };
}

export default async function LocationsPage({ params }: LocationsPageProps) {

  console.log("params => ", params);
  const building = await getBuildingById(params.id);
  console.log("Building Locations:", building);

  if (!building) {
    notFound();
  }

  const formatFloorArea = (area?: number) => {
    if (!area) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(area);
  };

  return (
    <>
     {/*  <Header /> */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
       {/*  <PageTitle
          title={`${building.name} - Locations`}
          description="Manage building sub-locations"
          action={{
            label: "Add Location",
            href: `/building-management/${params.id}/locations/new`,
            icon: <Plus className="mr-2 h-4 w-4" />,
          }}
        /> */}

        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/bms/building-management/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Building
            </Link>
          </Button>
        </div>

        {building.subLocations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <MapPin className="mb-4 h-12 w-12 text-muted-foreground/60" />
              <h3 className="mb-2 text-xl font-semibold">No Locations Added</h3>
              <p className="mb-6 text-muted-foreground">
                Start adding sub-locations to organize this building.
              </p>
              <Button asChild>
                <Link href={`/building-management/${params.id}/locations/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Location
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sub-Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Group by type */}
                {["floor", "room", "zone", "area"].map((type) => {
                  const locationsOfType = building.subLocations.filter(
                    (loc) => loc.type === type
                  );

                  if (locationsOfType.length === 0) return null;
                  debugger;

                  return (
                    <div key={type}>
                      <h3 className="mb-4 text-lg font-medium capitalize">
                        {type}s ({locationsOfType.length})
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {locationsOfType.map((location) => (
                          <div
                            key={location.id}
                            className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{location.name}</h4>
                                <Badge variant="outline" className="mt-1">
                                  {location.type.charAt(0).toUpperCase() +
                                    location.type.slice(1)}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                asChild
                              >
                                <Link
                                  //href={`/bms/building-management/${params.id}/locations/${location.id}`}
                                  //href={`locations/${location.id}`}
                                  href={`/bms/building-management/${params.id}/locations/${location.id}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                  >
                                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                  </svg>
                                </Link>
                              </Button>
                            </div>

                            <div className="mt-2 space-y-1 text-sm">
                              {location.area && (
                                <div className="flex items-center text-muted-foreground">
                                  <Ruler className="mr-1 h-3 w-3" />
                                  <span>
                                    {formatFloorArea(location.area)} sq ft
                                  </span>
                                </div>
                              )}
                              {location.floorNumber !== undefined && (
                                <div className="flex items-center text-muted-foreground">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  <span>Floor {location.floorNumber}</span>
                                </div>
                              )}
                            </div>

                            {location.description && (
                              <p className="mt-3 text-sm text-muted-foreground">
                                {location.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-6" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}