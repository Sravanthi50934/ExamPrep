import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  Brain,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const RevisionQueue = ({ subjects = [], onOpenFlashcards, onRefreshData }) => {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'DUE' | 'FLAGGED'
  const [loadingTopicId, setLoadingTopicId] = useState(null);

  // Extract all topics across all subjects
  const allTopics = [];
  subjects.forEach(sub => {
    (sub.topics || []).forEach(top => {
      const isDue = top.nextRevisionDate && new Date(top.nextRevisionDate) <= new Date();
      const isFlagged = top.status === 'Needs Revision';
      const isOverdueOrDue = isDue || isFlagged;

      allTopics.push({
        ...top,
        subjectId: sub._id,
        subjectName: sub.name,
        subjectColor: sub.color,
        isDue,
        isFlagged,
        isPriority: isOverdueOrDue
      });
    });
  });

  const filtered = allTopics.filter(t => {
    if (filter === 'DUE') return t.isDue;
    if (filter === 'FLAGGED') return t.isFlagged;
    return t.isDue || t.isFlagged || t.status === 'Completed';
  });

  const handleMarkRevision = async (subjectId, topicId, confidence = 4) => {
    setLoadingTopicId(topicId);
    try {
      await api.completeRevision(subjectId, topicId, confidence);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Error updating revision: ' + err.message);
    } finally {
      setLoadingTopicId(null);
    }
  };

  const dueCount = allTopics.filter(t => t.isDue || t.isFlagged).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Science Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Brain className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Ebbinghaus Spaced Repetition Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Active Revision Queue</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated intervals (Day 1 → Day 3 → Day 7 → Day 14 → Day 30) to transfer concepts to permanent memory
          </p>
        </div>

        <button
          onClick={onOpenFlashcards}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Review via Flashcards
        </button>
      </div>

      {/* Stats & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Pending Revisions: <strong className="text-amber-600 dark:text-amber-400">{dueCount} topics</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Active ({filtered.length})
          </button>
          <button
            onClick={() => setFilter('DUE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'DUE'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Spaced Due
          </button>
          <button
            onClick={() => setFilter('FLAGGED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'FLAGGED'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Marked For Revision
          </button>
        </div>
      </div>

      {/* Topic Revision Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((topic) => {
            const isDueNow = topic.isDue || topic.isFlagged;

            return (
              <div
                key={topic._id}
                className={`p-5 rounded-3xl border transition-all ${
                  isDueNow
                    ? 'glass-card border-amber-300 dark:border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'glass-card border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white inline-block shadow-sm"
                      style={{ backgroundColor: topic.subjectColor || '#6366f1' }}
                    >
                      {topic.subjectName}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">{topic.title}</h4>
                  </div>

                  {isDueNow && (
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> Due Now
                    </span>
                  )}
                </div>

                {/* Notes or Formulas Preview */}
                {topic.notes && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 mb-3">
                    {topic.notes}
                  </p>
                )}

                {topic.keyFormulas && topic.keyFormulas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {topic.keyFormulas.slice(0, 2).map((f, i) => (
                      <code
                        key={i}
                        className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[11px] font-mono border border-indigo-200 dark:border-indigo-500/20"
                      >
                        {f}
                      </code>
                    ))}
                  </div>
                )}

                {/* Bottom Row: Revision stats + action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Reviewed: <strong className="text-slate-900 dark:text-white">{topic.revisionCount || 0} times</strong>
                    </div>
                    {topic.lastStudied && (
                      <div className="text-slate-400 text-[10px]">
                        Last: {new Date(topic.lastStudied).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleMarkRevision(topic.subjectId, topic._id, 4)}
                    disabled={loadingTopicId === topic._id}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {loadingTopicId === topic._id ? 'Updating...' : 'Mark Revised'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center glass-panel rounded-3xl border border-slate-200 dark:border-white/5">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">No Revisions Due!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Your spaced repetition queue is clear for today. Complete new topics in the Syllabus Tracker to automatically schedule future reviews!
          </p>
        </div>
      )}
    </div>
  );
};
