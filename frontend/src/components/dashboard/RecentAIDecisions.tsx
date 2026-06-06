import React, { useEffect, useState } from 'react';
import { recentAIDecisions as fallbackDecisions } from '../../data/resources';
import { getMemoryInsight } from '../../services/api';
import { CheckCircle2, CircleDashed } from 'lucide-react';

const RecentAIDecisions = () => {
  const [decisions, setDecisions] = useState<any[]>([]);

  useEffect(() => {
    const fetchInsight = async () => {
      const data = await getMemoryInsight();
      if (data && data.pattern_detected) {
        const generated = [
          {
            id: `DEC-${Math.floor(Math.random() * 1000) + 2000}`,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            recommendation: `Preventive Action: ${data.preventive_actions ? data.preventive_actions[0] : 'Monitor Zone'}`,
            confidence: data.confidence || 92,
            status: 'EXECUTED'
          },
          {
            id: `DEC-${Math.floor(Math.random() * 1000) + 2000}`,
            timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            recommendation: `Resource Auto-Dispatch: ${data.recommended_resources ? data.recommended_resources.join(', ') : 'Security Team'} to ${data.affected_zone}`,
            confidence: 88,
            status: 'PENDING'
          }
        ];
        setDecisions(generated);
      } else {
        setDecisions(fallbackDecisions.slice(0, 2));
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white">Recent AI Decisions</h3>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1 justify-center">
        {decisions.map((decision) => (
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
