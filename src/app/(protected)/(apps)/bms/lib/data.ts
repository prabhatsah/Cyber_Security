import { Building } from "./types";
import { mapProcessName,getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

// Mock data for buildings
/* export const mockBuildings: Building[] = [
  {
    id: "building-001",
    name: "Skyline Tower",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    buildingCode: "SKY-001",
    type: "office",
    floorArea: 250000,
    constructionYear: 2015,
    floors: 45,
    timeZone: "America/New_York",
    contacts: [
      {
        id: "contact-001",
        name: "John Doe",
        role: "Building Manager",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        isPrimary: true,
      },
      {
        id: "contact-002",
        name: "Jane Smith",
        role: "Maintenance Supervisor",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
        isPrimary: false,
      },
    ],
    subLocations: [
      {
        id: "subloc-001",
        name: "Floor 1",
        type: "floor",
        floorNumber: 1,
        area: 5500,
        description: "Lobby and reception area",
      },
      {
        id: "subloc-002",
        name: "Floor 2",
        type: "floor",
        floorNumber: 2,
        area: 5500,
        description: "Executive offices",
      },
    ],
    status: "active",
    createdAt: "2023-05-15T08:00:00Z",
    updatedAt: "2023-05-15T08:00:00Z",
  },
  {
    id: "building-002",
    name: "Riverside Apartments",
    address: {
      street: "456 River Road",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    buildingCode: "RVA-002",
    type: "residential",
    floorArea: 120000,
    constructionYear: 2010,
    floors: 20,
    timeZone: "America/Chicago",
    contacts: [
      {
        id: "contact-003",
        name: "Robert Johnson",
        role: "Property Manager",
        email: "robert.johnson@example.com",
        phone: "+1 (555) 234-5678",
        isPrimary: true,
      },
    ],
    subLocations: [
      {
        id: "subloc-003",
        name: "Building A",
        type: "zone",
        area: 60000,
        description: "North tower",
      },
      {
        id: "subloc-004",
        name: "Building B",
        type: "zone",
        area: 60000,
        description: "South tower",
      },
    ],
    status: "active",
    createdAt: "2023-06-10T10:30:00Z",
    updatedAt: "2023-06-10T10:30:00Z",
  },
  {
    id: "building-003",
    name: "Meadow Park Mall",
    address: {
      street: "789 Mall Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    buildingCode: "MPM-003",
    type: "retail",
    floorArea: 350000,
    constructionYear: 2005,
    floors: 3,
    timeZone: "America/Los_Angeles",
    contacts: [
      {
        id: "contact-004",
        name: "Sarah Williams",
        role: "Mall Director",
        email: "sarah.williams@example.com",
        phone: "+1 (555) 345-6789",
        isPrimary: true,
      },
      {
        id: "contact-005",
        name: "Michael Brown",
        role: "Security Manager",
        email: "michael.brown@example.com",
        phone: "+1 (555) 456-7890",
        isPrimary: false,
      },
    ],
    subLocations: [
      {
        id: "subloc-005",
        name: "Food Court",
        type: "zone",
        area: 25000,
        description: "Central dining area",
      },
      {
        id: "subloc-006",
        name: "Anchor Store 1",
        type: "area",
        area: 50000,
        description: "Department store - North entrance",
      },
    ],
    status: "active",
    createdAt: "2023-07-05T15:45:00Z",
    updatedAt: "2023-07-05T15:45:00Z",
  },
  {
    id: "building-004",
    name: "Innovate Industrial Park",
    address: {
      street: "321 Factory Lane",
      city: "Detroit",
      state: "MI",
      zipCode: "48201",
      country: "USA",
    },
    buildingCode: "IIP-004",
    type: "industrial",
    floorArea: 500000,
    constructionYear: 2000,
    floors: 2,
    timeZone: "America/Detroit",
    contacts: [
      {
        id: "contact-006",
        name: "David Clark",
        role: "Facilities Director",
        email: "david.clark@example.com",
        phone: "+1 (555) 567-8901",
        isPrimary: true,
      },
    ],
    subLocations: [
      {
        id: "subloc-007",
        name: "Production Floor",
        type: "area",
        area: 300000,
        description: "Main manufacturing area",
      },
      {
        id: "subloc-008",
        name: "Storage Warehouse",
        type: "area",
        area: 150000,
        description: "Inventory and shipping",
      },
    ],
    status: "active",
    createdAt: "2023-08-20T09:15:00Z",
    updatedAt: "2023-08-20T09:15:00Z",
  },
];
 */
// Get all buildings
let mockBuildings: Building[] = [];
export const getBuildings = async (): Promise<Building[]> => {

  //return mockBuildings;
  const instances = await getMyInstancesV2({
    processName: "Building",
  });
  console.log("Instances:", instances);
  mockBuildings = instances.map((instance) => instance.data);
  console.log("Mock Buildings:", mockBuildings);
  return mockBuildings;
};

// Get building by ID
export const getBuildingById = async (id: string): Promise<Building | undefined> => {
  /* return mockBuildings.find((building) => building.id === id); */
  /* debugger;
  const instance = mockBuildings.find((building) => building.id === id);
  if (!instance) return undefined;
  return instance; */
  const instance = await getMyInstancesV2({
    processName: "Building",
    mongoWhereClause: `this.Data.id == "${id}"`,
  });
    console.log("Instance:", instance);
    if (!instance) return undefined;
    const building = instance[0].data as Building;
    return building;
};

// Create a new building
export const createBuilding = (building: Omit<Building, "id" | "createdAt" | "updatedAt">): Building => {
  const now = new Date().toISOString();
  debugger;
  const newBuilding: Building = {
    ...building,
    id: `building-${mockBuildings.length + 1}`.padStart(11, "0"),
    createdAt: now,
    updatedAt: now,
  };
  
  // In a real app, we would save to a database here
  // mockBuildings.push(newBuilding);
  
  return newBuilding;
};

// Update an existing building
export const updateBuilding = (id: string, building: Partial<Building>): Building | undefined => {
  const index = mockBuildings.findIndex((b) => b.id === id);
  if (index === -1) return undefined;
  
  const updatedBuilding = {
    ...mockBuildings[index],
    ...building,
    updatedAt: new Date().toISOString(),
  };
  
  // In a real app, we would update in a database here
  // mockBuildings[index] = updatedBuilding;
  
  return updatedBuilding;
};

// Delete a building
export const deleteBuilding = (id: string): boolean => {
  const index = mockBuildings.findIndex((b) => b.id === id);
  if (index === -1) return false;
  
  // In a real app, we would delete from a database here
  // mockBuildings.splice(index, 1);
  
  return true;
};

// Mock user for authentication
export const mockUser = {
  id: "user-001",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};
