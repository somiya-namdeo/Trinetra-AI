export interface ResourceStat {
  type: string;
  available: number;
  total: number;
  color: string;
}

export const resourceStats: ResourceStat[] = [
  { type: 'Ambulances', available: 8, total: 12, color: 'bg-emerald-500' },
  { type: 'Medical Teams', available: 15, total: 20, color: 'bg-cyan-500' },
  { type: 'Security Units', available: 32, total: 40, color: 'bg-blue-500' },
  { type: 'Water Tankers', available: 3, total: 8, color: 'bg-orange-500' }
];

export interface SectorHealth {
  name: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
}

export const sectorHealthData: SectorHealth[] = [
  { name: 'Zone A', status: 'CRITICAL', riskScore: 85, trend: 'up' },
  { name: 'Zone B', status: 'SAFE', riskScore: 22, trend: 'stable' },
  { name: 'Zone C', status: 'WARNING', riskScore: 68, trend: 'up' },
  { name: 'North Gate', status: 'WARNING', riskScore: 74, trend: 'up' },
  { name: 'Gate 7', status: 'SAFE', riskScore: 41, trend: 'down' }
];

export interface AIDecision {
  id: string;
  recommendation: string;
  confidence: number;
  timestamp: string;
  status: 'EXECUTED' | 'PENDING' | 'REJECTED';
}

export const recentAIDecisions: AIDecision[] = [
  {
    id: 'DEC-1042',
    recommendation: 'Reroute incoming crowd from Gate 4 to Gate 6',
    confidence: 92,
    timestamp: '10 mins ago',
    status: 'EXECUTED'
  },
  {
    id: 'DEC-1043',
    recommendation: 'Dispatch Medical Unit 7 to Zone A',
    confidence: 88,
    timestamp: '4 mins ago',
    status: 'PENDING'
  },
  {
    id: 'DEC-1044',
    recommendation: 'Issue hydration warning via PA system',
    confidence: 76,
    timestamp: '1 min ago',
    status: 'PENDING'
  }
];
