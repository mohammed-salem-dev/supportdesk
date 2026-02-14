import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get total tickets
    const totalTickets = await prisma.ticket.count();

    // Get open and closed tickets
    const openTickets = await prisma.ticket.count({
      where: {
        status: { in: ['open', 'in_progress'] },
      },
    });

    const closedTickets = await prisma.ticket.count({
      where: {
        status: { in: ['resolved', 'closed'] },
      },
    });

    // Get tickets by category
    const ticketsByCategory = await prisma.ticket.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    const categoryData = ticketsByCategory.map((item) => ({
      category: item.category,
      count: item._count.category,
    }));

    // Get tickets by priority
    const ticketsByPriority = await prisma.ticket.groupBy({
      by: ['priority'],
      _count: { priority: true },
    });

    const priorityData = ticketsByPriority.map((item) => ({
      priority: item.priority,
      count: item._count.priority,
    }));

    // Calculate average response time (time from ticket creation to first comment)
    const ticketsWithComments = await prisma.ticket.findMany({
      where: {
        comments: {
          some: {},
        },
      },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });

    let totalResponseTime = 0;
    let ticketsWithResponse = 0;

    ticketsWithComments.forEach((ticket) => {
      if (ticket.comments?.[0]) {
        const responseTime =
          ticket.comments[0].createdAt.getTime() - ticket.createdAt.getTime();
        totalResponseTime += responseTime;
        ticketsWithResponse++;
      }
    });

    const averageResponseTime =
      ticketsWithResponse > 0
        ? Math.round(totalResponseTime / ticketsWithResponse / (1000 * 60 * 60)) // in hours
        : 0;

    // Get recent activity
    const recentActivity = await prisma.ticketActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        ticket: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const analytics = {
      totalTickets,
      openTickets,
      closedTickets,
      averageResponseTime,
      ticketsByCategory: categoryData,
      ticketsByPriority: priorityData,
      recentActivity,
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
