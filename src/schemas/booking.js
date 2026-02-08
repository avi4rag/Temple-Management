import { z } from "zod";

export const devoteeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  age: z
    .coerce
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be valid"),
  aadhaar: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export const bookingFormSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  devoteeCount: z
    .coerce
    .number()
    .min(1, "Must have at least 1 devotee")
    .max(10, "Maximum 10 devotees per booking"),
  devotees: z.array(devoteeSchema),
});
