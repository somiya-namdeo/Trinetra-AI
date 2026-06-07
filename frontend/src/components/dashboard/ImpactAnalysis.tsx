import React, { useEffect, useState } from 'react';
import { impactMetrics as fallbackMetrics } from '../../data/historicalCases';
import { getIncidents, getResources, getZones } from '../../services/api';
import { Heart, ShieldCheck, Timer, Zap, Activity } from 'lucide-react';

const ImpactAnalysis = () => {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [incidents, resources, zones] = await Promise.all([
        getIncidents(), getResources(), getZones()
      ]);

      if (incidents && resources && zones && incidents.length > 0 && resources.length > 0 && zones.length > 0) {
        const deployedResources = resources.filter((r: any) => {
          const s = (r.status || '').toUpperCase();
          return s === 'DEPLOYED' || s === 'BUSY';
        }).length;
        const totalResources = resources.length;
        const utilization = Math.round((deployedResources / totalResources) * 100) || 0;
        
        const criticalIncidents = incidents.filter((i: any) => (i.severity || '').toUpperCase() === 'CRITICAL' || (i.severity || '').toUpperCase() === 'HIGH').length;
        
        const safeZones = zones.filter((z: any) => z.risk_level === 'Low' || z.risk_score < 40).length;
        const totalZones = zones.length;
        const coverage = Math.round((safeZones / totalZones) * 100) || 0;

        setMetrics([
          { label: 'Deployed Resources', value: deployedResources.toString(), icon: Heart, color: 'text-critical' },
          { label: 'Critical Incidents', value: criticalIncidents.toString(), icon: ShieldCheck, color: 'text-safe' },
          { label: 'Resource Utilization', value: `${utilization}%`, icon: Timer, color: 'text-primary' },
          { label: 'Zone Safety Coverage', value: `${coverage}%`, icon: Zap, color: 'text-warning' }
        ]);
      } else {
        setMetrics([
          { label: 'Lives Saved', value: fallbackMetrics.livesPotentiallySaved, icon: Heart, color: 'text-critical' },
          { label: 'Incidents Prevented', value: fallbackMetrics.incidentsPrevented, icon: ShieldCheck, color: 'text-safe' },
          { label: 'Response Improvement', value: fallbackMetrics.responseTimeImprovement, icon: Timer, color: 'text-primary' },
          { label: 'Resource Efficiency', value: fallbackMetrics.resourceEfficiencyGain, icon: Zap, color: 'text-warning' }
        ]);
      }
    };
    fetchData();
  }, []);

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
