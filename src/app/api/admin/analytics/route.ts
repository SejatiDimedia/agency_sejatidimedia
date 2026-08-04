import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Calculate Conversion Rate
    const totalLeads = await prisma.lead.count({
      where: {
        NOT: { status: 'SPAM' }
      }
    });

    const wonLeads = await prisma.lead.count({
      where: { status: 'WON' }
    });

    const conversionRate = totalLeads > 0 ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1)) : 0;

    // 2. Average Conversion Time
    const wonLeadsDates = await prisma.lead.findMany({
      where: { status: 'WON' },
      select: {
        createdAt: true,
        statusSetAt: true,
      }
    });

    let totalConversionHours = 0;
    let validWonCount = 0;

    for (const lead of wonLeadsDates) {
      if (lead.statusSetAt && lead.createdAt) {
        const diffMs = lead.statusSetAt.getTime() - lead.createdAt.getTime();
        // Prevent negative or weird values
        if (diffMs >= 0) {
          totalConversionHours += diffMs / (1000 * 60 * 60);
          validWonCount++;
        }
      }
    }

    const averageConversionDays = validWonCount > 0 
      ? parseFloat((totalConversionHours / validWonCount / 24).toFixed(1))
      : 0;

    // 3. Leads Per Month (Last 6 Months)
    // We get all leads created in the last 6 months to construct the trend chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const leadsRecent = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        },
        NOT: { status: 'SPAM' }
      },
      select: {
        createdAt: true
      }
    });

    // Initialize map of the last 6 months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const monthlyMap: { [key: string]: number } = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      monthlyMap[label] = 0;
    }

    // Populate counts
    for (const lead of leadsRecent) {
      const d = new Date(lead.createdAt);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      if (monthlyMap[label] !== undefined) {
        monthlyMap[label]++;
      }
    }

    const leadsPerMonth = Object.keys(monthlyMap).map(key => ({
      month: key,
      count: monthlyMap[key]
    }));

    return NextResponse.json({
      success: true,
      metrics: {
        conversionRate,
        totalLeads,
        wonLeads,
        averageConversionDays,
        leadsPerMonth,
      }
    });
  } catch (error: any) {
    console.error('[GET /api/admin/analytics Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
