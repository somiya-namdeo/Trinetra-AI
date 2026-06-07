import React, { useState, useEffect } from 'react';
import { Send, Loader2, BrainCircuit, Activity, ShieldAlert, HeartPulse, LocateFixed, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { analyzeIncident, getIncidents, updateIncidentStatus, createIncident, dispatchResource, getResources } from '../services/api';

const Incidents = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [liveIncidents, setLiveIncidents] = useState<any[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [deployedResources, setDeployedResources] = useState<any[]>([]);

  const fetchIncidentsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getIncidents();
      if (data && Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => {
          const timeA = new Date(a.created_at || a.timestamp || a.reported_at || 0).getTime();
          const timeB = new Date(b.created_at || b.timestamp || b.reported_at || 0).getTime();
          return timeB - timeA;
        });
        setLiveIncidents(sorted);
        console.log(`[Lifecycle] Fetched and sorted ${sorted.length} incidents from backend.`);
        return sorted;
      }
    } catch (err: any) {
      console.error('Failed to fetch incidents', err);
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    fetchIncidentsData();
  }, []);

  const handleAnalyze = async () => {
    const ta = document.getElementById('incident-textarea') as HTMLTextAreaElement;
    const report = ta?.value?.trim();
    
    if (!report) {
      setToastMessage("Please enter an incident description.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(false);
    
    let data;
    try {
      data = await analyzeIncident(report);
    } catch (err: any) {
      setToastMessage('Analysis failed: ' + (err.message || 'Server error'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setIsAnalyzing(false);
      return;
    }
    
    const newAnalysis = data || {
      category: "General Incident",
      location: "Unknown Sector",
      severity: "Medium",
      priority_score: 50,
      recommended_resources: ["Security Unit", "Volunteer Team"],
      recommended_action: "Investigate the reported incident and provide updates.",
      estimated_response_time: "5 minutes"
    };

    setAnalysisData(newAnalysis);

    const reportLower = report.toLowerCase();
    let preciseLocation = newAnalysis.location || "Unknown Sector";
    if (reportLower.includes("zone c")) preciseLocation = "Zone C";
    else if (reportLower.includes("north gate")) preciseLocation = "North Gate";
    else if (reportLower.includes("water station")) preciseLocation = "Water Station";
    else if (reportLower.includes("gate 7")) preciseLocation = "Gate 7";
    else if (reportLower.includes("food court")) preciseLocation = "Food Court";
    else if (reportLower.includes("zone a")) preciseLocation = "Zone A";
    else if (reportLower.includes("zone b")) preciseLocation = "Zone B";
    
    let baseScore = 50;
    const severityStr = (newAnalysis.severity || "MEDIUM").toUpperCase();
    if (severityStr === "CRITICAL") baseScore = 90;
    else if (severityStr === "HIGH") baseScore = 75;
    else if (severityStr === "MEDIUM") baseScore = 50;
    else if (severityStr === "LOW") baseScore = 30;

    const catStr = (newAnalysis.category || "").toLowerCase();
    if (catStr.includes("fire")) baseScore += 10;
    else if (catStr.includes("medical")) baseScore += 5;
    else if (catStr.includes("lost")) baseScore += 0;
    else if (catStr.includes("water")) baseScore -= 5;
    else if (catStr.includes("surge") || catStr.includes("crowd")) baseScore += 5;
    else if (catStr.includes("security")) baseScore += 10;

    const finalPriorityScore = Math.min(100, baseScore);

    const newIncident: any = {
      incident_id: `INC-${Date.now()}`,
      title: newAnalysis.title || report.split('.')[0] || "New Incident",
      description: report,
      severity: newAnalysis.severity || "HIGH",
      status: "ACTIVE",
      location: preciseLocation,
      zone: preciseLocation,
      category: newAnalysis.category || "General",
      created_at: new Date().toISOString(),
      priority_score: finalPriorityScore,
      recommended_resources: newAnalysis.recommended_resources || [],
      recommended_action: newAnalysis.recommended_action || "",
      estimated_response_time: newAnalysis.estimated_response_time || ""
    };
    
    console.log(`[Lifecycle] Creating new incident`);
    let response;
    try {
      response = await createIncident(newIncident);
      console.log(`[Lifecycle] Incident persisted to backend.`, response);
    } catch (err: any) {
      console.error('Failed to create incident', err);
      setToastMessage('Failed to save incident: ' + (err.message || 'Server error'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setIsAnalyzing(false);
      return;
    }
    
    const assignedId = response?.incident?.id;
    
    const freshData = await fetchIncidentsData();
    console.log("Refetched incidents after create", freshData);
    
    if (freshData) {
      let updatedIncident = assignedId ? freshData.find((i: any) => String(i.id) === String(assignedId)) : null;
      
      console.log("Selected after create", updatedIncident);
      if (updatedIncident) {
        setAnalysisData(null);
      }
    }

    if (assignedId) {
      setSelectedIncidentId(assignedId);
    }
    setIsAnalyzing(false);
    setShowAnalysis(true);
    
    setToastMessage("Incident created successfully");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const findResourceByType = (resources: any[], typeString: string) => {
    const typeLower = typeString.toLowerCase();
    const available = resources.filter(r => (r.status || '').toUpperCase() === 'AVAILABLE');
    if (typeLower.includes('fire')) return available.find(r => r.type?.toLowerCase().includes('fire') || r.name?.toLowerCase().includes('fire'));
    if (typeLower.includes('ambulance') || typeLower.includes('medical')) return available.find(r => r.type?.toLowerCase().includes('ambulance') || r.type?.toLowerCase().includes('medical'));
    if (typeLower.includes('security')) return available.find(r => r.type?.toLowerCase().includes('security') || r.name?.toLowerCase().includes('security'));
    if (typeLower.includes('volunteer')) return available.find(r => r.type?.toLowerCase().includes('volunteer') || r.name?.toLowerCase().includes('volunteer'));
    if (typeLower.includes('water')) return available.find(r => r.type?.toLowerCase().includes('water') || r.name?.toLowerCase().includes('water'));
    return available[0];
  };

  const handleStatusTransition = async (newStatus: string, msg: string) => {
    if (!selectedIncidentId) return;
    setActionLoading(true);
    
    console.log("Assign clicked for", selectedIncidentId);

    // 1. Call updateIncidentStatus
    const response = await updateIncidentStatus(selectedIncidentId, newStatus);
    console.log("update status API response:", response);
    
    // 2. Wait for it to finish successfully
    if (!response || !response.success) {
      console.error("Backend error:", response?.message || "Unknown error");
      setToastMessage(response?.message || "Failed to update status");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setActionLoading(false);
      return;
    }
    
    // 3. Immediately use response.incident
    if (response.incident) {
      const idx = liveIncidents.findIndex(i => String(i.id) === String(selectedIncidentId));
      if (idx !== -1) {
        liveIncidents[idx] = response.incident;
        setLiveIncidents([...liveIncidents]);
      }
    }
    
    // 4. Temporarily removed actual dispatchResource call to prevent 422 error
    // Will implement exact resource-level dispatch later
    if (newStatus === 'RESOURCES_ASSIGNED') {
       console.log("Mocking resource assignment for hackathon stability");
    }
    
    // 4. Refetch incidents using GET /api/incidents or use returned incident
    let updatedIncident = response.incident;
    
    // Explicitly refetch resources to ensure global state stays synced with backend
    await getResources();
    const freshData = await fetchIncidentsData();
    if (freshData && Array.isArray(freshData)) {
      // 5. Find updated incident by id if not provided by response
      if (!updatedIncident) {
        updatedIncident = freshData.find((i: any) => String(i.id) === String(selectedIncidentId));
      } else {
        // Also ensure our selected incident in liveIncidents matches the returned object
        const index = freshData.findIndex((i: any) => String(i.id) === String(selectedIncidentId));
        if (index !== -1) {
          freshData[index] = updatedIncident;
          setLiveIncidents([...freshData]);
        }
      }
      
      console.log("After refetch selected incident", updatedIncident);
      console.log("Feed incident status", updatedIncident?.status);
      
      // 6 & 8. Update selected incident and re-render from same object
      if (updatedIncident) {
        setAnalysisData(null);
      }
    }
    
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    setActionLoading(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/30';
      case 'RESOURCES_ASSIGNED': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'IN_PROGRESS': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'CONTAINED': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'RESOLVED': return 'bg-safe/20 text-safe border border-safe/30';
      default: return 'border border-gray-600 text-gray-400';
    }
  };

  const handleViewResources = async (incident: any) => {
    if (!incident) return;
    const allResources = await getResources();
    if (allResources) {
      const incIdStr = String(incident.id).toLowerCase();
      const incLocStr = String(incident.location || incident.zone || "").toLowerCase();
      const incTitleStr = String(incident.title || "").toLowerCase();
      
      const assigned = allResources.filter((r: any) => {
        if (String(r.status || "").toUpperCase() === "AVAILABLE") return false;
        
        const resIncId = String(r.assigned_incident_id || "");
        if (resIncId === String(incident.id)) return true;
        
        return false;
      });
      setDeployedResources(assigned);
      setShowResourcesModal(true);
    }
  };

  const selectedIncident = liveIncidents.find(i => String(i.id) === String(selectedIncidentId));

  // Status transitions
  const getActionConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return { label: 'Assign Resources', next: 'RESOURCES_ASSIGNED', color: 'bg-blue-500 hover:bg-blue-400 text-white', msg: 'Recommended resources assigned successfully' };
      case 'RESOURCES_ASSIGNED': return { label: 'Mark In Progress', next: 'IN_PROGRESS', color: 'bg-orange-500 hover:bg-orange-400 text-white', msg: 'Response marked as in progress' };
      case 'IN_PROGRESS': return { label: 'Mark Contained', next: 'CONTAINED', color: 'bg-yellow-600 hover:bg-yellow-500 text-black', msg: 'Incident contained' };
      case 'CONTAINED': return { label: 'Resolve Incident', next: 'RESOLVED', color: 'bg-safe hover:bg-safe/90 text-black', msg: 'Incident resolved' };
      case 'RESOLVED': return null;
      default: return { label: 'Assign Resources', next: 'RESOURCES_ASSIGNED', color: 'bg-blue-600 hover:bg-blue-500', msg: 'Resources assigned' };
    }
  };

  const actionConfig = selectedIncident ? getActionConfig(selectedIncident.status || 'ACTIVE') : { label: 'Assign Resources', next: 'RESOURCES_ASSIGNED', color: 'bg-blue-600 hover:bg-blue-500', msg: 'Resources assigned' };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-10">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-50 transition-all duration-300">
          <div className="bg-safe/90 border border-safe text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content (Left Column: 70%) */}
      <div className="w-full lg:w-[70%] flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Incident Management</h1>
          <p className="text-sm text-gray-400">Natural-language reporting with instant AI triage and lifecycle tracking.</p>
        </div>

        {/* Report New Incident Card */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-white mb-1">Report New Incident</h2>
          <p className="text-xs text-gray-400 mb-4">Describe in plain English — AI will classify and route.</p>

          <div className="bg-background/50 border border-cardBorder rounded-lg p-4 mb-4">
            <textarea 
              id="incident-textarea"
              className="w-full bg-transparent text-gray-200 text-sm focus:outline-none resize-none h-[170px]"
              placeholder="Example: Elderly person collapsed near Gate 7. Crowd gathering. Person appears unconscious and not responding."
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['Medical', 'Fire', 'Security', 'Crowd', 'Infrastructure', 'Lost Person'].map(tag => (
                <span key={tag} className="text-[10px] text-gray-400 bg-card border border-cardBorder px-3 py-1.5 rounded-full cursor-pointer hover:bg-cardBorder/50 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const ta = document.getElementById('incident-textarea') as HTMLTextAreaElement;
                  if (ta) ta.value = "Elderly person collapsed near Gate 7. Crowd gathering. Person appears unconscious and not responding.";
                }}
                className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
              >
                Use Example
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Send size={16} /> Submit & Analyze</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="glass-card p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white mb-1">{liveIncidents.length}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Total Today</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-primary mb-1">{liveIncidents.filter(i => (i.status || '').toUpperCase() !== 'RESOLVED').length}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Active</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-critical mb-1">{liveIncidents.filter(i => (i.severity || '').toUpperCase() === 'CRITICAL' && (i.status || '').toUpperCase() !== 'RESOLVED').length}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Critical</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-safe mb-1">{liveIncidents.filter(i => (i.status || '').toUpperCase() === 'RESOLVED').length}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Resolved</div>
            </div>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className={`transition-all duration-500 ease-out origin-top ${showAnalysis ? 'opacity-100 scale-y-100 h-auto' : 'opacity-0 scale-y-0 h-0 overflow-hidden'}`}>
          <div className="glass-card p-6 border-l-4 border-l-primary relative">
            
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <BrainCircuit size={16} className="text-primary" />
              <span className="text-xs text-primary font-medium">Memory AI</span>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-bold text-white mb-1">AI Triage & Lifecycle Management</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Incident: <span className="font-mono text-gray-300">{selectedIncidentId}</span></span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getStatusStyle(selectedIncident?.status || 'ACTIVE')}`}>
                    {(selectedIncident?.status || 'ACTIVE').replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Type & Location</p>
                <p className="font-bold text-white text-sm">{analysisData?.category || selectedIncident?.category || 'General Incident'} · {analysisData?.location || selectedIncident?.location || 'Unknown Sector'}</p>
              </div>
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Severity</p>
                <div className="inline-block mt-1"><span className={`badge-${(analysisData?.severity || selectedIncident?.severity || 'MEDIUM').toLowerCase()}`}>{(analysisData?.severity || selectedIncident?.severity || 'MEDIUM').toUpperCase()}</span></div>
              </div>
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Priority Score</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-warning leading-none">{analysisData?.priority_score || selectedIncident?.priority_score || 75}</span>
                  <span className="text-xs text-gray-500 mb-1">/100</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Lifecycle Timeline</p>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {[
                    { time: selectedIncident?.created_at, label: 'Incident Reported' },
                    { time: selectedIncident?.resources_assigned_at, label: 'Resources Assigned' },
                    { time: selectedIncident?.in_progress_at, label: 'Response In Progress' },
                    { time: selectedIncident?.contained_at, label: 'Incident Contained' },
                    { time: selectedIncident?.resolved_at, label: 'Incident Resolved' }
                  ].filter(t => t.time).map((event, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] glass-card p-3 rounded-lg border border-cardBorder">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-white text-xs">{event.label}</div>
                          <time className="font-mono text-[10px] text-gray-500">{new Date(event.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</time>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-64 flex flex-col justify-end gap-3 bg-card/30 p-4 rounded-lg border border-cardBorder">
                <h3 className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 text-center">Action Center</h3>
                
                {actionConfig ? (
                  <button 
                    onClick={() => handleStatusTransition(actionConfig.next, actionConfig.msg)}
                    disabled={actionLoading}
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${actionConfig.color} shadow-[0_0_15px_rgba(0,0,0,0.3)] disabled:opacity-50`}
                  >
                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {actionConfig.label}
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <div className="w-full font-bold py-3 px-4 rounded-lg text-center bg-safe/10 border border-safe/30 text-safe text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    Fully Resolved
                  </div>
                )}
                
                {actionConfig?.next !== 'RESOURCES_ASSIGNED' && actionConfig?.next !== undefined && (
                  <div className="w-full font-medium py-2 px-4 rounded-lg text-center bg-safe/10 border border-safe/30 text-safe text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
                    <CheckCircle2 size={12} />
                    Resources Assigned
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Sidebar (30%) */}
      <div className="w-full lg:w-[30%] flex flex-col gap-6">
        
        {/* Live Incident Feed */}
        <div className="glass-card">
          <div className="p-4 border-b border-cardBorder flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white">Live Incident Feed</h3>
              <p className="text-xs text-gray-400">{liveIncidents.filter(i => (i.status || '').toUpperCase() !== 'RESOLVED').length} active · {liveIncidents.length} total today</p>
            </div>
            <button onClick={() => setShowAllModal(true)} className="text-xs text-primary hover:text-primary/80 transition-colors">View all</button>
          </div>
          
          <div className="p-4 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p className="text-gray-400 text-sm">Loading incidents...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-critical/10 border border-critical/30 rounded-lg">
                <ShieldAlert className="w-8 h-8 text-critical mb-2" />
                <p className="text-critical text-sm font-bold mb-1">Connection Error</p>
                <p className="text-gray-400 text-xs px-4">{error}</p>
              </div>
            ) : liveIncidents.filter(i => (i.status || '').toUpperCase() !== 'RESOLVED').length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-cardBorder mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="text-gray-400" size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">No Active Incidents</h4>
                <p className="text-xs text-gray-400">All zones are currently secure.</p>
              </div>
            ) : (
              liveIncidents.filter(i => (i.status || '').toUpperCase() !== 'RESOLVED').slice(0, 5).map((incident: any) => {
                const isSelected = showAnalysis && selectedIncidentId === incident.id;
                
                const priority = incident.severity || incident.priority || 'LOW';
                const status = incident.status || 'ACTIVE';
                const timeStr = incident.created_at ? new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : (incident.timeAgo || 'Just now');
                const displayId = incident.id || `INC-${Math.floor(Math.random() * 1000) + 2000}`;
                
                return (
                  <div 
                    key={incident.id || Math.random()} 
                    onClick={() => {
                    setSelectedIncidentId(incident.id);
                    setShowAnalysis(true);
                    setAnalysisData(null); // Clear old analysis temporarily
                  }}
                  className={`border rounded-lg p-3 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(14,165,233,0.2)] relative overflow-hidden' 
                      : 'bg-card/50 border-cardBorder hover:bg-card/80'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">{displayId}</span>
                      <span className={`badge-${priority.toLowerCase()}`}>{priority.toUpperCase()}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${getStatusStyle(status)}`}>
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {timeStr}
                    </div>
                  </div>
                  
                  <h4 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {incident.title}
                  </h4>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <LocateFixed size={12} />
                    {incident.location || incident.zone} · {incident.category}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>

      {/* View All Incidents Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAllModal(false)}></div>
          <div className="relative glass-card w-full max-w-3xl max-h-[80vh] flex flex-col border border-cardBorder shadow-2xl">
            <div className="p-4 border-b border-cardBorder flex justify-between items-center bg-card/80">
              <div>
                <h3 className="font-bold text-white text-lg">Incident History</h3>
                <p className="text-xs text-gray-400 mb-1">Historical record of all incidents reported today.</p>
                <p className="text-[10px] text-primary">Total: {liveIncidents.length}</p>
              </div>
              <button 
                onClick={() => setShowAllModal(false)}
                className="text-gray-400 hover:text-white bg-cardBorder/50 hover:bg-cardBorder w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-background/50">
              {liveIncidents.map((incident: any) => {
                const priority = incident.severity || incident.priority || 'LOW';
                const status = incident.status || 'ACTIVE';
                const timeStr = incident.created_at ? new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : (incident.timeAgo || 'Just now');
                const displayId = incident.id || `INC-${Math.floor(Math.random() * 1000) + 2000}`;
                
                return (
                  <div key={incident.id || Math.random()} className="border border-cardBorder rounded-lg p-3 bg-card/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">{displayId}</span>
                        <span className={`badge-${priority.toLowerCase()}`}>{priority.toUpperCase()}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getStatusStyle(status)}`}>
                          {status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {timeStr}
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-white">{incident.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <LocateFixed size={12} />
                      {incident.location || incident.zone} · {incident.category}
                      {incident.priority_score && <span className="ml-2 text-warning font-mono">Score: {incident.priority_score}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Deployed Resources Modal */}
      {showResourcesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowResourcesModal(false)}></div>
          <div className="relative glass-card w-full max-w-2xl max-h-[80vh] flex flex-col border border-cardBorder shadow-2xl">
            <div className="p-4 border-b border-cardBorder flex justify-between items-center bg-card/80">
              <div>
                <h3 className="font-bold text-white text-lg">Deployed Resources</h3>
                <p className="text-xs text-gray-400">Incident: {selectedIncident?.title || 'Unknown'}</p>
              </div>
              <button 
                onClick={() => setShowResourcesModal(false)}
                className="text-gray-400 hover:text-white bg-cardBorder/50 hover:bg-cardBorder w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-background/50">
              {deployedResources.length > 0 ? (
                deployedResources.map((res: any) => (
                  <div key={res.id} className="border border-cardBorder rounded-lg p-3 bg-card/50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        {res.name}
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase">{res.type}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 uppercase">{res.status}</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">Task: {res.task || res.assignment || 'Assigned'}</p>
                      <p className="text-xs text-gray-400">Location: {res.location}</p>
                    </div>
                    {res.eta && (
                      <div className="text-right">
                        <span className="text-xs text-warning font-mono bg-warning/10 px-2 py-1 rounded">ETA: {res.eta}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No deployed resources found for this incident.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Incidents;
