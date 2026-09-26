import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Key, Mail, Sparkles, ArrowRight, ShieldCheck, Target, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('alex@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-200">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Theme Toggle in corner */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle variant="button" />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl glass-panel relative z-10">
        {/* Left Side: Brand Hero & Benefits */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-50/80 via-slate-50/90 to-purple-50/80 dark:from-indigo-950/70 dark:via-slate-900/80 dark:to-purple-950/70 border-r border-slate-200 dark:border-white/5">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">ExamTrack Pro</h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">Intelligent Preparation Platform</p>
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight font-display">
                Prepare systematically. Remember indefinitely.
              </h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  Dynamic Syllabus Mastery Tracker
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  Automated Spaced Repetition (1-3-7-14-30d)
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  Built-in Pomodoro with Audio Chimes
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  Mock Test Analytics & Score Prediction
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
            Secure JWT Authentication • Resilient In-Memory & Atlas Cloud
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Welcome Back</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign in to resume your study streak and revision queue
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all transform active:scale-98"
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Preset Button */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Fill Demo Credentials (Alex Johnson)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
