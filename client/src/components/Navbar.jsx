import React, { useState, useEffect } from 'react';
import { Flame, Clock, LogOut, User, Database, Menu, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ onOpenTimer, onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const [dbStatus, setDbStatus] = useState({ isConnected: false, type: 'Checking...' });

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await api.getHealth();
        if (res?.database) {
          setDbStatus(res.database);
        }
      } catch (e) {
        setDbStatus({ isConnected: false, type: 'Offline Mode' });
      }
    };
    checkDb();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-white/5 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <span className="text-xl font-black text-white font-display">ET</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none font-display">
              ExamTrack <span className="text-indigo-600 dark:text-indigo-400 text-xs font-normal">Pro</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Smart Preparation & Revision</p>
          </div>
        </div>
      </div>

      {/* Middle & Right action items */}
      <div className="flex items-center gap-3">
        {/* Database Status indicator */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60"
          title={`Database: ${dbStatus.type}`}
        >
          <span className={`w-2 h-2 rounded-full ${dbStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
          <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300 text-[11px]">
            {dbStatus.isConnected ? 'MongoDB Live' : 'Atlas / Active'}
          </span>
        </div>

        {/* Study Streak Badge */}
        {user?.streak && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 shadow-sm">
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 animate-bounce" />
            <span>{user.streak.count || 1}d Streak</span>
          </div>
        )}

        {/* Global Theme Toggle Button */}
        <ThemeToggle variant="button" />

        {/* Launch Pomodoro Timer Button */}
        <button
          onClick={onOpenTimer}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
        >
          <Clock className="w-4 h-4" />
          <span className="hidden md:inline">Focus Timer</span>
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Student'}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{user?.targetExam?.title || 'Target Exam'}</p>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
