// In-memory rate limiting store per IP address
const ipRateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, limit = 3, windowMs = 3600000): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = ipRateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    ipRateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  ipRateLimitStore.set(ip, record);
  return { success: true, remaining: limit - record.count };
}
