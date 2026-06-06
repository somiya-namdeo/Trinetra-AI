import React from 'react';
import { AlertTriangle, Flame, Truck, Activity } from 'lucide-react';

const StatsCards = ({ data }: { data?: any }) => {
  const safeData = data || {
    activeIncidents: '6',
    criticalZones: '1',
    availableResources: '8',
    totalResources: '13',
    riskScore: '72',
    insightZone: 'Zone A',
    insightSeverity: 'elevated'
  };

  const stats = [
    {
      title: 'ACTIVE INCIDENTS',
      value: safeData.activeIncidents,
      subtext: 'vs last hour',
      trend: '+3',
      icon: AlertTriangle,
      color: 'text-warning',
      badge: 'bg-warning/20 border-warning/30',
      trendColor: 'text-critical'
    },
    {
      title: 'CRITICAL ZONES',
      value: safeData.criticalZones,
      subtext: 'requires immediate action',
      trend: '+1',
      icon: Flame,
      color: 'text-critical',
      badge: 'bg-critical/20 border-critical/30',
      trendColor: 'text-critical'
    },
    {
      title: 'AVAILABLE RESOURCES',
      value: safeData.availableResources,
      subtext: `of ${safeData.totalResources} total units`,
      trend: '-2',
      icon: Truck,
      color: 'text-safe',
      badge: 'bg-safe/20 border-safe/30',
      trendColor: 'text-safe'
    },
    {
      title: 'OVERALL RISK SCORE',
      value: safeData.riskScore,
      subtext: `${safeData.insightSeverity} — monitor ${safeData.insightZone}`,
      trend: '+8',
      icon: Activity,
      color: 'text-primary',
      badge: 'bg-primary/20 border-primary/30',
      trendColor: 'text-critical'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-5 relative overflow-hidden group">
          {/* Subtle gradient glow effect based on stat type */}
          <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${stat.color.replace('text-', 'bg-')}`}></div>
          
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-semibold text-gray-400 tracking-wider">{stat.title}</h3>
            <div className={`p-1.5 rounded-md border ${stat.badge} ${stat.color}`}>
              <stat.icon size={16} />
            </div>
          </div>
          
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{stat.value}</span>
            <div className="mb-1">
              <p className="text-xs text-gray-400">{stat.subtext}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-xs font-bold ${stat.trendColor}`}>
                  {stat.trend.startsWith('+') ? '↗' : '↘'} {stat.trend.replace(/[+-]/, '')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
