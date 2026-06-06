import React from 'react';
import { recentAIDecisions } from '../../data/resources';
import { CheckCircle2, CircleDashed } from 'lucide-react';

const RecentAIDecisions = () => {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white">Recent AI Decisions</h3>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1 justify-center">
        {recentAIDecisions.map((decision) => (
          <div key={decision.id} className="p-3 border border-cardBorder bg-card/60 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-500 font-mono">{decision.id}</span>
              <span className="text-[10px] text-gray-400">{decision.timestamp}</span>
            </div>
            <p className="text-sm text-gray-200 mb-3">{decision.recommendation}</p>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Confidence</span>
                <span className="text-primary font-bold">{decision.confidence}%</span>
              </div>
              <div className="flex items-center gap-1">
                {decision.status === 'EXECUTED' ? (
                  <><CheckCircle2 size={12} className="text-safe" /><span className="text-safe font-medium">Executed</span></>
                ) : (
                  <><CircleDashed size={12} className="text-warning animate-spin-slow" /><span className="text-warning font-medium">Pending</span></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAIDecisions;
