import type { Building } from "../../lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import Link from "next/link";
import { Button } from "@/shadcn/ui/button";
import { Building as BuildingIcon, MapPin, Calendar, Users } from "lucide-react";

interface BuildingCardProps {
  building: Building;
}

const BuildingCard = ({ building }: BuildingCardProps) => {
  const { id, name, address, type, constructionYear, floors, contacts } = building;

  const getBuildingTypeColor = (type: Building["type"]) => {
    switch (type) {
      case "office":
        return "bg-blue-100 text-blue-800";
      case "residential":
        return "bg-green-100 text-green-800";
      case "industrial":
        return "bg-yellow-100 text-yellow-800";
      case "retail":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge variant="outline" className={getBuildingTypeColor(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">Code: {building.buildingCode}</span>
        </div>
        <Link href={`/building-management/${id}`} className="group">
          <h3 className="group-hover:text-blue-600 text-lg font-semibold transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          <span>
            {address.city}, {address.state}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Year Built</span>
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">{constructionYear}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Floors</span>
            <div className="flex items-center">
              <BuildingIcon className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">{floors}</span>
            </div>
          </div>
          <div className="col-span-2 flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground">Primary Contact</span>
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">
                {contacts.find(c => c.isPrimary)?.name || contacts[0]?.name || "No contact"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/bms/building-management/${id}/locations`}>
            Locations
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/bms/building-management/${id}`}>
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuildingCard;