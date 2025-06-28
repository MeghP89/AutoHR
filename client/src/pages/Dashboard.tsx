// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketCard from '../components/TicketCard';
import type {Ticket} from '../types/Ticket'
import TicketStats from '../components/TicketStats';
import FilterTabs from '../components/FilterTabs';
import LastUpdated from '../components/LastUpdated';
import TicketDetailModal from '../components/TicketDetailModal'; // Import the new modal

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  const fetchTickets = async () => {
    try {
        console.log('📥 Fetching tickets...');
        const res = await axios.get('http://localhost:3000/api/tickets/getTicketsByUserId', { withCredentials: true });
        console.log('✅ Tickets received:', res.data);
        setTickets(res.data);
        setLastUpdateTime(new Date());
    } catch (error) {
        console.error('❌ Error fetching tickets:', error);
    }
  };


  useEffect(() => {
    fetchTickets();
  }, []);
  // This function will be called by the StatusSelector after a successful API update.
  const handleStatusUpdated = (ticketId: string, newStatus: string) => {
    setTickets(currentTickets => 
      currentTickets.map(ticket => 
        ticket._id === ticketId 
          ? { ...ticket, status: newStatus as 'open' | 'in-progress' | 'closed' } 
          : ticket
      )
    );
  };

  const filteredTickets = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const getStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length,
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Floating Background Bubbles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
              i === 0 ? 'top-1/4 left-1/4 w-64 h-64 bg-purple-500' :
              i === 1 ? 'top-3/4 right-1/4 w-72 h-72 bg-blue-500' :
                        'bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500'
            }`}
          />
        ))}
      </div>

    {/* Floating particles */}
    {[...Array(30)].map((_, i) => (
        <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10"
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationName: 'float',
                animationDuration: '8s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${Math.random() * 5}s`,
            }}
        />
    ))}

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Support Dashboard</h1>
              <p className="text-white/70 text-lg">Manage and track support tickets</p>
            </div>
            <LastUpdated updateTimestamp={lastUpdateTime}/>
          </div>

          <TicketStats stats={stats} />
          <FilterTabs filter={filter} setFilter={setFilter} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {filteredTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} onExpand={() => setSelectedTicket(ticket)} onStatusUpdated={handleStatusUpdated} />
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/50 text-lg">No tickets found for this filter</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
