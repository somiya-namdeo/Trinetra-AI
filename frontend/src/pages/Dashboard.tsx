import React from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import MissionMap from '../components/dashboard/MissionMap';
import IncidentFeed from '../components/dashboard/IncidentFeed';
import AIInsights from '../components/dashboard/AIInsights';
import QuickActions from '../components/dashboard/QuickActions';
import ResourceStatus from '../components/dashboard/ResourceStatus';
import SectorSummary from '../components/dashboard/SectorSummary';
import RecentAIDecisions from '../components/dashboard/RecentAIDecisions';
import EmergencyBroadcast from '../components/dashboard/EmergencyBroadcast';
import HistoricalCases from '../components/dashboard/HistoricalCases';
import ImpactAnalysis from '../components/dashboard/ImpactAnalysis';
import SystemStatus from '../components/dashboard/SystemStatus';

const Dashboard = () => {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Mission Control</h1>
        <p className="text-sm text-gray-400">Real-time situational awareness across all sectors.</p>
      </div>

      {/* KPI Cards */}
      <StatsCards />

      {/* Mission Ops Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-9">
          <MissionMap />
        </div>
        <div className="lg:col-span-3">
          <SystemStatus />
        </div>
      </div>

      {/* Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-6">
        <div className="lg:col-span-6">
          <IncidentFeed />
        </div>
        <div className="lg:col-span-6">
          <AIInsights />
        </div>
        <div className="lg:col-span-12">
          <QuickActions />
        </div>
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
    </div>
  );
};

export default Dashboard;
