import mongoose from "mongoose";
import { z } from "zod";

export const projectSchema = z
  .object({
    projectName: z
      .string()
      .min(3, "Project name must be at least 3 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    startDate: z
      .string()
      .date()
      .refine((date) => new Date(date) > new Date(), {
        message: "Contracts can only start in the future",
      }),
    endDate: z
      .string()
      .date()
      .refine((date) => new Date(date) > new Date(), {
        message: "No contracts can end just tomorrow",
      }),
    contractId: z.string().refine(
      (val) => {
        return mongoose.Types.ObjectId.isValid(val) && val.length === 24;
      },
      {
        message: "Invalid ObjectId format",
      }
    ),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (new Date(startDate) > new Date(endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });

export const contractSchema = z
  .object({
    contractName: z
      .string()
      .min(3, "name is too short need atleast 3 charactors"),
    startDate: z
      .string()
      .date()
      .refine((date) => new Date(date) > new Date(), {
        message: "Contracts can only start in the future",
      }),
    endDate: z
      .string()
      .date()
      .refine((date) => new Date(date) > new Date(), {
        message: "No contracts can end just tomorrow",
      }),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (new Date(startDate) > new Date(endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });

export const userValidation = z
  .object({
    userName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email("Please provide a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "passwords can not be that long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const milestoneSchema = z.object({
  milestoneName: z
    .string()
    .min(3, "Milestone name must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid due date format",
    })
    .transform((date) => new Date(date))
    .refine((dueDate) => dueDate > new Date(), {
      message: "Due date must be in the future",
    }),
  amount: z.number().positive("Amount must be a positive number"),
  contractId: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val) && val.length === 24,
      {
        message: "Invalid ObjectId format",
      }
    ),
});
