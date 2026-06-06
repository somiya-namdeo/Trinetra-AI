import React from 'react';
import { historicalCases } from '../../data/historicalCases';
import { History } from 'lucide-react';

const HistoricalCases = () => {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <History size={16} className="text-secondary" />
          Historical Similar Cases
        </h3>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-3">
          {historicalCases.slice(0, 3).map((hc) => (
            <div key={hc.id} className="p-3 border border-cardBorder bg-card/40 rounded">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-bold text-gray-200">{hc.eventName}</h4>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-1 rounded border border-primary/20">
                  {hc.similarityScore}% Match
                </span>
              </div>
              <div className="text-[10px] text-gray-400 space-y-1">
                <p><span className="text-gray-500 uppercase">Outcome:</span> {hc.outcome}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-auto py-2 text-xs font-medium text-gray-300 bg-card hover:bg-cardBorder/50 border border-cardBorder rounded transition-colors">
          View All Cases
        </button>
      </div>
    </div>
  );
};

export default HistoricalCases;
