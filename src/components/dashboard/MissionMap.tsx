import React from 'react';

const MissionMap = () => {
  return (
    <div className="glass-card flex flex-col min-h-[400px] overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-card/80 border border-cardBorder text-xs text-gray-400 px-3 py-1.5 rounded backdrop-blur-md font-mono">
          LAT 25.4358 · LON 81.8463
        </div>
      </div>
      <div className="absolute top-4 right-4 z-10">
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
        
        {/* Mock Map Nodes with Glows */}
        <div className="absolute top-1/3 left-1/4">
          <div className="w-48 h-48 bg-critical/20 rounded-full blur-3xl absolute -top-24 -left-24"></div>
          <div className="relative z-10 bg-critical p-2 rounded-full border border-white/20 animate-pulse cursor-pointer">
            <span className="text-white text-xs font-bold absolute -top-6 -left-4 whitespace-nowrap">ZONE A</span>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/2">
          <div className="w-32 h-32 bg-primary/20 rounded-full blur-2xl absolute -top-16 -left-16"></div>
          <div className="relative z-10 bg-primary p-2 rounded-full border border-white/20">
            <span className="text-gray-300 text-[10px] absolute -top-5 -left-4 whitespace-nowrap">NORTH GATE</span>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/4">
          <div className="w-40 h-40 bg-warning/20 rounded-full blur-3xl absolute -top-20 -left-20"></div>
          <div className="relative z-10 bg-warning p-2 rounded-full border border-white/20 animate-pulse">
            <span className="text-warning text-xs font-bold absolute -top-6 -left-4 whitespace-nowrap">GATE 7</span>
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/3">
          <div className="w-32 h-32 bg-safe/20 rounded-full blur-3xl absolute -top-16 -left-16"></div>
          <div className="relative z-10 bg-safe/80 border border-safe p-1.5 rounded-full">
            <span className="text-gray-400 text-[10px] absolute -top-5 -left-4 whitespace-nowrap">COMMAND</span>
          </div>
        </div>
      </div>

      <div className="h-12 bg-card/50 flex items-center gap-4 px-4 text-xs font-medium border-t border-cardBorder">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-critical"></div> Critical</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warning"></div> Warning</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-safe"></div> Safe</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> Enroute</div>
      </div>
    </div>
  );
};

export default MissionMap;
