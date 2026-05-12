/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, Users, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onSelectRole: (role: 'doctor' | 'student') => void;
}

export default function LandingPage({ onSelectRole }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-6 py-16 md:py-24">
      {/* Extra decorative blur orbs for the landing */}
      <div className="fixed top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[10%] left-[10%] w-[400px] h-[400px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-16 relative z-10"
      >
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-purple-500/30">
          <Activity size={40} />
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-purple-400 mb-6 tracking-tight text-center">
          مرآة
        </h1>
        <p className="text-base md:text-lg text-slate-400 italic max-w-2xl mx-auto text-center leading-relaxed mb-16">
          منصة ذكية لتقييم أداء فرق المشاريع الجماعية، مدعومة بالذكاء الاصطناعي لتوزيع المهام بعدالة، تحليل المساهمات لحظياً، وكشف الخمول قبل فوات الأوان.
        </p>
      </motion.div>

      {/* Role Selection Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col md:flex-row gap-6 w-full max-w-2xl relative z-10"
      >
        {/* Doctor / Professor Card */}
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectRole('doctor')}
          className="flex-1 group relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 text-center transition-all duration-500 hover:border-purple-500/50 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden"
          aria-label="الدخول كدكتور"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-xl group-hover:shadow-purple-500/30 transition-all">
              <LayoutDashboard size={28} />
            </div>
            <h2 className="text-xl font-black text-white mb-2 tracking-tight">عرض الدكتور</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-400 mb-4">PROFESSOR DASHBOARD</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              لوحة تحكم تفاعلية لتقييم أداء الفريق وكشف الخمول وتحليل المساهمات
            </p>
          </div>
        </motion.button>

        {/* Student Card */}
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectRole('student')}
          className="flex-1 group relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 text-center transition-all duration-500 hover:border-blue-500/50 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
          aria-label="الدخول كطالب"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 transition-all duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all">
              <Users size={28} />
            </div>
            <h2 className="text-xl font-black text-white mb-2 tracking-tight">عرض الطالب</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400 mb-4">STUDENT PORTAL</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              تابع مهامك، وثّق مساهماتك، واحصل على تقييم فوري بالذكاء الاصطناعي
            </p>
          </div>
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-[10px] text-slate-700 uppercase tracking-widest font-mono relative z-10"
      >
        Built with Gemini AI • مرآة v1.0
      </motion.div>
    </div>
  );
}
