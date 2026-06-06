import React, { useState } from 'react';
import { Send, Loader2, BrainCircuit, Activity, ShieldAlert, HeartPulse, LocateFixed, Clock, CheckCircle2 } from 'lucide-react';
import { activeIncidents } from '../data/incidents';

const Incidents = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowAnalysis(false);
    setIsDispatched(false);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  const handleDispatch = () => {
    setIsDispatched(true);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-10">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-50 transition-all duration-300">
          <div className="bg-safe/90 border border-safe text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">Resources dispatched to Gate 7 successfully.</span>
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
              <div className="text-xl font-bold text-white mb-1">47</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Total Today</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-primary mb-1">23</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Active</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-critical mb-1">4</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Critical</div>
            </div>
            <div className="bg-card/50 border border-cardBorder rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-safe mb-1">20</div>
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
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Type</p>
                <p className="font-bold text-white text-sm">Medical Emergency · Elderly Distress</p>
              </div>
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Severity</p>
                <div className="inline-block mt-1"><span className="badge-high">HIGH</span></div>
              </div>
              <div className="bg-card/60 border border-cardBorder rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Priority Score</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-warning leading-none">87</span>
                  <span className="text-xs text-gray-500 mb-1">/100</span>
                </div>
              </div>
            </div>

            {/* Recommended Resources Row */}
            <div className="mb-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Recommended Resources</p>
              <div className="grid grid-cols-3 gap-4">
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
              </div>
            </div>

            {/* Suggested Actions Row */}
            <div className="mb-6 flex gap-6">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Suggested Actions</p>
                <div className="space-y-3">
                  {[
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
                  ))}
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
                <button className="w-full bg-card border border-cardBorder hover:bg-cardBorder/50 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors">
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
              <p className="text-xs text-gray-400">6 active · 7 total today</p>
            </div>
            <button className="text-xs text-primary hover:text-primary/80 transition-colors">View all</button>
          </div>
          
          <div className="p-4 space-y-3">
            {activeIncidents.slice(0, 5).map((incident) => {
              const isSelected = showAnalysis && incident.title.includes('Elderly collapse');
              
              return (
                <div 
                  key={incident.id} 
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
                      <span className="text-xs text-gray-500 font-mono">{incident.id}</span>
                      <span className={`badge-${incident.priority.toLowerCase()}`}>{incident.priority}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        isSelected && isDispatched 
                          ? 'bg-safe/20 text-safe border border-safe/30' 
                          : 'border border-gray-600 text-gray-400'
                      }`}>
                        {isSelected && isDispatched ? 'Resources Assigned' : incident.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {incident.timeAgo}
                    </div>
                  </div>
                  
                  <h4 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {incident.title}
                  </h4>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <LocateFixed size={12} />
                    {incident.location} · {incident.category}
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
