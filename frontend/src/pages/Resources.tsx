import React, { useEffect, useState } from 'react';
import { Network, Zap, Truck, ShieldAlert, HeartPulse, Shield, Thermometer, Loader2, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { getResources } from '../services/api';

const Resources = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [showToast, setShowToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  
  // Track assigned state for individual actions/resources
  const [assignedResources, setAssignedResources] = useState<Record<string, boolean>>({});
  const [fieldUnits, setFieldUnits] = useState<any[]>([
    { id: 'u1', name: 'Ambulance 01', type: 'AMB-01', status: 'Deployed', location: 'Gate 7', eta: 'On site', assignment: 'INC-2840', fit: 82, isRecommended: false },
    { id: 'u2', name: 'Ambulance 02', type: 'AMB-02', status: 'Available', location: 'Base', eta: '3 min', assignment: 'None', fit: 96, isRecommended: true, recommendFor: 'Elderly collapse near Gate 7' },
    { id: 'u3', name: 'Medical Team Alpha', type: 'MED-01', status: 'Deployed', location: 'Zone A', eta: 'On site', assignment: 'INC-2841', fit: 75, isRecommended: false },
    { id: 'u4', name: 'Medical Team Bravo', type: 'MED-02', status: 'Available', location: 'Zone B', eta: '4 min', assignment: 'None', fit: 94, isRecommended: true, recommendFor: 'Heat Stress Cluster — Zone A' },
    { id: 'u5', name: 'Security Unit 01', type: 'SEC-01', status: 'Deployed', location: 'North Gate', eta: 'On site', assignment: 'INC-2838', fit: 88, isRecommended: false },
    { id: 'u6', name: 'Security Unit 02', type: 'SEC-02', status: 'Available', location: 'Gate 7', eta: '2 min', assignment: 'None', fit: 91, isRecommended: true, recommendFor: 'Minor crowd surge near Gate 3' },
  ]);

  useEffect(() => {
    const fetchResources = async () => {
      const data = await getResources();
      if (data && Array.isArray(data) && data.length > 0) {
        // Merge backend data with existing mock fields for the demo (like assignment, fit, isRecommended)
        const mappedData = data.map((unit: any, idx: number) => {
           const fallbackUnit = fieldUnits[idx] || {};
           return { ...fallbackUnit, ...unit };
        });
        setFieldUnits(mappedData);
      }
    };
    fetchResources();
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setIsOptimized(false);
    
    setTimeout(() => {
      setIsOptimizing(false);
      setIsOptimized(true);
      setShowToast({ show: true, message: 'AI optimization complete: 4 deployment actions recommended.' });
      
      setTimeout(() => setShowToast({ show: false, message: '' }), 4000);
    }, 1500);
  };

  const handleAssign = (id: string) => {
    setAssignedResources(prev => ({ ...prev, [id]: true }));
    setShowToast({ show: true, message: 'Resource assigned successfully.' });
    
    setTimeout(() => setShowToast({ show: false, message: '' }), 3000);
  };

  const predictedDemands = [
    { type: 'Ambulances', current: 2, total: 4, predicted: '+2', icon: Truck, color: 'text-primary', badge: 'bg-primary/20 text-primary border-primary/30', risk: 'High', riskColor: 'text-warning' },
    { type: 'Medical Teams', current: 2, total: 3, predicted: '+1', icon: HeartPulse, color: 'text-secondary', badge: 'bg-secondary/20 text-secondary border-secondary/30', risk: 'Moderate', riskColor: 'text-primary' },
    { type: 'Security Units', current: 2, total: 3, predicted: '+3', icon: Shield, color: 'text-warning', badge: 'bg-warning/20 text-warning border-warning/30', risk: 'Critical', riskColor: 'text-critical' },
    { type: 'Water Tankers', current: 1, total: 2, predicted: '+2', icon: Thermometer, color: 'text-orange-500', badge: 'bg-orange-500/20 text-orange-500 border-orange-500/30', risk: 'High', riskColor: 'text-warning' }
  ];

  const deploymentPlan = [
    { id: 'dp1', action: 'Dispatch Ambulance 02 to Gate 7', priority: 'High', impact: 'Critical', effort: 'Low' },
    { id: 'dp2', action: 'Move Medical Team Bravo to Zone A perimeter', priority: 'High', impact: 'High', effort: 'Medium' },
    { id: 'dp3', action: 'Reposition Security Unit 02 near Gate 3', priority: 'Medium', impact: 'Moderate', effort: 'Low' },
    { id: 'dp4', action: 'Keep Fire Unit 01 on standby', priority: 'Low', impact: 'Low', effort: 'None' }
  ];



  return (
    <div className="flex flex-col space-y-6 h-full pb-10 relative">
      {/* Toast Notification */}
      {showToast.show && (
        <div className="absolute top-0 right-1/4 transform translate-x-1/2 z-50 transition-all duration-300 ease-out opacity-100 translate-y-0">
          <div className="bg-safe/90 border border-safe text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">{showToast.message}</span>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Resource Coordination</h1>
        <p className="text-sm text-gray-400">Live status of all field units and team assignments.</p>
      </div>

      {/* Top Row: AI Optimizer & Load Balance */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card p-6 border-t-2 border-t-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Network size={120} className="text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                <Zap className="text-primary" size={20} /> AI Resource Optimizer
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold px-2 py-1 bg-safe/20 text-safe border border-safe/30 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse"></div> ACTIVE
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Demand Spike</p>
                <p className="font-bold text-warning flex items-center gap-2">
                  <AlertTriangle size={16} /> Zone A Medical
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Impact Metrics</p>
                <div className="flex items-center gap-4">
                  <div><span className="text-primary font-bold">91%</span> <span className="text-xs text-gray-400">Confidence</span></div>
                  <div><span className="text-safe font-bold">42%</span> <span className="text-xs text-gray-400">Time Saved</span></div>
                </div>
              </div>
              <div className="col-span-2 bg-cardBorder/30 p-3 rounded border border-cardBorder">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Recommended Action</p>
                <p className="text-sm text-gray-200">Pre-position Medical Team Bravo and Ambulance 02 near Gate 7.</p>
              </div>
            </div>

            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <><Loader2 size={16} className="animate-spin" /> Optimizing resource allocation...</>
              ) : (
                <><Network size={16} /> Run Resource Optimization</>
              )}
            </button>
          </div>
        </div>

        <div className="col-span-1 glass-card p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-secondary" /> Resource Load Balance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Zone A</span>
              <span className="text-xs font-bold text-critical bg-critical/20 border border-critical/30 px-2 py-0.5 rounded">Overloaded</span>
            </div>
            <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden mb-2"><div className="bg-critical h-full rounded-full w-[95%]"></div></div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Gate 7</span>
              <span className="text-xs font-bold text-warning bg-warning/20 border border-warning/30 px-2 py-0.5 rounded">High Demand</span>
            </div>
            <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden mb-2"><div className="bg-warning h-full rounded-full w-[80%]"></div></div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Zone C</span>
              <span className="text-xs font-bold text-safe bg-safe/20 border border-safe/30 px-2 py-0.5 rounded">Stable</span>
            </div>
            <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden mb-2"><div className="bg-safe h-full rounded-full w-[45%]"></div></div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">North Gate</span>
              <span className="text-xs font-bold text-primary bg-primary/20 border border-primary/30 px-2 py-0.5 rounded">Watch</span>
            </div>
            <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden"><div className="bg-primary h-full rounded-full w-[60%]"></div></div>
          </div>
        </div>
      </div>

      {/* Predicted Demand */}
      <div>
        <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-widest">Predicted Resource Demand - Next 30 Min</h3>
        <div className="grid grid-cols-4 gap-4">
          {predictedDemands.map((demand, i) => (
            <div key={i} className="glass-card p-4 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <demand.icon size={16} className={demand.color} />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{demand.type}</span>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{demand.current}</span>
                <span className="text-gray-500 mb-1">/ {demand.total}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-cardBorder">
                <span className="text-[10px] text-gray-400">Predicted Need: <span className="font-bold text-white">{demand.predicted}</span></span>
                <span className={`text-[10px] font-bold ${demand.riskColor}`}>{demand.risk} Risk</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Resources & Plan */}
      <div className="grid grid-cols-3 gap-6 flex-1">
        {/* Field Units List */}
        <div className="col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Active Field Units</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {fieldUnits.map((unit) => {
              const isHighlighted = isOptimized && unit.isRecommended;
              const isUnitAssigned = assignedResources[unit.id];
              const status = isUnitAssigned ? 'Assigned' : unit.status;
              const statusBadge = isUnitAssigned 
                ? 'bg-safe/20 text-safe border-safe/30'
                : status === 'Available' ? 'bg-safe/20 text-safe border-safe/30' : 'bg-warning/20 text-warning border-warning/30';

              return (
                <div key={unit.id} className={`glass-card p-4 transition-all duration-500 ${isHighlighted ? 'border-primary shadow-[0_0_15px_rgba(14,165,233,0.3)] bg-primary/5' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isHighlighted ? 'bg-primary/20 text-primary' : 'bg-cardBorder text-gray-400'}`}>
                        {unit.name.includes('Ambulance') ? <Truck size={18} /> : unit.name.includes('Medical') ? <HeartPulse size={18} /> : <Shield size={18} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{unit.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono">{unit.type}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge} uppercase`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs mb-4">
                    <div className="text-gray-400">Location: <span className="text-gray-200">{unit.location}</span></div>
                    <div className="text-gray-400">ETA: <span className="text-gray-200">{unit.eta}</span></div>
                    <div className="text-gray-400">Current Task: <span className="text-gray-200">{unit.assignment}</span></div>
                    <div className="text-gray-400">Best Fit: <span className="text-primary font-bold">{unit.fit}%</span></div>
                  </div>

                  {isHighlighted && !isUnitAssigned && (
                    <div className="mb-3 text-[10px] bg-primary/10 border border-primary/20 p-2 rounded text-primary">
                      <span className="font-bold">Recommended for:</span> {unit.recommendFor}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAssign(unit.id)}
                      disabled={isUnitAssigned || status === 'Deployed'}
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors border ${
                        isUnitAssigned || status === 'Deployed'
                          ? 'bg-cardBorder/50 border-cardBorder text-gray-500 cursor-not-allowed'
                          : isHighlighted 
                            ? 'bg-primary border-primary text-white hover:bg-primary/90' 
                            : 'bg-card border-cardBorder hover:bg-cardBorder/50 text-gray-300'
                      }`}
                    >
                      {isUnitAssigned ? 'Assigned' : 'Reassign'}
                    </button>
                    <button className="bg-card border border-cardBorder hover:bg-cardBorder/50 text-primary py-1.5 px-3 rounded transition-colors">
                      <Zap size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Deployment Plan */}
        <div className="col-span-1 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={16} className="text-primary" /> Recommended Plan
          </h3>
          <div className="glass-card flex flex-col flex-1 p-4 justify-between">
            {deploymentPlan.map((plan, i) => {
              const isExecuted = assignedResources[plan.id];
              return (
                <div key={plan.id} className="bg-card/60 border border-cardBorder rounded-lg p-3">
                  <div className="flex gap-2 mb-2">
                    <div className="bg-primary/20 text-primary w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-200 font-medium leading-snug">{plan.action}</p>
                  </div>
                  <div className="flex justify-between items-center pl-7 text-[10px] mb-3">
                    <span className="text-gray-400">Priority: <span className={plan.priority === 'High' ? 'text-warning font-bold' : 'text-gray-300'}>{plan.priority}</span></span>
                    <span className="text-gray-400">Impact: <span className={plan.impact === 'Critical' ? 'text-critical font-bold' : 'text-gray-300'}>{plan.impact}</span></span>
                  </div>
                  <div className="pl-7">
                    <button 
                      onClick={() => handleAssign(plan.id)}
                      disabled={isExecuted}
                      className={`w-full py-1.5 rounded text-xs font-bold flex justify-center items-center gap-2 transition-colors border ${
                        isExecuted 
                          ? 'bg-safe/20 border-safe/30 text-safe cursor-default'
                          : 'bg-card border-primary/30 hover:bg-primary/10 text-primary'
                      }`}
                    >
                      {isExecuted ? <><CheckCircle2 size={14} /> Executed</> : <><ArrowRight size={14} /> Execute</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
