// src/components/TicketCard.tsx
import { useState } from 'react';
import { getPriorityBorderColor, getPriorityColor, getStatusColor, getIntentText } from '../utils/ticketUtils';
import StatusSelector from './StatusSelector';
import type { Ticket } from '../types/Ticket'

type Props = {
  ticket: Ticket;
  onExpand: () => void;
  onStatusUpdated: (ticketId: string, newStatus: string) => void;
};

export default function TicketCard({ ticket, onExpand, onStatusUpdated }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // This is the single, main container for the entire card
<div
  className={`
    relative cursor-pointer
    p-5 rounded-xl 
    bg-white/5 backdrop-blur-sm 
    transition-all duration-300 
    border-2 
    ${getPriorityBorderColor(ticket.priority)} 
    hover:border-purple-400/30
  `}
  onClick={onExpand}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>

    {/* --- All card content goes inside here --- */}

    {/* Top Row */}
    <div className="flex items-center justify-between mb-3">
        {/* Left side content */}
        <div className="flex items-center space-x-4">
            <span className="text-base font-semibold text-indigo-300">{getIntentText(ticket.intent)}</span>
            <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>{ticket.priority.toUpperCase()}</span>
        </div>
        {/* Right side content */}
        <span className="text-xs text-white/50 font-mono">
            #{ticket._id.slice(-8)}
        </span>
    </div>

    {/* Title & Summary */}
    <h3 className="text-white font-semibold text-lg mb-2 leading-tight">{ticket.title}</h3>
    <p className="text-white/70 text-sm mb-4 line-clamp-2">{ticket.summary}</p>

    {/* Bottom Row */}
    <div className="flex items-center justify-between">
        <span className="text-white/60 text-sm">{ticket.sender}</span>
        <StatusSelector 
          ticketId={ticket._id}
          initialStatus={ticket.status}
          onStatusUpdated={onStatusUpdated}
        />
    </div>

    {/* Hover Overlay */}
    {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl pointer-events-none"></div>
    )}

</div> // <-- The one and only closing tag for the main container.
  );
}