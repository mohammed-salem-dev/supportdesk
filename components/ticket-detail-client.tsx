'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Clock, User, MessageSquare, Activity } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface TicketDetailClientProps {
  ticketId: string;
  userRole: string;
  userId: string;
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

export function TicketDetailClient({ ticketId, userRole, userId }: TicketDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);

  const canEdit = userRole === 'admin' || userRole === 'agent';

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      const data = await response.json();

      if (response.ok) {
        setTicket(data.ticket);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to load ticket',
          variant: 'destructive',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Fetch ticket error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load ticket',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgents = async () => {
    if (userRole === 'admin' || userRole === 'agent') {
      try {
        const response = await fetch('/api/users?role=agent');
        const data = await response.json();
        if (response.ok) {
          setAgents(data.users || []);
        }
      } catch (error) {
        console.error('Fetch agents error:', error);
      }
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchAgents();
  }, [ticketId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, content: comment }),
      });

      if (response.ok) {
        setComment('');
        fetchTicket();
        toast({
          title: 'Success',
          description: 'Comment added successfully',
        });
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to add comment',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Add comment error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTicket = async (field: string, value: any) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        fetchTicket();
        toast({
          title: 'Success',
          description: 'Ticket updated successfully',
        });
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to update ticket',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Update ticket error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Tickets
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{ticket.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">Ticket ID: #{ticket.id.slice(-8)}</p>
                  </div>
                  <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                    {ticket.priority}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {categoryLabels[ticket.category as keyof typeof categoryLabels]}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{ticket.createdBy?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-xl font-semibold">
                  Comments ({ticket.comments?.length || 0})
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {ticket.comments?.map((comment: any) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user?.image || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {comment.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.user?.name}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {comment.user?.role}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddComment} className="space-y-4 border-t pt-6">
                <Label htmlFor="comment">Add a comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Type your comment here..."
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {canEdit && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Ticket Management</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={ticket.status}
                    onValueChange={(value) => handleUpdateTicket('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={ticket.priority}
                    onValueChange={(value) => handleUpdateTicket('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {userRole === 'admin' && agents?.length > 0 && (
                  <div className="space-y-2">
                    <Label>Assign to Agent</Label>
                    <Select
                      value={ticket.assignedToId || 'unassigned'}
                      onValueChange={(value) =>
                        handleUpdateTicket('assignedToId', value === 'unassigned' ? null : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Activity</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.activities?.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{activity.user?.name}</p>
                      <p className="text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
