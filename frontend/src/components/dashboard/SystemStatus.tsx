import React from 'react';
import { Server, Activity, Users, Shield, Cpu, Database } from 'lucide-react';

const SystemStatus = () => {
  return (
    <div className="glass-card flex flex-col">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Server size={16} className="text-primary" /> System Status
        </h3>
      </div>
      <div className="p-4 flex flex-col gap-4">
        
        {/* Agent Status */}
        <div>
          <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Agent Status</h4>
          <div className="space-y-2.5">
            {[
              { name: 'Risk Prediction Core', status: 'Online', latency: '12ms', color: 'safe' },
              { name: 'Incident Classification Agent', status: 'Online', latency: '42ms', color: 'safe' },
              { name: 'Resource Optimizer', status: 'Syncing', latency: '180ms', color: 'warning' },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-300 flex items-center gap-1.5"><Cpu size={12} className="text-gray-500" /> {agent.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{agent.latency}</span>
                  <div className={`w-1.5 h-1.5 rounded-full bg-${agent.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Resources */}
        <div className="mt-2">
          <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Active Resources</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-cardBorder/30 p-2 rounded flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase">Medical</span>
              <span className="text-white font-bold text-sm">24<span className="text-gray-500 text-xs font-normal">/30</span></span>
            </div>
            <div className="bg-cardBorder/30 p-2 rounded flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase">Security</span>
              <span className="text-white font-bold text-sm">48<span className="text-gray-500 text-xs font-normal">/50</span></span>
            </div>
            <div className="bg-cardBorder/30 p-2 rounded flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase">Fire/Hazmat</span>
              <span className="text-white font-bold text-sm">12<span className="text-gray-500 text-xs font-normal">/15</span></span>
            </div>
            <div className="bg-cardBorder/30 p-2 rounded flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase">Volunteers</span>
              <span className="text-white font-bold text-sm">120<span className="text-gray-500 text-xs font-normal">/150</span></span>
            </div>
          </div>
        </div>

        {/* Database / Network */}
        <div className="mt-2 pt-4 border-t border-cardBorder">
          <div className="flex justify-between items-center text-xs text-gray-400">
             <div className="flex items-center gap-1.5"><Activity size={12} /> Network Load</div>
             <span className="text-primary font-mono">34%</span>
          </div>
          <div className="w-full bg-cardBorder h-1.5 rounded-full mt-2 overflow-hidden">
             <div className="bg-primary h-full w-[34%]"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemStatus;
