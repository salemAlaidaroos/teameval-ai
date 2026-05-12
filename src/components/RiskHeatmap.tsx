/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectState } from '../types';
import { cn } from '../lib/utils';

interface RiskHeatmapProps {
  project: ProjectState;
}

export default function RiskHeatmap({ project }: RiskHeatmapProps) {
  const students = project.students;
  const days = Array.from({ length: 14 }); // Last 14 days
  const isMock = project.isMockData === true;

  return (
    <div className="flex flex-col gap-2 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-widest">
        <span>14 days ago</span>
        <span>Today</span>
      </div>
      {students.map((student, studentIdx) => (
        <div key={student.id} className="flex items-center gap-4">
          <div className="w-24 text-[11px] font-bold truncate text-slate-400">{student.name}</div>
          <div className="flex gap-1.5">
            {days.map((_, dayIdx) => {
              const intensity = isMock
                ? getMockIntensity(studentIdx, dayIdx)
                : getRealIntensity(project, student.id, dayIdx);
              return (
                <div 
                  key={dayIdx} 
                  className={cn(
                    "w-6 h-6 rounded-[4px] transition-all duration-500 hover:scale-125 cursor-help border border-white/[0.03]",
                    intensity === 0 ? "bg-white/[0.02]" :
                    intensity === 1 ? "bg-purple-900/40" :
                    intensity === 2 ? "bg-purple-700/60" :
                    intensity === 3 ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" :
                    "bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]" // Anomaly
                  )}
                  title={`Day ${dayIdx}: Intensity ${intensity}`}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex gap-6 mt-6 items-center">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/[0.02] border border-white/5 rounded-sm" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">No Activity</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-sm shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">High Effort</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm animate-pulse" />
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Anomaly Detect</span>
         </div>
      </div>
    </div>
  );
}

/**
 * Mock intensity uses student array index for demo visual storytelling:
 * Index 0 (leader): very active
 * Index 1: normal activity
 * Index 2: free rider (drops off recently)
 * Index 3: anomaly (sudden spike at the end)
 */
function getMockIntensity(studentIdx: number, dayIdx: number): number {
  // Student 0 (leader) is very active
  if (studentIdx === 0) return dayIdx % 3 === 0 ? 3 : 2;
  // Student 2 is the free rider (no activity recently)
  if (studentIdx === 2) return dayIdx < 5 ? 1 : 0;
  // Student 3 has anomaly (sudden massive activity at end)
  if (studentIdx === 3 && dayIdx > 11) return 4;
  // Others are normal
  return (dayIdx + studentIdx) % 3;
}

/**
 * Real intensity: count contributions per student per day.
 * dayIdx 0 = 14 days ago, dayIdx 13 = today.
 * Detects anomaly: 7+ days of inactivity then 3+ contributions in one day.
 */
function getRealIntensity(project: ProjectState, studentId: string, dayIdx: number): number {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() - (13 - dayIdx));
  const targetDateStr = targetDate.toISOString().slice(0, 10); // YYYY-MM-DD

  const studentContribs = project.contributions.filter(c => c.studentId === studentId);
  const dayContribs = studentContribs.filter(c => c.timestamp.slice(0, 10) === targetDateStr);
  const count = dayContribs.length;

  if (count === 0) return 0;

  // Detect anomaly: check if this student had 7+ consecutive days of inactivity before this day
  if (count >= 3) {
    let inactiveDays = 0;
    for (let d = dayIdx - 1; d >= 0; d--) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() - (13 - d));
      const checkStr = checkDate.toISOString().slice(0, 10);
      const prevCount = studentContribs.filter(c => c.timestamp.slice(0, 10) === checkStr).length;
      if (prevCount === 0) {
        inactiveDays++;
      } else {
        break;
      }
    }
    if (inactiveDays >= 7) return 4; // Anomaly detected
  }

  if (count >= 3) return 3;
  if (count >= 2) return 2;
  return 1;
}
