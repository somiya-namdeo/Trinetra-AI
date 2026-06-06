import React, { useState, useEffect } from 'react';
import { Send, Loader2, BrainCircuit, Activity, ShieldAlert, HeartPulse, LocateFixed, Clock, CheckCircle2 } from 'lucide-react';
import { activeIncidents } from '../data/incidents';
import { analyzeIncident, getIncidents } from '../services/api';

const Incidents = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [liveIncidents, setLiveIncidents] = useState<any[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidentsData = async () => {
      const data = await getIncidents();
      if (data && Array.isArray(data) && data.length > 0) {
        setLiveIncidents(data);
      } else {
        setLiveIncidents(activeIncidents);
      }
    };
    fetchIncidentsData();
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowAnalysis(false);
    setIsDispatched(false);
    
    const ta = document.getElementById('incident-textarea') as HTMLTextAreaElement;
    const report = ta?.value?.trim() ? ta.value.trim() : "Elderly person collapsed near Gate 7. Crowd gathering.";
    
    const data = await analyzeIncident(report);
    
    const newAnalysis = data || {
      category: "Medical Emergency",
      location: "Gate 7",
      severity: "High",
      priority_score: 87,
      recommended_resources: ["Ambulance A2", "Medical Team Bravo", "Security Unit S1"],
      recommended_action: "Clear the crowd, dispatch medical team, and secure the area.",
      estimated_response_time: "4 minutes"
    };

    setAnalysisData(newAnalysis);

    const newIncident = {
      id: "INC-NEW",
      title: report.split('.')[0] || "New Incident",
      severity: newAnalysis.severity || "HIGH",
      status: "ACTIVE",
      location: newAnalysis.location || "Unknown",
      category: newAnalysis.category || "General",
      created_at: new Date().toISOString()
    };
    
    setLiveIncidents(prev => [newIncident, ...prev]);

    setSelectedIncidentId("INC-NEW");
    setIsAnalyzing(false);
    setShowAnalysis(true);
  };

  const handleDispatch = () => {
    setIsDispatched(true);
    setToastMessage("Recommended resources dispatched.");
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleReassign = () => {
    setIsDispatched(true);
    setToastMessage("Resource reassigned to incident.");
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const getStatusStyle = (status: string, isSelected: boolean, isDispatched: boolean) => {
    if (isSelected && isDispatched) return 'bg-safe/20 text-safe border border-safe/30';
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-warning/20 text-warning border border-warning/30';
      case 'ESCALATED': return 'bg-critical/20 text-critical border border-critical/30';
      case 'MONITORING': return 'bg-[#19B5D8]/20 text-[#19B5D8] border border-[#19B5D8]/30';
      case 'RESOLVED': return 'bg-safe/20 text-safe border border-safe/30';
      default: return 'border border-gray-600 text-gray-400';
    }
  };

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
          <p className="text-sm text-gray-400">Natural-language reporting with instant AI triage.</p>
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

        {/* Quick Stats Card (Single line, equally spaced) */}
        <div className="glass-card p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white mb-1">{liveIncidents.length || 47}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Total Today</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-primary mb-1">{liveIncidents.filter(i => i.status?.toUpperCase() === 'ACTIVE').length || 23}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Active</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-critical mb-1">{liveIncidents.filter(i => (i.severity || i.priority)?.toUpperCase() === 'CRITICAL').length || 4}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Critical</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-safe mb-1">{liveIncidents.filter(i => i.status?.toUpperCase() === 'RESOLVED').length || 20}</div>
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

            <h2 className="font-bold text-white mb-1">AI Analysis</h2>
            <p className="text-xs text-gray-400 mb-6">Triage recommendation</p>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Type & Location</p>
                <p className="font-bold text-white text-sm">{analysisData?.category || 'Medical Emergency'} · {analysisData?.location || 'Gate 7'}</p>
              </div>
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Severity</p>
                <div className="inline-block mt-1"><span className={`badge-${(analysisData?.severity || 'HIGH').toLowerCase()}`}>{(analysisData?.severity || 'HIGH').toUpperCase()}</span></div>
              </div>
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Priority Score</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-warning leading-none">{analysisData?.priority_score || 87}</span>
                  <span className="text-xs text-gray-500 mb-1">/100</span>
                </div>
              </div>
            </div>

            {/* Recommended Resources Row */}
            <div className="mb-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Recommended Resources</p>
              <div className="grid grid-cols-3 gap-4">
                {analysisData?.recommended_resources?.map((res: string, idx: number) => (
                  <div key={idx} className="bg-card/60 border border-cardBorder rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded text-primary">
                      {res.toLowerCase().includes('ambulance') ? <HeartPulse size={16} /> : res.toLowerCase().includes('medical') ? <Activity size={16} /> : <ShieldAlert size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{res}</p>
                      <p className="text-[10px] text-gray-400">{idx === 0 ? `ETA ${analysisData?.estimated_response_time || '3 min'}` : 'On standby'}</p>
                    </div>
                  </div>
                )) || (
                  <>
                    <div className="bg-card/60 border border-cardBorder rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded text-primary"><HeartPulse size={16} /></div>
                      <div>
                        <p className="text-sm font-bold text-white">Ambulance 02</p>
                        <p className="text-[10px] text-gray-400">ETA 3 min</p>
                      </div>
                    </div>
                    <div className="bg-card/60 border border-cardBorder rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded text-primary"><Activity size={16} /></div>
                      <div>
                        <p className="text-sm font-bold text-white">Medical Team Bravo</p>
                        <p className="text-[10px] text-gray-400">Closest unit · 180m</p>
                      </div>
                    </div>
                    <div className="bg-card/60 border border-cardBorder rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded text-primary"><ShieldAlert size={16} /></div>
                      <div>
                        <p className="text-sm font-bold text-white">Security Unit 02</p>
                        <p className="text-[10px] text-gray-400">Crowd control</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Suggested Actions Row */}
            <div className="flex gap-6">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Suggested Actions</p>
                <div className="space-y-3">
                  {analysisData?.recommended_action ? (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 text-primary w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-sm text-gray-200">{analysisData.recommended_action}</p>
                    </div>
                  ) : (
                    [
                      "Clear a 4m radius around the victim immediately.",
                      "Dispatch nearest ambulance via service road E-2 (bypasses crowd).",
                      "Activate PA at Gate 7: redirect inbound traffic to Gate 6.",
                      "Notify on-site cardiologist (Dr. Mehta) — patient profile suggests cardiac risk."
                    ].map((action, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="bg-primary/20 text-primary w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-200">{action}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="w-48 flex flex-col justify-end gap-3">
                <button 
                  onClick={handleDispatch}
                  disabled={isDispatched}
                  className={`w-full font-bold py-3 px-6 rounded-lg transition-colors text-center ${
                    isDispatched 
                      ? 'bg-safe/20 text-safe border border-safe/30 cursor-default' 
                      : 'bg-[#ff003c] hover:bg-[#ff003c]/90 text-white'
                  }`}
                >
                  {isDispatched ? 'Dispatched' : 'Dispatch Now'}
                </button>
                <button 
                  onClick={handleReassign}
                  className="w-full bg-card border border-cardBorder hover:bg-cardBorder/50 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Reassign
                </button>
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
              <p className="text-xs text-gray-400">{liveIncidents.filter(i => i.status?.toUpperCase() === 'ACTIVE').length || 6} active · {liveIncidents.length || 7} total today</p>
            </div>
            <button className="text-xs text-primary hover:text-primary/80 transition-colors">View all</button>
          </div>
          
          <div className="p-4 space-y-3">
            {liveIncidents.slice(0, 5).map((incident: any) => {
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
                    setIsDispatched(false);
                    setAnalysisData({
                      category: incident.category || 'General Issue',
                      location: incident.location || incident.zone || 'Unknown Area',
                      severity: priority,
                      priority_score: incident.priority_score || incident.risk_score || 75,
                      recommended_resources: incident.recommended_resources || ['Security Patrol', 'Field Officer'],
                      recommended_action: incident.recommended_action || incident.description || 'Dispatch nearest available unit to assess the situation.',
                      estimated_response_time: incident.estimated_response_time || '5 minutes'
                    });
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
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getStatusStyle(status, isSelected, isDispatched)}`}>
                        {isSelected && isDispatched ? 'RESOURCES ASSIGNED' : status.toUpperCase()}
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incidents;
