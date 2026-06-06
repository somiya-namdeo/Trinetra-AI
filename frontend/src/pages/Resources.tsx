import React, { useEffect, useState } from 'react';
import { Network, Zap, Truck, ShieldAlert, HeartPulse, Shield, Thermometer, Loader2, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { getResources, getIncidents } from '../services/api';

const Resources = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  
  const [deploymentPlan, setDeploymentPlan] = useState<any[]>([]);
  const [reassigningId, setReassigningId] = useState<string | null>(null);
  
  const OPTIMIZATION_SCENARIOS = [
    { demand: 'Zone A Medical Surge', action: 'Pre-position Medical Team Bravo and Ambulance 02 near Gate 7.', conf: 91, time: 42, icon: HeartPulse, color: 'text-secondary' },
    { demand: 'Gate 7 Crowd Congestion', action: 'Deploy Volunteer Team 05 and Security Unit 02 to Gate 7.', conf: 88, time: 35, icon: ShieldAlert, color: 'text-warning' },
    { demand: 'North Gate Security Alert', action: 'Reposition Security Unit 01 to North Gate.', conf: 94, time: 50, icon: Shield, color: 'text-primary' },
    { demand: 'Water Supply Failure', action: 'Dispatch Water Supply 02 to Zone B.', conf: 85, time: 25, icon: Thermometer, color: 'text-orange-500' },
    { demand: 'Lost Child Search Operation', action: 'Assign Volunteer Team 05 to Gate 3.', conf: 92, time: 60, icon: AlertTriangle, color: 'text-warning' },
    { demand: 'Fire Hazard Escalation', action: 'Keep Fire Unit 03 on standby near Food Court.', conf: 96, time: 45, icon: ShieldAlert, color: 'text-critical' },
  ];
  const [optScenario, setOptScenario] = useState(OPTIMIZATION_SCENARIOS[0]);
  
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
      setLoading(true);
      const [data, incidents] = await Promise.all([getResources(), getIncidents()]);
      
      if (data && Array.isArray(data) && data.length > 0) {
        const mappedData = data.map((unit: any, idx: number) => {
           const fallbackUnit = fieldUnits[idx] || {};
           
           let etaText = `${unit.eta_minutes} min`;
           if (unit.eta_minutes === 0) {
               etaText = unit.status === 'Available' ? 'Available now' : 'On site';
           } else if (unit.eta_minutes === undefined) {
               etaText = fallbackUnit.eta;
           }

           const assignmentText = unit.assigned_incident_id || 'Unassigned';
           
           let bestFitScore = fallbackUnit.fit || Math.floor(Math.random() * 20) + 70;
           let recommendFor = fallbackUnit.recommendFor || 'Standby';

           if (unit.status === 'Available' && incidents && incidents.length > 0) {
             const activeIncs = incidents.filter((i: any) => i.status !== 'Resolved');
             if (activeIncs.length > 0) {
               const targetInc = activeIncs[idx % activeIncs.length];
               
               let score = 70;
               if (targetInc.category?.includes('Medical') && unit.type?.includes('Medical')) score += 15;
               if (targetInc.category?.includes('Fire') && unit.type?.includes('Fire')) score += 15;
               if (targetInc.zone === unit.location) score += 10;
               
               const etaNum = unit.eta_minutes || 0;
               if (etaNum < 5) score += 5;
               else if (etaNum < 15) score += 2;
               
               bestFitScore = Math.min(score, 99);
               recommendFor = `${targetInc.category} — ${targetInc.location || targetInc.zone}`;
             } else {
               recommendFor = 'Standby';
             }
           } else if (unit.status !== 'Available') {
             recommendFor = 'Standby';
           }

           return { 
               ...fallbackUnit, 
               ...unit,
               eta: etaText,
               assignment: assignmentText,
               location: unit.location || unit.zone || fallbackUnit.location,
               fit: bestFitScore,
               isRecommended: unit.status === 'Available' && bestFitScore > 80,
               recommendFor: recommendFor
           };
        });
        setFieldUnits(mappedData);
        
        // Generate dynamic deployment plan based on data
        let generatedPlans: any[] = [];
        let planId = 1;
        const availableUnits = mappedData.filter((u: any) => u.status === 'Available');
        const activeIncs = incidents && Array.isArray(incidents) ? incidents.filter((i: any) => i.severity === 'Critical' || i.severity === 'High') : [];
        
        availableUnits.slice(0, 3).forEach((u: any, i: number) => {
           const inc = activeIncs[i % activeIncs.length] || { location: 'Zone A', category: 'Emergency' };
           generatedPlans.push({
             id: `dp${planId++}`,
             action: `Dispatch ${u.name} to ${inc.zone || inc.location}`,
             priority: 'High', impact: 'Critical', effort: 'Low'
           });
        });
        
        const otherUnits = mappedData.filter((u: any) => u.status !== 'Available' && u.status !== 'Maintenance').slice(0, 3);
        otherUnits.forEach((u: any) => {
           generatedPlans.push({
             id: `dp${planId++}`,
             action: `Reposition ${u.name} near ${u.location || 'Riverfront'}`,
             priority: 'Medium', impact: 'Moderate', effort: 'Medium'
           });
        });
        
        if (generatedPlans.length < 5) {
          generatedPlans.push(
            { id: `dp${planId++}`, action: 'Deploy Water Supply 02 to Zone A', priority: 'High', impact: 'High', effort: 'Medium' },
            { id: `dp${planId++}`, action: 'Keep Fire Unit 03 on standby near Food Court', priority: 'Low', impact: 'Low', effort: 'None' },
            { id: `dp${planId++}`, action: 'Assign Volunteer Team 05 to North Gate queue control', priority: 'Medium', impact: 'Moderate', effort: 'Low' }
          );
        }
        
        setDeploymentPlan(generatedPlans.slice(0, 7));
      }
      setLoading(false);
    };
    fetchResources();
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setIsOptimized(false);
    
    setTimeout(() => {
      setIsOptimizing(false);
      setIsOptimized(true);
      const nextScenario = OPTIMIZATION_SCENARIOS[Math.floor(Math.random() * OPTIMIZATION_SCENARIOS.length)];
      setOptScenario(nextScenario);
      setShowToast({ show: true, message: `Optimization applied: Focus shifted to ${nextScenario.demand}` });
      
      setTimeout(() => setShowToast({ show: false, message: '' }), 4000);
    }, 1500);
  };

  const handleAssign = (id: string, isPlanAction = false, planText = '', forceZone = '') => {
    setAssignedResources(prev => ({ ...prev, [id]: true }));
    
    if (isPlanAction) {
      setShowToast({ show: true, message: '✓ Action Executed Successfully' });
      
      const unitMatch = fieldUnits.find(u => planText.includes(u.name));
      if (unitMatch) {
         setFieldUnits(prev => prev.map(u => {
           if (u.id === unitMatch.id) {
             const newLoc = planText.split(' to ')[1] || planText.split(' near ')[1] || u.location;
             return {
               ...u,
               status: 'Deployed',
               eta: 'On site',
               assignment: 'INC-AUTO',
               location: newLoc
             };
           }
           return u;
         }));
      }
    } else {
      const unit = fieldUnits.find(u => u.id === id);
      if (unit) {
        const isDeploy = unit.status === 'Available';
        setShowToast({ show: true, message: isDeploy ? 'Resource deployed successfully.' : `Resource reassigned to ${forceZone || 'new zone'}.` });
        
        setFieldUnits(prev => prev.map(u => {
          if (u.id === id) {
            let newLoc = forceZone || u.location;
            if (!forceZone && u.recommendFor && u.recommendFor !== 'Standby') {
              const parts = u.recommendFor.split(' — ');
              newLoc = parts.length > 1 ? parts[1] : parts[0];
            }
            return {
              ...u,
              status: 'Deployed',
              eta: 'On site',
              assignment: 'INC-AUTO',
              location: newLoc
            };
          }
          return u;
        }));
      }
    }
    
    setTimeout(() => setShowToast({ show: false, message: '' }), 3000);
  };

  const getResourceCounts = (typeStr: string) => {
    const units = fieldUnits.filter(u => u.type?.toLowerCase().includes(typeStr) || u.name?.toLowerCase().includes(typeStr));
    const available = units.filter(u => u.status === 'Available').length;
    return { current: available, total: Math.max(units.length, 1) };
  };

  const predictedDemands = [
    { type: 'Ambulances', ...getResourceCounts('amb'), predicted: '+2', icon: Truck, color: 'text-primary', badge: 'bg-primary/20 text-primary border-primary/30', risk: 'High', riskColor: 'text-warning' },
    { type: 'Medical Teams', ...getResourceCounts('med'), predicted: '+1', icon: HeartPulse, color: 'text-secondary', badge: 'bg-secondary/20 text-secondary border-secondary/30', risk: 'Moderate', riskColor: 'text-primary' },
    { type: 'Security Units', ...getResourceCounts('sec'), predicted: '+3', icon: Shield, color: 'text-warning', badge: 'bg-warning/20 text-warning border-warning/30', risk: 'Critical', riskColor: 'text-critical' },
    { type: 'Water Tankers', ...getResourceCounts('wat'), predicted: '+2', icon: Thermometer, color: 'text-orange-500', badge: 'bg-orange-500/20 text-orange-500 border-orange-500/30', risk: 'High', riskColor: 'text-warning' }
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
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
          Resource Coordination
          {loading && <Loader2 size={16} className="text-primary animate-spin" />}
        </h1>
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
            
            <div className={`grid grid-cols-2 gap-4 mb-6 transition-opacity duration-500 ${isOptimizing ? 'opacity-50' : 'opacity-100'}`}>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Demand Spike</p>
                <p className={`font-bold flex items-center gap-2 ${optScenario.color}`}>
                  <optScenario.icon size={16} /> {optScenario.demand}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Impact Metrics</p>
                <div className="flex items-center gap-4">
                  <div><span className="text-primary font-bold">{optScenario.conf}%</span> <span className="text-xs text-gray-400">Confidence</span></div>
                  <div><span className="text-safe font-bold">{optScenario.time}%</span> <span className="text-xs text-gray-400">Time Saved</span></div>
                </div>
              </div>
              <div className="col-span-2 bg-cardBorder/30 p-3 rounded border border-cardBorder">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Recommended Action</p>
                <p className="text-sm text-gray-200">{optScenario.action}</p>
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
              
              let statusBadge = '';
              if (isUnitAssigned) {
                statusBadge = 'bg-safe/20 text-safe border-safe/30';
              } else if (status === 'Available') {
                statusBadge = 'bg-safe/20 text-safe border-safe/30';
              } else if (status === 'Deployed') {
                statusBadge = 'bg-primary/20 text-primary border-primary/30';
              } else if (status === 'Busy') {
                statusBadge = 'bg-warning/20 text-warning border-warning/30';
              } else {
                statusBadge = 'bg-critical/20 text-critical border-critical/30';
              }

              return (
                <div key={unit.id} className={`glass-card p-4 transition-all duration-500 ${isHighlighted ? 'border-primary shadow-[0_0_20px_rgba(14,165,233,0.4)] bg-primary/10 animate-pulse-subtle' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${isHighlighted ? 'bg-primary/20 text-primary' : 'bg-cardBorder text-gray-400'}`}>
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
                    <div className="text-gray-400 truncate pr-2" title={unit.assignment}>Task: <span className="text-gray-200">{unit.assignment}</span></div>
                    <div className="text-gray-400">Best Fit: <span className="text-primary font-bold">{unit.fit || 'N/A'}%</span></div>
                    {unit.capacity && (
                      <div className="text-gray-400 col-span-2">Capacity: <span className="text-gray-200">{unit.capacity}</span></div>
                    )}
                  </div>

                  {isHighlighted && !isUnitAssigned && (
                    <div className="mb-3 text-[10px] bg-primary/10 border border-primary/20 p-2 rounded text-primary">
                      <span className="font-bold">Recommended for:</span> {unit.recommendFor}
                    </div>
                  )}

                  {reassigningId === unit.id ? (
                    <div className="flex gap-2">
                      <select 
                         className="flex-1 py-1.5 px-2 rounded text-xs bg-card border border-cardBorder text-gray-300 focus:outline-none"
                         onChange={(e) => {
                           if (e.target.value) {
                             handleAssign(unit.id, false, '', e.target.value);
                           }
                           setReassigningId(null);
                         }}
                         onBlur={() => setReassigningId(null)}
                         autoFocus
                      >
                        <option value="">Select Zone...</option>
                        <option value="Zone A">Zone A</option>
                        <option value="Zone B">Zone B</option>
                        <option value="Zone C">Zone C</option>
                        <option value="Gate 7">Gate 7</option>
                        <option value="North Gate">North Gate</option>
                        <option value="Base">Base</option>
                      </select>
                      <button onClick={() => setReassigningId(null)} className="bg-card border border-cardBorder hover:bg-cardBorder/50 text-gray-400 py-1.5 px-3 rounded transition-colors text-xs font-bold">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => status === 'Available' ? handleAssign(unit.id, false) : setReassigningId(unit.id)}
                        disabled={isUnitAssigned || status === 'Maintenance'}
                        className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors border ${
                          isUnitAssigned || status === 'Maintenance'
                            ? 'bg-cardBorder/50 border-cardBorder text-gray-500 cursor-not-allowed'
                            : isHighlighted 
                              ? 'bg-primary border-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20' 
                              : 'bg-card border-cardBorder hover:bg-cardBorder/50 text-gray-300'
                        }`}
                      >
                        {status === 'Maintenance' ? 'Unavailable' : isUnitAssigned ? 'Assigned' : status === 'Available' ? 'Deploy' : 'Reassign'}
                      </button>
                      <button className="bg-card border border-cardBorder hover:bg-cardBorder/50 text-primary py-1.5 px-3 rounded transition-colors">
                        <Zap size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Deployment Plan */}
        <div className="col-span-1 flex flex-col gap-4 sticky top-6 max-h-[calc(100vh-140px)]">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 shrink-0">
            <ShieldAlert size={16} className="text-primary" /> Recommended Plan
          </h3>
          <div className="glass-card flex flex-col p-4 gap-3 overflow-y-auto">
            {[...deploymentPlan]
              .sort((a, b) => {
                if (assignedResources[a.id] && !assignedResources[b.id]) return 1;
                if (!assignedResources[a.id] && assignedResources[b.id]) return -1;
                return 0;
              })
              .map((plan, i) => {
              const isExecuted = assignedResources[plan.id];
              return (
                <div key={plan.id} className={`transition-all duration-500 border rounded-lg p-3 ${isExecuted ? 'bg-safe/5 border-safe/20 opacity-70' : 'bg-card/60 border-cardBorder'}`}>
                  <div className="flex gap-2 mb-2">
                    <div className="bg-primary/20 text-primary w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-200 font-medium leading-snug">{plan.action}</p>
                  </div>
                  <div className="flex justify-between items-center pl-7 text-[10px] mb-3 transition-opacity">
                    <span className="text-gray-400">Priority: <span className={isExecuted ? 'text-safe font-bold' : plan.priority === 'High' ? 'text-warning font-bold' : 'text-gray-300'}>{isExecuted ? 'Executed' : plan.priority}</span></span>
                    <span className="text-gray-400">Impact: <span className={isExecuted ? 'text-gray-500 font-bold' : plan.impact === 'Critical' ? 'text-critical font-bold' : 'text-gray-300'}>{plan.impact}</span></span>
                  </div>
                  <div className="pl-7">
                    <button 
                      onClick={() => handleAssign(plan.id, true, plan.action)}
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
