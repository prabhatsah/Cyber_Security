"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Building, ChevronRight, FileBarChart, MapPin, Settings, Users, Thermometer, Zap } from "lucide-react"
import { Badge } from "@/shadcn/ui/badge"
import { Button } from "@/shadcn/ui/button"
import Image from "next/image"

export function BuildingsList() {
  const buildings = [
    {
      id: "building-a",
      name: "Corporate Headquarters",
      address: "123 Main Street, New York, NY",
      floors: 12,
      area: "120,000 sq ft",
      occupancy: "85%",
      status: "Active",
      temperatureAvg: "72°F",
      energyUsage: "12.4 kWh/ft²",
      imageUrl: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "building-b",
      name: "Tech Campus Building B",
      address: "456 Innovation Blvd, San Francisco, CA",
      floors: 8,
      area: "85,000 sq ft",
      occupancy: "92%",
      status: "Active",
      temperatureAvg: "70°F",
      energyUsage: "10.8 kWh/ft²",
      imageUrl: "https://images.pexels.com/photos/2228549/pexels-photo-2228549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "building-c",
      name: "Research Center",
      address: "789 Science Drive, Boston, MA",
      floors: 5,
      area: "65,000 sq ft",
      occupancy: "75%",
      status: "Maintenance",
      temperatureAvg: "71°F",
      energyUsage: "11.2 kWh/ft²",
      imageUrl: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
  ]
  
  return (
    <div className="grid gap-6">
      {buildings.map((building) => (
        <Card key={building.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
              <div className="absolute inset-0">
                <img
                  src={building.imageUrl}
                  alt={building.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                  {building.status === "Active" ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      Maintenance
                    </span>
                  )}
                </Badge>
              </div>
            </div>
            
            <CardContent className="flex-1 p-0">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{building.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      {building.address}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{building.floors} Floors</p>
                      <p className="text-xs text-muted-foreground">{building.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Occupancy</p>
                      <p className="text-xs text-muted-foreground">{building.occupancy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Avg. Temp</p>
                      <p className="text-xs text-muted-foreground">{building.temperatureAvg}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Energy Usage</p>
                      <p className="text-xs text-muted-foreground">{building.energyUsage}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex border-t">
                <Button variant="ghost" className="flex-1 justify-center rounded-none py-6 text-xs font-medium">
                  <FileBarChart className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
                <Button variant="ghost" className="flex-1 justify-center rounded-none border-l py-6 text-xs font-medium">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Systems
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}