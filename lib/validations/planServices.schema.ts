import { z } from "zod";

export const PlanServiceSchema = z.object({
  name: z
    .string({
      required_error: "Plan Service is required",
    })
    .min(1, "Plan Service name is required"),
});

export type PlanServiceInput = z.infer<typeof PlanServiceSchema>;
