import React from 'react';
import { impactMetrics } from '../../data/historicalCases';
import { Heart, ShieldCheck, Timer, Zap, Activity } from 'lucide-react';

const ImpactAnalysis = () => {
  const metrics = [
    { label: 'Lives Saved', value: impactMetrics.livesPotentiallySaved, icon: Heart, color: 'text-critical' },
    { label: 'Incidents Prevented', value: impactMetrics.incidentsPrevented, icon: ShieldCheck, color: 'text-safe' },
    { label: 'Response Improvement', value: impactMetrics.responseTimeImprovement, icon: Timer, color: 'text-primary' },
    { label: 'Resource Efficiency', value: impactMetrics.resourceEfficiencyGain, icon: Zap, color: 'text-warning' }
  ];

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Activity size={16} className="text-secondary" />
          Resource Impact Analysis
        </h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3 flex-1 content-center">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card/50 border border-cardBorder rounded py-1.5 px-2 flex flex-col items-center justify-center text-center">
            <m.icon size={14} className={`${m.color} mb-1`} />
            <span className="text-base font-bold text-gray-200 leading-tight">{m.value}</span>
            <span className="text-[8px] text-gray-400 uppercase tracking-wide">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactAnalysis;
