import { z } from "zod";
import crypto from "crypto";
export const signUpFormSchema = z
  .object({
    email: z.string().min(4, "Email is required").email("Please enter a valid email"),
    first_name: z.string().min(1, "Name is required").min(3, "Too short"),
    last_name: z.string().min(1, "Name is required").min(3, "Too short"),
    password: z.string().min(1, "Password is required").min(7, "Too short"),
    confirm_password: z.string().min(1, "Confirm Password is required").min(7, "Too short"),
    companyCode: z
      .string()
      .min(1, "Company Code is required")
      .transform((val) => {
        // Transform the input (hash the input value)
        const hash = crypto.createHash("sha256").update(val).digest("hex");
        return hash;
      })
      .refine(
        (hash) => {
          // Compare the transformed hash with "123456789" hashed value
          const targetHash = crypto.createHash("sha256").update("123456789").digest("hex");
          return hash === targetHash;
        },
        {
          message: "The provided value does not match the company code.",
        },
      ),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirm_password"],
      });
    }
  });

export type signUpFormType = z.infer<typeof signUpFormSchema>;
