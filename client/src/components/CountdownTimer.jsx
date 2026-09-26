import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, Zap, Edit2, Check, X, AlertCircle } from 'lucide-react';

export const CountdownTimer = ({
  examTitle,
  targetDate,
  targetScore,
  dailyGoalHours,
  onSaveDate
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [savingDate, setSavingDate] = useState(false);
  const [dateError, setDateError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (targetDate) {
      setSelectedDate(new Date(targetDate).toISOString().split('T')[0]);
    } else {
      setSelectedDate('');
    }
  }, [targetDate]);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (isNaN(difference) || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSaveDate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedDate) {
      setDateError('Please select a valid exam date.');
      return;
    }

    const picked = new Date(selectedDate);
    if (isNaN(picked.getTime())) {
      setDateError('Invalid date format.');
      return;
    }

    setDateError('');
    setSavingDate(true);
    try {
      if (onSaveDate) {
        await onSaveDate(selectedDate);
      }
      setIsEditingDate(false);
    } catch (err) {
      setDateError(err.message || 'Failed to save exam date');
    } finally {
      setSavingDate(false);
    }
  };

  const hasValidDate = targetDate && !isNaN(new Date(targetDate).getTime());

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50/70 dark:from-indigo-900/60 dark:via-slate-900/90 dark:to-purple-950/50 p-6 md:p-8 border border-indigo-200/80 dark:border-indigo-500/20 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Background ambient decorative blurs */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 max-w-xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Target Exam Countdown
            </span>
            {targetScore && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/25">
                <Target className="w-3.5 h-3.5" /> Goal: {targetScore}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            {examTitle || 'Upcoming Major Examination'}
          </h2>

          {/* Exam Date & Inline Edit Trigger */}
          {hasValidDate && !isEditingDate ? (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Exam Date:{' '}
                <strong className="text-slate-900 dark:text-slate-200">
                  {new Date(targetDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(new Date(targetDate).toISOString().split('T')[0]);
                  setIsEditingDate(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700 transition-colors ml-1"
                title="Change Exam Date"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change Date</span>
              </button>
            </div>
          ) : null}

          {/* Date Selector Form (shown when editing or when no exam date is set) */}
          {(!hasValidDate || isEditingDate) && (
            <div className="mt-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-500/30 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {!hasValidDate ? 'Select Your Target Exam Date:' : 'Update Exam Date:'}
                </span>
                {isEditingDate && hasValidDate && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateError('');
                      setIsEditingDate(false);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {dateError && (
                <p className="text-xs text-rose-500 dark:text-rose-400 mb-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {dateError}
                </p>
              )}

              <form onSubmit={handleSaveDate} className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setDateError('');
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  disabled={savingDate || !selectedDate}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-1.5 transition-all transform active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  {savingDate ? 'Saving...' : 'Save Exam Date'}
                </button>

                {isEditingDate && hasValidDate && (
                  <button
                    type="button"
                    onClick={() => setIsEditingDate(false)}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                )}
              </form>
              {!hasValidDate && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Pick your target date above to calculate your study countdown and readiness index.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Countdown Digits */}
        {hasValidDate ? (
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shadow-md dark:shadow-lg">
                <span className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-display">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5">
                Days
              </span>
            </div>

            <span className="text-2xl font-bold text-slate-400 dark:text-slate-600 mb-6">:</span>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shadow-md dark:shadow-lg">
                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5">
                Hours
              </span>
            </div>

            <span className="text-2xl font-bold text-slate-400 dark:text-slate-600 mb-6">:</span>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shadow-md dark:shadow-lg">
                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5">
                Minutes
              </span>
            </div>

            <span className="text-2xl font-bold text-slate-400 dark:text-slate-600 mb-6">:</span>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shadow-md dark:shadow-lg">
                <span className="text-2xl md:text-3xl font-black text-amber-500 dark:text-amber-400 font-display animate-pulse-subtle">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5">
                Seconds
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-slate-900/60 border border-dashed border-indigo-300 dark:border-indigo-500/40 text-center max-w-sm">
            <Clock className="w-10 h-10 text-indigo-500 dark:text-indigo-400 mx-auto mb-2 animate-bounce" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Countdown Inactive</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select and save your target exam date to trigger the live countdown timer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
