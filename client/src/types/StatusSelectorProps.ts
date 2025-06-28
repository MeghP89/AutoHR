export type StatusSelectorProps = {
  ticketId: string;
  initialStatus: 'open' | 'in-progress' | 'closed';
  // A callback to tell the parent Dashboard to update its state
  onStatusUpdated: (ticketId: string, newStatus: string) => void;
};