import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data (optional - be careful in production!)
  await prisma.ticketActivity.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash('johndoe123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create agent users
  const agentPassword = await bcrypt.hash('agent123', 10);
  const agent1 = await prisma.user.create({
    data: {
      email: 'agent1@supportdesk.com',
      name: 'Sarah Johnson',
      password: agentPassword,
      role: 'agent',
    },
  });
  
  const agent2 = await prisma.user.create({
    data: {
      email: 'agent2@supportdesk.com',
      name: 'Michael Chen',
      password: agentPassword,
      role: 'agent',
    },
  });
  console.log('Created agent users');

  // Create customer users
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      name: 'Emily Davis',
      password: customerPassword,
      role: 'customer',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      name: 'David Wilson',
      password: customerPassword,
      role: 'customer',
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: 'customer3@example.com',
      name: 'Lisa Anderson',
      password: customerPassword,
      role: 'customer',
    },
  });
  console.log('Created customer users');

  // Create sample tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Unable to login to my account',
      description: 'I\'ve been trying to login for the past hour but keep getting an error message saying "Invalid credentials" even though I\'m sure my password is correct. Can you please help me reset my password or check if there\'s an issue with my account?',
      status: 'open',
      priority: 'high',
      category: 'technical_issue',
      createdById: customer1.id,
      assignedToId: agent1.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Billing discrepancy on last invoice',
      description: 'I noticed that my last invoice has charges that don\'t match my subscription plan. I\'m being charged $99 instead of the agreed $79. Please review and correct this.',
      status: 'in_progress',
      priority: 'medium',
      category: 'billing',
      createdById: customer2.id,
      assignedToId: agent2.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: 'Request for dark mode feature',
      description: 'I love using your platform, but I work mostly during night hours and would really appreciate a dark mode option. This would make the interface much easier on the eyes. Is this something you\'re planning to implement?',
      status: 'open',
      priority: 'low',
      category: 'feature_request',
      createdById: customer3.id,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      title: 'How to export data from dashboard?',
      description: 'I need to export my data for the quarterly report but can\'t find the export option in the dashboard. Could you please guide me on how to do this or point me to the documentation?',
      status: 'resolved',
      priority: 'medium',
      category: 'general_inquiry',
      createdById: customer1.id,
      assignedToId: agent1.id,
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      title: 'API integration not working',
      description: 'I\'m trying to integrate your API with our system but keep getting 401 unauthorized errors. I\'ve double-checked my API key and it seems correct. The documentation doesn\'t mention any additional authentication steps. Please help!',
      status: 'in_progress',
      priority: 'high',
      category: 'technical_issue',
      createdById: customer2.id,
      assignedToId: agent1.id,
    },
  });

  const ticket6 = await prisma.ticket.create({
    data: {
      title: 'Refund request for unused credits',
      description: 'I have $150 in unused credits that I would like to request a refund for as I\'m closing my business. According to your terms of service, unused credits are refundable within 90 days. My account was created 45 days ago.',
      status: 'closed',
      priority: 'medium',
      category: 'billing',
      createdById: customer3.id,
      assignedToId: agent2.id,
      resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      closedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('Created sample tickets');

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Thank you for reaching out. I can see the issue with your account. Let me reset your password for you.',
      ticketId: ticket1.id,
      userId: agent1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'I\'ve reviewed your invoice and you\'re correct - there was a billing error. I\'ve issued a credit for the overcharge and your next invoice will reflect the correct amount.',
      ticketId: ticket2.id,
      userId: agent2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'You can export your data by clicking on the "Export" button in the top right corner of the dashboard. It\'s next to the filter options. Let me know if you need any other assistance!',
      ticketId: ticket4.id,
      userId: agent1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Perfect! That worked. Thank you so much for the quick help!',
      ticketId: ticket4.id,
      userId: customer1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'The issue is that you need to include the API key in the Authorization header with "Bearer" prefix. Updated documentation has been sent to your email.',
      ticketId: ticket5.id,
      userId: agent1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Your refund has been processed and will appear in your original payment method within 5-7 business days. Thank you for using our service.',
      ticketId: ticket6.id,
      userId: agent2.id,
    },
  });
  console.log('Created sample comments');

  // Create activity logs
  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket1.id,
      userId: customer1.id,
      action: 'created',
      description: 'Ticket created: Unable to login to my account',
    },
  });

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket1.id,
      userId: admin.id,
      action: 'assigned',
      description: 'Ticket assigned to Sarah Johnson',
    },
  });

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket1.id,
      userId: agent1.id,
      action: 'commented',
      description: 'Added a comment',
    },
  });

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket2.id,
      userId: customer2.id,
      action: 'created',
      description: 'Ticket created: Billing discrepancy on last invoice',
    },
  });

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket2.id,
      userId: admin.id,
      action: 'updated',
      description: 'Status changed from open to in_progress',
    },
  });

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket4.id,
      userId: customer1.id,
      action: 'created',
      description: 'Ticket created: How to export data from dashboard?',
    },
  });

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket4.id,
      userId: agent1.id,
      action: 'updated',
      description: 'Status changed from open to resolved',
    },
  });

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket6.id,
      userId: agent2.id,
      action: 'updated',
      description: 'Status changed from resolved to closed',
    },
  });
  console.log('Created activity logs');

  console.log('\nSeed completed successfully!');
  console.log('\n=== Test Accounts ===');
  console.log('Admin: john@doe.com / johndoe123');
  console.log('Agent 1: agent1@supportdesk.com / agent123');
  console.log('Agent 2: agent2@supportdesk.com / agent123');
  console.log('Customer 1: customer1@example.com / customer123');
  console.log('Customer 2: customer2@example.com / customer123');
  console.log('Customer 3: customer3@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
