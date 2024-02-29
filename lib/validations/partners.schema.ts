import { z } from "zod";

export const PartnersSchema = z.object({
  name: z
    .string({
      required_error: "Partner URL is required",
    })
    .min(1, "Partner URL is required")
    .max(191, "Partner URL is too long"),
  isActive: z.boolean().optional(),
  sortId: z.number().optional(),
  media: z
    .object({
      desktopMediaUrl: z.string().optional(),
    })
    .optional(),
});

export type PartnersInput = z.infer<typeof PartnersSchema>;
