import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^\+?[1-9]\d{9,14}$/,
        "Please enter a valid phone number"
      ),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;