Note: This repository is a sanitized demo version built for portfolio purposes. It contains no client data or secrets.

# SupportDesk - Customer Support Ticket System

 A modern, full-featured customer support ticket management system built with Next.js, TypeScript, and PostgreSQL.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes (REST)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Data Visualization**: Recharts
- **Date Handling**: date-fns


##  Project Structure

```
nextjs_space/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── analytics/          # Analytics endpoint
│   │   ├── auth/               # NextAuth routes
│   │   ├── comments/           # Comment operations
│   │   ├── tickets/            # Ticket CRUD
│   │   ├── users/              # User management
│   │   └── signup/             # User registration
│   ├── dashboard/              # Protected dashboard pages
│   │   ├── analytics/          # Admin analytics
│   │   ├── tickets/[id]/       # Ticket detail page
│   │   └── users/              # User management
│   ├── login/                  # Authentication page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                 # React components
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard-nav.tsx       # Navigation bar
│   ├── tickets-client.tsx      # Ticket list
│   ├── ticket-card.tsx         # Ticket preview
│   ├── ticket-detail-client.tsx # Ticket detail view
│   ├── analytics-client.tsx    # Analytics dashboard
│   ├── users-client.tsx        # User management
│   └── providers.tsx           # Context providers
├── lib/                        # Utility functions
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # NextAuth configuration
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Helper functions
├── prisma/                     # Database schema
│   └── schema.prisma           # Prisma schema
├── scripts/                    # Utility scripts
│   └── seed.ts                 # Database seeding
└── types/                      # Type declarations
    └── next-auth.d.ts          # NextAuth types
```

## Features Implementation

### Role-Based Access Control

The application implements three distinct roles:

- **Admin**: Full system access, can manage users, view analytics, and handle all tickets
- **Agent**: Can view and manage assigned tickets, update status, and add comments
- **Customer**: Can create tickets, view own tickets, and communicate via comments


### Analytics Dashboard

The analytics dashboard provides real-time insights:

- **Ticket Metrics**: Total, open, and resolved ticket counts
- **Response Time**: Average time to first response
- **Visual Charts**: Category and priority distribution
- **Activity Feed**: Recent ticket activities



