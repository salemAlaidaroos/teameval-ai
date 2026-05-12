/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectState } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineGraphProps {
  project: ProjectState;
}

// Demo data for mock projects
const MOCK_DATA = [
  { name: 'أسبوع 1', total: 10, s1: 5, s2: 3, s4: 2 },
  { name: 'أسبوع 2', total: 25, s1: 10, s2: 8, s4: 7 },
  { name: 'أسبوع 3', total: 45, s1: 20, s2: 15, s4: 10 },
  { name: 'أسبوع 4', total: 70, s1: 30, s2: 25, s4: 15 },
  { name: 'أسبوع 5', total: 95, s1: 45, s2: 35, s4: 15 },
];

/**
 * Derives weekly timeline data from real contributions.
 * Buckets contributions into the last 5 weeks relative to today,
 * computing cumulative score totals per week.
 */
function deriveRealData(project: ProjectState): { name: string; total: number }[] {
  const now = new Date();
  const weeks: { name: string; total: number }[] = [];

  for (let w = 4; w >= 0; w--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const weekContribs = project.contributions.filter(c => {
      const d = new Date(c.timestamp);
      return d >= weekStart && d <= weekEnd;
    });

    const total = weekContribs.reduce((acc, c) => acc + (c.analysis?.score || 0), 0);
    weeks.push({ name: `أسبوع ${5 - w}`, total });
  }

  // Convert to cumulative
  let cumulative = 0;
  return weeks.map(w => {
    cumulative += w.total;
    return { ...w, total: cumulative };
  });
}

export default function TimelineGraph({ project }: TimelineGraphProps) {
  const isMock = project.isMockData === true;
  const data = isMock ? MOCK_DATA : deriveRealData(project);

  // Check if real data has any contributions
  const hasRealData = !isMock && data.some(d => d.total > 0);

  if (!isMock && !hasRealData) {
    return (
      <div className="h-48 w-full flex items-center justify-center">
        <p className="text-sm text-slate-500 italic">لم تُسجَّل أي مساهمات بعد</p>
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748B' }} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#141416', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
              color: '#F1F5F9'
            }}
            itemStyle={{ color: '#F1F5F9' }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#A855F7" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            animationDuration={2000}
          />
          {/* Only show the s1 line for mock data which has that key */}
          {isMock && (
            <Area 
              type="monotone" 
              dataKey="s1" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorS1)" 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
