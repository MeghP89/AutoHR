import { useState, useEffect } from 'react';

// Helper function to format the time difference into a readable string
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

type LastUpdatedDisplayProps = {
  // We'll pass the timestamp of the last data fetch as a prop
  updateTimestamp: Date;
};

export default function LastUpdatedDisplay({ updateTimestamp }: LastUpdatedDisplayProps) {
  // State to hold the formatted "time ago" string
  const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(updateTimestamp));

  useEffect(() => {
    // This interval will re-calculate the "time ago" string every 30 seconds
    // to keep the display fresh without updating every single second.
    const intervalId = setInterval(() => {
      setTimeAgo(formatTimeAgo(updateTimestamp));
    }, 30000); // Update every 30 seconds

    // This is a crucial cleanup function. It runs when the component is removed
    // from the screen to prevent memory leaks by stopping the interval.
    return () => clearInterval(intervalId);

  }, [updateTimestamp]); // This effect re-runs if the updateTimestamp prop ever changes

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-right">
      <div className="text-white/70 text-sm">Last updated</div>
      <div className="text-white font-semibold">{timeAgo}</div>
    </div>
  );
}
