import { NextResponse } from 'next/server';
import { getProjects } from '../../../lib/api/glio-projects';
import { notifyOwnerViaTelegram } from '../../../lib/telegram';
import { saveSessionMapping, enableHandoffMode, isHandoffMode } from '../../../lib/redis';

const BASE_SYSTEM_PROMPT = `Namamu adalah Sedia AI, asisten virtual resmi untuk SejatiDimedia (sejatidimedia.web.id). 
SejatiDimedia adalah software engineering agency & digital solutions command center premium berbasis di Balikpapan, Indonesia. Dikelola oleh Founder & Lead Software Engineer: Timur Dian Radha Sejati.

Identitas & Keunggulan Utama SejatiDimedia:
- Kami membangun sistem perangkat lunak siap produksi (Production-Ready), aplikasi SaaS modern, mobile apps, otomasi pabrik/industri, dan integrasi kecerdasan buatan (AI & Automation).
- Nilai Utama: Kode Bersih & Terstruktur (Clean Code), 100% Hak Cipta & Akses Penuh Source Code Klien, Tanpa Biaya Tersembunyi, serta Pendampingan & Garansi Bug Fixing Resmi Pasca-Launch.
- Client Portal Eksklusif: Klien mendapatkan dashboard portal khusus untuk memantau progress sprint, dokumen, invoice, dan timeline secara transparan.

Struktur Skema Pengembangan & Solusi:
1. Starter — MVP Prototype (Skema: Fixed Scope & Timeline, Estimasi: 2–4 Minggu):
   - Tujuan: Validasi ide bisnis atau produk baru ke pasar secara cepat dan fungsional sebelum komitmen anggaran besar.
   - Pilihan: Web App MVP ATAU Mobile App MVP.
   - Termasuk: Fitur Inti & Core Business Logic, UI/UX Responsif & Siap Rilis, Waktu Pengerjaan Cepat 2–4 Minggu.

2. Growth — Production Ready (Skema: Berdasarkan Fitur & Scope, Estimasi: 1–2 Bulan) [Paling Populer]:
   - Tujuan: Aplikasi skala penuh dengan multi-user, backend tangguh, dan integrasi lengkap untuk operasional bisnis harian.
   - Termasuk: Web App ATAU Mobile App (Android & iOS), Backend API & Database Multi-User, Autentikasi Multi-Role & Payment Gateway, Dashboard Admin & Analitik Bisnis.

3. Custom — Enterprise, Pabrik & AI (Skema: Custom Architecture & Retainer, Estimasi: Roadmap Fleksibel):
   - Tujuan: Kebutuhan sistem enterprise skala tinggi, software pabrik/industri, arsitektur multi-platform terpadu, dan otomasi berbasis AI.
   - Termasuk: Custom Architecture & Retainer, Integrasi AI/LLM & Otomasi Alur Kerja Pabrik, Infrastruktur Cloud High-Availability, Dedicated Support & SLA Khusus.

Standar di Setiap Proyek:
Semua proyek mendapatkan 100% Hak Cipta & Akses Penuh Source Code, Garansi Bug Fixing Resmi, Deployment ke Server Cloud, dan komunikasi langsung dengan developer (Direct Developer tanpa perantara).

Keahlian Teknologi (Tech Stack):
- Web & Backend: Next.js, React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, Supabase, Redis, Prisma.
- Mobile: React Native, Flutter, Expo (Android & iOS).
- AI & LLM Engineering: LangChain, LlamaIndex, n8n Workflow Automation, RAG (Retrieval-Augmented Generation), Autonomous Agents, Vector Databases (Pinecone/Qdrant/Chroma), Model Fine-Tuning, OpenAI, Claude, Groq, Gemini, Ollama.

Filosofi Desain: Premium, High-Performance, Minimalist, Airy Light Design, dan Modern.
WhatsApp Konsultasi Cepat: https://wa.me/6289508436275`;

