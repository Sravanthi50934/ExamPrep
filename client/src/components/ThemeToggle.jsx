import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ variant = 'segmented', className = '' }) => {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center relative ${
          isDark
            ? 'bg-slate-800 text-amber-300 hover:bg-slate-700 hover:text-amber-200 border border-slate-700/60'
            : 'bg-white text-indigo-600 hover:bg-slate-100 hover:text-indigo-700 border border-slate-200 shadow-sm'
        } ${className}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-500 hover:rotate-90" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-500 hover:-rotate-12" />
        )}
      </button>
    );
  }

  // Segmented switch (default)
  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 shadow-inner'
          : 'bg-slate-100 border-slate-200/90 shadow-sm'
      } ${className}`}
      role="radiogroup"
      aria-label="Theme selection"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        role="radio"
        aria-checked={!isDark}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
          !isDark
            ? 'bg-white text-amber-600 shadow-md shadow-amber-500/10 border border-slate-200/80 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-400' : ''}`} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        role="radio"
        aria-checked={isDark}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
          isDark
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-200 fill-indigo-200' : ''}`} />
        <span>Dark</span>
      </button>
    </div>
  );
};
