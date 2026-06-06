import React from 'react';
import { resourceStats } from '../../data/resources';

const ResourceStatus = () => {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white">Resource Status</h3>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {resourceStats.map((stat, idx) => {
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
