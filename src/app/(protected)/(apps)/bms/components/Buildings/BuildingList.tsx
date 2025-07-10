"use client";
import type { Building } from "../../lib/types";
import BuildingCard from "./BuildingCard";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { useState } from "react";

interface BuildingListProps {
  buildings: Building[];
}

const BuildingList = ({ buildings }: BuildingListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Filter buildings based on search term and type
  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch =
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.buildingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || building.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search buildings by name, code, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-60">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBuildings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No buildings found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBuildings.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildingList;