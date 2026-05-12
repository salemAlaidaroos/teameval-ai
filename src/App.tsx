/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectState, Student, Task, Contribution } from './types';
import Dashboard from './components/Dashboard';
import StudentPortal from './components/StudentPortal';
import SetupWizard from './components/SetupWizard';
import LandingPage from './components/LandingPage';

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
  const [view, setView] = useState<'landing' | 'doctor' | 'student' | 'setup'>('landing');
  const [project, setProject] = useState<ProjectState>({
    id: 'p1',
    name: 'تطبيق التقييم الذكي - مرآة',
    description: 'نظام متقدم لإدارة وتقييم مساهمات الطلاب في المشاريع الجماعية.',
    students: MOCK_STUDENTS,
    tasks: MOCK_TASKS,
    contributions: MOCK_CONTRIBUTIONS,
    isMockData: true,
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(MOCK_STUDENTS[0]?.id || '');

  // Feature #4: Auto-sync activeStudentId when project.students changes
  useEffect(() => {
    if (project.students.length === 0) {
      setActiveStudentId('');
    } else if (!project.students.find(s => s.id === activeStudentId)) {
      setActiveStudentId(project.students[0].id);
    }
  }, [project.students, activeStudentId]);

  // Safely resolve the active student (no non-null assertion)
  const activeStudent: Student | null = project.students.find(s => s.id === activeStudentId) || null;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F1F5F9] font-sans rtl overflow-x-hidden relative" dir="rtl">
      {/* Visual background elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation Rail — hidden on landing page, simplified (logo + avatar only) */}
      {view !== 'landing' && (
        <nav className="fixed right-0 top-0 h-full w-20 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col items-center py-8 z-50">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white mb-12 shadow-lg shadow-purple-500/20">
            <Activity size={24} />
          </div>

          {/* Nav items removed — navigation happens via Landing Page role selection */}

          <div className="mt-auto flex flex-col gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              <span className="text-xs font-bold">DR</span>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={view !== 'landing' ? "pr-20 min-h-screen" : "min-h-screen"}>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <LandingPage onSelectRole={(role) => setView(role)} />
            </motion.div>
          )}

          {view === 'doctor' && (
            <motion.div
              key="doctor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 max-w-7xl mx-auto"
            >
              <Dashboard
                project={project}
                onBackToHome={() => setView('landing')}
              />
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
                student={activeStudent}
                activeStudentId={activeStudentId}
                onSelectStudent={(id) => setActiveStudentId(id)}
                onAddContribution={(c) => setProject(prev => ({ ...prev, contributions: [c, ...prev.contributions] }))}
                onBackToHome={() => setView('landing')}
                onOpenSetup={() => setView('setup')}
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
    </div>
  );
}
