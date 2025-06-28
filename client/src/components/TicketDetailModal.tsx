import { motion } from 'framer-motion';
import { getIntentText, getPriorityColor, getStatusColor } from '../utils/ticketUtils';
import type { Ticket } from '../types/Ticket';

type Props = {
  ticket: Ticket;
  onClose: () => void;
};

export default function TicketDetailModal({ ticket, onClose }: Props) {
  return (
    // The backdrop overlay
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Close modal when clicking the backdrop
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      {/* The main modal content card */}
      <motion.div
        layoutId={`ticket-card-${ticket._id}`} // MUST match the layoutId from TicketCard
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
        className="w-full max-w-3xl max-h-[90vh] bg-slate-800/80 border border-white/20 rounded-2xl p-8 overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl">{getIntentText(ticket.intent)}</span>
              <span className={`text-xl font-bold ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.toUpperCase()}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight">{ticket.title}</h2>
            <span className="text-sm text-white/50 font-mono">#{ticket._id}</span>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-3xl">&times;</button>
        </div>

        <div className="space-y-6 text-white/90">
            <p className="text-lg">{ticket.summary}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-white/60">Sender</div>
                    <div className="font-medium">{ticket.sender}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                    <div className="text-white/60">Status</div>
                    <div className="font-medium flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                        <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
                    </div>
                </div>
            </div>
            
            <div className="border-t border-white/20 pt-4">
                <h4 className="font-semibold mb-2">Submitted</h4>
                <p>{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
