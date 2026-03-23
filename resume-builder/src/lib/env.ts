import { z } from "zod";

const coreEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  AUTH_JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.url(),
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
});

const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
});

export const env = parsedCore.data;

export function getOpenAIEnv() {
  const parsed = openAIEnvSchema.safeParse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
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
