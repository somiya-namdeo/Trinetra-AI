import React, { useEffect, useState } from 'react';
import { Network, Zap, Truck, ShieldAlert, HeartPulse, Shield, Thermometer, Loader2, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Flame, Radio, Users } from 'lucide-react';
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
  const initialMocks = [
    { id: 'u1', name: 'Ambulance 01', type: 'AMB-01', status: 'Deployed', location: 'Gate 7', eta: 'On site', assignment: 'INC-2840', fit: 82, isRecommended: false },
    { id: 'u2', name: 'Ambulance 02', type: 'AMB-02', status: 'Available', location: 'Base', eta: '3 min', assignment: 'None', fit: 96, isRecommended: true, recommendFor: 'Elderly collapse near Gate 7' },
    { id: 'u3', name: 'Medical Team Alpha', type: 'MED-01', status: 'Deployed', location: 'Zone A', eta: 'On site', assignment: 'INC-2841', fit: 75, isRecommended: false },
    { id: 'u4', name: 'Medical Team Bravo', type: 'MED-02', status: 'Available', location: 'Zone B', eta: '4 min', assignment: 'None', fit: 94, isRecommended: true, recommendFor: 'Heat Stress Cluster — Zone A' },
    { id: 'u5', name: 'Security Unit 01', type: 'SEC-01', status: 'Deployed', location: 'North Gate', eta: 'On site', assignment: 'INC-2838', fit: 88, isRecommended: false },
    { id: 'u6', name: 'Security Unit 02', type: 'SEC-02', status: 'Available', location: 'Gate 7', eta: '2 min', assignment: 'None', fit: 91, isRecommended: true, recommendFor: 'Minor crowd surge near Gate 3' },
  ];
  const [fieldUnits, setFieldUnits] = useState<any[]>(initialMocks);

  const calculateFitScore = (unit: any, targetDemand: string) => {
    let etaScore = 0;
    const etaStr = String(unit.eta || '').toLowerCase();
    let mins = 0;
    if (etaStr.includes('on site') || etaStr.includes('now')) mins = 1;
    else {
      const match = etaStr.match(/(\d+)/);
      if (match) mins = parseInt(match[1]);
      else mins = 10;
    }
    if (mins <= 2) etaScore = 100;
    else if (mins <= 5) etaScore = 90;
    else if (mins <= 10) etaScore = 75;
    else etaScore = 50;
    
    let availScore = 0;
    const status = unit.status;
    if (status === 'Available') availScore = 100;
    else if (status === 'Busy') availScore = 60;
    else if (status === 'Deployed') availScore = 40;
    else availScore = 0;
    
    let locScore = 65;
    const d = targetDemand.toLowerCase();
    let targetLoc = '';
    if (d.includes('gate 7')) targetLoc = 'Gate 7';
    else if (d.includes('zone a')) targetLoc = 'Zone A';
    else if (d.includes('north gate')) targetLoc = 'North Gate';
    else if (d.includes('gate 3')) targetLoc = 'Gate 3';
    else if (d.includes('food court')) targetLoc = 'Food Court';
    else if (d.includes('zone b')) targetLoc = 'Zone B';

    if (targetLoc && unit.location && (unit.location.includes(targetLoc) || targetLoc.includes(unit.location))) {
        locScore = 100;
    } else if (targetLoc) {
        locScore = 40;
    }
    
    let capScore = 0;
    const cap = String(unit.capacity || 'N/A').toLowerCase();
    if (cap === 'n/a' || cap === '0') {
      const hash = unit.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      capScore = hash % 2 === 0 ? 100 : 70;
    } else {
       const num = parseInt(cap);
       if (num >= 6) capScore = 100;
       else if (num >= 3) capScore = 70;
       else capScore = 40;
    }
    
    const finalScore = (etaScore * 0.4) + (locScore * 0.3) + (availScore * 0.2) + (capScore * 0.1);
    const variance = (unit.name.length % 5) - 2; 
    return Math.min(100, Math.max(0, Math.floor(finalScore + variance)));
  };

  const generateDeploymentPlan = (scenario: any, units: any[]) => {
    let generatedPlans: any[] = [];
    let planId = Date.now();
    const d = scenario.demand.toLowerCase();
    let loc = 'Site';
    if (d.includes('gate 7')) loc = 'Gate 7';
    else if (d.includes('zone a')) loc = 'Zone A';
    else if (d.includes('north gate')) loc = 'North Gate';
    else if (d.includes('gate 3')) loc = 'Gate 3';
    else if (d.includes('food court')) loc = 'Food Court';
    else if (d.includes('zone b')) loc = 'Zone B';

    let updatedUnits = units.map(u => {
       const typeLower = (u.type || '').toLowerCase();
       const nameLower = (u.name || '').toLowerCase();
       let score = 70;
       
       if (d.includes('lost') || d.includes('missing')) {
         if (typeLower.includes('volunteer')) score += 20;
         if (typeLower.includes('security')) score += 20;
         if (typeLower.includes('drone')) score += 20;
         if (typeLower.includes('command')) score += 20;
       } else if (d.includes('medical') || d.includes('collapse') || d.includes('health')) {
         if (typeLower.includes('ambulance') || typeLower.includes('medical')) score += 20;
         if ((d.includes('crowd') || d.includes('gate')) && typeLower.includes('security')) score += 20;
       } else if (d.includes('fire') || d.includes('hazard')) {
         if (typeLower.includes('fire')) score += 20;
         if (typeLower.includes('ambulance') || typeLower.includes('medical')) score += 20;
         if (typeLower.includes('security')) score += 20;
         if (typeLower.includes('command')) score += 20;
       } else if (d.includes('crowd') || d.includes('surge') || d.includes('congestion')) {
         if (typeLower.includes('security')) score += 20;
         if (typeLower.includes('volunteer')) score += 20;
         if (typeLower.includes('drone')) score += 20;
         if (typeLower.includes('command')) score += 20;
       } else if (d.includes('water') || d.includes('infrastructure')) {
         if (typeLower.includes('water')) score += 20;
         if (typeLower.includes('volunteer')) score += 20;
         if (typeLower.includes('command')) score += 20;
         if ((d.includes('crowd') || d.includes('risk')) && typeLower.includes('security')) score += 20;
       }
       
       const etaNum = u.eta_minutes || 0;
       if (etaNum < 5) score += 5;
       else if (etaNum < 15) score += 2;
       
       return {
         ...u,
         dynamicFit: Math.min(score, 99),
         isRecommended: false,
         recommendFor: score > 80 ? scenario.demand : 'Standby'
       };
    });
    
    // Highlight/glow only the top 3 to 4 best matching units across all recommended resource types.
    const availableRecs = updatedUnits.filter(u => String(u.status).toUpperCase() === 'AVAILABLE' && u.dynamicFit > 80)
         .sort((a, b) => b.dynamicFit - a.dynamicFit)
         .slice(0, 4);
         
    availableRecs.forEach(u => u.isRecommended = true);
    
    // Sort recommended cards to the top
    updatedUnits.sort((a, b) => {
       if (a.isRecommended && !b.isRecommended) return -1;
       if (!a.isRecommended && b.isRecommended) return 1;
       if (String(a.status).toUpperCase() === 'DEPLOYED' && String(b.status).toUpperCase() !== 'DEPLOYED') return -1;
       if (String(a.status).toUpperCase() !== 'DEPLOYED' && String(b.status).toUpperCase() === 'DEPLOYED') return 1;
       return 0;
    });

    const getUnit = (typeMatch: string) => {
       const scoredUnits = updatedUnits.filter(u => u.type?.toLowerCase().includes(typeMatch) || u.name?.toLowerCase().includes(typeMatch));
       scoredUnits.sort((a, b) => b.dynamicFit - a.dynamicFit);
       
       const avail = scoredUnits.find(u => String(u.status).toUpperCase() === 'AVAILABLE');
       if (avail) return `${avail.name} (${avail.dynamicFit}%)`;
       const anyUnit = scoredUnits[0];
       return anyUnit ? `${anyUnit.name} (${anyUnit.dynamicFit}%)` : `Standby Unit (${typeMatch})`;
    };

    if (d.includes('water') || d.includes('infrastructure')) {
      generatedPlans.push({ id: `dp${planId++}`, action: `Dispatch ${getUnit('water')} to ${loc}`, priority: 'High', impact: 'Critical', effort: 'Medium' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Deploy ${getUnit('volunteer')} to ${loc}`, priority: 'High', impact: 'High', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Send ${getUnit('command')} to ${loc}`, priority: 'Medium', impact: 'Moderate', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Assign ${getUnit('sec')} for crowd risk control`, priority: 'Medium', impact: 'Moderate', effort: 'Low' });
    } else if (d.includes('crowd') || d.includes('congestion') || d.includes('surge')) {
      generatedPlans.push({ id: `dp${planId++}`, action: `Deploy ${getUnit('sec')} to ${loc}`, priority: 'High', impact: 'Critical', effort: 'Medium' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Deploy ${getUnit('volunteer')} to ${loc}`, priority: 'High', impact: 'High', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Send ${getUnit('drone')} to ${loc}`, priority: 'Medium', impact: 'Moderate', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Send ${getUnit('command')} to ${loc}`, priority: 'Medium', impact: 'Moderate', effort: 'Low' });
    } else if (d.includes('lost') || d.includes('missing')) {
      generatedPlans.push({ id: `dp${planId++}`, action: `Deploy ${getUnit('volunteer')} to search zone`, priority: 'High', impact: 'High', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Assign ${getUnit('sec')} to gate exits`, priority: 'High', impact: 'High', effort: 'Medium' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Send ${getUnit('drone')} for search support`, priority: 'Medium', impact: 'High', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Generate PA announcement`, priority: 'Low', impact: 'High', effort: 'Low' });
    } else if (d.includes('medical') || d.includes('collapse') || d.includes('health')) {
      generatedPlans.push({ id: `dp${planId++}`, action: `Dispatch ${getUnit('amb')} to ${loc}`, priority: 'High', impact: 'Critical', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Deploy ${getUnit('med')} to ${loc}`, priority: 'High', impact: 'Critical', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Assign ${getUnit('sec')} for crowd control`, priority: 'Medium', impact: 'Moderate', effort: 'Low' });
    } else if (d.includes('fire') || d.includes('hazard')) {
      generatedPlans.push({ id: `dp${planId++}`, action: `Dispatch ${getUnit('fire')} to ${loc}`, priority: 'High', impact: 'Critical', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Dispatch ${getUnit('amb')} to ${loc}`, priority: 'High', impact: 'High', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Assign ${getUnit('sec')} to ${loc}`, priority: 'High', impact: 'Moderate', effort: 'Low' });
      generatedPlans.push({ id: `dp${planId++}`, action: `Send ${getUnit('command')} to ${loc}`, priority: 'Medium', impact: 'Moderate', effort: 'Low' });
    } else {
       generatedPlans.push({ id: `dp${planId++}`, action: `Dispatch ${getUnit('sec')} to ${loc}`, priority: 'High', impact: 'Moderate', effort: 'Low' });
    }

    setDeploymentPlan(generatedPlans);
    return updatedUnits;
  };

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const [data, incidents] = await Promise.all([getResources(), getIncidents()]);
      
      let rawResources = data;
      if (!rawResources || !Array.isArray(rawResources) || rawResources.length === 0) {
        rawResources = initialMocks;
      }
      
      if (rawResources.length > 0) {
        const mappedData = rawResources.map((unit: any, idx: number) => {
           const fallbackUnit = initialMocks[idx] || {};
           
           const safeName = unit.name || fallbackUnit.name || "Unnamed Resource";
           const safeType = unit.type || fallbackUnit.type || "General Resource";
           const safeStatus = unit.status || fallbackUnit.status || "Available";
           const safeLocation = unit.location || unit.zone || fallbackUnit.location || "Standby Base";
           const safeEta = unit.eta_minutes !== undefined && unit.eta_minutes !== null ? (unit.eta_minutes === 0 ? (safeStatus === 'Available' ? 'Available now' : 'On site') : `${unit.eta_minutes} min`) : (unit.eta || fallbackUnit.eta || "Available now");
           let safeTask = unit.assigned_incident_id || unit.task || fallbackUnit.assignment || "Unassigned";
           let safeFit = unit.bestFit || fallbackUnit.fit || 75;
           let safeCapacity = unit.capacity ?? "N/A";
           
           const nameLower = safeName.toLowerCase();
           const typeLower = safeType.toLowerCase();
           
           if (nameLower.includes('fire') || typeLower.includes('fire')) {
             if (safeCapacity === 'N/A') safeCapacity = 6;
             safeFit = safeFit === 75 ? 80 : safeFit;
           } else if (nameLower.includes('drone') || typeLower.includes('drone')) {
             if (safeCapacity === 'N/A') safeCapacity = 1;
             if (safeTask === 'Unassigned') safeTask = 'Surveillance / Unassigned';
             safeFit = safeFit === 75 ? 70 : safeFit;
           } else if (nameLower.includes('volunteer') || typeLower.includes('volunteer')) {
             if (safeCapacity === 'N/A') safeCapacity = 8;
             if (safeTask === 'Unassigned') safeTask = 'Crowd Support / Unassigned';
             safeFit = safeFit === 75 ? 75 : safeFit;
           } else if (nameLower.includes('command') || typeLower.includes('command')) {
             if (safeCapacity === 'N/A') safeCapacity = 8;
             if (safeTask === 'Unassigned') safeTask = 'Coordination / Unassigned';
             safeFit = safeFit === 75 ? 85 : safeFit;
           }

           let recommendFor = fallbackUnit.recommendFor || 'Standby';
           if (safeStatus === 'Available' && incidents && incidents.length > 0) {
             const activeIncs = incidents.filter((i: any) => i.status !== 'Resolved');
             if (activeIncs.length > 0) {
               const targetInc = activeIncs[idx % activeIncs.length];
               let score = 70;
               if (targetInc.category?.includes('Medical') && typeLower.includes('medical')) score += 15;
               if (targetInc.category?.includes('Fire') && typeLower.includes('fire')) score += 15;
               if (targetInc.zone === safeLocation || targetInc.location === safeLocation) score += 10;
               const etaNum = unit.eta_minutes || 0;
               if (etaNum < 5) score += 5;
               else if (etaNum < 15) score += 2;
               safeFit = Math.min(score, 99);
               recommendFor = `${targetInc.category} — ${targetInc.location || targetInc.zone}`;
             }
           } else if (safeStatus !== 'Available') {
             recommendFor = 'Standby';
           }

           return { 
               ...unit,
               id: unit.id || fallbackUnit.id || `res-${idx}`,
               name: safeName,
               type: safeType,
               status: safeStatus,
               location: safeLocation,
               capacity: safeCapacity,
               eta: safeEta,
               assignment: safeTask,
               fit: safeFit,
               isRecommended: safeStatus === 'Available' && safeFit > 80,
               recommendFor: recommendFor
           };
        });
        const finalUnits = generateDeploymentPlan(optScenario, mappedData);
        setFieldUnits(finalUnits);
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
      setFieldUnits(prev => { 
        const updated = generateDeploymentPlan(nextScenario, prev); 
        return updated; 
      });
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
         setAssignedResources(prev => ({ ...prev, [unitMatch.id]: true }));
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

  const getResourceCounts = (typeStr: string, fallbackDeployed: number, fallbackTotal: number) => {
    const units = fieldUnits.filter(u => u.type?.toLowerCase().includes(typeStr) || u.name?.toLowerCase().includes(typeStr));
    if (units.length > 0) {
      const deployed = units.filter(u => u.status?.toLowerCase() === 'deployed' || u.status?.toLowerCase() === 'busy' || u.status?.toLowerCase() === 'assigned').length;
      return { current: deployed, total: units.length };
    }
    return { current: fallbackDeployed, total: fallbackTotal };
  };

  const predictedDemands = [
    { type: 'Ambulances', ...getResourceCounts('amb', 4, 8), predicted: '+2', icon: Truck, color: 'text-primary', badge: 'bg-primary/20 text-primary border-primary/30', risk: 'High', riskColor: 'text-warning' },
    { type: 'Medical Teams', ...getResourceCounts('med', 5, 10), predicted: '+1', icon: HeartPulse, color: 'text-secondary', badge: 'bg-secondary/20 text-secondary border-secondary/30', risk: 'Moderate', riskColor: 'text-primary' },
    { type: 'Security Units', ...getResourceCounts('sec', 12, 20), predicted: '+3', icon: Shield, color: 'text-warning', badge: 'bg-warning/20 text-warning border-warning/30', risk: 'Critical', riskColor: 'text-critical' },
    { type: 'Water Tankers', ...getResourceCounts('wat', 1, 3), predicted: '+2', icon: Thermometer, color: 'text-orange-500', badge: 'bg-orange-500/20 text-orange-500 border-orange-500/30', risk: 'High', riskColor: 'text-warning' },
    { type: 'Fire Units', ...getResourceCounts('fire', 2, 6), predicted: '+2', icon: Flame, color: 'text-red-500', badge: 'bg-red-500/20 text-red-500 border-red-500/30', risk: 'High', riskColor: 'text-warning' },
    { type: 'Drone Units', ...getResourceCounts('drone', 1, 2), predicted: '+1', icon: Radio, color: 'text-blue-400', badge: 'bg-blue-400/20 text-blue-400 border-blue-400/30', risk: 'Moderate', riskColor: 'text-primary' },
    { type: 'Volunteer Teams', ...getResourceCounts('volunteer', 6, 10), predicted: '+4', icon: Users, color: 'text-emerald-400', badge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30', risk: 'High', riskColor: 'text-warning' },
    { type: 'Command Vehicles', ...getResourceCounts('command', 1, 2), predicted: '+1', icon: Shield, color: 'text-purple-400', badge: 'bg-purple-400/20 text-purple-400 border-purple-400/30', risk: 'Moderate', riskColor: 'text-primary' }
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
              <div className="bg-card/50 border border-cardBorder rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Predicted Peak Demand</p>
                <h3 className="font-bold text-white text-md mb-2">{optScenario.demand}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-primary">Confidence: {optScenario.conf}%</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-400">Impact in: {optScenario.time}m</span>
                </div>
              </div>
              <div className="bg-card/50 border border-cardBorder rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Recommended Action</p>
                <div className="flex gap-2">
                  <optScenario.icon className={`mt-0.5 ${optScenario.color}`} size={16} />
                  <p className="font-bold text-white text-sm">{optScenario.action}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? <><Loader2 className="animate-spin" size={18} /> Optimizing Network...</> : 'Run Re-Optimization Phase'}
            </button>
          </div>
        </div>

        {/* System Load Balance */}
        <div className="col-span-1 glass-card p-6 border-t-2 border-t-safe">
          <h3 className="font-bold text-white text-sm mb-4">Resource Load Balance</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Zone A</span>
              <span className="text-xs font-bold text-warning bg-warning/20 border border-warning/30 px-2 py-0.5 rounded">High Load</span>
            </div>
            <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden mb-2"><div className="bg-warning h-full rounded-full w-[85%]"></div></div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Zone B</span>
              <span className="text-xs font-bold text-safe bg-safe/20 border border-safe/30 px-2 py-0.5 rounded">Optimal</span>
            </div>
            <div className="w-full bg-cardBorder h-1.5 rounded-full overflow-hidden mb-2"><div className="bg-safe h-full rounded-full w-[35%]"></div></div>
            
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          {fieldUnits.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-card/30 border border-cardBorder rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400">No active field units found. Check resources API or fallback data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 flex-1">
              {(() => {
                const getRequiredResourceTypes = (demand: string) => {
                  const d = demand.toLowerCase();
                  if (d.includes('medical') || d.includes('collapse')) return ['amb', 'med'];
                  if (d.includes('fire')) return ['fire', 'amb', 'sec'];
                  if (d.includes('crowd') || d.includes('congestion') || d.includes('surge')) return ['sec', 'volunteer', 'drone'];
                  if (d.includes('water')) return ['wat', 'volunteer', 'command'];
                  if (d.includes('lost')) return ['volunteer', 'sec', 'drone'];
                  if (d.includes('infrastructure') || d.includes('alert')) return ['command', 'sec', 'volunteer'];
                  return [];
                };

                const requiredTypes = isOptimized ? getRequiredResourceTypes(optScenario.demand) : [];

                const scoredUnits = fieldUnits.map(u => ({
                   ...u,
                   dynamicFit: isOptimized ? calculateFitScore(u, optScenario.demand) : (u.fit || 75)
                }));

                const sortedFieldUnits = [...scoredUnits].sort((a, b) => {
                  const isMatchA = requiredTypes.some(t => (a.type || '').toLowerCase().includes(t) || (a.name || '').toLowerCase().includes(t));
                  const isMatchB = requiredTypes.some(t => (b.type || '').toLowerCase().includes(t) || (b.name || '').toLowerCase().includes(t));
                  
                  if (isMatchA && !isMatchB) return -1;
                  if (!isMatchA && isMatchB) return 1;
                  
                  if (isMatchA && isMatchB) {
                     return b.dynamicFit - a.dynamicFit;
                  }
                  
                  const isMaintA = a.status === 'Maintenance' || a.status === 'Unavailable';
                  const isMaintB = b.status === 'Maintenance' || b.status === 'Unavailable';
                  if (isMaintA && !isMaintB) return 1;
                  if (!isMaintA && isMaintB) return -1;
                  
                  return b.dynamicFit - a.dynamicFit;
                });

                const isCritical = optScenario.demand.toLowerCase().includes('fire') || optScenario.demand.toLowerCase().includes('surge') || optScenario.demand.toLowerCase().includes('failure');
                const topN = isCritical ? 5 : 3;
                let recommendedCount = 0;

                return sortedFieldUnits.map((unit) => {
                  const isMatch = requiredTypes.some(t => (unit.type || '').toLowerCase().includes(t) || (unit.name || '').toLowerCase().includes(t));
                  const isUnitAssigned = assignedResources[unit.id];
                  
                  let isHighlighted = false;
                  if (isOptimized && isMatch && !isUnitAssigned && recommendedCount < topN) {
                     isHighlighted = true;
                     recommendedCount++;
                  }
                  
                  const status = isUnitAssigned ? 'Assigned' : unit.status;
                  const isAvail = status === 'Available';
                  
                  let statusBadge = '';
                  if (isUnitAssigned) {
                    statusBadge = 'bg-safe/20 text-safe border-safe/30';
                  } else if (isHighlighted) {
                    statusBadge = isAvail ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-warning/20 text-warning border-warning/50';
                  } else if (status === 'Available') {
                    statusBadge = 'bg-safe/20 text-safe border-safe/30';
                  } else if (status === 'Deployed') {
                    statusBadge = 'bg-primary/20 text-primary border-primary/30';
                  } else if (status === 'Busy') {
                    statusBadge = 'bg-warning/20 text-warning border-warning/30';
                  } else {
                    statusBadge = 'bg-critical/20 text-critical border-critical/30';
                  }
                  
                  const statusLabel = isHighlighted ? (isAvail ? 'Recommended' : 'Reassign Candidate') : status;

                  const nameStr = unit.name || "";
                let IconComponent = Shield;
                if (nameStr.includes('Ambulance')) IconComponent = Truck;
                else if (nameStr.includes('Medical')) IconComponent = HeartPulse;
                else if (nameStr.includes('Fire')) IconComponent = ShieldAlert;
                else if (nameStr.includes('Water')) IconComponent = Thermometer;
                else if (nameStr.includes('Drone')) IconComponent = Zap;

                return (
                  <div key={unit.id} className={`glass-card p-4 transition-all duration-500 flex flex-col ${isHighlighted ? 'border-primary shadow-[0_0_20px_rgba(14,165,233,0.4)] bg-primary/10 animate-pulse-subtle' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${isHighlighted ? 'bg-primary/20 text-primary' : 'bg-cardBorder text-gray-400'}`}>
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{unit.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono">{unit.type}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge} uppercase`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs mb-auto">
                    <div className="text-gray-400 truncate" title={unit.location}>Location: <span className="text-gray-200">{unit.location}</span></div>
                    <div className="text-gray-400">ETA: <span className="text-gray-200">{unit.eta}</span></div>
                    <div className="text-gray-400 truncate pr-2" title={unit.assignment}>Task: <span className="text-gray-200">{unit.assignment}</span></div>
                    <div className="text-gray-400">Best Fit: <span className="text-primary font-bold">{unit.dynamicFit}%</span></div>
                    {unit.capacity !== undefined && (
                      <div className="text-gray-400 col-span-2">Capacity: <span className="text-gray-200">{unit.capacity === 0 ? 'N/A' : unit.capacity}</span></div>
                    )}
                  </div>

                  {isHighlighted && !isUnitAssigned && (
                    <div className="my-3 text-[10px] bg-primary/10 border border-primary/20 p-2 rounded text-primary">
                      <span className="font-bold">Recommended for:</span> {optScenario.demand}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-cardBorder">
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
                              ? 'bg-primary border-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                              : 'bg-card border-cardBorder hover:bg-cardBorder/50 text-gray-300'
                        }`}
                      >
                        {status === 'Maintenance' ? 'Unavailable' : isUnitAssigned ? 'Assigned' : isHighlighted ? (isAvail ? 'Deploy Recommended' : 'Reassign Recommended') : (isAvail ? 'Deploy' : 'Reassign')}
                      </button>
                      <button className="bg-card border border-cardBorder hover:bg-cardBorder/50 text-primary py-1.5 px-3 rounded transition-colors flex-shrink-0">
                        <Zap size={14} />
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
          )}
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
