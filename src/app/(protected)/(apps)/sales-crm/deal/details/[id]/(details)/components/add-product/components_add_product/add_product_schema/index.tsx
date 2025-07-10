import { z } from "zod";

export const productSchema = z.object({
  productDetails: z
    .object({
      productIdentifier: z.string().optional(),
      productType: z.string().optional(),
      projectManager: z.string().optional(),
      productDescription: z.string().optional(),
    })

    .optional(),
});