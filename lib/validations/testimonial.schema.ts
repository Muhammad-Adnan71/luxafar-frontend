import { z } from "zod";

export const TestimonialSchema = z.object({
  clientName: z
    .string({
      required_error: "Client name is required",
    })
    .max(191, "Client Name is too long")
    .optional(),
  clientLocation: z
    .string({
      required_error: "Client location is required",
    })

    .max(191, "Client location is too long")
    .optional(),
  clientImageId: z.number().optional(),
  destinationImageId: z.number().optional(),
  description: z
    .string({
      required_error: "description is required",
    })
    .nullable()
    .optional(),
  clientImageMedia: z
    .object({
      id: z.number().optional(),
      desktopMediaUrl: z.string().optional(),
    })

    .optional(),
  isActive: z.boolean().optional(),
  sortId: z.number().optional(),
  destinationImageMedia: z
    .object({
      id: z.number().optional(),
      desktopMediaUrl: z.string().optional(),
    })
    .optional(),
});

export type TestimonialInput = z.infer<typeof TestimonialSchema>;
