export type IncidentPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'ACTIVE' | 'RESPONDING' | 'RESOLVED';

export interface Incident {
  id: string;
  title: string;
  location: string;
  category: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  timestamp: string;
  timeAgo: string;
}

export const activeIncidents: Incident[] = [
  {
    id: 'INC-2841',
    title: 'Heat stress cluster',
    location: 'Zone A',
    category: 'Medical',
    priority: 'CRITICAL',
    status: 'ACTIVE',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    timeAgo: '2 min ago'
  },
  {
    id: 'INC-2840',
    title: 'Elderly collapse near Gate 7',
    location: 'Gate 7',
    category: 'Medical',
    priority: 'HIGH',
    status: 'RESPONDING',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    timeAgo: '5 min ago'
  },
  {
    id: 'INC-2839',
    title: 'Water station failure',
    location: 'Zone A',
    category: 'Infrastructure',
    priority: 'HIGH',
    status: 'RESPONDING',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    timeAgo: '8 min ago'
  },
  {
    id: 'INC-2838',
    title: 'Minor crowd surge reported',
    location: 'North Gate',
    category: 'Security',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    timeAgo: '15 min ago'
  },
  {
    id: 'INC-2837',
    title: 'Lost child found',
    location: 'Zone C',
    category: 'Welfare',
    priority: 'LOW',
    status: 'RESOLVED',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    timeAgo: '25 min ago'
  },
  {
    id: 'INC-2836',
    title: 'Suspicious package',
    location: 'Gate 4',
    category: 'Security',
    priority: 'HIGH',
    status: 'ACTIVE',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    timeAgo: '30 min ago'
  }
];
