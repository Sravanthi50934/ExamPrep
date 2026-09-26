import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  Edit2,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  BarChart2,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const SyllabusTracker = ({
  subjects = [],
  onOpenSubjectModal,
  onOpenTopicModal,
  onRefreshData
}) => {
  const [localSubjects, setLocalSubjects] = useState(subjects);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?._id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [showAllSubjectsProgress, setShowAllSubjectsProgress] = useState(false);

  useEffect(() => {
    setLocalSubjects(subjects);
    if (!selectedSubjectId && subjects.length > 0) {
      setSelectedSubjectId(subjects[0]._id);
    }
  }, [subjects, selectedSubjectId]);

  // Current active subject from local state (optimistic)
  const currentSubject = localSubjects.find(s => s._id === selectedSubjectId) || localSubjects[0];

  // Topic status update handler (saves changes persistently & updates UI automatically)
  const handleUpdateTopicStatus = async (topicId, newStatus) => {
    if (!currentSubject) return;

    // Optimistically update local subjects so progress percentage & bars recompute instantly
    setLocalSubjects(prev =>
      prev.map(sub => {
        if (sub._id !== currentSubject._id) return sub;
        const updatedTopics = (sub.topics || []).map(t =>
          t._id === topicId ? { ...t, status: newStatus } : t
        );
        const comp = updatedTopics.filter(t => t.status === 'Completed').length;
        const tot = updatedTopics.length;
        const rate = tot > 0 ? Math.round((comp / tot) * 100) : 0;
        return { ...sub, topics: updatedTopics, completionRate: rate };
      })
    );

    try {
      await api.updateTopic(currentSubject._id, topicId, {
        status: newStatus
      });

      if (newStatus === 'Completed') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err) {
      alert('Failed to update topic status: ' + err.message);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleToggleTopicStatus = (topic) => {
    const nextStatus = topic.status === 'Completed' ? 'In Progress' : 'Completed';
    handleUpdateTopicStatus(topic._id, nextStatus);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject and all its topics?')) return;
    try {
      await api.deleteSubject(subjectId);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Failed to delete subject: ' + err.message);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Delete this topic?')) return;
    try {
      await api.deleteTopic(currentSubject._id, topicId);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Failed to delete topic: ' + err.message);
    }
  };

  const filteredTopics = (currentSubject?.topics || []).filter(topic => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.notes && topic.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || topic.status === statusFilter;
    const matchesDiff = difficultyFilter === 'ALL' || topic.difficulty === difficultyFilter;
    return matchesSearch && matchesStatus && matchesDiff;
  });

  // Automated calculation of progress percentage, completed/total topics, and counts
  const completedCount = (currentSubject?.topics || []).filter(t => t.status === 'Completed').length;
  const inProgressCount = (currentSubject?.topics || []).filter(t => t.status === 'In Progress').length;
  const notStartedCount = (currentSubject?.topics || []).filter(t => t.status === 'Not Started').length;
  const totalCount = (currentSubject?.topics || []).length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & New Subject Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">
            Syllabus Breakdown & Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Map out modules, track completion status, and monitor topic mastery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAllSubjectsProgress(!showAllSubjectsProgress)}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <BarChart2 className="w-4 h-4" />
            <span>{showAllSubjectsProgress ? 'Hide Overview' : 'All Subjects Progress'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenSubjectModal(null)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Subject Module
          </button>
        </div>
      </div>

      {/* All Subjects Progress Overview Panel (collapsible or toggleable) */}
      {showAllSubjectsProgress && localSubjects.length > 0 && (
        <div className="glass-card p-5 rounded-3xl border border-indigo-200 dark:border-indigo-500/30 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BarChart2 className="w-4 h-4" /> All Subjects Syllabus Progress Overview
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {localSubjects.length} Subject Modules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {localSubjects.map(sub => {
              const comp = (sub.topics || []).filter(t => t.status === 'Completed').length;
              const tot = (sub.topics || []).length;
              const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

              return (
                <div
                  key={sub._id}
                  onClick={() => setSelectedSubjectId(sub._id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    currentSubject?._id === sub._id
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-500/50 shadow-sm'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color || '#6366f1' }} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{sub.name}</span>
                    </div>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{pct}%</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: sub.color || '#6366f1' }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{comp} of {tot} Completed</span>
                    <span>Target: {sub.targetHours || 30}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {localSubjects.map(sub => {
          const isSelected = currentSubject?._id === sub._id;
          const comp = (sub.topics || []).filter(t => t.status === 'Completed').length;
          const tot = (sub.topics || []).length;
          const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

          return (
            <button
              key={sub._id}
              onClick={() => setSelectedSubjectId(sub._id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2.5 border transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: sub.color || '#6366f1' }}
              />
              <span>{sub.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isSelected
                    ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-500'
                }`}
              >
                {pct}%
              </span>
            </button>
          );
        })}
      </div>

      {currentSubject ? (
        <div className="space-y-6">
          {/* Active Subject Banner: Automatic Progress Percentage & Visual Progress Bar */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-white/5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                  style={{ backgroundColor: currentSubject.color || '#6366f1' }}
                >
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                    {currentSubject.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-slate-200">{completedCount} of {totalCount}</strong> topics completed • Target: {currentSubject.targetHours || 30} hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenTopicModal(currentSubject._id, null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Topic
                </button>
                <button
                  onClick={() => onOpenSubjectModal(currentSubject)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
                  title="Edit Subject"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSubject(currentSubject._id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-700 transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subject Progress Bar & Breakdown */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Subject Syllabus Progress:</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400 font-display text-sm">
                    {completionPercent}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    {completedCount} Completed
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    {inProgressCount} In Progress
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {notStartedCount} Not Started
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${completionPercent}%`,
                    backgroundColor: currentSubject.color || '#6366f1'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics, formulas, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm"
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Topics List with Interactive Completion Status Editor */}
          {filteredTopics.length > 0 ? (
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic._id;
                const isCompleted = topic.status === 'Completed';

                return (
                  <div
                    key={topic._id}
                    className={`rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-50/90 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 shadow-sm'
                        : 'bg-white dark:bg-slate-900/40 glass-card border-slate-200/90 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      {/* Left: Checkbox & Title & Meta */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Quick Checkbox button */}
                        <button
                          type="button"
                          onClick={() => handleToggleTopicStatus(topic)}
                          title={isCompleted ? 'Mark In Progress' : 'Mark Completed'}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-transparent hover:border-indigo-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold truncate ${
                                isCompleted
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {topic.title}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {/* Difficulty badge */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                topic.difficulty === 'Hard'
                                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/25'
                                  : topic.difficulty === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/25'
                                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/25'
                              }`}
                            >
                              {topic.difficulty}
                            </span>

                            {/* Logged study hours */}
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {topic.loggedMinutes ? (topic.loggedMinutes / 60).toFixed(1) : 0} / {topic.estimatedHours || 3}h
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Topic Completion Status Selector + Actions */}
                      <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                        {/* Direct Completion Status Editor (Not Started / In Progress / Completed) */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                            Status:
                          </label>
                          <select
                            value={topic.status}
                            onChange={(e) => handleUpdateTopicStatus(topic._id, e.target.value)}
                            aria-label={`Status for ${topic.title}`}
                            className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              topic.status === 'Completed'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                                : topic.status === 'In Progress'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
                                : topic.status === 'Needs Revision'
                                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <option value="Not Started" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              ⚪ Not Started
                            </option>
                            <option value="In Progress" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              ⏳ In Progress
                            </option>
                            <option value="Completed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              ✅ Completed
                            </option>
                            <option value="Needs Revision" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              🔁 Needs Revision
                            </option>
                          </select>
                        </div>

                        {/* Confidence Stars */}
                        <div className="hidden lg:flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                (topic.confidence || 3) >= s
                                  ? 'text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Actions: Toggle Details, Edit Modal, Delete */}
                        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                          <button
                            type="button"
                            onClick={() => setExpandedTopicId(isExpanded ? null : topic._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Toggle Notes & Formulas"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenTopicModal(currentSubject._id, topic)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Topic"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTopic(topic._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Topic"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Topic Details (Notes & Formulas) */}
                    {isExpanded && (
                      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 rounded-b-2xl space-y-3 animate-fade-in">
                        {topic.notes && (
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                              Study Notes:
                            </span>
                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                              {topic.notes}
                            </p>
                          </div>
                        )}

                        {topic.keyFormulas && topic.keyFormulas.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                              Key Formulas / Equations:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {topic.keyFormulas.map((f, i) => (
                                <code
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-500/30 dark:text-indigo-300 text-xs font-mono"
                                >
                                  {f}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/50">
                          <span>
                            Revision count: <strong className="text-slate-700 dark:text-slate-300">{topic.revisionCount || 0} times</strong>
                          </span>
                          {topic.nextRevisionDate && (
                            <span>
                              Next spaced review: <strong className="text-slate-700 dark:text-slate-300">{new Date(topic.nextRevisionDate).toLocaleDateString()}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No topics found</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No topics match your current filter or search query. Click "Add Topic" to create one!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-16 text-center glass-panel rounded-3xl border border-slate-200 dark:border-white/5">
          <Layers className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">No subjects configured yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Create your first subject module to start tracking your exam syllabus!
          </p>
          <button
            type="button"
            onClick={() => onOpenSubjectModal(null)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            Create First Subject
          </button>
        </div>
      )}
    </div>
  );
};
