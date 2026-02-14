# SupportDesk - Customer Support Ticket System

 A modern, full-featured customer support ticket management system built with Next.js, TypeScript, and PostgreSQL. This application demonstrates professional-grade development practices with role-based access control, real-time analytics, and a beautiful user interface.

## 🌟 Features

### Core Functionality
- **Multi-Role Authentication System**
  - Email/Password authentication
  - Google SSO integration
  - Role-based access control (Admin, Agent, Customer)

- **Ticket Management**
  - Create, read, update, and track support tickets
  - Status tracking (Open, In Progress, Resolved, Closed)
  - Priority levels (Low, Medium, High)
  - Categories (Technical Issue, Billing, Feature Request, General Inquiry)
  - Ticket assignment to agents
  - Rich comment/reply system
  - Activity logging for audit trails

- **Advanced Search & Filtering**
  - Full-text search across titles, descriptions, and ticket IDs
  - Multi-parameter filtering (status, priority, category, assigned agent)
  - Real-time search results

- **Analytics Dashboard** (Admin Only)
  - Total ticket counts and metrics
  - Open/closed ratio visualization
  - Average response time calculation
  - Tickets by category (pie chart)
  - Tickets by priority (bar chart)
  - Recent activity feed

- **User Management** (Admin Only)
  - View all users with role badges
  - Change user roles dynamically
  - Track ticket creation and assignment statistics

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes (REST)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Data Visualization**: Recharts
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and Yarn
- PostgreSQL database
- Google OAuth credentials (optional, for SSO)

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
cd nextjs_space
yarn install
```

### 2. Environment Setup

The `.env` file should contain:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma Client
yarn prisma generate

# Push schema to database
yarn prisma db push

# Seed database with sample data
yarn prisma db seed
```

### 4. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Test Accounts

After seeding, the following accounts are available:

| Role     | Email                      | Password     |
|----------|----------------------------|-------------|
| Admin    | john@doe.com               | johndoe123  |
| Agent    | agent1@supportdesk.com     | agent123    |
| Agent    | agent2@supportdesk.com     | agent123    |
| Customer | customer1@example.com      | customer123 |
| Customer | customer2@example.com      | customer123 |
| Customer | customer3@example.com      | customer123 |

## 🏗️ Project Structure

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

## 🎨 Key Features Implementation

### Role-Based Access Control

The application implements three distinct roles:

- **Admin**: Full system access, can manage users, view analytics, and handle all tickets
- **Agent**: Can view and manage assigned tickets, update status, and add comments
- **Customer**: Can create tickets, view own tickets, and communicate via comments

### Google SSO Integration

To enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `{your-domain}/api/auth/callback/google`
5. Add credentials to `.env` file

### Analytics Dashboard

The analytics dashboard provides real-time insights:

- **Ticket Metrics**: Total, open, and resolved ticket counts
- **Response Time**: Average time to first response
- **Visual Charts**: Category and priority distribution
- **Activity Feed**: Recent ticket activities

## 📚 API Documentation

See [API-DOCS.md](./API-DOCS.md) for complete API documentation.

## 🗄️ Database Schema

See [SCHEMA.md](./SCHEMA.md) for detailed database schema documentation.

## 🚢 Deployment

### Build for Production

```bash
yarn build
yarn start
```

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- `DATABASE_URL`: Production database connection string
- `NEXTAUTH_SECRET`: Strong random secret
- `NEXTAUTH_URL`: Your production domain
- `GOOGLE_CLIENT_ID`: Production OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Production OAuth client secret

## 🤝 Contributing

This is a portfolio project demonstrating professional development practices. Feel free to fork and customize for your own needs.

## 📄 License

MIT License - feel free to use this project for learning or portfolio purposes.

## 👤 Author

Built as a professional portfolio project demonstrating:
- Full-stack development with Next.js
- TypeScript best practices
- Database design with Prisma
- Authentication and authorization
- Modern UI/UX design
- RESTful API development
- Data visualization
- Clean code architecture

## 🐛 Known Issues / Future Enhancements

- [ ] Email notifications for ticket updates
- [ ] File attachments for tickets
- [ ] Real-time notifications with WebSockets
- [ ] Bulk ticket operations
- [ ] Advanced reporting and exports
- [ ] Mobile app integration
- [ ] Multi-language support

---

**Note**: This application uses placeholder Google OAuth credentials. Replace them with your actual credentials for Google SSO to work in production.
