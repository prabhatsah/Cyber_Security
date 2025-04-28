// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import { AlertTriangle, AlertCircle, AlertOctagon, Activity, Clock, Calendar, Shield, Globe, Target } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import type { Database } from '../lib/database.types';
// import { Line, Doughnut } from 'react-chartjs-2';
// import SecurityAIAgents from './SecurityAIAgents';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ArcElement
// } from 'chart.js';
// import { format, subDays, differenceInHours, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ArcElement
// );

// type ScanFinding = Database['public']['Tables']['scan_findings']['Row'];
// type VulnerabilityScan = Database['public']['Tables']['vulnerability_scans']['Row'];
// type ScanTarget = Database['public']['Tables']['scan_targets']['Row'];

// export default function Dashboard() {
//   // Fetch all necessary data in parallel
//   const { data: recentScans, isLoading: scansLoading } = useQuery({
//     queryKey: ['recent-scans'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('vulnerability_scans')
//         .select(`
//           *,
//           scan_targets (
//             name,
//             target_url,
//             target_ip
//           )
//         `)
//         .order('created_at', { ascending: false })
//         .limit(10);
      
//       if (error) throw error;
//       return data as (VulnerabilityScan & { scan_targets: ScanTarget })[];
//     }
//   });

//   const { data: findings, isLoading: findingsLoading } = useQuery({
//     queryKey: ['findings-summary'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('scan_findings')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
//       return data as ScanFinding[];
//     }
//   });

//   const { data: targets, isLoading: targetsLoading } = useQuery({
//     queryKey: ['scan-targets'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('scan_targets')
//         .select('*');
      
//       if (error) throw error;
//       return data as ScanTarget[];
//     }
//   });

//   const isLoading = scansLoading || findingsLoading || targetsLoading;

//   // Process findings data
//   const findingsBySeverity = findings?.reduce((acc, finding) => {
//     if (!acc[finding.severity]) {
//       acc[finding.severity] = 0;
//     }
//     acc[finding.severity]++;
//     return acc;
//   }, {} as Record<string, number>) || {};

//   // Calculate trend data for the last 7 days
//   const last7Days = Array.from({ length: 7 }, (_, i) => {
//     const date = subDays(new Date(), i);
//     return {
//       date,
//       label: format(date, 'MMM dd'),
//     };
//   }).reverse();

//   const findingsByDay = findings?.reduce((acc, finding) => {
//     const findingDate = startOfDay(new Date(finding.created_at));
//     last7Days.forEach(({ date }) => {
//       if (isWithinInterval(new Date(finding.created_at), {
//         start: startOfDay(date),
//         end: endOfDay(date)
//       })) {
//         if (!acc[finding.severity]) {
//           acc[finding.severity] = {};
//         }
//         if (!acc[finding.severity][format(date, 'MMM dd')]) {
//           acc[finding.severity][format(date, 'MMM dd')] = 0;
//         }
//         acc[finding.severity][format(date, 'MMM dd')]++;
//       }
//     });
//     return acc;
//   }, {} as Record<string, Record<string, number>>) || {};

//   const trendData = {
//     labels: last7Days.map(d => d.label),
//     datasets: [
//       {
//         label: 'Critical',
//         data: last7Days.map(({ label }) => findingsByDay.critical?.[label] || 0),
//         borderColor: 'rgb(239, 68, 68)',
//         backgroundColor: 'rgba(239, 68, 68, 0.1)',
//         fill: true,
//       },
//       {
//         label: 'High',
//         data: last7Days.map(({ label }) => findingsByDay.high?.[label] || 0),
//         borderColor: 'rgb(249, 115, 22)',
//         backgroundColor: 'rgba(249, 115, 22, 0.1)',
//         fill: true,
//       },
//       {
//         label: 'Medium',
//         data: last7Days.map(({ label }) => findingsByDay.medium?.[label] || 0),
//         borderColor: 'rgb(234, 179, 8)',
//         backgroundColor: 'rgba(234, 179, 8, 0.1)',
//         fill: true,
//       },
//     ],
//   };

//   const severityDistribution = {
//     labels: ['Critical', 'High', 'Medium', 'Low'],
//     datasets: [
//       {
//         data: [
//           findingsBySeverity.critical || 0,
//           findingsBySeverity.high || 0,
//           findingsBySeverity.medium || 0,
//           findingsBySeverity.low || 0,
//         ],
//         backgroundColor: [
//           'rgb(239, 68, 68)',
//           'rgb(249, 115, 22)',
//           'rgb(234, 179, 8)',
//           'rgb(59, 130, 246)',
//         ],
//       },
//     ],
//   };

//   // Calculate statistics
//   const activeScans = recentScans?.filter(scan => scan.status === 'running').length || 0;
//   const completedScans = recentScans?.filter(scan => scan.status === 'completed').length || 0;
//   const totalTargets = targets?.length || 0;
//   const recentFindings = findings?.filter(f => 
//     differenceInHours(new Date(), new Date(f.created_at)) <= 24
//   ).length || 0;

