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
  // Generate a grid representing days and activity
  // This is a visual representation of student activity peaks/valleys
  const students = project.students;
  const days = Array.from({ length: 14 }); // Last 14 days

  return (
    <div className="flex flex-col gap-2 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-widest">
        <span>14 days ago</span>
        <span>Today</span>
      </div>
      {students.map((student) => (
        <div key={student.id} className="flex items-center gap-4">
          <div className="w-24 text-[11px] font-bold truncate text-slate-400">{student.name}</div>
          <div className="flex gap-1.5">
            {days.map((_, i) => {
              const intensity = getMockIntensity(student.id, i);
              return (
                <div 
                  key={i} 
                  className={cn(
                    "w-6 h-6 rounded-[4px] transition-all duration-500 hover:scale-125 cursor-help border border-white/[0.03]",
                    intensity === 0 ? "bg-white/[0.02]" :
                    intensity === 1 ? "bg-purple-900/40" :
                    intensity === 2 ? "bg-purple-700/60" :
                    intensity === 3 ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" :
                    "bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]" // Anomaly
                  )}
                  title={`Day ${i}: Intensity ${intensity}`}
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

function getMockIntensity(studentId: string, dayIdx: number) {
  // S1 (Leader) is very active
  if (studentId === 's1') return dayIdx % 3 === 0 ? 3 : 2;
  // S3 (Khalid) is the free rider (no activity recently)
  if (studentId === 's3') return dayIdx < 5 ? 1 : 0;
  // S4 (Layla) has anomaly (sudden massive activity)
  if (studentId === 's4' && dayIdx > 11) return 4;
  // Others are normal
  return (dayIdx + studentId.length) % 3;
}
