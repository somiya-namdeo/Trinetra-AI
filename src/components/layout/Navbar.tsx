import React, { useState, useEffect } from 'react';
import { Search, Bell, Activity } from 'lucide-react';

const Navbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-20 bg-card border-b border-cardBorder flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-critical/10 text-critical border border-critical/30 px-3 py-1.5 rounded-full text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-critical animate-pulse"></div>
          LIVE OPS
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Mahakumbh 2026 — Sector 7</h2>
          <p className="text-xs text-gray-400">Operator: Cmdr. R. Sharma · Shift 14:00-22:00</p>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search incidents, zones, resources..." 
            className="w-full bg-background border border-cardBorder rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity className="text-warning" size={18} />
          <span className="text-sm text-gray-400">Risk <span className="text-warning font-bold">72</span></span>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-mono text-gray-200">{time.toLocaleTimeString('en-US', { hour12: false })}</p>
          <p className="text-[10px] text-gray-500">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} IST</p>
        </div>

        <div className="relative">
          <Bell className="text-gray-400 hover:text-gray-200 cursor-pointer" size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-critical rounded-full border-2 border-card"></span>
        </div>

        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
          RS
        </div>
      </div>
    </div>
  );
};

export default Navbar;
