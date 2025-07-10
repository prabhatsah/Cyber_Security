import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Building, Thermometer, Users } from "lucide-react"
import Link from "next/link"

const floors = {
  "building-a": [
    { id: "floor-1", name: "Floor 1", temperature: "72°F", humidity: "45%", occupancy: "85%" },
    { id: "floor-2", name: "Floor 2", temperature: "73°F", humidity: "44%", occupancy: "78%" },
    { id: "floor-3", name: "Floor 3", temperature: "71°F", humidity: "46%", occupancy: "92%" }
  ],
  "building-b": [
    { id: "floor-1", name: "Floor 1", temperature: "70°F", humidity: "43%", occupancy: "88%" },
    { id: "floor-2", name: "Floor 2", temperature: "71°F", humidity: "45%", occupancy: "75%" }
  ],
  "building-c": [
    { id: "floor-1", name: "Floor 1", temperature: "74°F", humidity: "42%", occupancy: "82%" }
  ]
}

export default function BuildingPage({ params }: { params: { id: string } }) {
  const buildingFloors = floors[params.id as keyof typeof floors] || []
  const buildingName = params.id === "building-a" ? "Building A" : 
                      params.id === "building-b" ? "Building B" : "Building C"

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        {/* <Building className="h-6 w-6" /> */}
        <h1 className="text-2xl font-bold">{buildingName} Overview</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {buildingFloors.map((floor) => (
          <Link key={floor.id} href={`/bms/buildings/${params.id}/floors/${floor.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{floor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* <Thermometer className="h-4 w-4 text-muted-foreground" /> */}
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="text-sm font-medium">{floor.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Occupancy</span>
                    </div>
                    <span className="text-sm font-medium">{floor.occupancy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}