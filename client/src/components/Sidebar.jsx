import React from 'react';
import {
  LayoutDashboard,
  BookMarked,
  RotateCcw,
  Clock,
  Award,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, revisionCount = 0, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: BookMarked },
    {
      id: 'revision',
      label: 'Spaced Revision',
      icon: RotateCcw,
      badge: revisionCount > 0 ? revisionCount : null
    },
    { id: 'sessions', label: 'Study Sessions', icon: Clock },
    { id: 'mocktests', label: 'Mock Tests & Scores', icon: Award },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Exam Target', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-panel border-r border-slate-200/80 dark:border-white/5 flex flex-col justify-between p-4 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
              Navigation
            </span>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Motivation Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-indigo-100 dark:from-indigo-950/40 dark:to-slate-900 dark:border-indigo-500/20 text-center">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Recall</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            "Testing yourself produces stronger neural pathways than re-reading."
          </p>
        </div>
      </aside>
    </>
  );
};
