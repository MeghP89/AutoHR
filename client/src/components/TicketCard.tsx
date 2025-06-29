// src/components/TicketCard.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { getPriorityBorderColor, getPriorityColor, getStatusColor, getIntentText } from '../utils/ticketUtils';
import StatusSelector from './StatusSelector';
import type { Ticket } from '../types/Ticket';
import axios from 'axios';

type Props = {
  ticket: Ticket;
  onStatusUpdated: (ticketId: string, newStatus: string) => void; 
};

export default function TicketCard({ ticket, onStatusUpdated }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [emailSent, setEmailSent] = useState(null);

  const sendEmail = async (ticket: Ticket) => {
    try {
      const res = await axios.post('http://localhost:3000/api/sendEmail', { ticket });
      setEmailSent(res.data.email);
      } catch (error) {
      console.error('❌ Failed to send email:', error);
    }
  };

  const handleExpand = () => {
    setExpanded(prev => !prev);
  }

  return (
    <motion.div
      layoutId={`ticket-card-${ticket._id}`} // This is crucial for the animation
      onClick={handleExpand} // Call the passed-in onExpand function on click
      className={`
        relative cursor-pointer
        p-5 rounded-xl 
        bg-white/5 backdrop-blur-sm 
        transition-colors duration-300 
        border-2 
        ${getPriorityBorderColor(ticket.priority)} 
        hover:border-purple-400/30
      `}
      whileHover={{ scale: 1.02 }} // A subtle hover effect
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

      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
          marginTop: isExpanded ? '1rem' : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="border-t border-white/20 pt-4" onClick={(e) => e.stopPropagation()}>
          <h4 className="font-semibold text-white mb-2">Relevant User Info</h4>
          <p className="text-white/80 whitespace-pre-wrap mb-3">
            {ticket.relevantUserinfo}
          </p>
          <h4 className="font-semibold text-white mb-2">Suggested Action</h4>
          <p className="text-white/80 whitespace-pre-wrap mb-3">
            {ticket.suggestedSolution}
          </p>
          {ticket.status === 'in-progress' ? <div className="mt-4 flex gap-4">
            <button onClick={()=>sendEmail(ticket)} className="bg-purple-500/80 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Fulfill With Agent
            </button>
          </div> : <p className="text-red-400/70 text-sm mb-2 line-clamp-2">Mark as In Progress for AI Agent Fulfillment Option</p>}
          {(ticket.status === 'in-progress' || ticket.status === 'closed') && emailSent ?
          <div> 
            <h4 className="font-semibold text-white mb-2">Email Has Been Sent</h4>
              <p className="text-red-400/70 text-sm mb-2 line-clamp-2"></p> 
            </div>
          : <></>}
        </div>
      </motion.div>

        {/* Hover Overlay */}
        {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl pointer-events-none"></div>
        )}

    </motion.div>
  );
}