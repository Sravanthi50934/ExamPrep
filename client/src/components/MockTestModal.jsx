import React, { useState } from 'react';
import { X, Award, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export const MockTestModal = ({ isOpen, onClose, subjects = [], onTestSaved }) => {
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('Full Syllabus');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalMarks, setTotalMarks] = useState(100);
  const [scoreObtained, setScoreObtained] = useState(80);
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [weakAreaInput, setWeakAreaInput] = useState('');
  const [weakAreas, setWeakAreas] = useState([]);
  const [strongAreaInput, setStrongAreaInput] = useState('');
  const [strongAreas, setStrongAreas] = useState([]);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddWeak = () => {
    if (weakAreaInput.trim()) {
      setWeakAreas([...weakAreas, weakAreaInput.trim()]);
      setWeakAreaInput('');
    }
  };

  const handleAddStrong = () => {
    if (strongAreaInput.trim()) {
      setStrongAreas([...strongAreas, strongAreaInput.trim()]);
      setStrongAreaInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a mock test title');
      return;
    }

    if (Number(scoreObtained) > Number(totalMarks)) {
      setError('Score obtained cannot exceed total marks');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createMockTest({
        title: title.trim(),
        subjectName,
        testDate: new Date(testDate),
        totalMarks: Number(totalMarks),
        scoreObtained: Number(scoreObtained),
        durationMinutes: Number(durationMinutes),
        weakAreas,
        strongAreas,
        reflectionNotes: reflectionNotes.trim()
      });

      if (onTestSaved) onTestSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save mock test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Log Mock Test Result</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track score progression and weak topics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mock Test Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. National Diagnostic Test #4, Gate CS Full Mock"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Subject / Scope</label>
              <select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Full Syllabus">Full Syllabus</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Test Date</label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Total Marks</label>
              <input
                type="number"
                min="1"
                required
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Score Got</label>
              <input
                type="number"
                min="0"
                required
                value={scoreObtained}
                onChange={(e) => setScoreObtained(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Duration (m)</label>
              <input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Weak areas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Questions Missed / Weak Areas</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Graph Traversal, Calculus Limits..."
                value={weakAreaInput}
                onChange={(e) => setWeakAreaInput(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddWeak}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {weakAreas.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {weakAreas.map((w, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300"
                  >
                    <span>{w}</span>
                    <button
                      type="button"
                      onClick={() => setWeakAreas(weakAreas.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Reflection Notes</label>
            <textarea
              rows="2"
              placeholder="What went well? Where was time lost?"
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-600/30 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : 'Save Mock Test Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
