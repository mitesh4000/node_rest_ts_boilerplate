"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce
        .number({
        message: "PORT must be a valid number",
    })
        .min(1, { message: "PORT must be greater than 0" }),
    ENV: zod_1.z
        .enum(["development", "testing", "production"], {
        errorMap: () => ({
            message: "ENV must be one of: development, testing, production",
        }),
    })
        .default("development"),
    JSON_SECRET: zod_1.z
        .string()
        .min(5, { message: "JSON_SECRET must be at least 5 characters long" })
        .max(100, { message: "JSON_SECRET must be at most 100 characters long" }),
    DATABASE_CONNECTION_STRING: zod_1.z.string().url({
        message: "DATABASE_CONNECTION_STRING must be a valid URL",
    }),
});
const validateEnv = () => {
    try {
        envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.log(error.errors);
            throw new Error("ENV variable validation failed");
        }
    }
};
exports.validateEnv = validateEnv;
