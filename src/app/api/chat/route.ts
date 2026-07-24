import { NextResponse } from 'next/server';
import { getProjects } from '../../../lib/api/glio-projects';
import { notifyOwnerViaTelegram } from '../../../lib/telegram';
import { saveSessionMapping, enableHandoffMode, isHandoffMode } from '../../../lib/redis';

const BASE_SYSTEM_PROMPT = `Namamu adalah Sedia AI, asisten virtual resmi untuk SejatiDimedia (sejatidimedia.web.id). 
SejatiDimedia adalah software agency & media command center premium berbasis di Balikpapan, Indonesia. Dikelola oleh Timur Dian Radha Sejati.

Layanan utama yang ditawarkan (Paket Harga):
1. Starter (MVP Prototype): Cocok untuk validasi ide/produk tahap awal. Estimasi pengerjaan 2-4 minggu. Harga: Mulai dari Rp 3.000.000 - Rp 7.000.000+ per proyek.
2. Growth (Production Ready): Cocok untuk bisnis yang siap rilis publik dengan fitur lengkap & backend. Harga: Mulai dari Rp 10.000.000+ per proyek.
3. Custom (Sistem Kompleks): Untuk kebutuhan sistem skala besar atau Enterprise. Harga: Custom (Disesuaikan dengan cakupan/scope proyek).

Filosofi kami: Premium, High-Performance, Minimalist, dan Modern.
Teknologi yang sering digunakan: Next.js, React, Node.js, Tailwind CSS, TypeScript, dll.`;

const ANTI_HALLUCINATION_RULES = `
Aturan menjawab & Anti-Halusinasi (SANGAT PENTING!):
1. Jawab dengan ramah, profesional, elegan, namun tetap singkat (jangan terlalu panjang lebar). Gunakan Bahasa Indonesia.
2. JANGAN PERNAH mengarang atau membuat-buat portofolio palsu! Jika user bertanya apakah pernah membuat aplikasi A, dan itu ada kaitannya/mirip dengan daftar di atas, sebutkan dan jelaskan portofolio tersebut. 
3. Jika ditanya aplikasi yang TIDAK ADA kaitannya sama sekali dengan daftar portofolio di atas (misal: game 3D, crypto), jawab dengan jujur: "Saat ini kami belum memiliki portofolio publik untuk jenis aplikasi tersebut, namun kami sangat terbuka dan memiliki kapasitas teknis untuk mendiskusikan kebutuhan sistem Anda lebih lanjut."
4. Jika user bertanya tentang harga proyek, ketersediaan, atau memulai kerja sama, arahkan mereka untuk mengisi Formulir Kontak di bawah layar (Konsultasi Gratis).
5. Gunakan format Markdown (bold, bullet) agar rapi.
`;

