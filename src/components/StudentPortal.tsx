/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectState, Student, Contribution } from '../types';
import { geminiService } from '../services/gemini';
import { Send, Link as LinkIcon, FileUp, Type, Loader2, Star, CheckCircle2, Layout, Clock, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface StudentPortalProps {
  project: ProjectState;
  student: Student | null;
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddContribution: (contribution: Contribution) => void;
  onBackToHome: () => void;
  onOpenSetup: () => void;
}

export default function StudentPortal({ project, student, activeStudentId, onSelectStudent, onAddContribution, onBackToHome, onOpenSetup }: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'upload'>('tasks');
  const [uploadType, setUploadType] = useState<Contribution['type']>('text');
  const [content, setContent] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Empty state: no students in the project
  if (!student) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          aria-label="العودة للصفحة الرئيسية"
        >
          <ArrowRight size={16} />
          العودة للصفحة الرئيسية
        </button>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <Users size={36} className="text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-white">لا يوجد طلاب في المشروع بعد</h2>
            <p className="text-sm text-slate-500 italic">أضف طلاباً عبر معالج إعداد المشروع</p>
            <button
              onClick={onOpenSetup}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-500/20"
            >
              <PlusCircle size={18} />
              إعداد مشروع جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  const studentTasks = project.tasks.filter(t => t.assignedTo === student.id);
  const studentContributions = project.contributions.filter(c => c.studentId === student.id);

  const handleUpload = async () => {
    if (!content || !selectedTaskId) return;

    setIsAnalyzing(true);
    const selectedTask = project.tasks.find(t => t.id === selectedTaskId);
    
    // AI Analysis
    const analysis = await geminiService.analyzeContribution(content, selectedTask?.description || '');

    const newContribution: Contribution = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      taskId: selectedTaskId,
      timestamp: new Date().toISOString(),
      content,
      type: uploadType,
      analysis
    };

    onAddContribution(newContribution);
    setIsAnalyzing(false);
    setContent('');
    setUploadType('text');
    setActiveTab('tasks');
  };

  return (
    <div className="space-y-8">
      {/* Top Actions: Back + Setup */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          aria-label="العودة للصفحة الرئيسية"
        >
          <ArrowRight size={16} />
          العودة للصفحة الرئيسية
        </button>
        <button
          onClick={onOpenSetup}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-4 py-2 text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/20"
          aria-label="إعداد مشروع جديد"
        >
          <PlusCircle size={16} />
          إعداد مشروع جديد
        </button>
      </div>

      {/* Student Welcome + Student Selector */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-light tracking-tight">مرحباً، <span className="font-bold text-purple-400">{student.name}</span></h1>
          <p className="text-slate-500 text-sm italic">أهلاً بك في منصة التقييم. تابع مهامك ووثق مساهماتك.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Student Selector */}
          {project.students.length > 1 && (
            <select
              value={activeStudentId}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
              aria-label="اختيار الطالب"
            >
              {project.students.map(s => (
                <option key={s.id} value={s.id} className="bg-[#1A1A1B]">
                  {s.name} {s.role === 'leader' ? '(قائد)' : ''}
                </option>
              ))}
            </select>
          )}

          {/* Stats */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-6 backdrop-blur-md">
            <div className="text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-widest">نقاط الجودة</span>
              <span className="text-xl font-black flex items-center justify-center gap-1 text-white">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                {studentContributions.reduce((acc, c) => acc + (c.analysis?.score || 0), 0)}
              </span>
            </div>
            <div className="text-center">
               <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-widest">المهام المكتملة</span>
               <span className="text-xl font-black text-white italic">{studentTasks.filter(t => t.status === 'completed').length} / {studentTasks.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={cn("pb-4 text-xs font-bold uppercase tracking-widest transition-all relative", activeTab === 'tasks' ? "text-purple-400" : "text-slate-500 hover:text-slate-300")}
        >
          المهام والمساهمات
          {activeTab === 'tasks' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('upload')}
          className={cn("pb-4 text-xs font-bold uppercase tracking-widest transition-all relative", activeTab === 'upload' ? "text-purple-400" : "text-slate-500 hover:text-slate-300")}
        >
          رفع مساهمة جديدة
          {activeTab === 'upload' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tasks' && (
          <motion.div 
            key="tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned Tasks */}
              <section className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
                <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-300 uppercase tracking-widest">
                  <Layout size={18} className="text-purple-500" />
                  مهامي الحالية
                </h2>
                <div className="space-y-4">
                  {studentTasks.length > 0 ? studentTasks.map(task => (
                    <div key={task.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-purple-500/50 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm text-white">{task.title}</h3>
                        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">W: {task.weight}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2 italic">"{task.description}"</p>
                      <div className="flex justify-between items-center">
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded font-black uppercase border",
                          task.status === 'completed' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                          task.status === 'in-progress' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          {task.status === 'completed' ? 'COMPLETED' : task.status === 'in-progress' ? 'IN PROGRESS' : 'PENDING'}
                        </span>
                        <button 
                          onClick={() => { setSelectedTaskId(task.id); setActiveTab('upload'); }}
                          className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          SUBMIT <Send size={10} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-slate-600 text-xs italic">لا توجد مهام مسندة حالياً</div>
                  )}
                </div>
              </section>

              {/* Recent History */}
              <section className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
                <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-300 uppercase tracking-widest">
                  <Clock size={18} className="text-pink-500" />
                  مساهماتي الأخيرة
                </h2>
                <div className="space-y-4">
                  {studentContributions.map(c => (
                    <div key={c.id} className="flex gap-4 group items-start border-b border-white/5 pb-4 last:border-0">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-400">
                        {c.type === 'link' ? <LinkIcon size={16} /> : c.type === 'file' ? <FileUp size={16} /> : <Type size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-white truncate">{project.tasks.find(t => t.id === c.taskId)?.title || 'مهمة محذوفة'}</h4>
                          <span className="text-[10px] font-mono text-slate-500">{new Date(c.timestamp).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 truncate italic">"{c.content}"</p>
                        {c.analysis && (
                          <div className={cn(
                            "mt-3 text-[10px] p-2 rounded-lg border",
                            c.analysis.quality === 'Critical' ? "bg-red-500/10 text-red-300 border-red-500/20" :
                            c.analysis.quality === 'Major' ? "bg-blue-500/10 text-blue-300 border-blue-500/20" :
                            "bg-white/5 text-slate-300 border-white/10"
                          )}>
                            <strong className="uppercase opacity-50 block mb-1">AI Logic Guard:</strong> {c.analysis.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {studentContributions.length === 0 && (
                    <div className="text-center py-12 text-slate-600 text-xs italic">لا توجد مساهمات بعد</div>
                  )}
                </div>
              </section>
            </div>
            
            {/* External Contributions */}
            <section className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
               <div className="relative z-10 space-y-3">
                  <h2 className="text-2xl font-black italic tracking-tighter">LEADERSHIP ACTIONS / المساهمات الخارجية</h2>
                  <p className="text-sm text-slate-400 max-w-md italic">هل قمت بمهام قيادية أو تصميم خارج النظام؟ سجلها الآن لضمان حقك في الدرجات.</p>
                  <button className="mt-4 px-8 py-3 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    تسجيل مهمة إضافية
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-purple-500/20 transition-all" />
            </section>
          </motion.div>
        )}

        {activeTab === 'upload' && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto bg-white/5 rounded-3xl p-10 border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <h2 className="text-3xl font-black italic mb-8 text-center text-white tracking-tight underline decoration-purple-500/50 underline-offset-8">رفع مساهمة جديدة</h2>
            
            <div className="space-y-8">
              {/* Task Selection */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">المهمة المرتبطة</label>
                <select 
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#1A1A1B]">اختر مهمة من قائمتك...</option>
                  {studentTasks.map(t => (
                    <option key={t.id} value={t.id} className="bg-[#1A1A1B]">{t.title} (W: {t.weight})</option>
                  ))}
                </select>
              </div>

              {/* Type Selection */}
              <div className="flex gap-4">
                <TypeToggle active={uploadType === 'text'} onClick={() => setUploadType('text')} icon={<Type size={20} />} label="Text" />
                <TypeToggle active={uploadType === 'link'} onClick={() => setUploadType('link')} icon={<LinkIcon size={20} />} label="Link" />
                <TypeToggle active={uploadType === 'file'} onClick={() => setUploadType('file')} icon={<FileUp size={20} />} label="File" />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">المحتوى أو الرابط</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  placeholder="اكتب تفاصيل إنجازك هنا..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-6 pt-4">
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className="flex-1 py-4 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  disabled={isAnalyzing || !content || !selectedTaskId}
                  onClick={handleUpload}
                  className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-500/20"
                >
                  {isAnalyzing ? (
                    <>AI NEURAL ANALYSIS... <Loader2 size={20} className="animate-spin" /></>
                  ) : (
                    <>SUBMIT TO ENGINE <Send size={20} /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypeToggle({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all duration-300",
        active 
          ? "bg-purple-600/20 text-white border-purple-500 shadow-lg shadow-purple-500/20" 
          : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:border-white/20"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      {active && <CheckCircle2 size={12} className="text-purple-400" />}
    </button>
  );
}
