import React, { useEffect, useState } from 'react';
import { BrainCircuit, Network, Activity, ShieldAlert, HeartPulse, MessageSquareWarning, Zap, ArrowRight, AlertTriangle, Droplet, Users, Clock, CheckCircle2, Search, Database, LocateFixed, GitCommit, Loader2 } from 'lucide-react';
import { getMemoryInsight, generateAlert } from '../services/api';

const MemoryAI = () => {
  const [insightData, setInsightData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionStates, setActionStates] = useState<Record<number, 'pending' | 'executing' | 'executed'>>({});
  const [actionSummaries, setActionSummaries] = useState<Record<number, string>>({});
  const [toastMessage, setToastMessage] = useState<{ show: boolean, msg: string }>({ show: false, msg: '' });
  
  const executedCount = Object.values(actionStates).filter(s => s === 'executed').length;

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const data = await getMemoryInsight();
      if (data) setInsightData(data);
      setLoading(false);
    };
    fetchInsight();
  }, []);

  const handleExecute = async (idx: number, actionText: string) => {
    setActionStates(prev => ({ ...prev, [idx]: 'executing' }));
    
    await new Promise(r => setTimeout(r, 1000));
    
    setActionStates(prev => ({ ...prev, [idx]: 'executed' }));
    
    const textLower = actionText.toLowerCase();
    let toast = "Memory AI action executed successfully.";
    
    if (textLower.includes('dispatch fire response team') || 
        textLower.includes('deploy mobile hydration unit') || 
        textLower.includes('pre-position medical team') || 
        textLower.includes('deploy security')) {
        setActionSummaries(prev => ({ ...prev, [idx]: "Resource dispatch triggered" }));
    } else if (textLower.includes('broadcast')) {
        toast = "Broadcast generated from Memory AI recommendation.";
        if (insightData) {
          await generateAlert({
            incident_type: insightData.pattern_detected || 'Unknown Pattern',
            location: insightData.affected_zone || 'Unknown Zone',
            severity: insightData.severity || 'High'
          });
        }
    } else if (textLower.includes('evacuate') || textLower.includes('clear emergency access routes')) {
        toast = "Operational command issued.";
    }
    
    setToastMessage({ show: true, msg: toast });
    setTimeout(() => setToastMessage({ show: false, msg: '' }), 4000);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* Toast Notification */}
      {toastMessage.show && (
        <div className="fixed top-8 right-8 z-50 transition-all duration-300">
          <div className="bg-safe/90 border border-safe text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">{toastMessage.msg}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <BrainCircuit className="text-secondary" size={28} />
            Emergency Memory AI {loading && <span className="text-sm font-normal text-secondary animate-pulse ml-2">Analyzing signals...</span>}
          </h1>
          <p className="text-sm text-gray-400">Cross-incident intelligence, pattern detection, and predictive operational reasoning.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card/50 border border-cardBorder px-4 py-2 rounded-lg flex items-center gap-2">
            <Database size={14} className="text-primary" />
            <span className="text-xs font-bold text-gray-300">2.4M events indexed</span>
          </div>
          <div className="bg-card/50 border border-cardBorder px-4 py-2 rounded-lg flex items-center gap-2">
            <Zap size={14} className="text-warning" />
            <span className="text-xs font-bold text-gray-300">Model v3.2 · 0.42s latency</span>
          </div>
        </div>
      </div>

      {/* TOP ROW: 4 METRICS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Historical Incidents Analyzed', value: '48,291', color: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/5' },
          { label: 'Linked Signals', value: insightData?.linked_signals?.length || '4', color: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/5' },
          { label: 'Predicted Escalation', value: insightData?.predicted_escalation || '8-12 mins', color: 'text-critical', border: 'border-critical/30', bg: 'bg-critical/5' },
          { label: 'AI Confidence', value: insightData?.confidence ? `${insightData.confidence}%` : '87%', color: 'text-safe', border: 'border-safe/30', bg: 'bg-safe/5' }
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-5 border ${stat.border} ${stat.bg} shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* MAIN SECTION: 60/40 Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT: MEMORY AI CORE (60%) */}
        <div className="w-full lg:w-[60%] glass-card p-6 flex flex-col relative overflow-hidden border-t-4 border-t-secondary/50">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Network size={16} className="text-secondary" /> Active Neural Graph
          </h2>
          
          <div className="relative h-[400px] w-full flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-background/5 to-transparent"></div>
            
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
               <defs>
                 <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                 </linearGradient>
               </defs>
               {/* Fixed lines to center (50%, 50%) */}
               <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_2s_ease-in-out_infinite]" />
               <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
               <line x1="15%" y1="50%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_1.5s_ease-in-out_infinite]" />
               <line x1="85%" y1="50%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_3s_ease-in-out_infinite]" />
               <line x1="30%" y1="85%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_2s_ease-in-out_infinite]" />
               <line x1="70%" y1="85%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_2.2s_ease-in-out_infinite]" />
            </svg>

            {/* Central Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
               <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center border-2 border-secondary/50 shadow-[0_0_40px_rgba(59,130,246,0.4)] relative">
                 <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_4s_linear_infinite]"></div>
                 <div className="absolute inset-2 rounded-full border border-cyan-400/20 animate-[spin_6s_linear_infinite_reverse]"></div>
                 <BrainCircuit size={40} className="text-white drop-shadow-[0_0_10px_white]" />
               </div>
               <span className="mt-3 text-[10px] font-black text-white bg-black/60 px-3 py-1 rounded border border-secondary/30 uppercase tracking-widest shadow-lg">Memory AI Core</span>
            </div>

            {/* Surrounding Nodes */}
            {[
              { label: 'Incident Class.', icon: ShieldAlert, x: '20%', y: '20%', color: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
              { label: 'Risk Prediction', icon: Activity, x: '80%', y: '20%', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
              { label: 'Crowd Intel', icon: Users, x: '15%', y: '50%', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/50' },
              { label: 'Medical Intel', icon: HeartPulse, x: '85%', y: '50%', color: 'text-safe', bg: 'bg-safe/20', border: 'border-safe/50' },
              { label: 'Resource Opt.', icon: Network, x: '30%', y: '85%', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' },
              { label: 'Broadcast Agent', icon: MessageSquareWarning, x: '70%', y: '85%', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
            ].map((node, i) => (
              <div key={i} className="absolute z-10 flex flex-col items-center group cursor-pointer" style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }}>
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${node.border} ${node.bg} ${node.color} group-hover:scale-110 transition-transform bg-card relative shadow-[0_0_15px_currentColor]`}>
                   <node.icon size={20} />
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-safe rounded-full border-2 border-card shadow-[0_0_5px_#10b981]"></div>
                 </div>
                 <span className="mt-2 text-[9px] font-bold text-gray-300 uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border border-white/10 whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity">
                   {node.label}
                 </span>
                 
                 {/* Hover Tooltip */}
                 <div className="absolute top-16 w-32 bg-card border border-cardBorder p-2 rounded text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-30">
                   <span className="text-white font-bold block mb-1">Status: Active</span>
                   Streams live telemetry to Memory Core.
                 </div>
              </div>
            ))}
            
            {/* Floating Particles simulating data */}
            <div className="absolute top-[35%] left-[35%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-[float_2s_linear_infinite]"></div>
            <div className="absolute top-[65%] left-[65%] w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_10px_#3b82f6] animate-[float_3s_linear_infinite_reverse]"></div>
          </div>
        </div>

        {/* RIGHT: LIVE AI REASONING FEED (40%) */}
        <div className="w-full lg:w-[40%] glass-card flex flex-col h-[480px]">
          <div className="p-4 border-b border-cardBorder">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-warning" /> Live AI Reasoning Feed
            </h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {[
              { 
                title: insightData?.pattern_detected || 'Potential Heat Stress Cluster', 
                conf: insightData?.confidence ? `${insightData.confidence}%` : '87%', 
                loc: insightData?.affected_zone || 'Zone A', 
                sev: insightData?.severity?.toUpperCase() || 'HIGH', 
                badge: (insightData?.severity === 'Critical' || insightData?.severity === 'CRITICAL') ? 'bg-[#ff003c]/20 text-[#ff003c] border-[#ff003c]/30' : 'bg-critical/20 text-critical border-critical/30', 
                action: `Risk Score: ${insightData?.risk_score || 96}` 
              },
              { title: 'Crowd Surge Risk Detected', conf: '74%', loc: 'North Gate', sev: 'MEDIUM', badge: 'bg-warning/20 text-warning border-warning/30', action: 'Suggesting gate reroute' },
              { title: 'Repeated Water Station Failures', conf: '82%', loc: 'Zone A', sev: 'HIGH', badge: 'bg-critical/20 text-critical border-critical/30', action: 'Correlating with heat metrics' },
              { title: 'Lost Child Pattern Correlation', conf: '91%', loc: 'Zone C', sev: 'CRITICAL', badge: 'bg-[#ff003c]/20 text-[#ff003c] border-[#ff003c]/30', action: 'Locking down exit points' },
              { title: 'Minor Altercation Probability', conf: '45%', loc: 'Zone B', sev: 'LOW', badge: 'bg-primary/20 text-primary border-primary/30', action: 'Monitoring security feeds' },
            ].map((feed, i) => (
              <div key={i} className="bg-card/50 border border-cardBorder rounded-lg p-3 hover:bg-card/80 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${feed.badge}`}>{feed.sev}</span>
                    <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Clock size={10}/> Just now</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{feed.conf}</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{feed.title}</h4>
                <div className="flex justify-between items-end">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1"><LocateFixed size={12}/> {feed.loc}</span>
                  <span className="text-[10px] text-secondary group-hover:underline cursor-pointer">{feed.action} &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: PATTERN DISCOVERY */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Pattern Discovery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 border-l-2 border-l-warning">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-warning/20 p-2 rounded text-warning"><HeartPulse size={16} /></div>
              <h3 className="font-bold text-white text-sm">{insightData?.pattern_detected || 'Repeated Medical Incidents'}</h3>
            </div>
            <div className="bg-black/30 rounded p-3 text-sm text-gray-300 border border-white/5">
              <span className="text-warning font-bold text-[10px] uppercase tracking-widest block mb-1">Reasoning Trace:</span>
              {insightData?.reasoning_trace ? (
                <div className="space-y-1">
                  {insightData.reasoning_trace.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-2"><span className="text-warning opacity-50">↳</span> <span className="text-xs">{step}</span></div>
                  ))}
                </div>
              ) : '32% increase in elderly distress events between 14:00–16:00 near Gate 7.'}
            </div>
          </div>
          
          <div className="glass-card p-5 border-l-2 border-l-primary">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/20 p-2 rounded text-primary"><Users size={16} /></div>
              <h3 className="font-bold text-white text-sm">Linked Signals</h3>
            </div>
            <div className="bg-black/30 rounded p-3 text-sm text-gray-300 border border-white/5">
              <span className="text-primary font-bold text-[10px] uppercase tracking-widest block mb-1">Correlated Data:</span>
              {insightData?.linked_signals ? (
                <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                  {insightData.linked_signals.map((sig: string, idx: number) => <li key={idx}>{sig}</li>)}
                </ul>
              ) : 'Recurring congestion every 18 minutes near North Gate.'}
            </div>
          </div>
          
          <div className="glass-card p-5 border-l-2 border-l-critical">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-critical/20 p-2 rounded text-critical"><Droplet size={16} /></div>
              <h3 className="font-bold text-white text-sm">Predicted Outcome</h3>
            </div>
            <div className="bg-black/30 rounded p-3 text-sm text-gray-300 border border-white/5">
              <span className="text-critical font-bold text-[10px] uppercase tracking-widest block mb-1">Risk Escalation:</span>
              {insightData?.predicted_outcome || 'Water station outages strongly correlate with heat-related incidents.'}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MEMORY TIMELINE */}
      <div className="glass-card p-6 border-t-4 border-t-secondary/50">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <GitCommit size={16} className="text-secondary" /> Memory Timeline Analysis: Hypothesis #H-0241
        </h2>
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-cardBorder"></div>
          
          <div className="grid grid-cols-6 gap-2 relative z-10">
            {[
              { time: '09:15', label: 'Water Station Failure', status: 'critical' },
              { time: '09:24', label: 'Crowd Density Spike', status: 'warning' },
              { time: '09:31', label: 'Medical Incident', status: 'critical' },
              { time: '09:35', label: 'AI Alert Generated', status: 'primary' },
              { time: '09:37', label: 'Resource Dispatch', status: 'secondary' },
              { time: '09:42', label: 'Situation Stabilized', status: 'safe' }
            ].map((event, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-3 h-3 rounded-full mb-3 ring-4 ring-background bg-${event.status} shadow-[0_0_10px_currentColor]`}></div>
                <div className="text-[10px] text-gray-500 font-mono font-bold mb-1">{event.time}</div>
                <div className={`text-[11px] font-semibold text-white max-w-[100px]`}>{event.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4 & 5: PREDICTIVE INTEL & RECOMMENDED ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Predictive Intelligence */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity size={16} className="text-warning" /> Next 30 Minute Forecast
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Heat Stress Probability', val: 78, color: 'bg-critical' },
              { label: 'Crowd Surge Probability', val: 63, color: 'bg-warning' },
              { label: 'Medical Escalation Probability', val: 54, color: 'bg-primary' },
              { label: 'Infrastructure Failure Probability', val: 21, color: 'bg-secondary' }
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-medium">{metric.label}</span>
                  <span className="font-bold text-white">{metric.val}%</span>
                </div>
                <div className="w-full bg-cardBorder h-2 rounded-full overflow-hidden shadow-inner">
                  <div className={`${metric.color} h-full rounded-full shadow-[0_0_10px_currentColor]`} style={{ width: `${metric.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="glass-card p-6 border-l-4 border-l-primary/50 relative">
          <div className="absolute top-6 right-6 text-xs text-gray-400 font-bold bg-cardBorder/30 px-2 py-1 rounded">
            Executed: {executedCount} / {insightData?.preventive_actions?.length || 4}
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" /> Memory AI Recommendations
          </h2>
          <div className="space-y-3">
            {(insightData?.preventive_actions || [
              "Deploy mobile hydration unit to Zone A.",
              "Clear emergency access routes at North Gate.",
              "Pre-position medical team by 2 units.",
              "Broadcast crowd diversion advisory."
            ]).map((action: string, i: number) => {
              const state = actionStates[i] || 'pending';
              const summary = actionSummaries[i];
              const isExecuted = state === 'executed';
              
              return (
              <div key={i} className={`border p-3 rounded-lg flex items-center gap-3 transition-colors ${isExecuted ? 'bg-safe/10 border-safe/30' : 'bg-card/40 border-cardBorder hover:bg-card/80'}`}>
                <div className={`${isExecuted ? 'bg-safe/20 text-safe border-safe/30' : 'bg-primary/10 border-primary/20 text-primary'} border w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0`}>
                  {isExecuted ? <CheckCircle2 size={14}/> : i + 1}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isExecuted ? 'text-gray-400' : 'text-gray-200'}`}>{action}</p>
                  {summary && <p className="text-[10px] text-primary mt-1 font-bold">{summary}</p>}
                </div>
                <button 
                  onClick={() => handleExecute(i, action)}
                  disabled={state !== 'pending'}
                  className={`ml-auto text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                    state === 'executed' ? 'bg-safe/20 text-safe cursor-default' : 
                    state === 'executing' ? 'bg-primary/50 text-white cursor-wait' :
                    'bg-primary hover:bg-primary/90 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                  }`}
                >
                  {state === 'executing' ? <Loader2 size={12} className="animate-spin inline mr-1"/> : null}
                  {state === 'executed' ? 'Executed' : state === 'executing' ? 'Executing...' : 'Execute'}
                </button>
              </div>
            )})}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MemoryAI;