export async function POST(req: Request) {
  try {
    const { history, message, session_id } = await req.json();

    // Check if user is already in Handoff (Human) mode
    const inHandoff = session_id ? await isHandoffMode(session_id) : false;

    // HANDOFF LOGIC
    if (message.trim().toLowerCase() === '/end') {
      if (session_id) {
        const { disableHandoffMode } = await import('../../../lib/redis');
        await disableHandoffMode(session_id);
        
        // Notify owner on Telegram that the client ended the chat
        const telegramText = `🔴 *Klien Mengakhiri Sesi Chat*\n\nSession ID: \`${session_id}\`\nSedia AI telah mengambil alih percakapan kembali.`;
        try {
          await notifyOwnerViaTelegram(telegramText);
        } catch(e) {}
      }
      return NextResponse.json({ 
        response: "Sesi percakapan langsung dengan Tim SejatiDimedia telah diakhiri. Saya (Sedia AI) kembali siap membantu Anda! 🤖",
        isHandoff: false
      });
    }

    if (message.toLowerCase().startsWith('/chatowner') || inHandoff) {
      if (!session_id) {
        return NextResponse.json({ response: "Maaf, sesi Anda tidak valid (Session ID kosong). Coba muat ulang halaman.", isHandoff: false });
      }

      // If this is the FIRST time triggering handoff
      if (message.toLowerCase().startsWith('/chatowner')) {
        const clientName = message.substring(10).trim() || 'Klien Baru';

        // Format summary of chat for the owner
        const chatSummary = Array.isArray(history) 
          ? history.map((msg: any) => `${msg.role === 'user' ? '👤 User' : '🤖 AI'}: ${msg.text}`).join('\n')
          : '';
        
        const telegramText = `🔔 *Request Chat dari ${clientName}*\n\n*Session ID:* \`${session_id}\`\n\n*Riwayat Chat Singkat:*\n${chatSummary.substring(chatSummary.length - 1000)}\n\n_Balas pesan ini untuk merespons user secara langsung._`;

        try {
          const tgResponse = await notifyOwnerViaTelegram(telegramText);
          // Save mapping message_id -> session_id
          await saveSessionMapping(tgResponse.message_id, session_id);
          // Lock user into human handoff mode for 2 hours
          await enableHandoffMode(session_id);
          
          return NextResponse.json({ 
            response: "Baik, saya akan sampaikan pesan Anda ke tim kami. Mohon tunggu sebentar ya, mereka akan segera membalas langsung di sini.",
            isHandoff: true
          });
        } catch (err) {
          console.error("Handoff failed:", err);
          return NextResponse.json({ response: "Mohon maaf, sistem notifikasi ke tim kami sedang bermasalah. Silakan isi form kontak di bawah layar.", isHandoff: false });
        }
      } 
      
      // If user is ALREADY in handoff mode, just forward their message directly
      else {
        const telegramText = `💬 *Balasan dari User (${session_id.substring(0,6)}...)*\n\n"${message}"`;
        
        try {
          const tgResponse = await notifyOwnerViaTelegram(telegramText);
          await saveSessionMapping(tgResponse.message_id, session_id);
          
          // Don't return an AI text response, just acknowledge receipt
          return NextResponse.json({ response: "_Pesan terkirim ke Tim SejatiDimedia..._", isHandoff: true });
        } catch (err) {
          console.error("Handoff forwarding failed:", err);
          return NextResponse.json({ response: "Mohon maaf, pesan Anda gagal terkirim ke tim kami. Coba beberapa saat lagi.", isHandoff: true });
        }
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key belum dikonfigurasi. Silakan tambahkan OPENROUTER_API_KEY di .env.local" },
        { status: 500 }
      );
    }

    // Fetch actual live projects from the CMS/API
    const liveProjects = await getProjects();
    const projectsListStr = liveProjects.map((p, index) => {
      const summary = p.summaryId || p.summary || p.descriptionId || p.description || "";
      return `${index + 1}. ${p.name}: ${summary} (Kategori: ${p.categories.join(', ')})`;
    }).join('\\n');

    const dynamicSystemPrompt = `${BASE_SYSTEM_PROMPT}\\n\\nDaftar Portofolio/Proyek yang pernah dikerjakan SejatiDimedia:\\n${projectsListStr}\\n${ANTI_HALLUCINATION_RULES}`;

    // Format history for OpenRouter (OpenAI format)
    const messages = [
      { role: 'system', content: dynamicSystemPrompt },
      { role: 'assistant', content: 'Paham. Saya siap menjadi Sedia AI, asisten profesional SejatiDimedia.' }
    ];

    if (Array.isArray(history)) {
      history.forEach((msg: any) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    messages.push({ role: 'user', content: message });

    const modelsToTry = [
      "google/gemma-4-31b-it:free",
      "google/gemma-4-26b-a4b-it:free",
      "google/gemini-2.0-flash-exp:free"
    ];

    let aiMessage = "Maaf, saya tidak bisa membalas saat ini.";
    let success = false;

    for (const modelName of modelsToTry) {
      if (success) break;

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://sejatidimedia.web.id", 
            "X-Title": "SejatiDimedia", 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: messages,
          })
        });

        const data = await response.json();
        
        if (response.ok && data.choices?.[0]?.message?.content) {
          aiMessage = data.choices[0].message.content;
          success = true;
        } else {
          console.warn(`Model ${modelName} failed:`, data.error?.message);
        }
      } catch (err) {
        console.warn(`Fetch error for ${modelName}:`, err);
      }
    }

    if (!success) {
      throw new Error("Semua server AI gratis sedang sibuk (Provider returned error). Coba lagi beberapa saat.");
    }

    return NextResponse.json({ response: aiMessage, isHandoff: false });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: `Maaf, terjadi kesalahan: ${error.message || error}` },
      { status: 500 }
    );
  }
}
