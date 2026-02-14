import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TicketDetailClient } from '@/components/ticket-detail-client';
import { redirect } from 'next/navigation';

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <TicketDetailClient ticketId={params.id} userRole={session.user.role} userId={session.user.id} />
    </div>
  );
}
