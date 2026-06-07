import React, { useEffect, useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import StatsCards from '../components/dashboard/StatsCards';
import MissionMap from '../components/dashboard/MissionMap';
import IncidentFeed from '../components/dashboard/IncidentFeed';
import AIInsights from '../components/dashboard/AIInsights';
import MLRiskCard from '../components/dashboard/MLRiskCard';
import QuickActions from '../components/dashboard/QuickActions';
import ResourceStatus from '../components/dashboard/ResourceStatus';
import SectorSummary from '../components/dashboard/SectorSummary';
import RecentAIDecisions from '../components/dashboard/RecentAIDecisions';
import EmergencyBroadcast from '../components/dashboard/EmergencyBroadcast';
import HistoricalCases from '../components/dashboard/HistoricalCases';
import ImpactAnalysis from '../components/dashboard/ImpactAnalysis';
import SystemStatus from '../components/dashboard/SystemStatus';
import { getIncidents, getZones, getResources, getMemoryInsight } from '../services/api';

const Dashboard = () => {
  const [dashboardIncidents, setDashboardIncidents] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({
    activeIncidents: '6',
    criticalZones: '1',
    availableResources: '8',
    totalResources: '13',
    riskScore: '72',
    insightZone: 'Zone A',
    insightSeverity: 'elevated',
    totalIncidents: '24',
    resolvedIncidents: '5',
    enRouteResources: '2'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [incidents, zones, resources, insight] = await Promise.all([
        getIncidents(),
        getZones(),
        getResources(),
        getMemoryInsight()
      ]);

      if (incidents && Array.isArray(incidents)) {
        setDashboardIncidents(incidents);
      }

      setStatsData(prev => {
        const activeCount = incidents && Array.isArray(incidents) && incidents.length > 0 
          ? incidents.filter((i: any) => {
              const s = (i.status || '').toUpperCase();
              return ['ACTIVE', 'RESOURCES_ASSIGNED', 'IN_PROGRESS', 'CONTAINED'].includes(s);
            }).length.toString() 
          : prev.activeIncidents;
          
        const totalIncCount = incidents && Array.isArray(incidents) ? incidents.length.toString() : prev.totalIncidents;
        const resolvedIncCount = incidents && Array.isArray(incidents) ? incidents.filter((i: any) => (i.status || '').toUpperCase() === 'RESOLVED').length.toString() : prev.resolvedIncidents;
        const availCount = resources && Array.isArray(resources) && resources.length > 0 ? resources.filter((r: any) => (r.status || '').toUpperCase() === 'AVAILABLE').length.toString() : prev.availableResources;
        const enRouteCount = resources && Array.isArray(resources) && resources.length > 0 ? resources.filter((r: any) => ['DEPLOYED', 'EN_ROUTE', 'BUSY'].includes((r.status || '').toUpperCase())).length.toString() : (prev.enRouteResources || '2');
        const critZoneCount = zones && Array.isArray(zones) && zones.length > 0 ? zones.filter((z: any) => z.risk_level === 'Critical' || z.risk_score >= 80).length.toString() : prev.criticalZones;
        
        let highestRisk = prev.riskScore;
        let bestZoneName = prev.insightZone;
        let bestZoneSeverity = prev.insightSeverity;
        let riskSource = 'Rule-Based';
        
        if (zones && Array.isArray(zones) && zones.length > 0) {
          let maxScore = -1;
          let bestZ: any = null;
          zones.forEach((z: any) => {
            const score = z.ml_risk_score !== undefined ? z.ml_risk_score : (z.risk_score || 0);
            if (score > maxScore) {
              maxScore = score;
              bestZ = z;
            }
          });
          if (bestZ) {
            highestRisk = maxScore.toString();
            bestZoneName = bestZ.name;
            bestZoneSeverity = bestZ.ml_risk_level || bestZ.risk_level || 'Medium';
            riskSource = bestZ.model_used ? 'ML' : 'Rule-Based Fallback';
          }
        }

        return {
          ...prev,
          activeIncidents: activeCount,
          criticalZones: critZoneCount,
          availableResources: availCount,
          totalResources: resources && Array.isArray(resources) && resources.length > 0 ? resources.length.toString() : prev.totalResources,
          riskScore: highestRisk,
          insightZone: bestZoneName,
          insightSeverity: bestZoneSeverity,
          riskSource: riskSource,
          totalIncidents: totalIncCount,
          resolvedIncidents: resolvedIncCount,
          enRouteResources: enRouteCount
        };
      });
      } catch (err: any) {
        console.error('Failed to fetch dashboard data', err);
        setError(err.message || 'Server error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Mission Control</h1>
        <p className="text-sm text-gray-400">Real-time situational awareness across all sectors.</p>
      </div>

      {/* KPI Cards */}
      <StatsCards data={statsData} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/50 border border-cardBorder rounded-lg col-span-full">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
          <p className="text-gray-400 text-sm">Initializing Command Center...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-critical/10 border border-critical/30 rounded-lg col-span-full">
          <ShieldAlert className="w-10 h-10 text-critical mb-3" />
          <p className="text-critical font-bold mb-1 text-lg">System Initialization Failed</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {/* Mission Ops Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-9">
              <MissionMap activeIncidents={statsData.activeIncidents} enRouteResources={statsData.enRouteResources} />
            </div>
            <div className="lg:col-span-3">
              <SystemStatus />
            </div>
          </div>

          {/* Intelligence Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-6 h-[450px]">
              <IncidentFeed incidents={dashboardIncidents} />
            </div>
            <div className="lg:col-span-6 flex flex-col h-[450px]">
              <AIInsights />
            </div>
          </div>

          {/* Quick Actions - Full Width */}
          <div className="mt-6">
            <QuickActions />
          </div>

          {/* Advanced Analytics - Full Width */}
          <div className="border-t border-cardBorder pt-6">
            <h2 className="text-lg font-bold text-white mb-6 text-gradient">Advanced Analytics & Response Panel</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
                {/* Row 1: 3 + 3 + 6 */}
                <div className="lg:col-span-3">
                  <ResourceStatus />
                </div>
                <div className="lg:col-span-3">
                  <SectorSummary />
                </div>
                <div className="lg:col-span-6">
                  <RecentAIDecisions />
                </div>
              </div>
                
              {/* Row 2: 4 + 4 + 4 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-4">
                  <HistoricalCases />
                </div>
                <div className="lg:col-span-4">
                  <EmergencyBroadcast />
                </div>
                <div className="lg:col-span-4">
                  <ImpactAnalysis />
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
