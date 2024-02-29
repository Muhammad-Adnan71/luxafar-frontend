import { z } from "zod";

export const PagesSchema = z.object({
  title: z
    .string({
      required_error: "Page title is required",
    })
    .min(1, "input please"),

  description: z
    .string({
      required_error: "Page title is required",
    })
    .min(1, "input description"),

  seoKeywords: z
    .string({
      required_error: "Page title is required",
    })
    .optional(),

  isExpandable: z.boolean().optional(),
  name: z.string().optional(),
  content: z
    .object({
      id: z.number().optional(),
      name: z.string().optional(),
      subTitle: z.string().optional().nullish(),
      description: z.string().optional().nullish(),
      buttonText: z.string().optional().nullish(),
      buttonUrl: z.string().optional().nullish(),
      title: z
        .string({
          required_error: "Page title is required",
        })
        .min(1, "Check Please"),
    })
    .array(),
});
export type PagesSchemaInput = z.infer<typeof PagesSchema>;