const ANTI_HALLUCINATION_RULES = `
Aturan Menjawab & Panduan Komunikasi (SANGAT PENTING!):
1. Jawab dengan ramah, profesional, percaya diri, elegan, namun tetap padat dan to-the-point (hindari bertele-tele). Gunakan Bahasa Indonesia yang baik dan natural.
2. JANGAN PERNAH mengarang atau membuat-buat portofolio palsu! Jika user bertanya apakah pernah membuat aplikasi tertentu, hubungkan dengan portofolio yang ada di daftar di bawah. Jika belum pernah ada portofolio publik untuk jenis tersebut (misal game 3D), sampaikan dengan jujur bahwa SejatiDimedia memiliki kapasitas teknis untuk mendiskusikannya lebih lanjut.
3. JANGAN PERNAH menjanjikan estimasi waktu/harga kaku tanpa dasar. Jelaskan bahwa penentuan biaya mengacu pada 3 skema di atas (Starter MVP: Fixed Scope, Growth: Berdasarkan Scope Fitur, Custom: Retainer & Arsitektur Khusus), dan sarankan untuk berkonsultasi via WhatsApp (https://wa.me/6289508436275) atau formulir di bawah halaman.
4. Jika user ingin berbicara dengan tim manusia, arahkan mereka untuk klik tombol 'Hubungi Tim' di bagian atas jendela chat ini agar terhubung langsung ke Telegram Founder.
5. Gunakan format Markdown (bold, bullet points) agar jawaban enak dibaca.
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
        } catch (e) { }
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
          return NextResponse.json({ response: "Mohon maaf, sistem notifikasi ke tim kami sedang bermasalah. Silakan hubungi kami via WhatsApp atau isi form konsultasi.", isHandoff: false });
        }
      }

      // If user is ALREADY in handoff mode, just forward their message directly
      else {
        const telegramText = `💬 *Balasan dari User (${session_id.substring(0, 6)}...)*\n\n"${message}"`;

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

    const groqApiKey = process.env.GROQ_API_KEY;
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!groqApiKey && !openRouterApiKey && !geminiApiKey) {
      return NextResponse.json(
        { error: "API Key AI belum dikonfigurasi. Silakan tambahkan GROQ_API_KEY di .env.local untuk respon AI yang cepat dan stabil." },
        { status: 500 }
      );
    }

    // Fetch actual live projects from the CMS/API
    const liveProjects = await getProjects();
    const projectsListStr = liveProjects.map((p, index) => {
      const summary = p.summaryId || p.summary || p.descriptionId || p.description || "";
      return `${index + 1}. ${p.name}: ${summary} (Kategori: ${p.categories.join(', ')})`;
    }).join('\n');

    const dynamicSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\nDaftar Portofolio/Proyek yang pernah dikerjakan SejatiDimedia:\n${projectsListStr}\n${ANTI_HALLUCINATION_RULES}`;

    // Format history for OpenAI/Groq compatible chat completions
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

    let aiMessage = "Maaf, saya tidak bisa membalas saat ini.";
    let success = false;

    // =========================================================================
    // 1. PRIMARY: GROQ CLOUD (Ultra-fast ~800 tokens/sec & generous free tier)
    // =========================================================================
    if (groqApiKey) {
      const groqModels = [
        "qwen/qwen3.8-27b",
        "qwen/qwen3.6-27b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant"
      ];

      for (const modelName of groqModels) {
        if (success) break;

        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              messages: messages,
              temperature: 0.6,
              max_tokens: 1024,
            })
          });

          const data = await response.json();

          if (response.ok && data.choices?.[0]?.message?.content) {
            let content = data.choices[0].message.content;
            // Clean up any internal reasoning / <think> tags if model produces them
            if (content.includes('</think>')) {
              content = content.split('</think>').pop()?.trim() || content;
            }
            if (content.trim()) {
              aiMessage = content.trim();
              success = true;
            }
          } else {
            console.warn(`Groq model ${modelName} error:`, data.error?.message || data);
          }
        } catch (err) {
          console.warn(`Fetch error for Groq ${modelName}:`, err);
        }
      }
    }

    // =========================================================================
    // 2. FALLBACK: OPENROUTER (If Groq is not configured or failed)
    // =========================================================================
    if (!success && openRouterApiKey) {
      const openRouterModels = [
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemini-2.0-flash-exp:free",
        "google/gemma-4-31b-it:free",
        "google/gemma-4-26b-a4b-it:free"
      ];

      for (const modelName of openRouterModels) {
        if (success) break;

        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openRouterApiKey}`,
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
            console.warn(`OpenRouter model ${modelName} failed:`, data.error?.message);
          }
        } catch (err) {
          console.warn(`Fetch error for OpenRouter ${modelName}:`, err);
        }
      }
    }

    if (!success) {
      if (!groqApiKey) {
        throw new Error("Server AI gratis OpenRouter sedang sibuk. Masukkan GROQ_API_KEY di file .env.local untuk respon instan dan stabil.");
      }
      throw new Error("Server AI sedang mengalami kendala sementara. Silakan coba beberapa saat lagi atau hubungi kami via WhatsApp.");
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
