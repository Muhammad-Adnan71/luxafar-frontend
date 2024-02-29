import { z } from "zod";

export const ConfigurationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title is required"),

  phone: z
    .string({
      required_error: "Number is required",
    })
    .min(1, "Number is required")
    .regex(/^\d+$/, "Phone number must contain only digits"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),

  whatsappNumber: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type ConfigurationInput = z.infer<typeof ConfigurationSchema>;
