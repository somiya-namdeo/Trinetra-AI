import React, { useEffect, useState } from 'react';
import { sectorHealthData } from '../../data/resources';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { getZones } from '../../services/api';

const SectorSummary = () => {
  const [sectors, setSectors] = useState<any[]>(sectorHealthData);

  useEffect(() => {
    const fetchZones = async () => {
      const zones = await getZones();
      if (zones && Array.isArray(zones) && zones.length > 0) {
        // Find top 4 highest risk zones to replace static sectors
        const sortedZones = [...zones].sort((a, b) => {
           const scoreA = a.ml_risk_score !== undefined ? a.ml_risk_score : (a.risk_score || 0);
           const scoreB = b.ml_risk_score !== undefined ? b.ml_risk_score : (b.risk_score || 0);
           return scoreB - scoreA;
        });
        
        const newSectors = sortedZones.slice(0, 4).map(z => {
           const score = z.ml_risk_score !== undefined ? z.ml_risk_score : (z.risk_score || 0);
           let status = 'SAFE';
           let trend = 'down';
           if (score >= 80 || z.risk_level === 'Critical') { status = 'CRITICAL'; trend = 'up'; }
           else if (score >= 50 || z.risk_level === 'High') { status = 'WARNING'; trend = 'up'; }
           
           return {
             name: z.name,
             status: status,
             riskScore: Math.round(score).toString(),
             trend: trend
           };
        });
        
        if (newSectors.length > 0) {
            setSectors(newSectors);
        }
      }
    };
    fetchZones();
  }, []);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white">Sector Health</h3>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          {sectors.map((sector, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded border border-cardBorder bg-card/40">
              <div className="flex items-center gap-3">
                {sector.status === 'CRITICAL' && <ShieldAlert size={16} className="text-critical" />}
                {sector.status === 'WARNING' && <ShieldAlert size={16} className="text-warning" />}
                {sector.status === 'SAFE' && <ShieldCheck size={16} className="text-safe" />}
                <span className="text-xs font-medium text-gray-200">{sector.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  sector.status === 'CRITICAL' ? 'bg-critical/20 text-critical border-critical/30' :
                  sector.status === 'WARNING' ? 'bg-warning/20 text-warning border-warning/30' :
                  'bg-safe/20 text-safe border-safe/30'
                }`}>
                  {sector.status}
                </span>
                <span className="text-xs text-[#8b5cf6] w-6 text-right font-bold" title="ML Risk Score">{sector.riskScore}</span>
                <span className={`text-[10px] ${sector.trend === 'up' && sector.status !== 'SAFE' ? 'text-critical' : sector.trend === 'down' ? 'text-safe' : 'text-gray-500'}`}>
                  {sector.trend === 'up' ? '▲' : sector.trend === 'down' ? '▼' : '▬'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorSummary;
