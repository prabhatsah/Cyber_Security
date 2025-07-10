import type { Building } from "../../lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Badge } from "@/shadcn/ui/badge";
import {
  MapPin,
  User,
  Calendar,
  Building as BuildingIcon,
  Ruler,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { Separator } from "@/shadcn/ui/separator";

interface BuildingDetailsProps {
  building: Building;
}

const BuildingDetails = async ({ building }: BuildingDetailsProps) => {
  const {
    name,
    address,
    buildingCode,
    type,
    floorArea,
    constructionYear,
    floors,
    timeZone,
    contacts,
    subLocations,
  } = await building;

  console.log("Building Details:", building);

  console.log("address => ", address);

  const formatFloorArea = (area: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(area);
  };

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
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{name}</CardTitle>
              <CardDescription className="flex items-center text-sm">
                <MapPin className="mr-1 h-3 w-3" />
                {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
              </CardDescription>
            </div>
            <Badge className={getBuildingTypeColor(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Building Code</span>
              <span className="font-medium">{buildingCode}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Construction Year</span>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{constructionYear}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Floors</span>
              <div className="flex items-center">
                <BuildingIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{floors}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Floor Area</span>
              <div className="flex items-center">
                <Ruler className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatFloorArea(floorArea)} sq ft
                </span>
              </div>
            </div>
            {/* <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Time Zone</span>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{timeZone}</span>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contacts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="mt-4 space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="mr-3 h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">
                        {contact.name} {contact.isPrimary && (
                          <Badge variant="secondary" className="ml-2">Primary</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{contact.role}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="flex items-center justify-end text-sm">
                      <Phone className="mr-1 h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center justify-end text-sm">
                      <Mail className="mr-1 h-3 w-3" />
                      <span>{contact.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="locations" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {subLocations.length === 0 ? (
                  <p className="text-center text-muted-foreground">No locations added yet</p>
                ) : (
                  subLocations.map((location, index) => (
                    <div key={location.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{location.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          {location.area && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Area: </span>
                              {formatFloorArea(location.area)} sq ft
                            </p>
                          )}
                          {location.floorNumber !== undefined && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Floor: </span>
                              {location.floorNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      {location.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {location.description}
                        </p>
                      )}
                      {index < subLocations.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuildingDetails;