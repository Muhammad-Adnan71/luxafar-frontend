import { z } from "zod";

export const RegisterUserSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, "Full name is required"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .min(1, "Email is required")
      .email("Email is invalid"),
    imageId: z.string().optional(),
    role: z.string().optional(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: z
      .string({
        required_error: "Confirm your password",
      })
      .min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });
export const UpdateUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Full name is required"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),

  oldPassword: z
    .string({ required_error: "Old Password is required" })
    .superRefine((val, ctx) => {
      if (val.length >= 1 && val.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be more than 8 characters",
        });
      } else if (val.length >= 1 && val.length > 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be less than 32 characters",
        });
      }
    }),
  newPassword: z
    .string({ required_error: "New Password is required" })
    .superRefine((val, ctx) => {
      if (val.length >= 1 && val.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be more than 8 characters",
        });
      } else if (val.length >= 1 && val.length > 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be less than 32 characters",
        });
      }
    }),
  media: z
    .object({
      desktopMediaUrl: z.string().optional(),
    })
    .optional(),
  imageId: z.number({ required_error: "imageId is required" }).optional(),
});

export const LoginUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
