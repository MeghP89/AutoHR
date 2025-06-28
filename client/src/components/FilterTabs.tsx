// src/components/FilterTabs.tsx

type Props = {
  filter: string;
  setFilter: (filter: string) => void;
};

export default function FilterTabs({ filter, setFilter }: Props) {
  const options = ['all', 'open', 'in-progress', 'closed'];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 inline-flex mb-6">
            {options.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === status 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {status === 'all' ? 'All Tickets' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
    </div>    
  );
}