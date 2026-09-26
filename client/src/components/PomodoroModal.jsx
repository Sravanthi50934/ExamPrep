import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, CheckCircle, Clock, Volume2, VolumeX, Star } from 'lucide-react';
import { api } from '../services/api';

export const PomodoroModal = ({ isOpen, onClose, subjects = [], onSessionSaved }) => {
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(4);
  const [saving, setSaving] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const audioCtxRef = useRef(null);

  // Play pleasant chime on completion using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  useEffect(() => {
    if (mode === 'focus') setTimeLeft(customMinutes * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else if (mode === 'longBreak') setTimeLeft(15 * 60);
    setIsRunning(false);
  }, [mode, customMinutes]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const totalTime = mode === 'focus' ? customMinutes * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const selectedSubject = subjects.find(s => s._id === selectedSubjectId);

  const handleSaveSession = async () => {
    setSaving(true);
    try {
      const minutesSpent = Math.max(1, Math.round((totalTime - timeLeft) / 60));
      await api.createSession({
        subjectId: selectedSubjectId || undefined,
        subjectName: selectedSubject?.name || 'General Focus Session',
        topicTitle: topicTitle || 'Self Study',
        durationMinutes: minutesSpent,
        sessionType: mode === 'focus' ? 'Pomodoro' : 'Theory Review',
        notes,
        rating
      });

      if (onSessionSaved) onSessionSaved();
      onClose();
    } catch (err) {
      alert('Error saving session: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Deep Work Study Timer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pomodoro focus block with auto-logging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-6 border border-slate-200 dark:border-slate-700/50">
          <button
            onClick={() => setMode('focus')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              mode === 'longBreak'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Countdown Progress */}
        <div className="flex flex-col items-center justify-center my-4 relative">
          <svg className="w-56 h-56 -rotate-90 transform">
            <circle
              cx="112"
              cy="112"
              r="96"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r="96"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 96}
              strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className={`transition-all duration-500 ${
                mode === 'focus' ? 'text-indigo-600 dark:text-indigo-500' : mode === 'shortBreak' ? 'text-emerald-500' : 'text-cyan-500'
              }`}
              fill="transparent"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
              {mode === 'focus' ? 'Deep Focus' : 'Recharge Time'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setTimeLeft(totalTime);
              setIsRunning(false);
            }}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 text-white shadow-xl transition-all transform active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start Focus
              </>
            )}
          </button>
        </div>

        {/* Subject & Topic Linkage */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">General (No specific subject)</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Topic / Task Title</label>
              <input
                type="text"
                placeholder="e.g. Graph Algorithms, Chapter 4..."
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Session Key Takeaways / Notes</label>
            <input
              type="text"
              placeholder="What did you accomplish or learn?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-600 dark:text-slate-400 mr-1">Focus Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${rating >= star ? 'text-amber-500 dark:text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveSession}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {saving ? 'Logging...' : 'Log Session Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
