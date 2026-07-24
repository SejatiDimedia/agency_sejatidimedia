import { NextResponse } from 'next/server';
import { getSessionIdByMessage, disableHandoffMode } from '../../../lib/redis';
import { broadcastToSession } from '../../../lib/pusher';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if it is a new message from Telegram
    if (body.message && body.message.reply_to_message) {
      const replyMessageId = body.message.reply_to_message.message_id;
      const text = body.message.text || "Pesan diterima namun bukan berupa teks.";

      // Get session ID from Redis
      const sessionId = await getSessionIdByMessage(replyMessageId);

      if (sessionId) {
        if (text.trim().toLowerCase() === '/end') {
          // Disable handoff mode
          await disableHandoffMode(sessionId);
          // Send system notification to user
          await broadcastToSession(sessionId, 'owner_reply', { text: "Sesi percakapan langsung dengan Tim SejatiDimedia telah diakhiri. Sedia AI kembali siap membantu Anda! 🤖" });
          console.log(`Ended handoff session ${sessionId}`);
        } else {
          // Broadcast the owner's reply back to the specific chat widget session
          await broadcastToSession(sessionId, 'owner_reply', { text });
          console.log(`Successfully routed owner reply to session ${sessionId}`);
        }
      } else {
        console.warn(`No active session found for message ID ${replyMessageId}`);
      }
    }

    // Telegram requires 200 OK to stop retrying the webhook
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram Webhook Error:", error);
    // Even on error, return 200 so Telegram stops retrying and blocking queues
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
}
