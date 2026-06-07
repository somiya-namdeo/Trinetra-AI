import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

const IncidentFeed = ({ incidents = [] }: { incidents?: any[] }) => {
  const navigate = useNavigate();
  
  const activeIncidents = incidents.filter(i => {
    const s = (i.status || '').toUpperCase();
    return ['ACTIVE', 'RESOURCES_ASSIGNED', 'IN_PROGRESS', 'CONTAINED'].includes(s);
  });

  const totalToday = incidents.length;
  const activeCount = activeIncidents.length;

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder flex justify-between items-center">
        <div>
          <h3 className="font-bold text-white">Live Incident Feed</h3>
          <p className="text-xs text-gray-400">{activeCount} active · {totalToday} total today</p>
        </div>
        <button onClick={() => navigate('/incidents')} className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer">View all</button>
      </div>
      
      <div className="p-4 space-y-3 flex-1 overflow-y-auto min-h-0">
        {activeIncidents.map((incident: any) => {
          const priority = incident.severity || incident.priority || 'LOW';
          const status = incident.status || 'ACTIVE';
          const timeStr = incident.created_at ? new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : (incident.timeAgo || 'Just now');
          const displayId = incident.id || `INC-${Math.floor(Math.random() * 1000) + 2000}`;
          
          let statusStyle = 'border-gray-600 text-gray-400 bg-transparent';
          switch(status.toUpperCase()) {
            case 'ACTIVE': statusStyle = 'bg-[#ff003c]/20 text-[#ff003c] border-[#ff003c]/30'; break;
            case 'RESOURCES_ASSIGNED': statusStyle = 'bg-blue-500/20 text-blue-400 border-blue-500/30'; break;
            case 'IN_PROGRESS': statusStyle = 'bg-orange-500/20 text-orange-400 border-orange-500/30'; break;
            case 'CONTAINED': statusStyle = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'; break;
          }
          
          return (
            <div key={incident.id || Math.random()} className="bg-card/50 border border-cardBorder rounded-lg p-3 hover:bg-card/80 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono">{displayId}</span>
                  <span className={`badge-${priority.toLowerCase()}`}>{priority.toUpperCase()}</span>
                  <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded uppercase ${statusStyle}`}>{status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {timeStr}
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-200 text-sm mb-1">{incident.title}</h4>
              
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={12} />
                {incident.location || incident.zone} · {incident.category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidentFeed;
