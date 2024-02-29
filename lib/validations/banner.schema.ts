import { z } from "zod";

export const BannerSchema = z.object({
  title: z
    .string({
      required_error: "Title must be string",
    })
    .min(1, "Title is required")
    .max(191, "Title must be less than 191 characters"),
  buttonText: z
    .string({
      required_error: "Button text must be string",
    })
    .max(191, "Button text must be less than 191 characters")
    .optional(),
  buttonUrl: z
    .string({
      required_error: "Button URL must be string",
    })
    .max(191, "Button URL must be less than 191 characters")
    .optional(),
  isActive: z.boolean().optional(),
  media: z
    .object({
      desktopMediaUrl: z.string().optional(),
      mobileMediaUrl: z.string().optional(),
    })
    .optional(),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, "Description is required"),
});

export type BannerSchemaInput = z.infer<typeof BannerSchema>;
