import React, { useState } from 'react';

const nodes = [
  { id: 'zone-a', title: 'ZONE A', severity: 'Critical', status: 'UNCONTAINED', eta: 'N/A', top: '33%', left: '25%', color: 'critical', pulse: 'shadow-[0_0_15px_#ef4444]', routeColor: 'url(#route-critical)' },
  { id: 'north-gate', title: 'NORTH GATE', severity: 'Medium', status: 'MONITORING', eta: 'En Route', top: '25%', left: '50%', color: 'primary', pulse: 'shadow-[0_0_15px_#0ea5e9]', routeColor: 'url(#route-primary)' },
  { id: 'gate-7', title: 'GATE 7', severity: 'High', status: 'RESPONDING', eta: '3 min', top: '66%', left: '75%', color: 'warning', pulse: 'shadow-[0_0_15px_#f59e0b]', routeColor: 'url(#route-warning)' }
];

const commandNode = { top: '75%', left: '33%' };

const MissionMap = ({ activeIncidents = 3, enRouteResources = 2 }: { activeIncidents?: string | number, enRouteResources?: string | number }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="glass-card flex flex-col min-h-[400px] overflow-hidden relative">
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="bg-card/80 border border-cardBorder text-xs px-3 py-1.5 rounded backdrop-blur-md">
            <span className="text-white font-bold tracking-widest">TRINETRA AI</span>
            <span className="text-gray-500 mx-2">|</span>
            <span className="text-primary tracking-widest uppercase font-medium text-[10px]">Emergency Intelligence Grid</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-card/80 border border-cardBorder text-xs text-gray-400 px-3 py-1.5 rounded backdrop-blur-md font-mono hidden sm:block">
            LAT 25.4358 · LON 81.8463
          </div>
          <div className="bg-card/80 border border-cardBorder text-xs text-gray-400 px-3 py-1.5 rounded backdrop-blur-md">
            Active Incidents: <span className="text-white font-bold">{activeIncidents}</span>
          </div>
          <div className="bg-card/80 border border-cardBorder text-xs text-gray-400 px-3 py-1.5 rounded backdrop-blur-md">
            En Route: <span className="text-primary font-bold">{enRouteResources}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-card/80 border border-cardBorder text-xs text-gray-400 px-3 py-1.5 rounded backdrop-blur-md flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse"></div>
          REC
        </div>
      </div>

      <div className="flex-1 relative bg-[#0B1120] border-b border-cardBorder">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.3)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Crosshairs */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cardBorder/50 border-dashed border-l border-gray-600"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-cardBorder/50 border-dashed border-t border-gray-600"></div>
        
        {/* Animated Routes SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="route-critical" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="route-warning" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="route-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1"/>
            </linearGradient>
            <style>
              {`
                @keyframes dashMove {
                  to { stroke-dashoffset: -20; }
                }
                .anim-dash {
                  animation: dashMove 1s linear infinite;
                }
              `}
            </style>
          </defs>
          
          {nodes.map(node => (
            <line 
              key={`route-${node.id}`}
              x1={commandNode.left} 
              y1={commandNode.top} 
              x2={node.left} 
              y2={node.top} 
              stroke={node.routeColor} 
              strokeWidth="2" 
              strokeDasharray="5 5" 
              className="anim-dash" 
            />
          ))}
        </svg>

        {/* Dynamic Nodes */}
        {nodes.map(node => (
          <div 
            key={node.id} 
            className="absolute z-20" 
            style={{ top: node.top, left: node.left }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className={`w-32 h-32 bg-${node.color}/20 rounded-full blur-2xl absolute -top-16 -left-16`}></div>
            <div className={`relative z-10 bg-${node.color} p-2 rounded-full border border-white/20 animate-pulse cursor-pointer ${node.pulse}`}>
              <span className={`text-${node.color === 'primary' ? 'gray-300' : (node.color === 'critical' ? 'white' : node.color)} text-[10px] absolute -top-5 -left-4 whitespace-nowrap font-bold`}>
                {node.title}
              </span>
            </div>
            
            {/* Tooltip */}
            {hoveredNode === node.id && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-[#0A192F] border border-cardBorder p-3 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 animate-slideDown pointer-events-none">
                <div className="font-bold text-white text-sm mb-2 pb-2 border-b border-cardBorder/50">{node.title}</div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <div className="text-gray-400">Severity:</div>
                  <div className={`font-bold text-${node.color}`}>{node.severity}</div>
                  <div className="text-gray-400">Status:</div>
                  <div className="text-white font-medium">{node.status}</div>
                  <div className="text-gray-400">ETA:</div>
                  <div className="text-white font-medium">{node.eta}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Command Center Node */}
        <div className="absolute z-20" style={{ top: commandNode.top, left: commandNode.left }}>
          <div className="w-32 h-32 bg-safe/20 rounded-full blur-3xl absolute -top-16 -left-16"></div>
          <div className="relative z-10 bg-safe/80 border border-safe p-1.5 rounded-full shadow-[0_0_15px_#10b981]">
            <span className="text-gray-400 text-[10px] absolute -top-5 -left-8 whitespace-nowrap font-bold">COMMAND CENTER</span>
          </div>
        </div>
      </div>

      <div className="h-12 bg-card/50 flex items-center justify-between px-4 text-xs font-medium border-t border-cardBorder">
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-critical animate-pulse"></div> Critical</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div> High</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Medium</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-safe"></div> Command Center</div>
        </div>
      </div>
    </div>
  );
};

export default MissionMap;
