import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** Generous allowance for normal back-and-forth with the assistant. */
export const CHAT_REQUESTS_PER_MINUTE = 50;

/** Per bubble — enough for long questions (Arabic/English). */
export const CHAT_MAX_MESSAGE_CHARS = 6_000;

/** Prevents oversized conversation payloads. */
export const CHAT_MAX_MESSAGES = 40;

/** Cap total characters across the conversation (Gemini payload + abuse guard). */
export const CHAT_MAX_TOTAL_CHARS = 100_000;

/** How long the in-memory window lasts (fallback when Upstash is not configured). */
const MEMORY_WINDOW_MS = 60_000;

type RateLimitOutcome = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  usingUpstash: boolean;
};

/** Result of applying rate limits — production refuses in-memory fallback unless explicitly opted in. */
export type LimitChatRequestsResult =
  | { ok: true; outcome: RateLimitOutcome }
  | { ok: false; reason: "redis_required" };

function trimPair(
  url: string | undefined,
  token: string | undefined
): { url: string; token: string } | null {
  const u = url?.trim();
  const t = token?.trim();
  if (!u || !t) return null;
  return { url: u, token: t };
}

/**
 * Upstash REST-compatible credentials (same wire format as Vercel KV / linked Redis).
 */
function resolveRedisRestCredentials(): { url: string; token: string } | null {
  return (
    trimPair(
      process.env.UPSTASH_REDIS_REST_URL,
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) ??
    trimPair(process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN) ??
    trimPair(process.env.REDIS_REST_URL, process.env.REDIS_REST_TOKEN)
  );
}

let distributedRatelimiter: Ratelimit | null | undefined;

function getDistributedRatelimiter(): Ratelimit | null {
  if (distributedRatelimiter !== undefined) return distributedRatelimiter;

  const cfg = resolveRedisRestCredentials();
  if (!cfg) {
    distributedRatelimiter = null;
    return null;
  }

  const redis = new Redis(cfg);
  distributedRatelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(CHAT_REQUESTS_PER_MINUTE, "60 s"),
    analytics: false,
    prefix: "portfolio:chat",
  });
  return distributedRatelimiter;
}

/** Opt into unsafe per-instance memory limiting on serverless (not recommended). */
function allowInMemoryRateLimitInProduction(): boolean {
  const v =
    process.env.CHAT_ALLOW_IN_MEMORY_RATE_LIMIT?.trim().toLowerCase() ?? "";
  return v === "1" || v === "true" || v === "yes";
}

const memoryBuckets = new Map<string, number[]>();

function memorySlidingApprox(ip: string): RateLimitOutcome {
  const now = Date.now();
  const cutoff = now - MEMORY_WINDOW_MS;

  let timestamps = memoryBuckets.get(ip) ?? [];
  timestamps = timestamps.filter((t) => t > cutoff);

  const limit = CHAT_REQUESTS_PER_MINUTE;
  if (timestamps.length >= limit) {
    const oldest = timestamps[0]!;
    const reset = oldest + MEMORY_WINDOW_MS;
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
      usingUpstash: false,
    };
  }

  timestamps.push(now);
  memoryBuckets.set(ip, timestamps);
  const reset = timestamps[0]! + MEMORY_WINDOW_MS;

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - timestamps.length),
    reset,
    usingUpstash: false,
  };
}

/**
 * Stable client identifier (Vercel / proxies use X-Forwarded-For).
 */
export function getChatClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "";
}

export async function limitChatRequests(
  ip: string
): Promise<LimitChatRequestsResult> {
  const key = ip || "anonymous";

  const distributed = getDistributedRatelimiter();

  if (distributed) {
    const res = await distributed.limit(key);
    return {
      ok: true,
      outcome: {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
        usingUpstash: true,
      },
    };
  }

  if (
    process.env.NODE_ENV === "production" &&
    !allowInMemoryRateLimitInProduction()
  ) {
    console.error(
      "[chat-rate-limit] Missing Redis REST credentials for distributed rate limiting. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (Upstash), or KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV). For local-only hacks, CHAT_ALLOW_IN_MEMORY_RATE_LIMIT=true enables unsafe in-memory limiting on serverless."
    );
    return { ok: false, reason: "redis_required" };
  }

  if (
    process.env.NODE_ENV === "production" &&
    allowInMemoryRateLimitInProduction()
  ) {
    console.warn(
      "[chat-rate-limit] CHAT_ALLOW_IN_MEMORY_RATE_LIMIT is set: using per-instance memory limiter in production — not reliable when scaled."
    );
  }

  return { ok: true, outcome: memorySlidingApprox(key) };
}

export function rateLimitHeaders(outcome: RateLimitOutcome): HeadersInit {
  return {
    "X-RateLimit-Limit": String(outcome.limit),
    "X-RateLimit-Remaining": String(Math.max(0, outcome.remaining)),
    "X-RateLimit-Reset": String(Math.floor(outcome.reset / 1000)),
  };
}

export function retryAfterSeconds(outcome: RateLimitOutcome): number {
  const sec = Math.ceil((outcome.reset - Date.now()) / 1000);
  return Math.max(1, sec);
}

export type ChatRequestMessage = { role: "user" | "assistant"; content: string };

export function validateChatPayload(
  messages: unknown
): { ok: true; messages: ChatRequestMessage[] } | { ok: false; error: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "Messages array is required" };
  }
  if (messages.length > CHAT_MAX_MESSAGES) {
    return { ok: false, error: `Too many messages (max ${CHAT_MAX_MESSAGES})` };
  }

  const normalized: ChatRequestMessage[] = [];
  for (let i = 0; i < messages.length; i++) {
    const raw = messages[i];
    if (!raw || typeof raw !== "object") {
      return { ok: false, error: `Invalid message at index ${i}` };
    }

    const role = (raw as { role?: unknown }).role;
    const content = (raw as { content?: unknown }).content;

    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: `Invalid role at index ${i}` };
    }
    if (typeof content !== "string") {
      return { ok: false, error: `Invalid message content at index ${i}` };
    }

    const trimmed = content.trim();
    if (trimmed.length === 0) {
      return { ok: false, error: `Empty message at index ${i}` };
    }
    if (trimmed.length > CHAT_MAX_MESSAGE_CHARS) {
      return {
        ok: false,
        error: `Message ${i + 1} exceeds maximum length (${CHAT_MAX_MESSAGE_CHARS} characters)`,
      };
    }

    normalized.push({ role, content: trimmed });
  }

  let totalChars = 0;
  for (const m of normalized) {
    totalChars += m.content.length;
    if (totalChars > CHAT_MAX_TOTAL_CHARS) {
      return {
        ok: false,
        error: `Conversation exceeds maximum size (${CHAT_MAX_TOTAL_CHARS} characters)`,
      };
    }
  }

  return { ok: true, messages: normalized };
}
