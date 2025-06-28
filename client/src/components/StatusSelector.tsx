import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { getStatusColor } from '../utils/ticketUtils';
import axios from 'axios'
// A type for the props we'll pass to this component
import type { StatusSelectorProps } from '../types/StatusSelectorProps';

// The list of possible statuses
const STATUS_OPTIONS = ['open', 'in-progress', 'closed'];

export default function StatusSelector({ ticketId, initialStatus, onStatusUpdated }: StatusSelectorProps) {
  // State to manage the currently selected status in the UI
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  // State to handle the loading spinner during the API call
  const [isLoading, setIsLoading] = useState(false);

  // This function is called when the user selects a new status
  const handleStatusChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    
    // Immediately show the change in the UI (Optimistic Update)
    setCurrentStatus(newStatus as 'open' | 'in-progress' | 'closed');
    setIsLoading(true);

    try {
      // --- API ROUTE CALL ---
      // This is where you call your backend to update the database.
      const response = await axios.put('http://localhost:3000/api/tickets/updateStatus', {
          ticketId: ticketId, // Or PATCH
          status: newStatus,
        },{
          withCredentials: true
        }
      );

      const updatedTicket = response.data;
      
      // Tell the parent Dashboard component about the successful update
      onStatusUpdated(ticketId, updatedTicket.status);

    } catch (error) {
      console.error("Error updating ticket status:", error);
      // If there was an error, revert the dropdown back to its original state
      setCurrentStatus(initialStatus);
      // Optionally, show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center mr-4">
      <div className={`w-3 h-3 rounded-full mr-4 mt-1.49 ${getStatusColor(currentStatus)} transition-colors`} />
      
      {/* The styled dropdown select element */}
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isLoading} // Disable the dropdown while updating
        className={`
          -ml-2 -my-1 pl-5 pr-7 py-1
          text-s capitalize rounded-lg appearance-none bg-transparent 
          text-white/70 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-purple-400
          transition-all duration-200
          ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
        `}
        // This prevents the click on the select from triggering the card's onExpand
        onClick={(e) => e.stopPropagation()} 
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status} className="bg-slate-800 text-white">
            {status.replace('-', ' ')}
          </option>
        ))}
      </select>
      
      {/* A custom dropdown arrow */}
      <div className="absolute right-1 top-5/9 -translate-y-1/2 text-white/50 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </div>

      {isLoading && (
         <div className="absolute -right-5 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
      )}
    </div>
  );
}
