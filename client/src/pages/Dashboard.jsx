import React from 'react';
import { CountdownTimer } from '../components/CountdownTimer';
import { StatCard } from '../components/StatCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import {
  BookCheck,
  Clock,
  Flame,
  Award,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Play,
  SunMoon,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard = ({
  analytics,
  user,
  subjects = [],
  onOpenTimer,
  onOpenFlashcards,
  onOpenMockModal,
  onNavigate,
  onMarkRevisionComplete,
  onRefreshData
}) => {
  const { updateUser } = useAuth();

  // No default date! User selects and saves their own exam date
  const targetDate = user?.targetExam?.date || null;
  const examTitle = user?.targetExam?.title || 'Target Examination';
  const targetScore = user?.targetExam?.targetScore || '90%';
  const dailyGoalHours = user?.targetExam?.dailyGoalMinutes
    ? (user.targetExam.dailyGoalMinutes / 60).toFixed(1)
    : 4;

  const readinessScore = analytics?.readinessScore || 65;

  const handleSaveExamDate = async (newDateStr) => {
    try {
      await updateUser({
        targetExam: {
          ...(user?.targetExam || {}),
          date: new Date(newDateStr)
        }
      });
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to update exam date:', err);
      throw err;
    }
  };

  const handleRevisionCheck = (subjectId, topicId) => {
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    if (onMarkRevisionComplete) {
      onMarkRevisionComplete(subjectId, topicId, 4);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 0. Home Page Top Control Bar: Greeting + Prominent Light/Dark Theme Switcher */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
              Welcome back, {user?.name || 'Scholar'}!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam preparation command center & revision dashboard
            </p>
          </div>
        </div>

        {/* Dedicated Light / Dark Theme Switcher on Home Page */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <SunMoon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Theme:
            </span>
          </div>
          <ThemeToggle variant="segmented" />
        </div>
      </div>

      {/* 1. Exam Target Countdown Banner (with select & save date ability) */}
      <CountdownTimer
        examTitle={examTitle}
        targetDate={targetDate}
        targetScore={targetScore}
        dailyGoalHours={dailyGoalHours}
        onSaveDate={handleSaveExamDate}
      />

      {/* 2. Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Syllabus Completion"
          value={`${analytics?.syllabusCompletionPercentage || 0}%`}
          subtitle={`${analytics?.topicCounts?.completed || 0} of ${analytics?.topicCounts?.total || 0} topics completed`}
          icon={BookCheck}
          color="indigo"
          progress={analytics?.syllabusCompletionPercentage || 0}
        />

        <StatCard
          title="Total Study Hours"
          value={`${analytics?.totalStudyHours || 0} hrs`}
          subtitle={`Today: ${Math.round(((analytics?.todayStudyMinutes || 0) / 60) * 10) / 10}h / ${dailyGoalHours}h target`}
          icon={Clock}
          color="cyan"
          trend={{ text: `${analytics?.streakCount || 1} day active streak`, positive: true }}
        />

        <StatCard
          title="Exam Readiness Index"
          value={`${readinessScore}%`}
          subtitle={
            readinessScore >= 80
              ? 'Peak Exam Readiness'
              : readinessScore >= 60
              ? 'On Track'
              : 'Needs Acceleration'
          }
          icon={TrendingUp}
          color={readinessScore >= 75 ? 'emerald' : readinessScore >= 50 ? 'amber' : 'rose'}
          progress={readinessScore}
        />

        <StatCard
          title="Mock Test Average"
          value={`${analytics?.averageMockScore || 0}%`}
          subtitle={`${analytics?.mockTestsCount || 0} mock tests logged so far`}
          icon={Award}
          color="purple"
          progress={analytics?.averageMockScore || 0}
        />
      </div>

      {/* 3. Quick Action Hub */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">Daily Study Station:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenTimer}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Focus Timer
          </button>

          <button
            onClick={onOpenFlashcards}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Review Flashcards
          </button>

          <button
            onClick={onOpenMockModal}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-amber-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            Log Mock Test
          </button>
        </div>
      </div>

      {/* 4. Split Section: Spaced Repetition Due + Weak Topics Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spaced Repetition Queue */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Spaced Repetition Due</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Scientifically timed review to beat forgetting curve</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('revision')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {analytics?.revisionDueList && analytics.revisionDueList.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              {analytics.revisionDueList.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:border-indigo-500/40 transition-colors shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.subjectColor || '#6366f1' }}
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-4.5">
                      {item.subjectName} • Difficulty: <strong className="text-slate-700 dark:text-slate-300">{item.difficulty}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleRevisionCheck(item.subjectId, item.topicId)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Reviewed
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">All caught up!</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">No topics due for spaced repetition today.</p>
            </div>
          )}
        </div>

        {/* Weak Topics & Risk Analysis Alert */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Priority Areas & Weak Spots</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Identified from low-confidence topics & mock tests</p>
              </div>
            </div>
          </div>

          {analytics?.weakAreas && analytics.weakAreas.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Focus your next Pomodoro sessions on these topics to raise your readiness index:
              </p>
              <div className="flex flex-wrap gap-2">
                {analytics.weakAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 text-rose-700 dark:text-rose-300 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Solid Foundation</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">No critical weak areas flagged. Keep practicing mock tests!</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Subject Mastery Progress Overview (Calculates progress percentage, completed/total topics, and visual progress bar) */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Subject Syllabus Mastery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track coverage across all examination subjects</p>
          </div>
          <button
            onClick={() => onNavigate('syllabus')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            Manage Syllabus <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const completed = (sub.topics || []).filter(t => t.status === 'Completed').length;
            const inProgress = (sub.topics || []).filter(t => t.status === 'In Progress').length;
            const total = (sub.topics || []).length;
            const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={sub._id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 hover:border-indigo-500/40 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color || '#6366f1' }}
                    />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{sub.name}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-display">{rate}%</span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${rate}%`,
                      backgroundColor: sub.color || '#6366f1'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {completed} of {total} Topics
                  </span>
                  <span>Target: {sub.targetHours || 30}h</span>
                </div>

                {inProgress > 0 && (
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    {inProgress} topic{inProgress > 1 ? 's' : ''} currently in progress
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
