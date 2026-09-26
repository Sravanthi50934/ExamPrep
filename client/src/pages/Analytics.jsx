import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const Analytics = ({ analytics, subjects = [] }) => {
  const readiness = analytics?.readinessScore || 70;
  const counts = analytics?.topicCounts || { total: 0, completed: 0, inProgress: 0, needsRevision: 0, notStarted: 0 };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Deep Analytics & Exam Readiness</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Holistic diagnosis of syllabus coverage, test velocity, and retention</p>
      </div>

      {/* 1. Readiness Index Hero Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 space-y-6 shadow-md dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Composite Readiness Metric
            </span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display">
              {readiness}% Readiness Forecast
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Calculated dynamically from: Syllabus Coverage (45%), Mock Test Performance (40%), and Consistency Streak (15%).
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center relative shadow-lg">
              <div
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center ${
                  readiness >= 80
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : readiness >= 60
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                }`}
              >
                <span className="text-2xl font-black font-display">{readiness}%</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold">Indexed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Formula Breakdown Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">Syllabus Completion</span>
              <span className="font-bold text-slate-900 dark:text-white">{analytics?.syllabusCompletionPercentage || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full"
                style={{ width: `${analytics?.syllabusCompletionPercentage || 0}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">Mock Test Accuracy</span>
              <span className="font-bold text-slate-900 dark:text-white">{analytics?.averageMockScore || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-amber-500 h-1.5 rounded-full"
                style={{ width: `${analytics?.averageMockScore || 0}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">Study Streak</span>
              <span className="font-bold text-slate-900 dark:text-white">{analytics?.streakCount || 1} Days</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (analytics?.streakCount || 1) * 14)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Topic Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Topic Status Distribution
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Completed / Mastered</span>
                <span className="font-bold text-slate-900 dark:text-white">{counts.completed} topics</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${counts.total > 0 ? (counts.completed / counts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">In Progress</span>
                <span className="font-bold text-slate-900 dark:text-white">{counts.inProgress} topics</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${counts.total > 0 ? (counts.inProgress / counts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Needs Revision</span>
                <span className="font-bold text-slate-900 dark:text-white">{counts.needsRevision} topics</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${counts.total > 0 ? (counts.needsRevision / counts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Not Started</span>
                <span className="font-bold text-slate-900 dark:text-white">{counts.notStarted} topics</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-slate-300 dark:bg-slate-700 h-2 rounded-full"
                  style={{ width: `${counts.total > 0 ? (counts.notStarted / counts.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Study Recommendations */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Strategic Study Prescriptions
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-slate-700 dark:text-slate-300 space-y-1">
              <strong className="text-indigo-700 dark:text-indigo-300 block">1. Prioritize High-Yield Hard Topics</strong>
              <p>Allocate your earliest Pomodoro focus blocks to Hard rated topics before cognitive fatigue sets in.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-slate-700 dark:text-slate-300 space-y-1">
              <strong className="text-amber-700 dark:text-amber-300 block">2. Reinforce Before You Forget</strong>
              <p>You have {counts.needsRevision} topics flagged for review. Clearing them today cements long-term memory retention.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300 space-y-1">
              <strong className="text-emerald-700 dark:text-emerald-300 block">3. Weekly Timed Mock Simulation</strong>
              <p>Students who take at least 1 mock test per week experience 28% less exam anxiety and superior time management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
