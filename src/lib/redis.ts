import { Redis } from '@upstash/redis';

// Validate environment variables
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Upstash Redis client
// If the env vars are missing, we mock it or throw an error based on whether it's accessed
export const redis = url && token ? new Redis({
  url: url,
  token: token,
}) : null;

/**
 * Save session mapping in Redis with expiration
 * @param messageId - Telegram message ID
 * @param sessionId - User session ID
 */
export async function saveSessionMapping(messageId: number, sessionId: string) {
  if (!redis) throw new Error("Upstash Redis is not configured");
  
  // Save mapping: telegram_message_id -> session_id
  // Expire in 24 hours (86400 seconds)
  await redis.set(`msg_session_${messageId}`, sessionId, { ex: 86400 });
}

/**
 * Retrieve session ID from Telegram message ID
 * @param messageId - Telegram message ID
 * @returns sessionId or null
 */
export async function getSessionIdByMessage(messageId: number): Promise<string | null> {
  if (!redis) throw new Error("Upstash Redis is not configured");
  
  const sessionId = await redis.get(`msg_session_${messageId}`);
  return sessionId as string | null;
}

/**
 * Enable Human Handoff mode for a session
 * @param sessionId - User session ID
 */
export async function enableHandoffMode(sessionId: string) {
  if (!redis) return;
  // Set handoff mode to true, expires in 2 hours (7200 seconds)
  await redis.set(`handoff_${sessionId}`, "true", { ex: 7200 });
}

/**
 * Check if a session is in Human Handoff mode
 * @param sessionId - User session ID
 */
export async function isHandoffMode(sessionId: string): Promise<boolean> {
  if (!redis) return false;
  const status = await redis.get(`handoff_${sessionId}`);
  // Upstash auto-parses JSON, so it might return the boolean true instead of the string "true"
  return status === "true" || status === true;
}

/**
 * Disable Human Handoff mode for a session
 * @param sessionId - User session ID
 */
export async function disableHandoffMode(sessionId: string) {
  if (!redis) return;
  await redis.del(`handoff_${sessionId}`);
}
