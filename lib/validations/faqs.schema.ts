import { z } from "zod";

export const FaqSchema = z.object({
  question: z
    .string({
      required_error: "Faq Question must be string. ",
    })
    .optional(),
  isActive: z.boolean().optional(),
  answer: z
    .string({
      required_error: "Faq Answer must be string.",
    })
    .optional(),
});

export type FaqInput = z.infer<typeof FaqSchema>;
