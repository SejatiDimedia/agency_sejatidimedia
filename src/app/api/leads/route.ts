import { NextResponse } from 'next/server';
import { createLeadSchema } from '@/lib/validations/lead';
import { checkRateLimit } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';
import { INITIAL_LEADS } from '@/lib/portalMockData';
import { sendInquiryReceivedEmail } from '@/lib/email';
import { notifyOwnerViaTelegram } from '@/lib/telegram';


// Fallback memory store when DATABASE_URL is not connected
let memoryLeads = [...INITIAL_LEADS];

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Parse & Validate Payload
    const body = await request.json();
    const validationResult = createLeadSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Input tidak valid';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, service, scale, message, honeypot } = validationResult.data;

    // 2. Deduplication Check (Ignore duplicate requests sent within 30 seconds)
    try {
      const existingRecentLead = await prisma.lead.findFirst({
        where: {
          email,
          message,
          createdAt: { gte: new Date(Date.now() - 30000) },
        },
      });

      if (existingRecentLead) {
        return NextResponse.json(
          {
            success: true,
            message: 'Pesan Anda telah diterima. Tim SejatiDimedia akan segera merespons!',
            leadId: existingRecentLead.id,
          },
          { status: 200 }
        );
      }
    } catch {
      // Continue if DB offline
    }

    // 3. IP Rate Limiting Check (Max 5 per hour)
    const rateLimit = checkRateLimit(ip, 5, 3600000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Batas pengiriman pesan tercapai (maksimal 5 kali/jam per IP).' },
        { status: 429 }
      );
    }

    // 3. Honeypot Bot Detection Check
    const isBotSpam = Boolean(honeypot && honeypot.length > 0);
    const initialStatus = isBotSpam ? 'SPAM' : 'NEW';

    // 4. Store Lead (Prisma or Fallback Store)
    let createdLead;
    try {
      createdLead = await prisma.lead.create({
        data: {
          name,
          email,
          service,
          scale: scale || 'small',
          message,
          status: isBotSpam ? 'SPAM' : 'NEW',
          honeypot: honeypot || null,
          ipAddress: ip,
        },
      });
    } catch {
      // Fallback in-memory lead creation for local dev without DB
      const newLeadId = `lead-${Date.now()}`;
      createdLead = {
        id: newLeadId,
        name,
        company: 'Personal / Direct Inquiry',
        email,
        phone: '-',
        serviceType: service as any,
        budgetEstimate: 'Rp 20M - 40M',
        submittedDate: 'Hari ini',
        status: initialStatus === 'SPAM' ? ('Spam' as const) : ('New' as const),
        notes: isBotSpam ? 'Ditandai SPAM otomatis via honeypot bot filter.' : '',
        source: 'Website Form' as const,
        message,
        timelineHistory: [
          {
            id: `tl-${Date.now()}`,
            status: initialStatus === 'SPAM' ? ('Spam' as const) : ('New' as const),
            timestamp: new Date().toLocaleString('id-ID'),
            author: 'System (Contact Form)',
          },
        ],
      };
      memoryLeads = [createdLead as any, ...memoryLeads];
    }

    // 5. Send Autoresponder Email (only if not spam)
    if (initialStatus !== 'SPAM') {
      try {
        const emailResult = await sendInquiryReceivedEmail({
          to: email,
          name,
          service,
          message,
        });
        if (!emailResult.success) {
          console.error('❌ [Autoresponder Fail] Email not sent:', emailResult.error);
        } else {
          console.log('✅ [Autoresponder Success] Email sent successfully!', emailResult.messageId || 'Simulated');
        }
      } catch (emailErr) {
        console.error('❌ [Autoresponder Catch Error] Exception thrown:', emailErr);
      }
    }

    // 6. Notify Owner via Telegram (only if not spam)
    if (initialStatus !== 'SPAM') {
      try {
        const tgText = `🔔 *Pengajuan Project Baru!*\n\n*Nama:* ${name}\n*Email:* ${email}\n*Layanan:* ${service}\n*Skala Proyek:* ${scale || 'Medium'}\n\n*Pesan:*\n"${message}"\n\n_Cek dashboard admin untuk detail selengkapnya._`;
        const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard`;
        await notifyOwnerViaTelegram(tgText + `\n\n*Link:* ${dashboardLink}`);
        console.log('✅ [Telegram Notification] Sent successfully!');
      } catch (tgErr) {
        console.error('❌ [Telegram Notification Fail] Error sending telegram alert:', tgErr);
      }
    }


    return NextResponse.json(
      {
        success: true,
        message: 'Pesan Anda berhasil dikirim. Tim SejatiDimedia akan segera merespons!',
        leadId: createdLead.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
