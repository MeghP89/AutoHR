// src/components/TicketStats.tsx
type Props = {
  stats: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
    urgent: number;
  };
};

export default function TicketStats({ stats }: Props) {
  const card = (label: string, value: number, color = 'text-white') => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-white/70 text-sm">{label}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {card('Total Tickets', stats.total)}
      {card('Open', stats.open, 'text-blue-400')}
      {card('In Progress', stats.inProgress, 'text-yellow-400')}
      {card('Closed', stats.closed, 'text-gray-400')}
      {card('Urgent', stats.urgent, 'text-red-400')}
    </div>
  );
}

