/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, PlusCircle, AlertCircle, TrendingUp, CheckCircle2, ChevronRight, Activity, Clock, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectState, Student, Task, Contribution } from './types';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import StudentPortal from './components/StudentPortal';
import SetupWizard from './components/SetupWizard';

// Mock Initial Data
const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'سالم أحمد', email: 'salem@example.com', role: 'leader' },
  { id: 's2', name: 'نورة علي', email: 'noura@example.com', role: 'member' },
  { id: 's3', name: 'خالد محمد', email: 'khaled@example.com', role: 'member' },
  { id: 's4', name: 'ليلى فهد', email: 'layla@example.com', role: 'member' },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'بناء قاعدة البيانات', description: 'تصميم وبناء الـ Schema وربطها بالتطبيق', weight: 8, status: 'completed', assignedTo: 's1' },
  { id: 't2', title: 'كتابة المقدمة والبحث', description: 'توثيق الدراسات السابقة والمقدمة العلمية', weight: 3, status: 'completed', assignedTo: 's4' },
  { id: 't3', title: 'تطوير واجهة المستخدم', description: 'بناء الواجهات الرئيسية باستخدام React', weight: 7, status: 'in-progress', assignedTo: 's2' },
  { id: 't4', title: 'إعداد البيئة البرمجية', description: 'تجهيز السيرفر وحاويات Docker', weight: 5, status: 'pending', assignedTo: 's3' },
  { id: 't5', title: 'اختبارات النظام', description: 'كتابة Unit Tests وضمان الجودة', weight: 4, status: 'pending' },
];

const MOCK_CONTRIBUTIONS: Contribution[] = [
  { 
    id: 'c1', 
    studentId: 's1', 
    taskId: 't1', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), 
    content: 'تم الانتهاء من هيكلة الجداول وربط العلاقات بين المستخدمين والمهام.',
    type: 'text',
    analysis: { quality: 'Critical', feedback: 'الكود يحل مشكلة أساسية في الخوارزمية الهيكلية.', score: 9 }
  },
  { 
    id: 'c2', 
    studentId: 's4', 
    taskId: 't2', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), 
    content: 'docs/report_v1.docx',
    type: 'file',
    analysis: { quality: 'Minor', feedback: 'عمل روتيني يفتقر للتحليل العميق.', score: 3 }
  },
   { 
    id: 'c3', 
    studentId: 's2', 
    taskId: 't3', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), 
    content: 'https://github.com/org/project/pull/42',
    type: 'link',
    analysis: { quality: 'Major', feedback: 'مساهمة قوية في الواجهات التفاعلية.', score: 7 }
  },
];

export default function App() {
  const [view, setView] = useState<'doctor' | 'student' | 'setup'>('doctor');
  const [project, setProject] = useState<ProjectState>({
    id: 'p1',
    name: 'تطبيق التقييم الذكي - TeamEval',
    description: 'نظام متقدم لإدارة وتقييم مساهمات الطلاب في المشاريع الجماعية.',
    students: MOCK_STUDENTS,
    tasks: MOCK_TASKS,
    contributions: MOCK_CONTRIBUTIONS,
  });

  const [activeStudentId, setActiveStudentId] = useState<string>('s2');

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F5F9] font-sans rtl overflow-x-hidden relative" dir="rtl">
      {/* Visual background elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation Rail */}
      <nav className="fixed right-0 top-0 h-full w-20 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col items-center py-8 z-50">
        <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white mb-12 shadow-lg shadow-purple-500/20">
          <Activity size={24} />
        </div>
        
        <div className="flex flex-col gap-8 flex-1">
          <NavItem 
            icon={<LayoutDashboard size={22} />} 
            active={view === 'doctor'} 
            onClick={() => setView('doctor')}
            label="اللوحة"
          />
          <NavItem 
            icon={<Users size={22} />} 
            active={view === 'student'} 
            onClick={() => setView('student')}
            label="الطلاب"
          />
          <NavItem 
            icon={<PlusCircle size={22} />} 
            active={view === 'setup'} 
            onClick={() => setView('setup')}
            label="إعداد"
          />
        </div>

        <div className="mt-auto flex flex-col gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-bold">DR</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pr-20 min-h-screen">
        <AnimatePresence mode="wait">
          {view === 'doctor' && (
            <motion.div
              key="doctor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 max-w-7xl mx-auto"
            >
              <Dashboard project={project} />
            </motion.div>
          )}

          {view === 'student' && (
            <motion.div
              key="student"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 max-w-5xl mx-auto"
            >
              <StudentPortal 
                project={project} 
                student={project.students.find(s => s.id === activeStudentId)!}
                onAddContribution={(c) => setProject(prev => ({ ...prev, contributions: [c, ...prev.contributions] }))}
              />
            </motion.div>
          )}

          {view === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-8 max-w-3xl mx-auto"
            >
              <SetupWizard onComplete={(newProject) => {
                setProject(newProject);
                setView('doctor');
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating View Switcher for Demo */}
      <div className="fixed bottom-6 left-6 flex gap-2 bg-black/5 p-1 rounded-full backdrop-blur-sm border border-black/10">
        <button 
          onClick={() => setView('doctor')}
          className={cn("px-4 py-2 rounded-full text-xs font-medium transition-all", view === 'doctor' ? "bg-black text-white" : "hover:bg-black/5")}
        >
          عرض الدكتور
        </button>
        <button 
          onClick={() => setView('student')}
          className={cn("px-4 py-2 rounded-full text-xs font-medium transition-all", view === 'student' ? "bg-black text-white" : "hover:bg-black/5")}
        >
          بروفايل الطالب
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
        active ? "bg-white text-black shadow-lg shadow-white/10" : "text-gray-500 hover:bg-white/5"
      )}
    >
      {icon}
      <span className="absolute right-16 scale-0 bg-white text-black text-[10px] px-2 py-1 rounded-md transition-all group-hover:scale-100 whitespace-nowrap z-50">
        {label}
      </span>
    </button>
  );
}
