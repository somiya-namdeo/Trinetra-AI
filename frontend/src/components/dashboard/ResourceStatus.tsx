import React, { useEffect, useState } from 'react';
import { resourceStats } from '../../data/resources';
import { getResources } from '../../services/api';

const ResourceStatus = () => {
  const [stats, setStats] = useState<any[]>(resourceStats);

  useEffect(() => {
    const fetchResources = async () => {
      const data = await getResources();
      if (data && Array.isArray(data) && data.length > 0) {
        const countByType = (targetType: string, statusFilter?: string) => {
          return data.filter((u: any) => {
            const isMatch = u.type?.toLowerCase() === targetType.toLowerCase();
            if (!isMatch) return false;
            if (statusFilter) return u.status?.toLowerCase() === statusFilter.toLowerCase();
            return true;
          }).length;
        };

        const medicalTotal = countByType('Medical Team');
        const medicalAvail = countByType('Medical Team', 'available');
        const secTotal = countByType('Security Unit');
        const secAvail = countByType('Security Unit', 'available');
        const ambTotal = countByType('Ambulance');
        const ambAvail = countByType('Ambulance', 'available');
        const waterTotal = countByType('Water Supply Unit');
        const waterAvail = countByType('Water Supply Unit', 'available');
        
        setStats([
          { type: 'Medical Teams', available: medicalAvail, total: medicalTotal, color: 'bg-primary' },
          { type: 'Security Units', available: secAvail, total: secTotal, color: 'bg-warning' },
          { type: 'Ambulances', available: ambAvail, total: ambTotal, color: 'bg-critical' },
          { type: 'Water Supply', available: waterAvail, total: waterTotal, color: 'bg-[#19B5D8]' }
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
                  style={{ width: stat.total > 0 ? `${percentage}%` : '0%' }}
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
