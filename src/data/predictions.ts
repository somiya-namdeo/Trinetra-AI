export interface Prediction {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  eta: string;
  description: string;
  confidence: number;
  recommendations: string[];
}

export const aiPredictions: Prediction[] = [
  {
    id: 'PRED-001',
    title: 'Potential Heat Stress Cluster — Zone A',
    severity: 'CRITICAL',
    eta: 'ETA 8-12 min',
    description: 'Correlated signals: water station failure, queue length spike, 3 medical incidents in last 14 min.',
    confidence: 87,
    recommendations: [
      'Dispatch mobile hydration unit',
      'Open backup water station',
      'Deploy Medical Team Bravo'
    ]
  },
  {
    id: 'PRED-002',
    title: 'Crowd Surge Risk — North Gate',
    severity: 'HIGH',
    eta: 'ETA 15-20 min',
    description: 'Inflow rate 18% above capacity. Bottleneck forming at turnstile 4.',
    confidence: 74,
    recommendations: [
      'Open auxiliary gate 4B',
      'Redirect signage to East Entry'
    ]
  },
  {
    id: 'PRED-003',
    title: 'Lost-Child Pattern — Zone C',
    severity: 'MEDIUM',
    eta: 'ETA ongoing',
    description: 'Three lost child reports clustered near food court in 25 min.',
    confidence: 62,
    recommendations: [
      'Activate child reunification point',
      'Increase PA announcements'
    ]
  }
];
