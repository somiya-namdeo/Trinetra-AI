import React, { useEffect, useState } from 'react';
import { BrainCircuit, Network, Activity, ShieldAlert, HeartPulse, MessageSquareWarning, Zap, ArrowRight, AlertTriangle, Droplet, Users, Clock, CheckCircle2, Search, Database, LocateFixed, GitCommit, Loader2, RefreshCw } from 'lucide-react';
import { getMemoryInsight, generateAlert, getIncidents, getZones, getResources, dispatchResource } from '../services/api';

const MemoryAI = () => {
  const [insightData, setInsightData] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [actionStates, setActionStates] = useState<Record<number, 'pending' | 'executing' | 'executed'>>({});
  const [actionSummaries, setActionSummaries] = useState<Record<number, string>>({});
  const [toastMessage, setToastMessage] = useState<{ show: boolean, msg: string }>({ show: false, msg: '' });
  
  const executedCount = Object.values(actionStates).filter(s => s === 'executed').length;

  const fetchData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    
    try {
      const [insightRes, incidentsRes, zonesRes, resourcesRes] = await Promise.all([
        getMemoryInsight(),
        getIncidents(),
        getZones(),
        getResources()
      ]);

      if (insightRes) setInsightData(insightRes);
      if (incidentsRes) setIncidents(Array.isArray(incidentsRes) ? incidentsRes : []);
      if (zonesRes) setZones(Array.isArray(zonesRes) ? zonesRes : []);
      if (resourcesRes) setResources(Array.isArray(resourcesRes) ? resourcesRes : []);
    } catch (err) {
      console.error("Error fetching Memory AI data:", err);
    } finally {
      if (showRefreshIndicator) setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
    
    const interval = setInterval(() => {
      fetchData(false);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    await fetchData(true);
    setToastMessage({ show: true, msg: "Memory AI intelligence refreshed." });
    setTimeout(() => setToastMessage({ show: false, msg: '' }), 4000);
  };

  const findResourceByType = (typeString: string) => {
    const typeLower = typeString.toLowerCase();
    const available = resources.filter(r => r.status === 'Available');
    if (typeLower.includes('fire')) return available.find(r => r.type?.toLowerCase().includes('fire') || r.name?.toLowerCase().includes('fire'));
    if (typeLower.includes('ambulance') || typeLower.includes('medical')) return available.find(r => r.type?.toLowerCase().includes('ambulance') || r.type?.toLowerCase().includes('medical'));
    if (typeLower.includes('security')) return available.find(r => r.type?.toLowerCase().includes('security') || r.name?.toLowerCase().includes('security'));
    if (typeLower.includes('volunteer')) return available.find(r => r.type?.toLowerCase().includes('volunteer') || r.name?.toLowerCase().includes('volunteer'));
    if (typeLower.includes('utility') || typeLower.includes('water')) return available.find(r => r.type?.toLowerCase().includes('water') || r.name?.toLowerCase().includes('water'));
    if (typeLower.includes('command')) return available.find(r => r.type?.toLowerCase().includes('command'));
    return available[0]; // fallback
  };

  const activeIncidents = incidents ? incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'Resolved') : [];
  const latestInc = activeIncidents.length > 0 ? [...activeIncidents].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null;
  const incCategory = (latestInc?.category || '').toLowerCase();
  
  let dynamicPattern = {
    title: 'Pattern Detection Active',
    trace: ['Monitoring incoming telemetry...', 'Awaiting significant anomalies.'],
    signals: ['Baseline crowd movement', 'Nominal temperature'],
    outcome: 'System stable. No escalation predicted.',
    nodes: ['Incident Class.', 'Risk Prediction'],
    recommendations: ['Maintain current operational posture', 'Monitor zone telemetry'],
    timeline: ['Initial Anomaly', 'Pattern Matched', 'ML Risk Scored', 'AI Alert Generated', 'Resource Dispatch Recommended', 'Situation Monitoring']
  };

  if (incCategory.includes('fire')) {
    dynamicPattern = {
      title: 'Fire Hazard Escalation',
      trace: ['Detected thermal anomaly', 'Correlated with crowd density in adjacent zones', 'Identified rapid temperature increase'],
      signals: ['Thermal sensor #42 (High)', 'Smoke detector #12 (Active)', 'Evacuation Radius: Active'],
      outcome: 'High probability of structural fire spread within 12 minutes.',
      nodes: ['Fire Signal', 'Evacuation AI', 'Fire Response', 'Risk Prediction', 'Broadcast Agent'],
      recommendations: ['Dispatch Fire Units to affected zone', 'Dispatch Ambulances for standby', 'Establish Safety Perimeter', 'Broadcast Evacuation to adjacent zones'],
      timeline: ['Fire Alert Received', 'Hazard Confirmed', 'Fire Unit Dispatched', 'Containment Started', 'Hazard Neutralized', 'Zone Secured']
    };
  } else if (incCategory.includes('crowd') || incCategory.includes('surge')) {
    dynamicPattern = {
      title: 'Crowd Surge Correlation',
      trace: ['Detected rapid density increase', 'Matched bottleneck signature at main gate', 'Correlated with incoming transit volume'],
      signals: ['Camera feed: Gate 3 (Congestion)', 'Turnstile throughput (Critical)', 'Density Level: High'],
      outcome: 'Risk of crushing incident or trampling at choke points.',
      nodes: ['Crowd Intel', 'Density Monitor', 'Gate Flow AI', 'Security Dispatch', 'Diversion Control'],
      recommendations: ['Deploy Security Teams to bottleneck', 'Deploy Volunteers to guide flow', 'Open Alternative Gates', 'Crowd Guidance Broadcast via PA'],
      timeline: ['Crowd Build-up Detected', 'Density Threshold Crossed', 'Security Deployed', 'Flow Diversion Initiated', 'Congestion Reduced', 'Situation Normal']
    };
  } else if (incCategory.includes('medical') || incCategory.includes('health')) {
    dynamicPattern = {
      title: 'Medical Escalation Pattern',
      trace: ['Multiple simultaneous distress signals', 'Matched with high-heat zone history', 'Correlated with prolonged wait times'],
      signals: ['Unconscious/not responding report', 'High-density gate area', 'Patient Risk: Critical'],
      outcome: 'Potential patient deterioration if response delayed.',
      nodes: ['Incident Class', 'Medical Intel', 'Ambulance Routing', 'Risk Prediction', 'Resource Optimizer'],
      recommendations: [`Dispatch ambulance to ${latestInc?.location || latestInc?.zone || 'target zone'}`, 'Deploy medical response team', 'Clear emergency access route', 'Assign security unit for crowd control'],
      timeline: ['Incident Reported', 'Medical Classification', 'Resource Recommendation', 'Ambulance Assigned', 'Response In Progress', 'Patient Stabilized']
    };
  } else if (incCategory.includes('lost') || incCategory.includes('child')) {
    dynamicPattern = {
      title: 'Child Separation Cluster',
      trace: ['Missing person report filed', 'Correlated with crowd movement vectors', 'Matched typical separation locations'],
      signals: ['Report: Missing 6yo', 'Crowd flow: Outbound', 'Exit Gate Risk: High'],
      outcome: 'Likely location trajectory points toward North Exit within 5 mins.',
      nodes: ['Missing Person Signal', 'Crowd Flow Analysis', 'Search Zone AI', 'Volunteer Dispatch', 'Reunification Center'],
      recommendations: ['Deploy Security to exit routes', 'Deploy Volunteer Search Teams', 'Activate Reunification Center', 'Targeted PA Announcement'],
      timeline: ['Child Reported Missing', 'Search Zone Defined', 'Volunteer Teams Assigned', 'Drone Search Activated', 'Child Located', 'Family Reunited']
    };
  } else if (incCategory.includes('water') || incCategory.includes('infrastructure')) {
    dynamicPattern = {
      title: 'Infrastructure Degradation Pattern',
      trace: ['Water pressure drop detected', 'Correlated with high ambient temperature', 'Matched historical pump failure'],
      signals: ['Pressure sensor (Low)', 'Temperature (High)', 'Tanker Demand: Rising'],
      outcome: 'Imminent failure of Zone B water distribution leading to severe heat risks.',
      nodes: ['Infrastructure Signal', 'Demand Monitor', 'Water Supply AI', 'Resource Optimizer', 'Broadcast Agent'],
      recommendations: ['Dispatch Utility Teams for repair', 'Deploy Command Vehicle for coordination', 'Public Announcement regarding outage', 'Reroute attendees to Zone A'],
      timeline: ['Pressure Drop Detected', 'Demand Spike Correlated', 'Degradation Pattern Matched', 'Maintenance Alert Generated', 'Utility Dispatch Recommended', 'Alternative Supplied']
    };
  } else if (latestInc) {
    dynamicPattern = {
      title: 'General Anomaly Detected',
      trace: ['Monitoring incoming telemetry...', 'Evaluating anomaly impact'],
      signals: ['System state deviation'],
      outcome: 'Situation stabilizing.',
      nodes: ['Incident Class.', 'Risk Prediction'],
      recommendations: ['Monitor situation', 'Standby resources'],
      timeline: ['Anomaly Detected', 'Pattern Evaluating', 'Risk Assessed', 'Monitoring Active', 'Standby Mode', 'Situation Stable']
    };
  } else {
    dynamicPattern = {
      title: 'Situation Stable',
      trace: ['All incidents resolved.', 'Monitoring baseline telemetry.'],
      signals: ['Nominal temperature', 'Baseline crowd density'],
      outcome: 'No escalation predicted. Environment secure.',
      nodes: ['Risk Prediction'],
      recommendations: ['Monitor Situation', 'Maintain Readiness', 'Continue Surveillance'],
      timeline: ['Baseline Monitored', 'All Clear', 'Situation Stable', 'Situation Stable', 'Situation Stable', 'Situation Stable']
    };
  }

  const handleExecute = async (idx: number, actionText: string) => {
    setActionStates(prev => ({ ...prev, [idx]: 'executing' }));
    
    const textLower = actionText.toLowerCase();
    let toast = "Memory AI action executed successfully.";
    let summary = "";
    
    if (textLower.includes('dispatch') || 
        textLower.includes('deploy') || 
        textLower.includes('pre-position') || 
        textLower.includes('assign') ||
        textLower.includes('send')) {
        
        const targetResource = findResourceByType(textLower);
        if (targetResource) {
          await dispatchResource({
            id: targetResource.id,
            task: actionText,
            location: latestInc?.location || latestInc?.zone || 'Active Incident Zone',
            incident_id: latestInc?.id
          });
          summary = `Dispatched: ${targetResource.name}`;
          toast = `${targetResource.name} dispatched and system synced.`;
        } else {
          summary = "No available units matched!";
          toast = "Warning: No available resource units of this type.";
        }
    } else if (textLower.includes('broadcast') || textLower.includes('alert') || textLower.includes('pa announcement') || textLower.includes('announcement')) {
        toast = "Broadcast generated from Memory AI recommendation.";
        summary = "Broadcast Sent";
        if (insightData) {
          await generateAlert({
            incident_type: dynamicPattern.title,
            location: latestInc?.location || latestInc?.zone || 'All Zones',
            severity: latestInc?.severity || 'High'
          });
        }
    } else if (textLower.includes('evacuate') || textLower.includes('clear') || textLower.includes('reroute') || textLower.includes('establish') || textLower.includes('activate') || textLower.includes('reserve')) {
        toast = "Operational command issued and synced.";
        summary = "Command Logged";
    }
    
    await new Promise(r => setTimeout(r, 800)); // Simulate processing delay
    
    setActionStates(prev => ({ ...prev, [idx]: 'executed' }));
    setActionSummaries(prev => ({ ...prev, [idx]: summary }));
    setToastMessage({ show: true, msg: toast });
    setTimeout(() => setToastMessage({ show: false, msg: '' }), 4000);
  };

  const generateReasoningFeed = () => {
    if (activeIncidents.length === 0) {
      return [
        { 
          title: 'System Baseline', 
          conf: '99%', 
          loc: 'All Zones', 
          sev: 'LOW', 
          badge: 'bg-safe/20 text-safe border-safe/30', 
          action: 'Monitoring telemetry' 
        }
      ];
    }
    
    const uniqueMap = new Map();
    [...activeIncidents].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).forEach(inc => {
      const isCritical = inc.severity === 'Critical';
      const isHigh = inc.severity === 'High';
      const cat = (inc.category || '').toLowerCase();
      
      let reason = "Correlating with historical operational patterns";
      let title = inc.title || inc.category || "Incident Detected";
      const loc = inc.location || inc.zone || 'Unknown Zone';
      
      if (cat.includes('fire')) {
        title = "Fire Hazard Escalation";
        const options = ["Hazard escalation pattern detected", "Nearby crowd exposure risk", "Immediate response required"];
        reason = options[Number(inc.id || 0) % 3];
      } else if (cat.includes('lost') || cat.includes('child')) {
        title = "Lost Child Cluster";
        const options = ["Missing person pattern detected", "Crowd density affecting search complexity", "Exit monitoring recommended"];
        reason = options[Number(inc.id || 0) % 3];
      } else if (cat.includes('water') || cat.includes('infrastructure')) {
        title = "Repeated Water Station Failure";
        const options = ["Supply disruption cluster detected", "Crowd service impact identified", "Correlating with heat metrics"];
        reason = options[Number(inc.id || 0) % 3];
      } else if (cat.includes('medical') || cat.includes('health')) {
        title = "Medical Escalation Pattern";
        const options = ["Unconscious patient pattern detected", "Correlating with historical medical emergencies", "Elevated response urgency identified"];
        reason = options[Number(inc.id || 0) % 3];
      } else if (cat.includes('crowd') || cat.includes('surge') || title.toLowerCase().includes('shouting')) {
        title = "Crowd Surge Pattern";
        const options = ["Density threshold exceeded", "Movement bottleneck detected", "Escalation risk increasing"];
        reason = options[Number(inc.id || 0) % 3];
      } else if (cat.includes('security') || cat.includes('threat') || title.toLowerCase().includes('fight')) {
        title = "Security Threat Profile";
        reason = "Matched with prior altercation signatures";
      } else {
        const options = ["Incident report received", "Operational anomaly detected", "Field verification recommended", "Situation monitoring active"];
        reason = options[Number(inc.id || 0) % 4];
      }

      const key = `${title}-${loc}`;
      if (!uniqueMap.has(key)) {
         uniqueMap.set(key, { ...inc, processedTitle: title, processedReason: reason, processedLoc: loc });
      }
    });

    const deduped = Array.from(uniqueMap.values()).slice(0, 4);

    return deduped.map(inc => {
      const isCritical = inc.severity === 'Critical';
      const isHigh = inc.severity === 'High';
      return {
        title: inc.processedTitle,
        loc: inc.processedLoc,
        conf: insightData?.confidence ? `${insightData.confidence}%` : (isCritical ? '94%' : '88%'),
        sev: inc.severity?.toUpperCase() || 'MEDIUM',
        badge: isCritical ? 'bg-[#ff003c]/20 text-[#ff003c] border-[#ff003c]/30' : isHigh ? 'bg-critical/20 text-critical border-critical/30' : 'bg-warning/20 text-warning border-warning/30',
        action: inc.processedReason
      };
    });
  };

  const generateForecasts = () => {
    let heatProb = 15;
    let crowdProb = 20;
    let medProb = 10;
    let infraProb = 5;

    const avgTemp = zones?.length ? zones.reduce((acc, z) => acc + (z.temperature || 0), 0) / zones.length : 35;
    const avgDensity = zones?.length ? zones.reduce((acc, z) => acc + (z.crowd_density || 0), 0) / zones.length : 40;
    
    const medCount = activeIncidents.filter(i => (i.category || '').toLowerCase().includes('medical')).length || 0;
    const crowdCount = activeIncidents.filter(i => (i.category || '').toLowerCase().includes('crowd')).length || 0;
    const waterCount = activeIncidents.filter(i => (i.category || '').toLowerCase().includes('water') || (i.category || '').toLowerCase().includes('infrastructure')).length || 0;

    const variance = latestInc && latestInc.id ? (Number(latestInc.id) % 15) : 5;
    
    if (incCategory.includes('medical') || incCategory.includes('health')) {
       heatProb = 70 + (variance % 16);
       crowdProb = 40 + (variance % 21);
       medProb = 80 + (variance % 16);
       infraProb = 10 + (variance % 16);
    } else if (incCategory.includes('crowd') || incCategory.includes('surge')) {
       heatProb = 40 + (variance % 21);
       crowdProb = 80 + (variance % 16);
       medProb = 30 + (variance % 21);
       infraProb = 15 + (variance % 16);
    } else if (incCategory.includes('fire')) {
       heatProb = 20 + (variance % 21);
       crowdProb = 50 + (variance % 21);
       medProb = 70 + (variance % 21);
       infraProb = 60 + (variance % 31);
    } else if (incCategory.includes('lost') || incCategory.includes('child')) {
       heatProb = 20 + (variance % 21);
       crowdProb = 40 + (variance % 21);
       medProb = 10 + (variance % 21);
       infraProb = 10 + (variance % 11);
    } else {
       const medCount = activeIncidents.filter(i => (i.category || '').toLowerCase().includes('medical')).length || 0;
       const crowdCount = activeIncidents.filter(i => (i.category || '').toLowerCase().includes('crowd')).length || 0;
       
       heatProb = Math.min(85, 30 + (medCount * 5) + variance);
       crowdProb = Math.min(80, 35 + (crowdCount * 8) + variance);
       medProb = Math.min(85, 20 + (medCount * 10) + variance);
       infraProb = Math.min(60, 15 + variance);
    }

    return [
      { label: 'Heat Stress Probability', val: Math.max(5, heatProb), color: 'bg-critical' },
      { label: 'Crowd Surge Probability', val: Math.max(5, crowdProb), color: 'bg-warning' },
      { label: 'Medical Escalation Probability', val: Math.max(5, medProb), color: 'bg-primary' },
      { label: 'Infrastructure Failure Probability', val: Math.max(5, infraProb), color: 'bg-secondary' }
    ];
  };

  const generateTimelineArray = () => {
    const now = new Date();
    const tStr = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return [
      { time: tStr(new Date(now.getTime() - 27 * 60000)), label: dynamicPattern.timeline[0], status: 'critical' },
      { time: tStr(new Date(now.getTime() - 18 * 60000)), label: dynamicPattern.timeline[1], status: 'warning' },
      { time: tStr(new Date(now.getTime() - 11 * 60000)), label: dynamicPattern.timeline[2], status: 'critical' },
      { time: tStr(new Date(now.getTime() - 7 * 60000)), label: dynamicPattern.timeline[3], status: 'primary' },
      { time: tStr(new Date(now.getTime() - 5 * 60000)), label: dynamicPattern.timeline[4], status: 'secondary' },
      { time: tStr(now), label: dynamicPattern.timeline[5], status: 'safe' }
    ];
  };

  const reasoningFeed = generateReasoningFeed();
  const forecasts = generateForecasts();
  const timeline = generateTimelineArray();
  const recommendations = dynamicPattern.recommendations;
  
  // Calculate confidence dynamically based on severity
  let confidenceScore = 85;
  if (latestInc) {
    const sev = (latestInc.severity || '').toLowerCase();
    const idNum = Number(latestInc.id || 0);
    if (sev === 'critical') confidenceScore = 92 + (idNum % 5);
    else if (sev === 'high') confidenceScore = 85 + (idNum % 8);
    else if (sev === 'medium') confidenceScore = 70 + (idNum % 16);
    else confidenceScore = 60 + (idNum % 16);
  }
  
  // Calculate predicted escalation dynamically
  let predictedEscalation = 'Monitoring';
  if (latestInc) {
    if (incCategory.includes('medical')) predictedEscalation = '4-8 mins';
    else if (incCategory.includes('crowd')) predictedEscalation = '8-15 mins';
    else if (incCategory.includes('fire')) predictedEscalation = '2-5 mins';
    else if (incCategory.includes('lost') || incCategory.includes('child')) predictedEscalation = '10-20 mins';
    else if (incCategory.includes('water')) predictedEscalation = '20-45 mins';
    else predictedEscalation = '8-12 mins';
  }

  let graphNodes = [];
  if (incCategory.includes('fire')) {
     graphNodes = [
       { label: 'Fire Signal', icon: ShieldAlert, x: '20%', y: '20%', color: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
       { label: 'Risk Prediction', icon: Activity, x: '80%', y: '20%', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
       { label: 'Evacuation AI', icon: Users, x: '15%', y: '50%', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/50' },
       { label: 'Fire Response', icon: HeartPulse, x: '85%', y: '50%', color: 'text-safe', bg: 'bg-safe/20', border: 'border-safe/50' },
       { label: 'Broadcast Agent', icon: MessageSquareWarning, x: '30%', y: '85%', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
     ];
  } else if (incCategory.includes('crowd') || incCategory.includes('surge')) {
     graphNodes = [
       { label: 'Crowd Intel', icon: Users, x: '20%', y: '20%', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/50' },
       { label: 'Density Monitor', icon: Activity, x: '80%', y: '20%', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
       { label: 'Gate Flow AI', icon: Network, x: '15%', y: '50%', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' },
       { label: 'Security Dispatch', icon: ShieldAlert, x: '85%', y: '50%', color: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
       { label: 'Diversion Control', icon: MessageSquareWarning, x: '30%', y: '85%', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
     ];
  } else if (incCategory.includes('medical') || incCategory.includes('health')) {
     graphNodes = [
       { label: 'Incident Class', icon: ShieldAlert, x: '20%', y: '20%', color: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
       { label: 'Risk Prediction', icon: Activity, x: '80%', y: '20%', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
       { label: 'Medical Intel', icon: HeartPulse, x: '15%', y: '50%', color: 'text-safe', bg: 'bg-safe/20', border: 'border-safe/50' },
       { label: 'Resource Optimizer', icon: Network, x: '85%', y: '50%', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' },
       { label: 'Ambulance Routing', icon: Network, x: '30%', y: '85%', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/50' },
     ];
  } else if (incCategory.includes('lost') || incCategory.includes('child')) {
     graphNodes = [
       { label: 'Missing Person Signal', icon: ShieldAlert, x: '20%', y: '20%', color: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
       { label: 'Crowd Flow Analysis', icon: Users, x: '80%', y: '20%', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/50' },
       { label: 'Search Zone AI', icon: Activity, x: '15%', y: '50%', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
       { label: 'Volunteer Dispatch', icon: HeartPulse, x: '85%', y: '50%', color: 'text-safe', bg: 'bg-safe/20', border: 'border-safe/50' },
       { label: 'Reunification Center', icon: Network, x: '30%', y: '85%', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' },
     ];
  } else if (incCategory.includes('water') || incCategory.includes('infrastructure')) {
     graphNodes = [
       { label: 'Infrastructure Signal', icon: ShieldAlert, x: '20%', y: '20%', color: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
       { label: 'Demand Monitor', icon: Activity, x: '80%', y: '20%', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
       { label: 'Water Supply AI', icon: Network, x: '15%', y: '50%', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' },
       { label: 'Resource Optimizer', icon: Users, x: '85%', y: '50%', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/50' },
       { label: 'Broadcast Agent', icon: MessageSquareWarning, x: '30%', y: '85%', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
     ];
  } else {
     graphNodes = [
       { label: 'Incident Class', icon: ShieldAlert, x: '20%', y: '20%', color: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
       { label: 'Risk Prediction', icon: Activity, x: '80%', y: '20%', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
       { label: 'Crowd Intel', icon: Users, x: '15%', y: '50%', color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/50' },
       { label: 'Medical Intel', icon: HeartPulse, x: '85%', y: '50%', color: 'text-safe', bg: 'bg-safe/20', border: 'border-safe/50' },
       { label: 'Resource Optimizer', icon: Network, x: '30%', y: '85%', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' },
       { label: 'Broadcast Agent', icon: MessageSquareWarning, x: '70%', y: '85%', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
     ];
  }

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
            Emergency Memory AI 
            {loading && <span className="text-sm font-normal text-secondary animate-pulse ml-2">Analyzing signals...</span>}
          </h1>
          <p className="text-sm text-gray-400">Continuous pattern correlation, predictive escalation, and autonomous operational control.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="bg-card/50 hover:bg-card/80 border border-cardBorder px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} className={`text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs font-bold text-gray-300">Refresh Intelligence</span>
          </button>
          <div className="bg-card/50 border border-cardBorder px-4 py-2 rounded-lg flex items-center gap-2">
            <Database size={14} className="text-primary" />
            <span className="text-xs font-bold text-gray-300">2.4M events indexed</span>
          </div>
          <div className="bg-card/50 border border-cardBorder px-4 py-2 rounded-lg flex items-center gap-2">
            <Zap size={14} className="text-warning" />
            <span className="text-xs font-bold text-gray-300">Model v4.1 · 0.28s latency</span>
          </div>
        </div>
      </div>

      {/* TOP ROW: 4 METRICS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Historical Incidents Analyzed', value: '48,291', sub: `Live today: ${incidents.length}`, color: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/5' },
          { label: 'Linked Signals', value: dynamicPattern.signals.length, sub: 'Correlated data points', color: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/5' },
          { label: 'Predicted Escalation', value: predictedEscalation, sub: 'Estimated timeframe', color: 'text-critical', border: 'border-critical/30', bg: 'bg-critical/5' },
          { label: 'AI Confidence', value: `${confidenceScore}%`, sub: 'Synthesis certainty', color: 'text-safe', border: 'border-safe/30', bg: 'bg-safe/5' }
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-5 border ${stat.border} ${stat.bg} shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end gap-2">
               <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
               <span className="text-[10px] text-gray-500 mb-1">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN SECTION: 60/40 Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT: MEMORY AI CORE (60%) */}
        <div className="w-full lg:w-[60%] glass-card p-6 flex flex-col relative overflow-hidden border-t-4 border-t-secondary/50">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Network size={16} className="text-secondary" /> Adaptive Neural Intelligence Graph
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
               {graphNodes.map((node, i) => {
                  const isActive = dynamicPattern.nodes.includes(node.label);
                  return (
                    <line key={`line-${i}`} x1={node.x} y1={node.y} x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className={`transition-opacity duration-1000 ${isActive ? `animate-[pulse_${2 + (i % 3)}s_ease-in-out_infinite] opacity-100` : 'opacity-10'}`} />
                  )
               })}
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
            {graphNodes.map((node, i) => {
              const isActive = dynamicPattern.nodes.includes(node.label);
              return (
              <div key={i} className="absolute z-10 flex flex-col items-center group cursor-pointer transition-all duration-500" style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)', opacity: isActive ? 1 : 0.4 }}>
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isActive ? node.border : 'border-gray-600'} ${isActive ? node.bg : 'bg-gray-800/50'} ${isActive ? node.color : 'text-gray-500'} group-hover:scale-110 transition-transform relative ${isActive ? 'shadow-[0_0_15px_currentColor]' : ''}`}>
                   <node.icon size={20} />
                   {isActive && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-safe rounded-full border-2 border-card shadow-[0_0_5px_#10b981]"></div>}
                 </div>
                 <span className={`mt-2 text-[9px] font-bold uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border whitespace-nowrap transition-colors ${isActive ? 'text-gray-200 border-white/20' : 'text-gray-600 border-gray-800'}`}>
                   {node.label}
                 </span>
              </div>
            )})}
            
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
            {reasoningFeed.map((feed, i) => (
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
                  <span className="text-[10px] text-secondary group-hover:underline cursor-pointer truncate max-w-[200px]" title={feed.action}>{feed.action} &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: PATTERN DISCOVERY */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Dynamic Pattern Discovery</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 border-l-2 border-l-[#8b5cf6]">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#8b5cf6]/20 p-2 rounded text-[#8b5cf6]"><Activity size={16} /></div>
              <h3 className="font-bold text-white text-sm">Intelligence Engine</h3>
            </div>
            <div className="bg-black/30 rounded p-3 text-xs text-gray-300 border border-white/5 space-y-2">
               <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-400">Confidence:</span> <span className="font-bold text-safe">{confidenceScore}%</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-400">Level:</span> <span className="font-bold text-white">{latestInc?.severity || 'Normal'}</span></div>
               <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-400">Sources:</span> <span className="font-bold">{incidents.length > 0 ? 'Live Telemetry + History' : 'Baseline Array'}</span></div>
               <div className="flex justify-between pt-1"><span className="text-gray-400">Model:</span> <span className="text-[#8b5cf6] font-mono text-[9px]">Operational Risk Model v4.1</span></div>
            </div>
          </div>
          
          <div className="glass-card p-5 border-l-2 border-l-warning">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-warning/20 p-2 rounded text-warning"><HeartPulse size={16} /></div>
              <h3 className="font-bold text-white text-sm truncate" title={dynamicPattern.title}>{dynamicPattern.title}</h3>
            </div>
            <div className="bg-black/30 rounded p-3 text-sm text-gray-300 border border-white/5">
              <span className="text-warning font-bold text-[10px] uppercase tracking-widest block mb-1">Reasoning Trace:</span>
              <div className="space-y-1">
                {dynamicPattern.trace.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-2"><span className="text-warning opacity-50">↳</span> <span className="text-xs">{step}</span></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="glass-card p-5 border-l-2 border-l-primary">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/20 p-2 rounded text-primary"><Users size={16} /></div>
              <h3 className="font-bold text-white text-sm">Linked Signals</h3>
            </div>
            <div className="bg-black/30 rounded p-3 text-sm text-gray-300 border border-white/5">
              <span className="text-primary font-bold text-[10px] uppercase tracking-widest block mb-1">Correlated Data:</span>
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
                {dynamicPattern.signals.map((sig: string, idx: number) => <li key={idx}>{sig}</li>)}
              </ul>
            </div>
          </div>
          
          <div className="glass-card p-5 border-l-2 border-l-critical">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-critical/20 p-2 rounded text-critical"><Droplet size={16} /></div>
              <h3 className="font-bold text-white text-sm">Predicted Outcome</h3>
            </div>
            <div className="bg-black/30 rounded p-3 text-sm text-gray-300 border border-white/5">
              <span className="text-critical font-bold text-[10px] uppercase tracking-widest block mb-1">Risk Escalation:</span>
              <span className="text-xs">{dynamicPattern.outcome}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MEMORY TIMELINE */}
      <div className="glass-card p-6 border-t-4 border-t-secondary/50">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <GitCommit size={16} className="text-secondary" /> Operational Memory Engine
        </h2>
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-cardBorder"></div>
          
          <div className="grid grid-cols-6 gap-2 relative z-10">
            {timeline.map((event, i) => (
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
            <Activity size={16} className="text-warning" /> Live Predictive Forecasting
          </h2>
          <div className="space-y-5">
            {forecasts.map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-medium">{metric.label}</span>
                  <span className="font-bold text-white">{metric.val}%</span>
                </div>
                <div className="w-full bg-cardBorder h-2 rounded-full overflow-hidden shadow-inner">
                  <div className={`${metric.color} h-full rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${metric.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="glass-card p-6 border-l-4 border-l-primary/50 relative">
          <div className="absolute top-6 right-6 text-xs text-gray-400 font-bold bg-cardBorder/30 px-2 py-1 rounded">
            Executed: {executedCount} / {recommendations.length}
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" /> Context-Aware Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((action: string, i: number) => {
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
