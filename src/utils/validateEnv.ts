import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce
    .number({
      message: "PORT must be a valid number",
    })
    .min(1, { message: "PORT must be greater than 0" }),

  ENV: z
    .enum(["development", "testing", "production"], {
      errorMap: () => ({
        message: "ENV must be one of: development, testing, production",
      }),
    })
    .default("development"),

  JSON_SECRET: z
    .string()
    .min(5, { message: "JSON_SECRET must be at least 5 characters long" })
    .max(100, { message: "JSON_SECRET must be at most 100 characters long" }),

  DATABASE_CONNECTION_STRING: z.string().url({
    message: "DATABASE_CONNECTION_STRING must be a valid URL",
  }),
});

export const validateEnv = () => {
  envSchema.parse(process.env);
};
