import React from 'react';
import { useNavigate } from 'react-router-dom';
import { activeIncidents } from '../../data/incidents';
import { MapPin, Clock } from 'lucide-react';

const IncidentFeed = () => {
  const navigate = useNavigate();
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder flex justify-between items-center">
        <div>
          <h3 className="font-bold text-white">Live Incident Feed</h3>
          <p className="text-xs text-gray-400">6 active · 7 total today</p>
        </div>
        <button onClick={() => navigate('/incidents')} className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer">View all</button>
      </div>
      
      <div className="p-4 space-y-3 flex-1">
        {activeIncidents.map((incident) => (
          <div key={incident.id} className="bg-card/50 border border-cardBorder rounded-lg p-3 hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">{incident.id}</span>
                <span className={`badge-${incident.priority.toLowerCase()}`}>{incident.priority}</span>
                <span className="text-[10px] font-bold text-gray-400 border border-gray-600 px-1.5 py-0.5 rounded uppercase">{incident.status}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                {incident.timeAgo}
              </div>
            </div>
            
            <h4 className="font-semibold text-gray-200 text-sm mb-1">{incident.title}</h4>
            
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={12} />
              {incident.location} · {incident.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentFeed;
