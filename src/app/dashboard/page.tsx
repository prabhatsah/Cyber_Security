'use client';

import { Card } from '@/components/ui/card';
import RecentScansCard from './components/RecentScansCard';
import ScanOverviewCard from './components/ScanOverviewCard';
import SecurityAlertCard from './components/SecurityAlertCard';


export default function Dashboard() {
  return (
    <div className="space-y-6 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your security status and view recent scan results
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 h-full">

        <div className="md:col-span-2">
          <ScanOverviewCard />
        </div>

        <div className="md:col-span-1">
          <RecentScansCard />
        </div>

        <div className="md:col-span-1">
          <SecurityAlertCard />
        </div>
      </div>
    </div>
  );
}