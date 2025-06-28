// src/utils/ticketUtils.ts
export const getPriorityBorderColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'border-green-400',
    medium: 'border-yellow-400',
    high: 'border-orange-400',
    urgent: 'border-red-400',
  };
  return colors[priority] || 'border-gray-400';
};

// We'll create a new function to get the descriptive text
export const getIntentText = (intent: string): string => {
    const text: Record<string, string> = {
      bug: 'Bug Report',
      req: 'Feature Request',
      qna: 'Question',
      cmp: 'Complaint',
      oth: 'Other',
    };
    return text[intent] || 'Other';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };
  return colors[priority] || 'text-gray-400';
};

export const getStatusColor = (status: string): string => {
  return status === 'open'
    ? 'bg-blue-400'
    : status === 'in-progress'
    ? 'bg-yellow-400'
    : 'bg-gray-400';
};

