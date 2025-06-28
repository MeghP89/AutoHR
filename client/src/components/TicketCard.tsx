// src/components/TicketCard.tsx
import { useState } from 'react';
import { getIntentIcon, getPriorityColor, getStatusColor } from '../utils/ticketUtils';
import type { Ticket } from '../types/Ticket'

type Props = {
  ticket: Ticket;
};

export default function TicketCard({ ticket }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getIntentIcon(ticket.intent)}</span>
          <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-white/50 font-mono">#{ticket._id.slice(-8)}</span>
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 leading-tight">{ticket.title}</h3>
      <p className="text-white/70 text-sm mb-4 line-clamp-2">{ticket.summary}</p>

      <div className="flex items-center justify-between">
        <span className="text-white/60 text-sm">{ticket.sender}</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
          <span className="text-xs text-white/50 capitalize">{ticket.status.replace('-', ' ')}</span>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl pointer-events-none"></div>
      )}
    </div>
  );
}