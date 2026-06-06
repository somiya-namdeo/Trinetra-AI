export interface HistoricalCase {
  id: string;
  eventName: string;
  outcome: string;
  preventionApplied: string;
  similarityScore: number;
}

export const historicalCases: HistoricalCase[] = [
  {
    id: 'HC-001',
    eventName: 'Kumbh Mela 2013 - Sector 4 Surge',
    outcome: 'Resolved safely',
    preventionApplied: 'Early barrier deployment',
    similarityScore: 94
  },
  {
    id: 'HC-002',
    eventName: 'Hajj 2018 - Heatwave Cluster',
    outcome: 'Minor injuries',
    preventionApplied: 'Mobile misting stations',
    similarityScore: 89
  },
  {
    id: 'HC-003',
    eventName: 'Ardh Kumbh 2019 - Lost Children Spike',
    outcome: '100% reunified',
    preventionApplied: 'RFID tagging & zone alerts',
    similarityScore: 76
  }
];

export const impactMetrics = {
  livesPotentiallySaved: 124,
  incidentsPrevented: 89,
  responseTimeImprovement: '42%',
  resourceEfficiencyGain: '34%'
};
