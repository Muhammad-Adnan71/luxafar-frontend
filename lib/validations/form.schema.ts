import { z } from "zod";

export const ContactSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  phone: z
    .string({
      required_error: "Phone Number is required",
    })
    .min(1, "Phone Number is required"),
  message: z
    .string({
      required_error: "Message is required",
    })
    .min(1, "Message is required"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export const FooterSubscribeSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  message: z
    .string({
      required_error: "Message is required",
    })
    .optional(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
});

export type FooterSubscribeInput = z.infer<typeof FooterSubscribeSchema>;

export const ContactHomeSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  message: z
    .string({
      required_error: "Message is required",
    })
    .min(1, "Message is required")
    .optional(),
  subject: z
    .string({
      required_error: "Subject is required",
    })
    .optional(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
});

export type ContactHomeInput = z.infer<typeof ContactHomeSchema>;

export const BookingFormSchema = z.object({
  name: z
    .string({
      required_error: "First Name is required",
    })
    .min(1, "First Name is required"),
  lastName: z
    .string({
      required_error: "Last Name is required",
    })
    .min(1, "Last Name is required"),
  noOfTravelers: z
    .string({
      required_error: "Number of Travelers is required",
    })
    .min(1, "Number of Travelers is required"),
  phone: z
    .string({
      required_error: "Phone Number is required",
    })
    .optional(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),

  travelingDate: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine(
      (value) => {
        // Ensure both "from" and "to" are valid date strings
        return value.from !== null && value.to !== null;
      },
      {
        message:
          "Both 'from' and 'to' dates are required and must be valid dates.",
      }
    ),
});

export type BookingFormInput = z.infer<typeof BookingFormSchema>;

export const ContactPageSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  phone: z
    .string({
      required_error: "Phone Number is required",
    })
    .min(1, "Phone Number is required"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
  message: z
    .string({
      required_error: "Message is required",
    })
    .min(1, "Message is required"),
  subject: z.string({
    required_error: "Subject is required",
  }),
});

export type ContactPageInput = z.infer<typeof ContactPageSchema>;

export const BecomePartnerSchema = z.object({
  contactingAbout: z
    .string({
      required_error: "Company/Product Name is required",
    })
    .min(1, "Company/Product Name is required"),
  description: z
    .string({
      required_error: "Service/Product required",
    })
    .min(1, "Service/Product is required"),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  jobTitle: z
    .string({
      required_error: "Job Title is required",
    })
    .min(1, "Job Title is required"),
  webAddress: z.string().optional(),
  relevantDepartment: z
    .string({
      required_error: "Relevant Department is required",
    })
    .min(1, "Relevant Department is required"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
  phone: z
    .string({
      required_error: "Phone Number is required",
    })
    .min(1, "Phone Number is required"),
});

export type BecomePartnerInput = z.infer<typeof BecomePartnerSchema>;
