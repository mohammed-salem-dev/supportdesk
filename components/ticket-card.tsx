'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: any;
  userRole: string;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

const categoryLabels = {
  technical_issue: 'Technical Issue',
  billing: 'Billing',
  feature_request: 'Feature Request',
  general_inquiry: 'General Inquiry',
};

export function TicketCard({ ticket, userRole }: TicketCardProps) {
  return (
    <Link href={`/dashboard/tickets/${ticket.id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-2">{ticket.title}</h3>
              <p className="text-xs text-gray-500 mt-1">#{ticket.id.slice(-8)}</p>
            </div>
            <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
              {ticket.priority}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">
                {categoryLabels[ticket.category as keyof typeof categoryLabels]}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4 border-t">
          <div className="flex items-center justify-between w-full text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="truncate">{ticket.createdBy?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs">
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          {ticket.assignedTo && (
            <div className="flex items-center gap-2 w-full text-sm">
              <Avatar className="h-6 w-6">
                <AvatarImage src={ticket.assignedTo?.image || ''} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {ticket.assignedTo?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-600 text-xs truncate">
                Assigned to {ticket.assignedTo?.name}
              </span>
            </div>
          )}

          {ticket.comments?.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MessageSquare className="h-3 w-3" />
              <span>{ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
