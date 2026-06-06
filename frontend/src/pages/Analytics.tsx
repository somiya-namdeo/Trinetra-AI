import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const trendData = [
  { time: '08:00', red: 7, green: 5 },
  { time: '09:00', red: 8, green: 5 },
  { time: '10:00', red: 8, green: 7 },
  { time: '11:00', red: 10, green: 4 },
  { time: '12:00', red: 7, green: 3 },
  { time: '13:00', red: 6, green: 3 },
  { time: '14:00', red: 5, green: 1 },
  { time: '15:00', red: 6, green: 3 },
  { time: '16:00', red: 4, green: 3 },
  { time: '17:00', red: 2, green: 3 },
  { time: '18:00', red: 4, green: 6 },
  { time: '19:00', red: 2, green: 5 },
];

const riskData = [
  { name: 'Critical', value: 25, fill: '#FF1744' },
  { name: 'High', value: 30, fill: '#FF9800' },
  { name: 'Medium', value: 20, fill: '#19B5D8' },
  { name: 'Low', value: 25, fill: '#00C853' },
];

const resourceData = [
  { name: 'Ambulance', deployed: 2, available: 2 },
  { name: 'Medical', deployed: 1, available: 2 },
  { name: 'Security', deployed: 1, available: 2 },
  { name: 'Fire', deployed: 0, available: 1 },
  { name: 'Volunteer', deployed: 1, available: 1 },
];

const heatMapCells = [
  '#FF9800', '#19B5D8', '#FF1744', '#19B5D8',
  '#00C853', '#FF9800', '#FF1744', '#19B5D8',
  '#FF1744', '#19B5D8', '#FF9800', '#19B5D8',
  '#00C853', '#FF1744', '#19B5D8', '#00C853',
  '#FF1744', '#FF9800', '#FF9800', '#19B5D8',
  '#19B5D8', '#19B5D8', '#FF9800', '#19B5D8',
  '#00C853', '#FF1744', '#00C853', '#FF9800'
];

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-sm text-gray-400">Operational telemetry, trends, and post-event learning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROW 1: Incident Trends (Span 2) */}
        <div className="glass-card p-5 lg:col-span-2 flex flex-col w-full min-w-0">
          <div className="mb-4">
            <h2 className="font-bold text-white text-sm">Incident Trends</h2>
            <p className="text-[10px] text-gray-400">Last 12 hours</p>
          </div>
          <div className="w-full h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF1744" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FF1744" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C853" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} tickCount={5} domain={[0, 12]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#081528', borderColor: '#1E293B', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ color: '#94A3B8', fontSize: '10px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="red" stroke="#FF1744" strokeWidth={2} fillOpacity={1} fill="url(#colorRed)" />
                <Area type="monotone" dataKey="green" stroke="#00C853" strokeWidth={2} fillOpacity={1} fill="url(#colorGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 1: Risk Distribution (Span 1) */}
        <div className="glass-card p-5 lg:col-span-1 flex flex-col w-full min-w-0">
          <div className="mb-3">
            <h2 className="font-bold text-white text-sm">Risk Distribution</h2>
            <p className="text-[10px] text-gray-400">Active incidents by severity</p>
          </div>
          <div className="w-full h-[250px] min-w-0 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#081528', borderColor: '#1E293B', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-2">
            {[
              { label: 'Critical', color: 'bg-[#FF1744]' },
              { label: 'High', color: 'bg-[#FF9800]' },
              { label: 'Medium', color: 'bg-[#19B5D8]' },
              { label: 'Low', color: 'bg-[#00C853]' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                <span className="text-[10px] text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROW 2: Resource Utilization (Span 2) */}
        <div className="glass-card p-5 lg:col-span-2 flex flex-col w-full min-w-0">
          <div className="mb-4">
            <h2 className="font-bold text-white text-sm">Resource Utilization</h2>
            <p className="text-[10px] text-gray-400">Deployed vs available</p>
          </div>
          <div className="w-full h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} margin={{ top: 10, right: 20, left: -20, bottom: -5 }} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} tickCount={5} domain={[0, 4]} />
                <RechartsTooltip 
                  cursor={{ fill: '#1E293B', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#081528', borderColor: '#1E293B', borderRadius: '8px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={20}
                  iconType="square"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }}
                />
                <Bar dataKey="deployed" stackId="a" fill="#FF9800" radius={[0, 0, 4, 4]} />
                <Bar dataKey="available" stackId="a" fill="#00C853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 2: Zone Heat Map (Span 1) */}
        <div className="glass-card p-5 lg:col-span-1 flex flex-col">
          <div className="mb-4">
            <h2 className="font-bold text-white text-sm">Zone Heat Map</h2>
            <p className="text-[10px] text-gray-400">Risk intensity by zone</p>
          </div>
          
          {/* Grid */}
          <div className="flex-1 grid grid-cols-4 gap-1.5 mb-4">
            {heatMapCells.map((color, i) => (
              <div 
                key={i} 
                className="rounded-md w-full h-8 sm:h-10 opacity-90 hover:opacity-100 transition-opacity cursor-pointer border border-black/20"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>

          {/* Heat Map Legend */}
          <div className="mt-auto">
            <div className="flex justify-between items-center text-[9px] text-gray-400 mb-1.5">
              <span>Low</span>
              <span>Critical</span>
            </div>
            <div className="h-1.5 w-full rounded-full flex overflow-hidden mb-3">
              <div className="flex-1 bg-[#00C853]"></div>
              <div className="flex-1 bg-[#19B5D8]"></div>
              <div className="flex-1 bg-[#FF9800]"></div>
              <div className="flex-1 bg-[#FF1744]"></div>
            </div>
            <p className="text-[11px] text-gray-300">
              <span className="text-[#FF1744] font-bold">3 hot cells</span> detected • Zone A perimeter
            </p>
          </div>
        </div>
      </div>

      {/* ROW 3: KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-cardBorder hover:border-primary/30 transition-colors">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">AVG. RESPONSE TIME</p>
          <p className="text-2xl font-bold text-white mb-1">3m 42s</p>
          <p className="text-xs text-[#00C853] font-bold">-18%</p>
        </div>
        
        <div className="glass-card p-5 border border-cardBorder hover:border-primary/30 transition-colors">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">RESOLVED TODAY</p>
          <p className="text-2xl font-bold text-white mb-1">147</p>
          <p className="text-xs text-[#FF1744] font-bold">+12</p>
        </div>
        
        <div className="glass-card p-5 border border-cardBorder hover:border-primary/30 transition-colors">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">AI PREDICTIONS ACCURATE</p>
          <p className="text-2xl font-bold text-white mb-1">94.2%</p>
          <p className="text-xs text-[#FF1744] font-bold">+1.4%</p>
        </div>
        
        <div className="glass-card p-5 border border-cardBorder hover:border-primary/30 transition-colors">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">CROWD DENSITY PEAK</p>
          <p className="text-2xl font-bold text-white mb-1">92/100</p>
          <p className="text-xs text-[#FF1744] font-bold">+6</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
