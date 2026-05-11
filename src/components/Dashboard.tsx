/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ProjectState, Contribution, Student } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShieldAlert, TrendingUp, Clock, CheckCircle2, AlertTriangle, User, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { cn } from '../lib/utils';
import RiskHeatmap from './RiskHeatmap';
import TimelineGraph from './TimelineGraph';

interface DashboardProps {
  project: ProjectState;
}

const COLORS = ['#A855F7', '#EC4899', '#3B82F6', '#F59E0B', '#10B981', '#6366F1'];

export default function Dashboard({ project }: DashboardProps) {
  // Calculate stats
  const totalWeight = project.tasks.reduce((acc, t) => acc + t.weight, 0);
  const contributionByStudent = project.students.map(s => {
    const studentContributions = project.contributions.filter(c => c.studentId === s.id);
    const scoreSum = studentContributions.reduce((acc, c) => acc + (c.analysis?.score || 0), 0);
    return {
      name: s.name,
      value: scoreSum || 0,
      contributionsCount: studentContributions.length
    };
  }).filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-1">TEAM <span className="font-bold text-purple-400">EVAL</span></h1>
          <p className="text-slate-500 max-w-2xl text-sm italic">{project.description}</p>
        </div>
        <div className="flex gap-4">
          <StatMini label="اكتمال المهام" value="65%" icon={<CheckCircle2 size={16} className="text-purple-400" />} />
          <StatMini label="ساعات الجهد" value="124" icon={<Clock size={16} className="text-blue-400" />} />
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Heatmap & Red Cards */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert size={20} className="text-red-500" />
                خريطة المخاطر والبطاقات الحمراء
              </h2>
              <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">LIVE ANALYSIS</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <RiskCard 
                student="خالد محمد" 
                risk="92%" 
                type="الخمول المفاجئ" 
                message="لم يتم تسجيل أي نشاط برمجي منذ 21 يوماً." 
                level="critical"
              />
              <RiskCard 
                student="ليلى فهد" 
                risk="45%" 
                type="نشاط شاذ" 
                message="رفع مساهمات ضخمة في وقت قصير جداً قبل الموعد النهائي." 
                level="warning"
              />
            </div>
            
            <RiskHeatmap project={project} />
          </section>

          {/* Dynamic Timeline */}
          <section className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                التايم لاين الديناميكي
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold">شهر</button>
                <button className="px-3 py-1 rounded-full text-[10px] font-bold opacity-40">أسبوع</button>
              </div>
            </div>
            <TimelineGraph project={project} />
          </section>
        </div>

        {/* Contribution Distribution */}
        <div className="space-y-6">
          <section className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-purple-300">
                <TrendingUp size={20} className="text-purple-500" />
                توزيع المساهمة الحقيقية
              </h2>
            </div>
            
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributionByStudent}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contributionByStudent.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1B', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total</span>
                  <span className="text-xl font-black text-white italic">88%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {contributionByStudent.map((data, idx) => (
                <div key={data.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-xs font-medium text-slate-300">{data.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-500">{data.contributionsCount} مساهمات</span>
                    <span className="text-xs font-bold text-white">{Math.round((data.value / contributionByStudent.reduce((a, b) => a + b.value, 0)) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full py-3 bg-white text-black rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
              استخراج التقرير النهائي <ArrowUpRight size={16} />
            </button>
          </section>
        </div>

      </div>

      {/* Recent Activity List */}
      <section className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-lg font-bold">آخر المساهمات المرفوعة</h2>
          <span className="text-[10px] font-bold text-purple-400 border border-purple-500/30 px-2 py-1 rounded-md uppercase tracking-wider">Activity Feed</span>
        </div>
        <div className="divide-y divide-white/5">
          {project.contributions.map((c) => {
            const student = project.students.find(s => s.id === c.studentId);
            return (
              <div key={c.id} className="data-grid-row grid-cols-[1.2fr_2fr_1.5fr_120px] items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600/20 to-pink-500/20 border border-white/10 flex items-center justify-center font-bold text-xs">
                    {student?.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{student?.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{c.type} update</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 truncate">{c.content}</p>
                </div>
                <div className="flex flex-col items-center">
                   <div className="flex gap-2">
                     <span className={cn(
                       "px-2 py-0.5 rounded text-[9px] font-bold uppercase border",
                       c.analysis?.quality === 'Critical' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                       c.analysis?.quality === 'Major' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                       "bg-slate-500/10 text-slate-400 border-slate-500/20"
                     )}>
                       {c.analysis?.quality || 'Under Review'}
                     </span>
                     <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-1.5 rounded">{c.analysis?.score}/10</span>
                   </div>
                   <span className="text-[10px] text-slate-500 mt-1 max-w-[150px] truncate italic">"{c.analysis?.feedback}"</span>
                </div>
                <div className="text-left font-mono text-[10px] text-slate-500">
                  {new Date(c.timestamp).toLocaleDateString('ar-EG')}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatMini({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg backdrop-blur-md hover:border-white/20 transition-all">
      <div className="p-2 bg-white/5 rounded-lg border border-white/5">{icon}</div>
      <div className="flex flex-col text-right">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-tight">{label}</span>
        <span className="text-base font-bold leading-tight text-white">{value}</span>
      </div>
    </div>
  );
}

function RiskCard({ student, risk, type, message, level }: { student: string, risk: string, type: string, message: string, level: 'critical' | 'warning' }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={cn(
        "p-5 rounded-2xl border-l-4 shadow-xl relative overflow-hidden transition-all",
        level === 'critical' ? "bg-red-950/20 border-red-500/50 hover:bg-red-900/30" : "bg-orange-950/20 border-orange-500/50 hover:bg-orange-900/30"
      )}
    >
      <div className="absolute -right-4 -top-4 text-white/5 text-6xl font-black select-none">{level === 'critical' ? '!' : '?'}</div>
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter", level === 'critical' ? "bg-red-500 text-white" : "bg-orange-500 text-white")}>
            {level === 'critical' ? 'RED CARD' : 'ANOMALY'}
          </span>
          <span className="text-sm font-bold text-white">{student}</span>
        </div>
        <span className="text-lg font-black italic text-right leading-none text-white">{risk}</span>
      </div>
      <h3 className={cn("text-xs font-bold mb-1", level === 'critical' ? "text-red-400" : "text-orange-400")}>{type}</h3>
      <p className="text-[11px] text-slate-400 leading-relaxed max-w-[90%]">{message}</p>
    </motion.div>
  );
}
