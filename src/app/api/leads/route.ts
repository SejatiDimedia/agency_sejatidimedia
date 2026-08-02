import { NextResponse } from 'next/server';
import { createLeadSchema } from '@/lib/validations/lead';
import { checkRateLimit } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';
import { INITIAL_LEADS } from '@/lib/portalMockData';

// Fallback memory store when DATABASE_URL is not connected
let memoryLeads = [...INITIAL_LEADS];

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting Check (Max 3 per hour)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 3, 3600000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Batas pengiriman pesan tercapai (maksimal 3 kali/jam per IP).' },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await request.json();
    const validationResult = createLeadSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Input tidak valid';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, service, scale, message, honeypot } = validationResult.data;

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
        status: initialStatus === 'SPAM' ? ('Lost/Spam' as const) : ('New' as const),
        notes: isBotSpam ? 'Ditandai SPAM otomatis via honeypot bot filter.' : '',
        source: 'Website Form' as const,
        message,
        timelineHistory: [
          {
            id: `tl-${Date.now()}`,
            status: initialStatus === 'SPAM' ? ('Lost/Spam' as const) : ('New' as const),
            timestamp: new Date().toLocaleString('id-ID'),
            author: 'System (Contact Form)',
          },
        ],
      };
      memoryLeads = [createdLead as any, ...memoryLeads];
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
