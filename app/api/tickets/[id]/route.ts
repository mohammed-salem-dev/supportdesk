import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticketId = params.id;
    const userId = session.user.id;
    const userRole = session.user.role;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        comments: {
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
          },
          orderBy: { createdAt: 'asc' },
        },
        activities: {
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
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Check permissions
    if (userRole === 'customer' && ticket.createdById !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (
      userRole === 'agent' &&
      ticket.createdById !== userId &&
      ticket.assignedToId !== userId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update ticket
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticketId = params.id;
    const userId = session.user.id;
    const userRole = session.user.role;
    const body = await request.json();

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Check permissions
    if (userRole === 'customer' && ticket.createdById !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (
      userRole === 'agent' &&
      ticket.createdById !== userId &&
      ticket.assignedToId !== userId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    const activities: string[] = [];

    if (body.status && body.status !== ticket.status) {
      updateData.status = body.status;
      activities.push(`Status changed from ${ticket.status} to ${body.status}`);

      if (body.status === 'resolved') {
        updateData.resolvedAt = new Date();
      } else if (body.status === 'closed') {
        updateData.closedAt = new Date();
      }
    }

    if (body.priority && body.priority !== ticket.priority) {
      updateData.priority = body.priority;
      activities.push(`Priority changed from ${ticket.priority} to ${body.priority}`);
    }

    if (body.category && body.category !== ticket.category) {
      updateData.category = body.category;
      activities.push(`Category changed from ${ticket.category} to ${body.category}`);
    }

    if (body.title && body.title !== ticket.title) {
      updateData.title = body.title;
      activities.push(`Title updated`);
    }

    if (body.description && body.description !== ticket.description) {
      updateData.description = body.description;
      activities.push(`Description updated`);
    }

    // Only admin and agent can assign tickets
    if (body.hasOwnProperty('assignedToId') && (userRole === 'admin' || userRole === 'agent')) {
      if (body.assignedToId !== ticket.assignedToId) {
        updateData.assignedToId = body.assignedToId;
        if (body.assignedToId) {
          activities.push(`Ticket assigned`);
        } else {
          activities.push(`Ticket unassigned`);
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ ticket }, { status: 200 });
    }

    // Update ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Create activity logs
    for (const activity of activities) {
      await prisma.ticketActivity.create({
        data: {
          ticketId,
          userId,
          action: 'updated',
          description: activity,
        },
      });
    }

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE ticket (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ticketId = params.id;

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
