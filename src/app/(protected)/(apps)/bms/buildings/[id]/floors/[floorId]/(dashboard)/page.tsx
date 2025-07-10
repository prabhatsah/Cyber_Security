import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Building, Thermometer, Users } from "lucide-react"
import Link from "next/link"

const equipmentList = {
  "building-a": {
    "floor-1": [
      { id: "equip-1", name: "AHU-1", temperature: "72°F", humidity: "45%", occupancy: "85%" },
      { id: "equip-2", name: "VAV-1", temperature: "73°F", humidity: "44%", occupancy: "78%" }
    ],
    "floor-2": [
      { id: "equip-1", name: "AHU-2", temperature: "71°F", humidity: "46%", occupancy: "80%" }
    ]
  },
  "building-b": {
    "floor-1": [
      { id: "equip-1", name: "FCU-1", temperature: "70°F", humidity: "43%", occupancy: "88%" }
    ]
  }
}

export default function FloorPage({
  params
}: {
  params: { id: string; floorId: string }
}) {
  const { id, floorId } = params

  const floorEquipments =
    equipmentList[id as keyof typeof equipmentList]?.[floorId as keyof typeof equipmentList[typeof id]] || []

  const buildingName = id
  const floorName = floorId

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        {/* <Building className="h-6 w-6" /> */}
        <h1 className="text-2xl font-bold">
          {buildingName} – {floorName} Overview
        </h1>
      </div>

      {floorEquipments.length === 0 ? (
        <p className="text-muted-foreground">No equipment found on this floor.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {floorEquipments.map((equipment) => (
            <Link
              key={equipment.id}
              href={`/bms/buildings/${id}/floors/${floorId}/equipments/${equipment.id}`}
            >
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{equipment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Temperature</span>
                      </div>
                      <span className="text-sm font-medium">{equipment.temperature}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Occupancy</span>
                      </div>
                      <span className="text-sm font-medium">{equipment.occupancy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
