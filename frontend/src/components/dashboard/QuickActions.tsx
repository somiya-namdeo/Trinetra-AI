import React from 'react';
import { PlusCircle, Truck, Megaphone, Eye } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { label: 'Report Incident', icon: PlusCircle, color: 'text-critical', bg: 'bg-critical/10 hover:bg-critical/20', border: 'border-critical/30' },
    { label: 'Dispatch Resource', icon: Truck, color: 'text-primary', bg: 'bg-primary/10 hover:bg-primary/20', border: 'border-primary/30' },
    { label: 'Generate Alert', icon: Megaphone, color: 'text-warning', bg: 'bg-warning/10 hover:bg-warning/20', border: 'border-warning/30' },
    { label: 'View Predictions', icon: Eye, color: 'text-safe', bg: 'bg-safe/10 hover:bg-safe/20', border: 'border-safe/30' }
  ];

  return (
    <div className="glass-card">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white">Quick Actions</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <button 
            key={idx} 
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border ${action.border} ${action.bg} transition-colors group`}
          >
            <action.icon className={`${action.color} group-hover:scale-110 transition-transform`} size={20} />
            <span className="text-xs font-medium text-gray-200">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
