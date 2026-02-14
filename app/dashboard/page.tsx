import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TicketsClient } from '@/components/tickets-client';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">
            Manage and track customer support requests
          </p>
        </div>
      </div>

      <TicketsClient userRole={session?.user?.role || 'customer'} />
    </div>
  );
}
