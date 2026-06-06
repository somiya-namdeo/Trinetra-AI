import React from 'react';
import { impactMetrics } from '../../data/historicalCases';
import { Heart, ShieldCheck, Timer, Zap } from 'lucide-react';

const ImpactAnalysis = () => {
  const metrics = [
    { label: 'Lives Saved', value: impactMetrics.livesPotentiallySaved, icon: Heart, color: 'text-critical' },
    { label: 'Incidents Prevented', value: impactMetrics.incidentsPrevented, icon: ShieldCheck, color: 'text-safe' },
    { label: 'Response Improvement', value: impactMetrics.responseTimeImprovement, icon: Timer, color: 'text-primary' },
    { label: 'Resource Efficiency', value: impactMetrics.resourceEfficiencyGain, icon: Zap, color: 'text-warning' }
  ];

  return (
    <div className="glass-card">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white text-sm">Resource Impact Analysis</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card/50 border border-cardBorder rounded p-3 flex flex-col items-center justify-center text-center">
            <m.icon size={16} className={`${m.color} mb-1.5`} />
            <span className="text-lg font-bold text-gray-200 mb-0.5">{m.value}</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-wide">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactAnalysis;
