const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID;

/**
 * Send a notification to the owner via Telegram
 * @param text The message text to send
 * @returns The message object returned by Telegram API (includes message_id)
 */
export async function notifyOwnerViaTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_OWNER_CHAT_ID) {
    console.error("Telegram environment variables are missing.");
    throw new Error("Telegram configuration missing");
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_OWNER_CHAT_ID,
      text: text,
      parse_mode: "Markdown",
    }),
  });

  const data = await response.json();
  
  if (!data.ok) {
    console.error("Telegram API Error:", data);
    throw new Error(`Failed to send Telegram message: ${data.description}`);
  }

  return data.result;
}
