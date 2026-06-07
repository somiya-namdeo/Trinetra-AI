import React, { useEffect, useState } from 'react';
import { BrainCircuit, Activity, Database, CheckCircle2 } from 'lucide-react';
import { getMemoryInsight } from '../../services/api';

const MLRiskCard = () => {
  const [mlData, setMlData] = useState<any>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await getMemoryInsight();
      if (insight) {
        setMlData(insight);
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="glass-card p-4 border-l-4 border-l-[#8b5cf6] relative overflow-hidden group mb-6">
      {/* Subtle glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-[#8b5cf6]"></div>
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xs font-semibold text-gray-400 tracking-wider flex items-center gap-2">
          <BrainCircuit size={14} className="text-[#8b5cf6]" /> ML RISK PREDICTION
        </h3>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
          mlData?.model_used ? 'bg-safe/20 text-safe border-safe/30' : 'bg-warning/20 text-warning border-warning/30'
        }`}>
          {mlData?.model_used ? 'Active' : 'Fallback'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{mlData?.ml_risk_score || '--'}</span>
            <span className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <Activity size={10} /> {mlData?.ml_risk_level || 'N/A'}
            </span>
          </div>
        </div>
        <div className="space-y-1 text-right border-l border-cardBorder pl-3">
          <p className="text-[10px] text-gray-400 flex justify-end items-center gap-1">
            <Database size={10} /> Source: {mlData?.risk_source || 'Rule-Based'}
          </p>
          <p className="text-[10px] text-[#8b5cf6] font-mono">
            {mlData?.ml_model_name || 'Rule-Based Fallback Active'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MLRiskCard;
