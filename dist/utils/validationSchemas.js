"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.milestoneSchema = exports.userValidation = exports.contractSchema = exports.projectSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.projectSchema = zod_1.z
    .object({
    projectName: zod_1.z
        .string()
        .min(3, "Project name must be at least 3 characters long"),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters long"),
    startDate: zod_1.z
        .string()
        .date()
        .refine((date) => new Date(date) > new Date(), {
        message: "Contracts can only start in the future",
    }),
    endDate: zod_1.z
        .string()
        .date()
        .refine((date) => new Date(date) > new Date(), {
        message: "No contracts can end just tomorrow",
    }),
    contractId: zod_1.z.string().refine((val) => {
        return mongoose_1.default.Types.ObjectId.isValid(val) && val.length === 24;
    }, {
        message: "Invalid ObjectId format",
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
exports.contractSchema = zod_1.z
    .object({
    contractName: zod_1.z
        .string()
        .min(3, "name is too short need atleast 3 charactors"),
    startDate: zod_1.z
        .string()
        .date()
        .refine((date) => new Date(date) > new Date(), {
        message: "Contracts can only start in the future",
    }),
    endDate: zod_1.z
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
exports.userValidation = zod_1.z
    .object({
    userName: zod_1.z
        .string()
        .min(2, { message: "Name must be at least 2 characters" }),
    email: zod_1.z.string().email("Please provide a valid email"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "passwords can not be that long"),
    confirmPassword: zod_1.z
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
exports.milestoneSchema = zod_1.z.object({
    milestoneName: zod_1.z
        .string()
        .min(3, "Milestone name must be at least 3 characters long"),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters long"),
    dueDate: zod_1.z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid due date format",
    })
        .transform((date) => new Date(date))
        .refine((dueDate) => dueDate > new Date(), {
        message: "Due date must be in the future",
    }),
    amount: zod_1.z.number().positive("Amount must be a positive number"),
    contractId: zod_1.z
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val) && val.length === 24, {
        message: "Invalid ObjectId format",
    }),
});
