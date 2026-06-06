import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Truck, BrainCircuit, Bell, BarChart2, Settings, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Resources', path: '/resources', icon: Truck },
    { name: 'Memory AI', path: '/memory-ai', icon: BrainCircuit, badge: 'AI' },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className={`bg-card h-screen flex flex-col border-r border-cardBorder transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div 
        onClick={() => navigate('/')}
        className={`p-6 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'} h-[88px] cursor-pointer hover:opacity-80 transition-opacity`}
        title="Return to Landing Page"
      >
        <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
          <Shield size={24} />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="font-bold text-lg tracking-wide text-white">ResQNet</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Emergency Command</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 mt-4 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 rounded-lg transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium shadow-[inset_2px_0_0_0_#0ea5e9]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-cardBorder/50'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && (
              <>
                <span className="whitespace-nowrap">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Status & Collapse */}
      <div className="p-4 border-t border-cardBorder flex flex-col gap-6">
        {/* System Status */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}`} title={isCollapsed ? "All Systems Online" : undefined}>
          <div className="w-2 h-2 rounded-full bg-safe animate-pulse shrink-0"></div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-medium text-gray-200">All Systems Online</p>
              <p className="text-xs text-gray-400">Latency 42ms</p>
            </div>
          )}
        </div>
        
        {/* Collapse Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center text-gray-400 hover:text-white transition-colors ${isCollapsed ? 'justify-center' : 'gap-2 px-2'}`}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!isCollapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
