import { z } from "zod";

export const bespokeQuestionSchema = z.object({
  id: z.number({}).optional(),
  name: z
    .string({
      required_error: "name is required",
    })
    .min(1, " Name is required"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
  otherCountry: z
    .string({
      required_error: "otherCountry title is required",
    })
    .nullish(),
  countryCode: z
    .string({
      required_error: "description title is required",
    })
    .nullish(),

  phoneNumber: z
    .string({
      required_error: "description title is required",
    })
    .min(1, " Phone Number is required"),

  preferredCountry: z
    .string({
      required_error: "description title is required",
    })
    .nullish(),

  tripDays: z
    .string({
      required_error: "description title is required",
    })
    .nullish(),
  bespokeFormQuestionAndAnswer: z
    .array(
      z
        .object({
          answer: z
            .union([z.string(), z.array(z.string())])
            .nullish()
            .optional(),
          additionalText: z.string().nullish().optional(),
        })
        .nullish()
        .optional()
    )
    .nullish()
    .optional(),
});
export type BespokeQuestionInput = z.infer<typeof bespokeQuestionSchema>;
