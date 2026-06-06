import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Activity, Database, Server, Zap, Cpu, Sliders as SlidersIcon, AlertTriangle, Download, RefreshCw, Lock, Trash2, Smartphone, Mail, AlertCircle, MessageSquare, X, CheckCircle2 } from 'lucide-react';

const defaultProfile = { name: 'Cmdr. R. Sharma', role: 'Operations Commander', region: 'North • UP Sector 7', shift: '14:00–22:00 IST' };
const defaultSliders = { crowd: 85, heat: 38, incident: 72, autoDispatch: 90 };
const defaultToggles = {
  crossEvent: true, predictive: true, autoGen: true, historical: true, resource: false, voice: false,
  crowd: true, behavior: true, sms: true, email: false, whatsapp: true, push: true, escalation: true, recommendations: true,
};

const Settings = () => {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('trinetra_profile') || JSON.stringify(defaultProfile)));
  const [sliders, setSliders] = useState(() => JSON.parse(localStorage.getItem('trinetra_sliders') || JSON.stringify(defaultSliders)));
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => JSON.parse(localStorage.getItem('trinetra_toggles') || JSON.stringify(defaultToggles)));
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ show: boolean, msg: string, isError?: boolean }>({ show: false, msg: '' });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Temp state for profile edit
  const [editProfile, setEditProfile] = useState(profile);
  
  // Temp state for password
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Temp state for danger action
  const [dangerAction, setDangerAction] = useState<{title: string, msg: string, action: () => void} | null>(null);

  const showToast = (msg: string, isError = false) => {
    setToastMessage({ show: true, msg, isError });
    setTimeout(() => setToastMessage({ show: false, msg: '', isError: false }), 3000);
  };

  const markUnsaved = () => setHasUnsavedChanges(true);

  const toggle = (key: string) => {
    setToggles((prev: any) => ({ ...prev, [key]: !prev[key] }));
    markUnsaved();
  };

  const handleSliderChange = (key: string, val: number) => {
    setSliders((prev: any) => ({ ...prev, [key]: val }));
    markUnsaved();
  };

  const handleSaveSettings = () => {
    localStorage.setItem('trinetra_profile', JSON.stringify(profile));
    localStorage.setItem('trinetra_sliders', JSON.stringify(sliders));
    localStorage.setItem('trinetra_toggles', JSON.stringify(toggles));
    setHasUnsavedChanges(false);
    showToast("Settings saved successfully.");
  };

  const handleResetSettings = () => {
    setProfile(JSON.parse(localStorage.getItem('trinetra_profile') || JSON.stringify(defaultProfile)));
    setSliders(JSON.parse(localStorage.getItem('trinetra_sliders') || JSON.stringify(defaultSliders)));
    setToggles(JSON.parse(localStorage.getItem('trinetra_toggles') || JSON.stringify(defaultToggles)));
    setHasUnsavedChanges(false);
    showToast("Changes reset.");
  };

  const saveProfileModal = () => {
    setProfile(editProfile);
    setActiveModal(null);
    markUnsaved();
  };

  const savePasswordModal = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    setActiveModal(null);
    setPasswords({ current: '', new: '', confirm: '' });
    showToast("Password updated successfully.");
  };

  const triggerDanger = (title: string, msg: string, action: () => void) => {
    setDangerAction({ title, msg, action });
    setActiveModal('danger');
  };

  const executeDanger = () => {
    if (dangerAction) dangerAction.action();
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 relative">
      
      {/* Toast Notification */}
      {toastMessage.show && (
        <div className="fixed top-8 right-8 z-[200] transition-all duration-300">
          <div className={`border px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md text-white ${toastMessage.isError ? 'bg-critical/90 border-critical' : 'bg-safe/90 border-safe'}`}>
            {toastMessage.isError ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            <span className="text-sm font-medium">{toastMessage.msg}</span>
          </div>
        </div>
      )}

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
              {profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">{profile.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{profile.role}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 bg-background/50 border border-cardBorder rounded-lg p-4 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Region</span>
              <span className="text-white font-medium">{profile.region}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shift</span>
              <span className="text-white font-medium">{profile.shift}</span>
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
            <button onClick={() => { setEditProfile(profile); setActiveModal('profile'); }} className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
              Edit Profile
            </button>
            <button onClick={() => setActiveModal('password')} className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
              Password
            </button>
          </div>
        </div>

        {/* CARD 2: ALERT THRESHOLDS (Span 8) */}
        <div className="xl:col-span-8 glass-card p-6 flex flex-col h-full">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
            <SlidersIcon size={16} className="text-warning" /> Alert Thresholds
          </h2>
          <p className="text-xs text-gray-400 mb-6">Trigger sensitivity for auto-escalation</p>

          <div className="flex-1 flex flex-col justify-center space-y-8 bg-background/50 border border-cardBorder p-6 rounded-lg">
            {[
              { key: 'crowd', label: 'Crowd density alert', val: sliders.crowd, suffix: '%', max: 100 },
              { key: 'heat', label: 'Heat index alert', val: sliders.heat, suffix: '°C', max: 60 },
              { key: 'incident', label: 'Incident escalation threshold', val: sliders.incident, suffix: '/100', max: 100 },
              { key: 'autoDispatch', label: 'AI Auto-dispatch confidence', val: sliders.autoDispatch, suffix: '%', max: 100 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-200 font-medium">{item.label}</span>
                  <span className="text-primary font-bold">{item.val}{item.suffix}</span>
                </div>
                <div className="w-full relative">
                  <input 
                    type="range" 
                    min="0" 
                    max={item.max} 
                    value={item.val} 
                    onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-card border border-cardBorder rounded-full appearance-none cursor-pointer accent-primary outline-none"
                  />
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
            <button onClick={() => setActiveModal('sessions')} className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
              Manage Sessions
            </button>
            <button onClick={() => setActiveModal('logs')} className="flex-1 bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm">
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
            <button onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({profile, sliders, toggles}));
              const anchor = document.createElement('a'); anchor.href = dataStr; anchor.download = "trinetra_config.json"; anchor.click();
            }} className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <Download size={14} /> Export Configuration
            </button>
            <button onClick={() => showToast("Settings backup completed.")} className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <Database size={14} /> Backup Settings
            </button>
            <button onClick={() => triggerDanger("Restart AI Services", "Are you sure you want to restart all AI microservices? This may cause a temporary delay in processing.", () => showToast("AI services restarted."))} className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <RefreshCw size={14} /> Restart AI Services
            </button>
            <button onClick={() => triggerDanger("Reset To Default", "Are you sure you want to revert all settings to their default factory state? This cannot be undone.", () => {
              setProfile(defaultProfile); setSliders(defaultSliders); setToggles(defaultToggles);
              localStorage.removeItem('trinetra_profile'); localStorage.removeItem('trinetra_sliders'); localStorage.removeItem('trinetra_toggles');
              showToast("All settings have been reset to default.");
            })} className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center gap-2">
              <RefreshCw size={14} /> Reset To Default
            </button>
            <button onClick={() => triggerDanger("EMERGENCY LOCKDOWN", "WARNING: This will lock all ground systems, disable external APIs, and enter offline defensive mode. Proceed?", () => showToast("Emergency lockdown activated.", true))} className="bg-[#FF1744]/10 border border-[#FF1744]/30 hover:bg-[#FF1744]/20 text-[#FF1744] font-medium py-2.5 px-6 rounded-lg transition-colors text-sm flex items-center gap-2 ml-auto">
              <Trash2 size={14} /> Emergency Lockdown
            </button>
          </div>
        </div>

      </div>

      {/* Sticky Save Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 right-0 p-4 bg-[#050B18]/95 backdrop-blur-md border-t border-cardBorder w-full lg:w-[calc(100%-16rem)] flex justify-end items-center gap-4 z-40 animate-[slideUp_0.3s_ease-out]">
          <span className="text-xs text-warning italic mr-2 flex items-center gap-2"><AlertCircle size={14}/> You have unsaved changes</span>
          <button onClick={handleResetSettings} className="text-gray-300 hover:text-white font-medium py-2 px-4 transition-colors text-sm">
            Reset
          </button>
          <button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Save Changes
          </button>
        </div>
      )}

      {/* MODALS */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-cardBorder w-full max-w-md rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Edit Profile</h3>
              <X size={20} className="text-gray-400 cursor-pointer hover:text-white" onClick={() => setActiveModal(null)} />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Operator Name</label>
                <input type="text" value={editProfile.name} onChange={e => setEditProfile({...editProfile, name: e.target.value})} className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Role</label>
                <input type="text" value={editProfile.role} onChange={e => setEditProfile({...editProfile, role: e.target.value})} className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Region</label>
                <input type="text" value={editProfile.region} onChange={e => setEditProfile({...editProfile, region: e.target.value})} className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shift</label>
                <input type="text" value={editProfile.shift} onChange={e => setEditProfile({...editProfile, shift: e.target.value})} className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setActiveModal(null)} className="flex-1 border border-cardBorder text-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={saveProfileModal} className="flex-1 bg-primary text-white font-bold py-2 rounded-lg text-sm">Apply</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'password' && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-cardBorder w-full max-w-md rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Change Password</h3>
              <X size={20} className="text-gray-400 cursor-pointer hover:text-white" onClick={() => setActiveModal(null)} />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Current Password</label>
                <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">New Password</label>
                <input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Confirm Password</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setActiveModal(null)} className="flex-1 border border-cardBorder text-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={savePasswordModal} className="flex-1 bg-primary text-white font-bold py-2 rounded-lg text-sm">Update Password</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'sessions' && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-cardBorder w-full max-w-lg rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Active Sessions</h3>
              <X size={20} className="text-gray-400 cursor-pointer hover:text-white" onClick={() => setActiveModal(null)} />
            </div>
            <div className="space-y-3">
              {['Current Device', 'Command Tablet', 'Mobile Backup Device', 'Control Room Terminal'].map((sess, i) => (
                <div key={i} className="flex justify-between items-center bg-background/50 border border-cardBorder p-3 rounded-lg">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">{sess} {i === 0 && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">This Device</span>}</div>
                    <div className="text-xs text-gray-400">IP: 192.168.1.{10+i} • Last active: {i===0 ? 'Just now' : `${i*2} hours ago`}</div>
                  </div>
                  {i !== 0 && <button onClick={() => showToast(`Session '${sess}' revoked.`)} className="text-xs text-[#FF1744] border border-[#FF1744]/30 hover:bg-[#FF1744]/10 px-3 py-1.5 rounded transition-colors">Revoke</button>}
                </div>
              ))}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full border border-cardBorder text-gray-300 py-2.5 rounded-lg text-sm mt-6 hover:bg-cardBorder/50">Close</button>
          </div>
        </div>
      )}

      {activeModal === 'logs' && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-cardBorder w-full max-w-lg rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Security Logs</h3>
              <X size={20} className="text-gray-400 cursor-pointer hover:text-white" onClick={() => setActiveModal(null)} />
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {[
                { e: 'Successful login from new IP', t: '10 mins ago', c: 'text-safe' },
                { e: 'Settings updated by Admin', t: '2 hours ago', c: 'text-primary' },
                { e: 'Emergency lockdown tested', t: '1 day ago', c: 'text-warning' },
                { e: 'Failed login blocked (x5)', t: '3 days ago', c: 'text-[#FF1744]' },
                { e: 'Password changed successfully', t: '24 days ago', c: 'text-safe' },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center bg-background/50 border border-cardBorder p-3 rounded-lg">
                  <div className={`text-sm font-medium ${log.c}`}>{log.e}</div>
                  <div className="text-xs text-gray-400">{log.t}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full border border-cardBorder text-gray-300 py-2.5 rounded-lg text-sm mt-6 hover:bg-cardBorder/50">Close</button>
          </div>
        </div>
      )}

      {activeModal === 'danger' && dangerAction && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-[#FF1744]/50 w-full max-w-md rounded-xl shadow-[0_0_30px_rgba(255,23,68,0.2)] p-6">
            <div className="flex items-center gap-3 mb-4 text-[#FF1744]">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">{dangerAction.title}</h3>
            </div>
            <p className="text-sm text-gray-300 mb-8 leading-relaxed">
              {dangerAction.msg}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 border border-cardBorder text-gray-300 py-2.5 rounded-lg text-sm hover:bg-cardBorder/50 transition-colors">Cancel</button>
              <button onClick={executeDanger} className="flex-1 bg-[#FF1744] hover:bg-[#FF1744]/90 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
