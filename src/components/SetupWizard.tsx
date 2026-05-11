/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ProjectState, Task, Student } from '../types';
import { geminiService } from '../services/gemini';
import { Sparkles, Loader2, ArrowLeft, ArrowRight, Check, Users, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SetupWizardProps {
  onComplete: (project: ProjectState) => void;
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Partial<Task>[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { id: 's1', name: 'سالم أحمد', email: 'salem@example.com', role: 'leader' }
  ]);
  const [newStudentName, setNewStudentName] = useState('');

  const handleGenerateTasks = async () => {
    setIsGenerating(true);
    const suggested = await geminiService.suggestTasks(description);
    setTasks(suggested.map((t, i) => ({ ...t, id: `t-new-${i}`, status: 'pending' })));
    setIsGenerating(false);
    setStep(2);
  };

  const addStudent = () => {
    if (!newStudentName) return;
    setStudents([...students, { 
      id: `s-${Date.now()}`, 
      name: newStudentName, 
      email: `${newStudentName}@example.com`, 
      role: 'member' 
    }]);
    setNewStudentName('');
  };

  const handleComplete = () => {
    onComplete({
      id: `p-${Date.now()}`,
      name: 'مشروع جديد - ' + new Date().toLocaleDateString('ar-EG'),
      description,
      students,
      tasks: tasks as Task[],
      contributions: []
    });
  };

  return (
    <div className="bg-black/40 rounded-[32px] p-10 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] -ml-32 -mb-32" />
      
      <div className="relative z-10">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-[10px] font-black uppercase mb-6 tracking-[0.2em] shadow-lg shadow-purple-500/20">
            Smart Neural Setup
          </div>
          <h1 className="text-4xl font-black mb-3 italic tracking-tighter text-white">إعداد المشروع الذكي</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto italic">استخدم الذكاء الاصطناعي لتوزيع المهام بشكل عادل ومنع التلاعب عبر "أوزان الجهد" التلقائية.</p>
        </header>

        {/* Steps Progress */}
        <div className="flex justify-center gap-12 mb-16 relative">
          <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-white/5 -z-10" />
          <StepIndicator num={1} active={step >= 1} label="Description" />
          <StepIndicator num={2} active={step >= 2} label="Task Pricing" />
          <StepIndicator num={3} active={step >= 3} label="Team Roster" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">وصف المشروع وتفاصيله</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="مثال: نريد بناء تطبيق لبيع الكتب المستعملة يجمع بين الطلاب في الجامعة..."
                  className="w-full bg-black/40 border border-white/10 rounded-3xl px-6 py-5 text-sm text-white focus:ring-4 focus:ring-purple-500/20 outline-none transition-all resize-none shadow-inner"
                />
              </div>
              <button 
                disabled={!description || isGenerating}
                onClick={handleGenerateTasks}
                className="w-full py-5 bg-white text-black rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/10"
              >
                {isGenerating ? (
                  <>GENERATING NEURAL WEIGHTS... <Loader2 size={20} className="animate-spin" /></>
                ) : (
                  <>اقتراح المهام بالـ AI <Sparkles size={20} /></>
                )}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {tasks.map((task, idx) => (
                  <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-purple-500/50 transition-all backdrop-blur-md">
                    <div>
                      <h3 className="font-bold text-sm text-white">{task.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{task.description}"</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <span className="block text-[8px] text-slate-500 uppercase font-bold tracking-widest">WEIGHT</span>
                          <span className="text-2xl font-black text-purple-400 italic">8.0</span>
                       </div>
                       <button className="text-white/20 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-6">
                <button onClick={() => setStep(1)} className="flex-1 py-4 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">رجوع</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl">
                   المتابعة لإضافة الطلاب <ArrowLeft size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex gap-3">
                <input 
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="اسم الطالب..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                />
                <button onClick={addStudent} className="px-8 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  ADD <Plus size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map(s => (
                  <div key={s.id} className="p-4 border border-white/10 bg-white/5 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center text-white font-black text-xs uppercase italic">
                        {s.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-white">{s.name}</span>
                    </div>
                    <span className="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded font-black text-slate-400 uppercase tracking-widest">
                      {s.role === 'leader' ? 'LEADER' : 'MEMBER'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-6 pt-6 border-t border-white/5">
                <button onClick={() => setStep(2)} className="flex-1 py-4 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">رجوع</button>
                <button onClick={handleComplete} className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/40">
                   إنهاء وإطلاق المشروع <Check size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepIndicator({ num, active, label }: { num: number, active: boolean, label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 group relative">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm italic transition-all duration-700 border-2",
        active ? "bg-white text-black border-white shadow-xl shadow-white/10 scale-110" : "bg-black text-slate-600 border-white/5"
      )}>
        {num}
      </div>
      <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", active ? "text-white" : "text-slate-700")}>
        {label}
      </span>
    </div>
  );
}
