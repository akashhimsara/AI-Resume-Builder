import { z } from "zod";

const coreEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  AUTH_JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url().default("http://localhost:3000"),
  ),
});

const parsedCore = coreEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsedCore.success) {
  console.error("Invalid core environment variables", parsedCore.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

const openAIEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  OPENAI_BASE_URL: z.string().url().optional(),
});

const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
});

const emailEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  EMAIL_FROM: z.string().email(),
  EMAIL_FROM_NAME: z.string().trim().min(1).default("AI Resume Builder"),
});

export const env = parsedCore.data;

export function getOpenAIEnv() {
  const parsed = openAIEnvSchema.safeParse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  });

  if (!parsed.success) {
    console.error("Invalid OpenAI environment variables", parsed.error.flatten().fieldErrors);
    throw new Error("OpenAI environment validation failed");
  }

  return parsed.data;
}

export function getStripeEnv() {
  const parsed = stripeEnvSchema.safeParse({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
  });

  if (!parsed.success) {
    console.error("Invalid Stripe environment variables", parsed.error.flatten().fieldErrors);
    throw new Error("Stripe environment validation failed");
  }

  return parsed.data;
}

export function getEmailEnv() {
  const parsed = emailEnvSchema.safeParse({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SECURE: process.env.SMTP_SECURE,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  });

  if (!parsed.success) {
    console.error("Invalid email environment variables", parsed.error.flatten().fieldErrors);
    throw new Error("Email environment validation failed");
  }

  return parsed.data;
}

const upstashEnvSchema = z.object({
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

export function getUpstashEnv() {
  const parsed = upstashEnvSchema.safeParse({
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  if (!parsed.success) {
    console.warn("Invalid Upstash environment variables - Rate limiting will default to in-memory mode.");
    return { UPSTASH_REDIS_REST_URL: undefined, UPSTASH_REDIS_REST_TOKEN: undefined };
  }

  return parsed.data;
}
