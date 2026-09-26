import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Target, Calendar, User, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Settings = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [examTitle, setExamTitle] = useState(user?.targetExam?.title || '');
  const [examDate, setExamDate] = useState(
    user?.targetExam?.date ? new Date(user.targetExam.date).toISOString().split('T')[0] : ''
  );
  const [dailyGoalHours, setDailyGoalHours] = useState(
    user?.targetExam?.dailyGoalMinutes ? user.targetExam.dailyGoalMinutes / 60 : 4
  );
  const [targetScore, setTargetScore] = useState(user?.targetExam?.targetScore || '90%');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.getHealth();
        setDbStatus(res?.database);
      } catch (e) {
        setDbStatus({ isConnected: false, type: 'Offline Mode' });
      }
    };
    fetchHealth();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateUser({
        name,
        targetExam: {
          title: examTitle,
          date: examDate ? new Date(examDate) : null,
          dailyGoalMinutes: Number(dailyGoalHours) * 60,
          targetScore
        }
      });
      setSuccessMsg('Settings updated successfully!');
      if (refreshUser) refreshUser();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Exam & Account Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure target milestones, study goals, and database settings</p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <User className="w-4 h-4" /> Personal Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Target Exam Milestones */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Target className="w-4 h-4" /> Exam Target Configuration
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target Examination Title</label>
            <input
              type="text"
              required
              placeholder="e.g. GRE General, USMLE Step 1, GATE CS, University Finals"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target Exam Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Daily Study Goal (Hours)</label>
              <input
                type="number"
                min="1"
                max="16"
                step="0.5"
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Target Score / Grade</label>
              <input
                type="text"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder="e.g. 95% or 330/340"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>

      {/* MongoDB Atlas Connection Status & Guide */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Database className="w-4 h-4" /> MongoDB Atlas Database Connection
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Database Backend Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {dbStatus?.type || 'Connected'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            To connect your live MongoDB Atlas cloud cluster:
          </p>

          <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
            <li>Create a free cluster on <span className="text-emerald-600 dark:text-emerald-400">cloud.mongodb.com</span></li>
            <li>Click <strong>Connect</strong> &gt; <strong>Drivers</strong> &gt; copy connection string</li>
            <li>Paste into <code className="text-indigo-600 dark:text-indigo-300">server/.env</code>:</li>
            <li className="text-slate-500 dark:text-slate-400 break-all pl-2 text-[11px]">
              MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/exam_prep_tracker?retryWrites=true&amp;w=majority
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
