/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { ProjectState } from '../types';
import { X, Download, Check, AlertTriangle, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface FinalReportModalProps {
  project: ProjectState;
  onClose: () => void;
}

const COLORS = ['#A855F7', '#EC4899', '#3B82F6', '#F59E0B', '#10B981', '#6366F1'];

export default function FinalReportModal({ project, onClose }: FinalReportModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const isDownloadable = project.isMockData === true;

  const handleDownload = () => {
    if (!isDownloadable) return;
    const link = document.createElement('a');
    link.href = '/reports/miraah-final-report.pdf';
    link.download = 'تقرير-مرآة-النهائي.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus modal on open
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // --- Computed data ---
  const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = project.tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = project.tasks.filter(t => t.status === 'in-progress').length;
  const completionPct = project.tasks.length > 0
    ? Math.round((completedTasks / project.tasks.length) * 100)
    : 0;

  const allScores = project.contributions
    .map(c => c.analysis?.score || 0);
  const totalAllScores = allScores.reduce((a, b) => a + b, 0);
  const avgScore = allScores.length > 0
    ? (totalAllScores / allScores.length).toFixed(1)
    : '0';

  // Per-student data
  const studentReports = project.students.map((student, idx) => {
    const contributions = project.contributions.filter(c => c.studentId === student.id);
    const scoreSum = contributions.reduce((acc, c) => acc + (c.analysis?.score || 0), 0);
    const contributionPct = totalAllScores > 0
      ? Math.round((scoreSum / totalAllScores) * 100)
      : 0;
    const assignedTasks = project.tasks.filter(t => t.assignedTo === student.id);
    const completedAssigned = assignedTasks.filter(t => t.status === 'completed').length;

    const criticalCount = contributions.filter(c => c.analysis?.quality === 'Critical').length;
    const majorCount = contributions.filter(c => c.analysis?.quality === 'Major').length;
    const minorCount = contributions.filter(c => c.analysis?.quality === 'Minor').length;

    // Risk flags (computed dynamically)
    const risks: { label: string; level: 'critical' | 'warning' }[] = [];
    if (contributions.length === 0 || contributionPct < 10) {
      risks.push({ label: 'خطر الخمول', level: 'critical' });
    }
    if (contributions.length > 0 && contributions.every(c => c.analysis?.quality === 'Minor')) {
      risks.push({ label: 'جودة منخفضة', level: 'warning' });
    }

    return {
      student,
      contributions,
      scoreSum,
      contributionPct,
      assignedTasks,
      completedAssigned,
      criticalCount,
      majorCount,
      minorCount,
      risks,
      color: COLORS[idx % COLORS.length],
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-[#141416] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 md:p-10 space-y-10">
          {/* Close Button (top-left in RTL) */}
          <div className="flex justify-start">
            <button
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
              aria-label="إغلاق التقرير"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Section A: Project Header */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">FINAL REPORT</span>
            </div>
            <h2 className="text-3xl font-black italic text-white tracking-tight">{project.name}</h2>
            <p className="text-sm text-slate-500 italic">{project.description}</p>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-[10px] font-mono text-slate-500">
                تاريخ التقرير: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className={cn(
                "text-[10px] font-bold px-3 py-1 rounded-full border",
                completionPct >= 80 ? "bg-green-500/10 text-green-400 border-green-500/20" :
                completionPct >= 50 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                "bg-orange-500/10 text-orange-400 border-orange-500/20"
              )}>
                اكتمال المشروع: {completionPct}%
              </span>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Section B: Per-Student Reports */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              STUDENT REPORTS — تقارير الطلاب
            </h3>

            <div className="space-y-4">
              {studentReports.map(({ student, contributions, scoreSum, contributionPct, assignedTasks, completedAssigned, criticalCount, majorCount, minorCount, risks, color }) => (
                <div key={student.id} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 space-y-5">
                  {/* Student Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg border border-white/10"
                        style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{student.name}</h4>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                          student.role === 'leader'
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-white/5 text-slate-500 border-white/10"
                        )}>
                          {student.role === 'leader' ? 'LEADER' : 'MEMBER'}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">CONTRIBUTION</span>
                      <span className="text-2xl font-black italic text-white">{contributionPct}%</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MiniStat label="المهام المكتملة" value={`${completedAssigned} / ${assignedTasks.length}`} />
                    <MiniStat label="نقاط الجودة" value={String(scoreSum)} />
                    <MiniStat label="عدد المساهمات" value={String(contributions.length)} />
                    <MiniStat label="النسبة المئوية" value={`${contributionPct}%`} />
                  </div>

                  {/* Quality Distribution */}
                  <div className="flex gap-2 flex-wrap">
                    {criticalCount > 0 && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/20">
                        Critical × {criticalCount}
                      </span>
                    )}
                    {majorCount > 0 && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        Major × {majorCount}
                      </span>
                    )}
                    {minorCount > 0 && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-slate-500/10 text-slate-400 border-slate-500/20">
                        Minor × {minorCount}
                      </span>
                    )}
                    {contributions.length === 0 && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-white/5 text-slate-600 border-white/5">
                        لا توجد مساهمات
                      </span>
                    )}
                  </div>

                  {/* Contributions List */}
                  {contributions.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-slate-600">CONTRIBUTIONS LOG</span>
                      {contributions.map(c => {
                        const task = project.tasks.find(t => t.id === c.taskId);
                        return (
                          <div key={c.id} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-300 block truncate">{task?.title || 'مهمة محذوفة'}</span>
                              {c.analysis?.feedback && (
                                <span className="text-[10px] text-slate-500 italic block truncate">"{c.analysis.feedback}"</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 mr-4">
                              <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-1.5 rounded">{c.analysis?.score || 0}/10</span>
                              <span className="text-[10px] font-mono text-slate-600">{new Date(c.timestamp).toLocaleDateString('ar-EG')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Risk Flags */}
                  {risks.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {risks.map((risk, i) => (
                        <span
                          key={i}
                          className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border",
                            risk.level === 'critical'
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          )}
                        >
                          {risk.level === 'critical' ? <AlertTriangle size={12} /> : <TrendingDown size={12} />}
                          {risk.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Section C: Team Summary */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              TEAM SUMMARY — ملخص الفريق
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <SummaryStat label="إجمالي المهام" value={String(project.tasks.length)} />
              <SummaryStat label="مكتملة" value={String(completedTasks)} accent="green" />
              <SummaryStat label="قيد التنفيذ" value={String(inProgressTasks)} accent="blue" />
              <SummaryStat label="معلقة" value={String(pendingTasks)} accent="slate" />
              <SummaryStat label="متوسط الجودة" value={avgScore} accent="purple" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-600">CONTRIBUTION DISTRIBUTION</span>
              <div className="flex gap-0 rounded-full overflow-hidden h-4">
                {studentReports.map(({ student, contributionPct, color }) => (
                  contributionPct > 0 ? (
                    <div
                      key={student.id}
                      className="h-full transition-all duration-500 relative group"
                      style={{ width: `${contributionPct}%`, backgroundColor: color }}
                      title={`${student.name}: ${contributionPct}%`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {contributionPct}%
                      </span>
                    </div>
                  ) : null
                ))}
                {/* If no contributions at all, show empty bar */}
                {studentReports.every(r => r.contributionPct === 0) && (
                  <div className="h-full w-full bg-white/5" />
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {studentReports.map(({ student, contributionPct, color }) => (
                  <div key={student.id} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[10px] text-slate-500">{student.name} ({contributionPct}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total contributions */}
            <div className="text-center text-[10px] font-mono text-slate-600">
              إجمالي المساهمات: {project.contributions.length} مساهمة
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Section D: Download Button */}
          <section className="flex flex-col items-center gap-3 pb-4">
            <motion.button
              onClick={handleDownload}
              disabled={!isDownloadable}
              aria-label="تحميل التقرير النهائي بصيغة PDF"
              aria-disabled={!isDownloadable}
              title={isDownloadable ? undefined : 'هذه الميزة غير متاحة في المشاريع المنشأة حديثاً'}
              whileHover={isDownloadable ? { y: -2 } : undefined}
              className={cn(
                "w-full max-w-md py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all",
                isDownloadable
                  ? "opacity-100 cursor-pointer hover:shadow-lg hover:shadow-purple-500/30"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              {downloaded ? (
                <>
                  <Check size={20} />
                  تم بدء التحميل
                </>
              ) : (
                <>
                  <Download size={20} />
                  تحميل التقرير النهائي (PDF)
                </>
              )}
            </motion.button>
            <span className="text-xs text-slate-400 italic">
              {isDownloadable ? 'تقرير جاهز للتحميل' : 'قريباً — متاح في النسخة القادمة'}
            </span>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/30 rounded-xl p-3 border border-white/5">
      <span className="block text-[8px] text-slate-600 uppercase tracking-widest font-bold mb-1">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  );
}

function SummaryStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const colorMap: Record<string, string> = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    slate: 'text-slate-400',
  };
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
      <span className="block text-[8px] text-slate-600 uppercase tracking-widest font-bold mb-1">{label}</span>
      <span className={cn("text-xl font-black", accent ? colorMap[accent] || 'text-white' : 'text-white')}>{value}</span>
    </div>
  );
}
