import { z } from "zod";

export const orderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  phone: z
    .string()
    .trim()
   .regex(
    /^(09|07)\d{8}$/,
    "Enter a valid Ethiopian phone number"),

  address: z
    .string()
    .trim()
    .min(1, "Delivery address is required"),
});