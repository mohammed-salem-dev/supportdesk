import { UserRole, TicketStatus, TicketPriority, TicketCategory } from '@prisma/client';

export type { UserRole, TicketStatus, TicketPriority, TicketCategory };

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdById: string;
  assignedToId: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  closedAt: Date | null;
  createdBy?: User;
  assignedTo?: User | null;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  ticketId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  description: string;
  createdAt: Date;
  user?: User;
}

export interface AnalyticsData {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  averageResponseTime: number;
  ticketsByCategory: { category: string; count: number }[];
  ticketsByPriority: { priority: string; count: number }[];
  recentActivity: TicketActivity[];
}
