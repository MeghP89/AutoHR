export type Ticket = {
  _id: string;
  title: string;
  summary: string;
  intent: string;
  priority: string;
  status: 'open' | 'in-progress' | 'closed';
  sender: string;
  createdAt: Date;
};