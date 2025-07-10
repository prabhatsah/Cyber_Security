export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface SubLocation {
  id: string;
  name: string;
  type: 'floor' | 'room' | 'zone' | 'area';
  floorNumber?: number;
  area?: number;
  description?: string;
}

export interface Building {
  id: string;
  name: string;
  address: Address;
  buildingCode: string;
  type: 'office' | 'residential' | 'industrial' | 'retail';
  floorArea: number;
  constructionYear: number;
  floors: number;
  timeZone: string;
  contacts: Contact[];
  subLocations: SubLocation[];
  status?: 'draft' | 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
}

export type BuildingFormData = Omit<Building, 'id' | 'createdAt' | 'updatedAt'>;