import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Building, Thermometer, Users } from "lucide-react"
import Link from "next/link"

const buildings = [
  {
    id: "building-a",
    name: "Building A",
    location: "123 Main Street",
    occupancy: "85%",
    temperature: "72°F",
    imageUrl: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg"
  },
  {
    id: "building-b", 
    name: "Building B",
    location: "456 Park Avenue",
    occupancy: "92%",
    temperature: "70°F",
    imageUrl: "https://images.pexels.com/photos/2228549/pexels-photo-2228549.jpeg"
  },
  {
    id: "building-c",
    name: "Building C", 
    location: "789 Broadway",
    occupancy: "78%",
    temperature: "74°F",
    imageUrl: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
  }
]

export default function BuildingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Building className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Buildings Overview</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building) => (
          <Link key={building.id} href={`/bms/buildings/${building.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={building.imageUrl} 
                  alt={building.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{building.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{building.occupancy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{building.temperature}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{building.location}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}