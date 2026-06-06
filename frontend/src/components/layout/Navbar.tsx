import React, { useState, useEffect, useRef } from 'react';
import { Bell, Activity, CheckCircle2, AlertTriangle, Shield, User, Settings, LogOut, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [toastMessage, setToastMessage] = useState({ show: false, msg: '' });
  
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Critical Incident', msg: 'Critical incident detected in Zone A', time: '2m ago', type: 'critical', icon: AlertTriangle },
    { id: 2, title: 'Fire Hazard', msg: 'Fire hazard escalation at Food Court', time: '14m ago', type: 'warning', icon: AlertTriangle },
    { id: 3, title: 'Resource Deployed', msg: 'Resource dispatched to Gate 7', time: '28m ago', type: 'safe', icon: Shield },
    { id: 4, title: 'Broadcast Sent', msg: 'Broadcast sent successfully', time: '1h ago', type: 'primary', icon: Info },
    { id: 5, title: 'AI Memory Alert', msg: 'Memory AI detected crowd surge risk', time: '2h ago', type: 'warning', icon: Activity },
    { id: 6, title: 'Utility Failure', msg: 'Water supply failure reported', time: '3h ago', type: 'critical', icon: AlertTriangle },
  ];

  const handleLogout = () => {
    setShowProfile(false);
    setToastMessage({ show: true, msg: 'Demo logout action initiated' });
    setTimeout(() => setToastMessage({ show: false, msg: '' }), 3000);
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-[#FF1744] bg-[#FF1744]/10 border-[#FF1744]/20';
      case 'warning': return 'text-[#FF9800] bg-[#FF9800]/10 border-[#FF9800]/20';
      case 'safe': return 'text-[#00C853] bg-[#00C853]/10 border-[#00C853]/20';
      case 'primary': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="h-20 bg-card border-b border-cardBorder flex items-center justify-between px-6 sticky top-0 z-[100]">
      
      {/* Toast */}
      {toastMessage.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-slideDown">
          <div className="bg-[#0A192F] border border-primary px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center gap-3 text-white">
            <CheckCircle2 className="text-primary" size={20} />
            <span className="text-sm font-medium">{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Left: Live Ops Status */}
      <div className="flex-1 flex justify-start">
        <div className="flex items-center gap-2 bg-critical/10 text-critical border border-critical/30 px-3 py-1.5 rounded-full text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-critical animate-pulse"></div>
          LIVE OPS
        </div>
      </div>

      {/* Center: Title & Operator Info */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-white font-bold text-lg tracking-wide">Mahakumbh 2026 — Sector 7</h2>
        <p className="text-xs text-gray-400 mt-0.5">Operator: Cmdr. R. Sharma · Shift 14:00-22:00</p>
      </div>

      {/* Right: Metrics & Profile */}
      <div className="flex-1 flex items-center justify-end gap-5">
        <div className="flex items-center gap-2 bg-background border border-cardBorder px-3 py-1.5 rounded-lg">
          <Activity className="text-warning" size={16} />
          <span className="text-xs text-gray-400 uppercase tracking-widest">Risk <span className="text-warning font-bold text-sm ml-1">72</span></span>
        </div>
        
        <div className="text-right flex flex-col justify-center min-w-[80px]">
          <p className="text-sm font-mono text-gray-200 font-bold leading-tight">{time.toLocaleTimeString('en-US', { hour12: false })}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} IST</p>
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-cardBorder relative">
          
          {/* NOTIFICATION BELL */}
          <div ref={notifRef} className="relative">
            <div 
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative hover:bg-cardBorder/50 p-2 rounded-full transition-colors cursor-pointer group"
            >
              <Bell className="text-gray-400 group-hover:text-gray-200" size={20} />
              {hasUnread && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-critical rounded-full border-2 border-card"></span>}
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-[#0A192F] border border-cardBorder rounded-xl shadow-2xl overflow-hidden animate-slideDown origin-top-right">
                <div className="px-4 py-3 border-b border-cardBorder flex justify-between items-center bg-[#050B18]">
                  <h3 className="font-bold text-white text-sm">Notifications</h3>
                  {hasUnread && (
                    <button onClick={() => setHasUnread(false)} className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-wider font-bold">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.map((notif) => {
                    const statusClass = getStatusColor(notif.type);
                    return (
                      <div key={notif.id} className="p-3 border-b border-cardBorder/50 hover:bg-cardBorder/30 transition-colors cursor-pointer flex gap-3 items-start">
                        <div className={`mt-0.5 p-1.5 rounded-full border ${statusClass} shrink-0`}>
                          <notif.icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-xs font-bold text-gray-200 truncate pr-2">{notif.title}</span>
                            <span className="text-[9px] text-gray-500 whitespace-nowrap">{notif.time}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-snug">{notif.msg}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-2 bg-[#050B18] border-t border-cardBorder">
                  <button 
                    onClick={() => { setShowNotifications(false); navigate('/alerts'); }}
                    className="w-full py-2 text-xs font-bold text-primary hover:text-white hover:bg-cardBorder/50 rounded transition-colors"
                  >
                    View all alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE AVATAR */}
          <div ref={profileRef} className="relative">
            <div 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/30 shadow-[0_0_10px_rgba(14,165,233,0.15)] cursor-pointer hover:bg-primary/20 transition-colors"
            >
              RS
            </div>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-[#0A192F] border border-cardBorder rounded-xl shadow-2xl overflow-hidden animate-slideDown origin-top-right">
                <div className="p-4 border-b border-cardBorder bg-[#050B18]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(14,165,233,0.4)] shrink-0">
                      RS
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight">Cmdr. R. Sharma</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Operations Commander</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-b border-cardBorder/50 bg-[#0A192F]/50">
                  <div className="text-[10px] text-gray-400 flex justify-between mb-1.5">
                    <span>Shift:</span><span className="text-white">14:00–22:00 IST</span>
                  </div>
                  <div className="text-[10px] text-gray-400 flex justify-between">
                    <span>Region:</span><span className="text-white">North • Sector 7</span>
                  </div>
                </div>

                <div className="p-2">
                  <button onClick={() => { setShowProfile(false); navigate('/settings'); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-cardBorder/50 rounded transition-colors">
                    <User size={16} className="text-gray-400" /> View Profile
                  </button>
                  <div className="my-1 border-t border-cardBorder/50"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#FF1744] hover:bg-[#FF1744]/10 rounded transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Navbar;
