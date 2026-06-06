import React, { useState } from 'react';
import { User, Shield, Bell, Activity, Database, Server, Zap, Cpu, Sliders, AlertTriangle, Download, RefreshCw, Lock, Trash2, Smartphone, Mail, AlertCircle, MessageSquare } from 'lucide-react';

const Settings = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    crossEvent: true,
    predictive: true,
    autoGen: true,
    historical: true,
    resource: false,
    voice: false,
    crowd: true,
    behavior: true,
    sms: true,
    email: false,
    whatsapp: true,
    push: true,
    escalation: true,
    recommendations: true,
  });

  const toggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-6 pb-24 relative">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-400">Manage operator profile, alert thresholds, AI behavior, notification preferences, and system controls.</p>
      </div>

      {/* Main Grid: 12 Cols Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ================= ROW 1 ================= */}
        
        {/* CARD 1: OPERATOR PROFILE (Span 4) */}
        <div className="xl:col-span-4 glass-card p-6 flex flex-col h-full">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <User size={16} className="text-primary" /> Operator Profile
          </h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0">
              RS
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">Cmdr. R. Sharma</h3>
              <p className="text-xs text-gray-400 mt-1">Operations Commander</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 bg-background/50 border border-cardBorder rounded-lg p-4 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Region</span>
              <span className="text-white font-medium">North • UP Sector 7</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shift</span>
              <span className="text-white font-medium">14:00–22:00 IST</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="text-safe font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-safe animate-pulse"></span> Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6 text-center">
            <div className="bg-card/50 border border-cardBorder p-2 rounded">
              <div className="text-lg font-bold text-white">2,847</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">Incidents</div>
            </div>
            <div className="bg-card/50 border border-cardBorder p-2 rounded">
              <div className="text-lg font-bold text-white">12</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">Years Exp.</div>
            </div>
            <div className="bg-card/50 border border-cardBorder p-2 rounded">
              <div className="text-sm font-bold text-white mt-1">18:24</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">Last Login</div>
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            <button className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
              Edit Profile
            </button>
            <button className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
              Password
            </button>
          </div>
        </div>

        {/* CARD 2: ALERT THRESHOLDS (Span 8) */}
        <div className="xl:col-span-8 glass-card p-6 flex flex-col h-full">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sliders size={16} className="text-warning" /> Alert Thresholds
          </h2>
          <p className="text-xs text-gray-400 mb-6">Trigger sensitivity for auto-escalation</p>

          <div className="flex-1 flex flex-col justify-center space-y-8 bg-background/50 border border-cardBorder p-6 rounded-lg">
            {[
              { label: 'Crowd density alert', val: '85%', width: '85%' },
              { label: 'Heat index alert', val: '38°C', width: '38%' },
              { label: 'Incident escalation threshold', val: '72/100', width: '72%' },
              { label: 'AI Auto-dispatch confidence', val: '90%', width: '90%' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-200 font-medium">{item.label}</span>
                  <span className="text-primary font-bold">{item.val}</span>
                </div>
                <div className="w-full h-1.5 bg-card border border-cardBorder rounded-full relative cursor-pointer group">
                  <div className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" style={{ width: item.width }}></div>
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md hover:scale-125 transition-transform" style={{ left: `calc(${item.width} - 8px)` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ROW 2 ================= */}
        
        {/* CARD 3: SYSTEM STATUS (Span 4) */}
        <div className="xl:col-span-4 glass-card p-6 flex flex-col h-full">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity size={16} className="text-safe" /> System Health
          </h2>
          
          <div className="flex justify-between items-end mb-6 pb-6 border-b border-cardBorder">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Overall Health</p>
              <p className="text-3xl font-bold text-safe">99.8%</p>
            </div>
            <div className="bg-safe/10 text-safe border border-safe/20 px-3 py-1 rounded text-xs font-bold tracking-wider">
              OPTIMAL
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {[
              { label: 'API Services', status: 'Online', icon: Server, color: 'text-safe' },
              { label: 'AI Engine', status: 'Operational', icon: Cpu, color: 'text-primary' },
              { label: 'Dispatch Network', status: 'Healthy', icon: Zap, color: 'text-safe' },
              { label: 'Database', status: 'Connected', icon: Database, color: 'text-safe' }
            ].map((sys, i) => (
              <div key={i} className="flex justify-between items-center bg-card/30 p-3 rounded-lg border border-cardBorder">
                <div className="flex items-center gap-3">
                  <sys.icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300 font-medium">{sys.label}</span>
                </div>
                <span className={`text-xs font-bold ${sys.color}`}>{sys.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: AI CONFIGURATION (Span 8) */}
        <div className="xl:col-span-8 glass-card p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Cpu size={16} className="text-primary" /> Memory AI Configuration
            </h2>
            <span className="text-[10px] text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded font-mono">v3.2</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">Memory AI behavior and operational scope.</p>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'crossEvent', label: 'Cross-event Correlation', icon: Zap },
              { key: 'predictive', label: 'Predictive Escalation', icon: Activity },
              { key: 'autoGen', label: 'Auto-generate Broadcasts', icon: MessageSquare },
              { key: 'historical', label: 'Historical Case Retrieval', icon: Database },
              { key: 'resource', label: 'Resource Auto-routing', icon: Shield },
              { key: 'voice', label: 'Voice Command Interface', icon: Server },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center bg-background/50 border border-cardBorder p-4 rounded-lg hover:border-primary/30 transition-colors h-14">
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="text-primary" />
                  <span className="text-sm text-gray-200">{item.label}</span>
                </div>
                <div 
                  onClick={() => toggle(item.key)}
                  className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors relative shrink-0 ${toggles[item.key] ? 'bg-primary' : 'bg-cardBorder'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${toggles[item.key] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ROW 3 ================= */}

        {/* CARD 5: NOTIFICATIONS (Span 6) */}
        <div className="xl:col-span-6 glass-card p-6 flex flex-col h-full">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Bell size={16} className="text-warning" /> Notifications
          </h2>
          <div className="space-y-5 flex-1">
            {[
              { key: 'sms', label: 'SMS Alerts', icon: Smartphone },
              { key: 'email', label: 'Email Alerts', icon: Mail },
              { key: 'whatsapp', label: 'WhatsApp Alerts', icon: MessageSquare },
              { key: 'push', label: 'Push Notifications', icon: Bell },
              { key: 'escalation', label: 'Critical Incident Escalation', icon: AlertTriangle },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <item.icon size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
                <div 
                  onClick={() => toggle(item.key)}
                  className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors relative shrink-0 ${toggles[item.key] ? 'bg-primary' : 'bg-cardBorder'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${toggles[item.key] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 6: SECURITY & ACCESS (Span 6) */}
        <div className="xl:col-span-6 glass-card p-6 flex flex-col h-full">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Lock size={16} className="text-safe" /> Security & Access
          </h2>
          
          <div className="space-y-5 mb-6 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Two-Factor Authentication</span>
              <span className="text-safe font-bold">Enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Last Password Change</span>
              <span className="text-white">24 Days Ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Active Sessions</span>
              <span className="text-white">4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Login Attempts Blocked</span>
              <span className="text-warning font-bold">12</span>
            </div>
          </div>

          <div className="flex gap-3 mt-auto">
            <button className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
              Manage Sessions
            </button>
            <button className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
              Security Logs
            </button>
          </div>
        </div>

        {/* ================= ROW 4 ================= */}

        {/* CARD 7: DANGER ZONE (Span 12) */}
        <div className="xl:col-span-12 glass-card p-6 border-l-4 border-l-[#FF1744]">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#FF1744]" /> Danger Zone
          </h2>
          <p className="text-xs text-gray-400 mb-6">System-level administrative controls. Use with caution.</p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <Download size={14} /> Export Configuration
            </button>
            <button className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <Database size={14} /> Backup Settings
            </button>
            <button className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <RefreshCw size={14} /> Restart AI Services
            </button>
            <button className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <RefreshCw size={14} /> Reset To Default
            </button>
            <button className="bg-[#FF1744]/10 border border-[#FF1744]/30 hover:bg-[#FF1744]/20 text-[#FF1744] font-medium py-2.5 px-6 rounded-lg transition-colors text-sm flex items-center gap-2 ml-auto">
              <Trash2 size={14} /> Emergency Lockdown
            </button>
          </div>
        </div>

      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 right-0 p-4 bg-[#050B18]/90 backdrop-blur-md border-t border-cardBorder w-full lg:w-[calc(100%-16rem)] flex justify-end items-center gap-4 z-50">
        <span className="text-xs text-gray-400 italic mr-2">You have unsaved changes</span>
        <button className="text-gray-300 hover:text-white font-medium py-2 px-4 transition-colors text-sm">
          Reset
        </button>
        <button className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default Settings;
