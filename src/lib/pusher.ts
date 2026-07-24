import PusherServer from 'pusher';

const appId = process.env.PUSHER_APP_ID;
const key = process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.PUSHER_CLUSTER;

// Initialize Pusher Server Client
export const pusherServer = appId && key && secret && cluster ? new PusherServer({
  appId: appId,
  key: key,
  secret: secret,
  cluster: cluster,
  useTLS: true,
}) : null;

/**
 * Broadcast message to a specific session channel
 * @param sessionId - The user's session ID (channel name)
 * @param eventName - The event name (e.g. 'owner_reply')
 * @param data - Payload to send
 */
export async function broadcastToSession(sessionId: string, eventName: string, data: any) {
  if (!pusherServer) {
    console.warn("Pusher is not configured. Failed to broadcast message.");
    return;
  }
  
  // Trigger event on the public channel 'session-<id>' (since UUIDs are unguessable)
  await pusherServer.trigger(`session-${sessionId}`, eventName, data);
}
