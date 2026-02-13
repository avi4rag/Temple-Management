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
  idType: z
    .enum(["aadhaar", "pan", "voter_id", "passport"])
    .default("aadhaar"),
  idLast4: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4}$/, "Must provide exactly the last 4 characters of ID"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit mobile number"),
});

export const bookingFormSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit mobile number"),
  devoteeCount: z
    .coerce
    .number()
    .min(1, "Must have at least 1 devotee")
    .max(6, "Maximum 6 devotees per booking"),
  devotees: z.array(devoteeSchema),
});
