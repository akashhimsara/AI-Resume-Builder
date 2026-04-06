import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getUpstashEnv } from "@/lib/env";

const env = getUpstashEnv();

let redisClient: Redis | null = null;
let aiRateLimiter: Ratelimit | null = null;

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Limit IP/User to 5 requests per 1 minute (Sliding Window avoids burst spam)
  aiRateLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/ai",
  });
}

/**
 * Validates if the given user is allowed to make an AI request.
 * If UPSTASH_REDIS_REST_URL is not set, this will always return { success: true }.
 */
export async function enforceAIRateLimit(userId: string) {
  if (!aiRateLimiter) {
    // Gracefully degrade to un-limited if Redis is not configured.
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  const result = await aiRateLimiter.limit(`ai_usage_${userId}`);
  return result;
}
