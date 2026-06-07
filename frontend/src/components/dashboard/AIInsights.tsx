import React, { useEffect, useState } from 'react';
import { BrainCircuit, Zap } from 'lucide-react';
import { aiPredictions } from '../../data/predictions';
import { getMemoryInsight } from '../../services/api';

const AIInsights = () => {
  const [predictions, setPredictions] = useState<any[]>(aiPredictions);

  useEffect(() => {
    const fetchInsight = async () => {
      const data = await getMemoryInsight();
      if (data && data.pattern_detected) {
        setPredictions([{
          id: 'backend-insight',
          title: data.pattern_detected,
          description: data.reasoning_trace?.[0] || 'Correlated live metrics point to escalation.',
          severity: 'HIGH',
          eta: data.predicted_escalation || '8-12m',
          confidence: data.confidence || 87,
          recommendations: data.preventive_actions || ['Deploy additional resources']
        }, ...aiPredictions.slice(1)]); // replace first one with real backend data
      }
    };
    fetchInsight();
  }, []);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder flex justify-between items-center">
        <div>
          <h3 className="font-bold text-white flex items-center gap-2">
            AI Insights
            <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded border border-primary/30 uppercase tracking-wider font-bold">
              Reasoning
            </span>
          </h3>
          <p className="text-xs text-gray-400">Live correlation engine · Memory AI v3.2</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto min-h-0">
        {predictions.map((pred) => (
          <div key={pred.id} className="bg-card border border-cardBorder rounded-lg p-4">
            <div className="flex gap-3 mb-3">
              <div className="mt-1 text-primary">
                <BrainCircuit size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className={`badge-${pred.severity.toLowerCase()}`}>
                    {pred.severity}
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{pred.eta}</span>
                </div>
                <h4 className="font-bold text-gray-200 text-sm mb-2">{pred.title}</h4>
                <p className="text-xs text-gray-400 mb-3">{pred.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Confidence</span>
                    <span className="text-primary font-bold">{pred.confidence}%</span>
                  </div>
                  <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ width: `${pred.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  {pred.recommendations.map((rec: string, j: number) => (
                    <div key={j} className="text-xs text-gray-300 flex items-center gap-2">
                      <Zap size={12} className="text-warning" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
