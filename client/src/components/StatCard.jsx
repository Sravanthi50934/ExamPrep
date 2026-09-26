import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend, progress }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-500/20',
      bar: 'bg-indigo-600 dark:bg-indigo-500',
      glow: 'hover:border-indigo-500/40'
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      bar: 'bg-emerald-600 dark:bg-emerald-500',
      glow: 'hover:border-emerald-500/40'
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/20',
      bar: 'bg-amber-500',
      glow: 'hover:border-amber-500/40'
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/10',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-500/20',
      bar: 'bg-rose-500',
      glow: 'hover:border-rose-500/40'
    },
    cyan: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/10',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-500/20',
      bar: 'bg-cyan-500',
      glow: 'hover:border-cyan-500/40'
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-500/20',
      bar: 'bg-purple-600 dark:bg-purple-500',
      glow: 'hover:border-purple-500/40'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${scheme.glow}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
          {trend && (
            <span className={`font-semibold ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {trend.text}
            </span>
          )}
        </div>
      )}

      {typeof progress === 'number' && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scheme.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