//   const stats = [
//     {
//       name: 'Critical Vulnerabilities',
//       value: findingsBySeverity.critical || 0,
//       icon: AlertOctagon,
//       color: 'text-red-600',
//       bgColor: 'bg-red-100',
//     },
//     {
//       name: 'High Vulnerabilities',
//       value: findingsBySeverity.high || 0,
//       icon: AlertTriangle,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100',
//     },
//     {
//       name: 'Medium Vulnerabilities',
//       value: findingsBySeverity.medium || 0,
//       icon: AlertCircle,
//       color: 'text-yellow-600',
//       bgColor: 'bg-yellow-100',
//     },
//     {
//       name: 'Active Scans',
//       value: activeScans,
//       icon: Activity,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100',
//     },
//   ];

//   const quickStats = [
//     { 
//       name: 'Total Targets', 
//       value: totalTargets.toString(), 
//       icon: Target,
//       change: '+2', 
//       changeType: 'increase' as const
//     },
//     { 
//       name: 'Scans Completed', 
//       value: completedScans.toString(), 
//       icon: Shield,
//       change: `+${completedScans}`, 
//       changeType: 'increase' as const
//     },
//     { 
//       name: 'Recent Findings', 
//       value: recentFindings.toString(), 
//       icon: AlertTriangle,
//       change: `+${recentFindings}`, 
//       changeType: recentFindings > 0 ? 'increase' as const : 'neutral' as const
//     },
//     { 
//       name: 'Security Score', 
//       value: calculateSecurityScore(findingsBySeverity), 
//       icon: Shield,
//       change: '+3%', 
//       changeType: 'increase' as const
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Activity className="h-8 w-8 text-primary animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold text-gray-900">Security Dashboard</h1>
//         <div className="flex items-center space-x-2 text-sm text-gray-500">
//           <Calendar className="h-4 w-4" />
//           <span>{format(new Date(), 'MMMM d, yyyy')}</span>
//         </div>
//       </div>
      
//       <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <div
//             key={stat.name}
//             className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
//           >
//             <dt>
//               <div className={`absolute rounded-md p-3 ${stat.bgColor}`}>
//                 <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
//               </div>
//               <p className="ml-16 text-sm font-medium text-gray-500 truncate">
//                 {stat.name}
//               </p>
//             </dt>
//             <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
//               <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
//             </dd>
//           </div>
//         ))}
//       </div>

//       {/* AI Security Agents Section */}
//       <div className="mt-8">
//         <SecurityAIAgents />
//       </div>

//       <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Vulnerability Trends</h2>
//           <div className="h-[300px]">
//             <Line
//               data={trendData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     ticks: {
//                       stepSize: 1,
//                     },
//                   },
//                 },
//                 plugins: {
//                   legend: {
//                     position: 'top' as const,
//                   },
//                   tooltip: {
//                     mode: 'index',
//                     intersect: false,
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Severity Distribution</h2>
//           <div className="h-[300px] flex items-center justify-center">
//             <Doughnut
//               data={severityDistribution}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: {
//                     position: 'right' as const,
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mt-8">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           {quickStats.map((item) => (
//             <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="p-5">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
//                   </div>
//                   <div className="ml-5 w-0 flex-1">
//                     <dl>
//                       <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
//                       <dd className="flex items-baseline">
//                         <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
//                         <div className={`ml-2 flex items-baseline text-sm font-semibold ${
//                           item.changeType === 'increase' ? 'text-green-600' : 
//                           item.changeType === 'decrease' ? 'text-red-600' : 
//                           'text-gray-600'
//                         }`}>
//                           {item.change}
//                         </div>
//                       </dd>
//                     </dl>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-8">
//         <h2 className="text-lg font-medium text-gray-900">Recent Scans</h2>
//         <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {recentScans?.map((scan) => (
//               <li key={scan.id}>
//                 <div className="px-4 py-4 sm:px-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Globe className="h-5 w-5 text-gray-400 mr-2" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {scan.scan_targets.name}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {scan.scan_targets.target_url || scan.scan_targets.target_ip}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <span
//                         className={`status-badge ${
//                           scan.status === 'completed' ? 'status-badge-success' :
//                           scan.status === 'failed' ? 'status-badge-error' :
//                           scan.status === 'running' ? 'status-badge-info' :
//                           'status-badge-warning'
//                         }`}
//                       >
//                         {scan.status}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="mt-2 sm:flex sm:justify-between">
//                     <div className="sm:flex">
//                       <p className="flex items-center text-sm text-gray-500">
//                         Started: {scan.started_at ? format(new Date(scan.started_at), 'PPp') : 'Pending'}
//                       </p>
//                     </div>
//                     {scan.completed_at && (
//                       <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                         Completed: {format(new Date(scan.completed_at), 'PPp')}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// function calculateSecurityScore(findingsBySeverity: Record<string, number>): string {
//   const weights = {
//     critical: 10,
//     high: 5,
//     medium: 2,
//     low: 1
//   };

//   const totalFindings = Object.values(findingsBySeverity).reduce((a, b) => a + b, 0);
//   if (totalFindings === 0) return '100%';

//   const weightedSum = Object.entries(findingsBySeverity).reduce((sum, [severity, count]) => {
//     return sum + (count * (weights[severity as keyof typeof weights] || 1));
//   }, 0);

//   const maxScore = totalFindings * 10; // Assuming all findings could have been critical
//   const score = Math.max(0, Math.round(100 * (1 - weightedSum / maxScore)));
  
//   return `${score}%`;
// }




export default function Dashboard() {
  return (
    <h1>Data coming soon ...</h1>
  )
}