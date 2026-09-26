import React, { useState, useEffect } from 'react';
import { Clock, Play, Trash2, Calendar, Star, BookOpen, Layers } from 'lucide-react';
import { api } from '../services/api';

export const StudySessionsPage = ({ onOpenTimer }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await api.getSessions();
      if (res.success && res.data) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Delete this study session record?')) return;
    try {
      await api.deleteSession(id);
      fetchSessions();
    } catch (err) {
      alert('Failed to delete session: ' + err.message);
    }
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Study Sessions & Focus Logs</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Chronological history of your Pomodoros and deep work</p>
        </div>

        <button
          onClick={onOpenTimer}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          Launch Pomodoro Timer
        </button>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Time Logged</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">{totalHours} Hours</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sessions Completed</p>
          <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 font-display">{sessions.length} Blocks</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Session Duration</p>
          <h3 className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1 font-display">
            {sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0} Mins
          </h3>
        </div>
      </div>

      {/* Sessions Table */}
      {sessions.length > 0 ? (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Study Blocks</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{sessions.length} recorded</span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {sessions.map((sess) => (
              <div key={sess._id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {sess.topicTitle || 'Deep Focus Session'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{sess.subjectName}</span>
                      <span>•</span>
                      <span>{sess.sessionType || 'Pomodoro'}</span>
                      {sess.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-700 dark:text-slate-300">"{sess.notes}"</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white font-display">
                      {sess.durationMinutes} min
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(sess.completedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteSession(sess._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-16 text-center glass-panel rounded-3xl border border-slate-200 dark:border-white/5">
          <Clock className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">No study sessions logged yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Start a Pomodoro focus timer to record your study hours!
          </p>
          <button
            onClick={onOpenTimer}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            Start First Timer
          </button>
        </div>
      )}
    </div>
  );
};
