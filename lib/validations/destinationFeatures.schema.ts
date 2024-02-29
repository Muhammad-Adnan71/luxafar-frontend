import { z } from "zod";

export const DestinationFeatureSchema = z.object({
  name: z
    .string({
      required_error: "Destination Feature is required",
    })
    .min(1, "Destination Feature name is required"),
});

export type DestinationFeatureInput = z.infer<typeof DestinationFeatureSchema>;
