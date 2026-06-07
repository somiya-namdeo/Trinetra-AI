import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Truck, Megaphone, Eye } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    { label: 'Report Incident', icon: PlusCircle, color: 'text-critical', bg: 'bg-critical/10 hover:bg-critical/20', border: 'border-critical/30', route: '/incidents' },
    { label: 'Dispatch Resource', icon: Truck, color: 'text-primary', bg: 'bg-primary/10 hover:bg-primary/20', border: 'border-primary/30', route: '/resources' },
    { label: 'Generate Alert', icon: Megaphone, color: 'text-warning', bg: 'bg-warning/10 hover:bg-warning/20', border: 'border-warning/30', route: '/alerts' },
    { label: 'View Predictions', icon: Eye, color: 'text-safe', bg: 'bg-safe/10 hover:bg-safe/20', border: 'border-safe/30', route: '/memory-ai' }
  ];

  return (
    <div className="glass-card">
      <div className="p-3 border-b border-cardBorder">
        <h3 className="font-bold text-white text-sm">Quick Actions</h3>
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {actions.map((action, idx) => (
          <button 
            key={idx} 
            onClick={() => navigate(action.route)}
            className={`flex flex-col items-center justify-center gap-1.5 py-2 px-3 rounded-lg border ${action.border} ${action.bg} transition-colors group cursor-pointer`}
          >
            <action.icon className={`${action.color} group-hover:scale-110 transition-transform`} size={18} />
            <span className="text-[11px] font-medium text-gray-200">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
