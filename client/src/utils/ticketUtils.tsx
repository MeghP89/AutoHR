// src/utils/ticketUtils.ts
export const getIntentIcon = (intent: string): string => {
  const icons: Record<string, string> = {
    bug: 'Bug 🐛',
    req: 'Req ✨',
    qna: 'QnA ❓',
    cmp: 'CMP ⚠️',
    oth: 'OTH 📝',
  };
  return icons[intent] || '📝';
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

