import { z } from "zod";

export const DestinationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  description: z.string({
    required_error: "description title is required",
  }),

  destinationDetails: z.object({
    name: z.string({
      required_error: "tab name is required",
    }),
    title: z.string({
      required_error: "title is required",
    }),
    description: z.string({
      required_error: "description is required",
    }),
  }),
  featuredDestinationOffered: z.object({
    description: z.string({
      required_error: "description is required",
    }),
  }),
});
export type DestinationSchemaInput = z.infer<typeof DestinationSchema>;
