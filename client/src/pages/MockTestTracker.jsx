import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const MockTestTracker = ({ onOpenMockModal }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMockTests = async () => {
    try {
      const res = await api.getMockTests();
      if (res.success && res.data) {
        setTests(res.data);
      }
    } catch (err) {
      console.error('Failed to load mock tests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mock test result?')) return;
    try {
      await api.deleteMockTest(id);
      fetchMockTests();
    } catch (err) {
      alert('Failed to delete mock test: ' + err.message);
    }
  };

  const avgPercentage = tests.length > 0
    ? Math.round(tests.reduce((acc, t) => acc + (t.percentage || 0), 0) / tests.length)
    : 0;

  const highestScore = tests.length > 0
    ? Math.max(...tests.map(t => t.percentage || 0))
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Mock Test & Performance Tracker</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Evaluate test simulation scores, accuracy, and error patterns</p>
        </div>

        <button
          onClick={onOpenMockModal}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Log Mock Test Result
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Test Accuracy</p>
          <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-display">{avgPercentage}%</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Highest Score Achieved</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-display">{highestScore}%</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mocks Attempted</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-display">{tests.length} Full Tests</h3>
        </div>
      </div>

      {/* Score Progression Trend Graphic */}
      {tests.length > 1 && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Accuracy Trajectory Timeline
          </h3>

          <div className="h-40 flex items-end gap-4 pt-6 px-2">
            {tests.slice().reverse().map((t, idx) => (
              <div key={t._id} className="flex-1 flex flex-col items-center gap-2 group relative">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.percentage}%
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-28 flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      t.percentage >= 80 ? 'bg-emerald-500' : t.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ height: `${t.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
                  #{tests.length - idx} {t.title.slice(0, 8)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test List Cards */}
      {tests.length > 0 ? (
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test._id} className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 hover:border-amber-500/40 transition-all shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      {test.subjectName || 'Full Syllabus'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(test.testDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{test.title}</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-black font-display text-slate-900 dark:text-white">
                      {test.scoreObtained} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {test.totalMarks}</span>
                    </div>
                    <span className={`text-xs font-bold ${
                      test.percentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' : test.percentage >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {test.percentage}% Accuracy
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(test._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Test Result"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weak & Strong Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {test.weakAreas && test.weakAreas.length > 0 && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-1.5">
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Questions Missed / Weak Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {test.weakAreas.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-800 dark:text-rose-200 text-xs">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {test.strongAreas && test.strongAreas.length > 0 && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> High Accuracy Areas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {test.strongAreas.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {test.reflectionNotes && (
                <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  "{test.reflectionNotes}"
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center glass-panel rounded-3xl border border-slate-200 dark:border-white/5">
          <Award className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">No mock tests recorded</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Simulate an exam condition, test your speed, and log your score to see your performance graph!
          </p>
          <button
            onClick={onOpenMockModal}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30"
          >
            Log First Mock Test
          </button>
        </div>
      )}
    </div>
  );
};
