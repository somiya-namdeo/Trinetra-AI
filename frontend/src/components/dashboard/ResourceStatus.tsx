import React, { useEffect, useState } from 'react';
import { resourceStats } from '../../data/resources';
import { getResources } from '../../services/api';

const ResourceStatus = () => {
  const [stats, setStats] = useState<any[]>(resourceStats);

  useEffect(() => {
    const fetchResources = async () => {
      const data = await getResources();
      if (data && Array.isArray(data) && data.length > 0) {
        const medicalTotal = data.filter(u => u.type === 'Medical').length;
        const medicalAvail = data.filter(u => u.type === 'Medical' && u.status === 'Available').length;
        const secTotal = data.filter(u => u.type === 'Security').length;
        const secAvail = data.filter(u => u.type === 'Security' && u.status === 'Available').length;
        
        setStats([
          { type: 'Medical', available: medicalAvail, total: medicalTotal || 4, color: 'bg-primary' },
          { type: 'Security', available: secAvail, total: secTotal || 6, color: 'bg-warning' },
          resourceStats[2], // Keep Fire/Hazmat mock fallback
          resourceStats[3]  // Keep Logistics mock fallback
        ]);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white">Resource Status</h3>
      </div>
      <div className="p-4 flex flex-col gap-4 flex-1 justify-center">
        {stats.map((stat, idx) => {
          const percentage = Math.round((stat.available / stat.total) * 100);
          return (
            <div key={idx}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300 font-medium">{stat.type}</span>
                <span className="text-gray-400 font-mono">{stat.available}/{stat.total}</span>
              </div>
              <div className="w-full bg-cardBorder h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${stat.color}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceStatus;
