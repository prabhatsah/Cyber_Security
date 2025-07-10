import { z } from "zod";

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  latitude: z.number(),
  longitude: z.number()
});

// Contact schema
export const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  isPrimary: z.boolean().default(false),
});

// SubLocation schema
export const subLocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["floor", "room", "zone", "area"], {
    required_error: "Location type is required",
  }),
  floorNumber: z.number().optional(),
  area: z.number().optional(),
  description: z.string().optional(),
});

// Building schema
export const buildingSchema = z.object({
  name: z.string().min(1, "Building name is required"),
  address: addressSchema,
  buildingCode: z
    .string()
    .min(1, "Building code is required")
    .regex(/^[A-Z0-9-]+$/, "Building code must be uppercase letters, numbers, and hyphens"),
  type: z.enum(["office", "residential", "industrial", "retail"], {
    required_error: "Building type is required",
  }),
  floorArea: z.number({
    required_error: "Floor area is required",
    invalid_type_error: "Floor area must be a number",
  }).positive("Floor area must be positive"),
  constructionYear: z.number({
    required_error: "Construction year is required",
    invalid_type_error: "Construction year must be a number",
  }).min(1800, "Construction year must be after 1800").max(new Date().getFullYear(), "Construction year cannot be in the future"),
  floors: z.number({
    required_error: "Number of floors is required",
    invalid_type_error: "Number of floors must be a number",
  }).positive("Number of floors must be positive"),
  timeZone: z.string().min(1, "Time zone is required"),
  contacts: z.array(contactSchema).min(1, "At least one contact is required"),
  subLocations: z.array(subLocationSchema),
  status: z.enum(["draft", "active", "inactive"]).optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
});

// Registration wizard steps schemas
export const buildingBasicInfoSchema = z.object({
  name: buildingSchema.shape.name,
  buildingCode: buildingSchema.shape.buildingCode,
  type: buildingSchema.shape.type,
});

export const buildingDetailsSchema = z.object({
  floorArea: buildingSchema.shape.floorArea,
  constructionYear: buildingSchema.shape.constructionYear,
  floors: buildingSchema.shape.floors,
  //timeZone: buildingSchema.shape.timeZone,
});

export const buildingAddressSchema = z.object({
  address: addressSchema,
});

export const buildingContactSchema = z.object({
  contacts: buildingSchema.shape.contacts,
});

export const buildingSubLocationSchema = z.object({
  subLocations: buildingSchema.shape.subLocations,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});