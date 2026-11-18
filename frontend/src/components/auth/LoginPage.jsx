import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Flame, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const IS_CONFIGURED = CLIENT_ID && !CLIENT_ID.includes('YOUR_GOOGLE');

export function LoginPage() {
  const { loginBack, setUserName, setUserEmail } = useHookStore();

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [method, setMethod]         = useState(null);   // 'google' | 'email'
  const [success, setSuccess]       = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const [ripple, setRipple]         = useState(false);

  /* ── Trigger click-ripple animation ── */
  const triggerRipple = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 500);
  };

  /* ── On successful Google token ── */
  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    setMethod('google');
    setErrorMsg('');
    try {
      // Fetch the user's Google profile with the access token
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      setSuccess(true);
      setUserName(profile.name || profile.email.split('@')[0]);
      setUserEmail(profile.email);
      setTimeout(() => loginBack(), 800);
    } catch {
      setLoading(false);
      setErrorMsg('Could not fetch your Google profile. Please try again.');
    }
  };

  /* ── Google OAuth hook (opens real Google popup) ── */
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setLoading(false);
      setErrorMsg('Google sign-in was cancelled or failed. Please try again.');
    },
  });

  const handleGoogleClick = () => {
    if (!IS_CONFIGURED) {
      setErrorMsg(
        'Google Client ID not configured yet. See the setup guide below, or use the email form for demo access.'
      );
      return;
    }
    triggerRipple();
    googleLogin();
  };

  /* ── Email / demo login ── */
  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMethod('email');
    setErrorMsg('');
    setTimeout(() => {
      setSuccess(true);
      const namePart = email.split('@')[0];
      setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
      setUserEmail(email);
      setTimeout(() => loginBack(), 800);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-white to-[#F8F7F4] dark:from-[#0F0F1A] dark:to-[#161626] transition-colors">
      <div className="w-full max-w-md">

        {/* ── Main Card ── */}
        <div className="bg-white dark:bg-[#1A1A2E] border border-[#E7E7E9] dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-2xl relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EA4C89] via-pink-400 to-[#0D0C22]" />

          {/* Logo & headline */}
          <div className="text-center space-y-1.5 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0D0C22] text-white shadow-md mx-auto mb-3">
              <Flame className="w-7 h-7 text-[#EA4C89] fill-current" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0D0C22] dark:text-white tracking-tight">
              Welcome to <span className="text-[#EA4C89]">ViralHook</span> Studio
            </h1>
            <p className="text-xs text-[#6E6D7A] dark:text-[#9E9EA7]">
              Sign in to access your A/B Hook Lab &amp; Virality Predictor
            </p>
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── Google Sign-In Button ── */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className={`w-full relative overflow-hidden flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-60 select-none
              ${ripple ? 'scale-[0.98] border-[#EA4C89] ring-2 ring-[#EA4C89]/30 shadow-md' : 'border-[#E7E7E9] dark:border-white/15 hover:border-[#EA4C89]/50 hover:shadow'}
              bg-white dark:bg-white/5 hover:bg-[#FAFAFA] dark:hover:bg-white/10 text-[#0D0C22] dark:text-white`}
          >
            {/* Ripple pulse overlay */}
            {ripple && (
              <span className="absolute inset-0 rounded-full bg-[#EA4C89]/10 animate-ping" />
            )}

            {loading && method === 'google' ? (
              success ? (
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in zoom-in-95">
                  <CheckCircle2 className="w-5 h-5" />
                  Welcome! Entering Studio...
                </span>
              ) : (
                <span className="flex items-center gap-2.5 font-medium">
                  <svg className="animate-spin h-4 w-4 text-[#EA4C89]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Connecting to Google...
                </span>
              )
            ) : (
              <>
                {/* Real Google "G" logo SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* ── Setup Guide (shown when not configured) ── */}
          {!IS_CONFIGURED && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-xs text-amber-800 dark:text-amber-300 space-y-2">
              <p className="font-black uppercase tracking-wide text-[10px]">🔧 One-Time Google Setup (5 min)</p>
              <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="underline font-semibold">console.cloud.google.com</a></li>
                <li>Create a project → <strong>APIs &amp; Services</strong> → <strong>Credentials</strong></li>
                <li>Create <strong>OAuth 2.0 Client ID</strong> (Web application)</li>
                <li>Add <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">http://127.0.0.1:8000</code> as Authorized JS Origin</li>
                <li>Copy the Client ID and paste it in <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">frontend/.env</code> as <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code></li>
                <li>Rebuild: <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">npm run build</code></li>
              </ol>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                Until then, use the email form below for demo access ↓
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E7E7E9] dark:bg-white/10" />
            <span className="text-[11px] uppercase tracking-wider text-[#9E9EA7] dark:text-[#666677] font-semibold">or continue with email</span>
            <div className="flex-1 h-px bg-[#E7E7E9] dark:bg-white/10" />
          </div>

          {/* ── Email Form ── */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0D0C22] dark:text-white mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white placeholder-[#9E9EA7] text-xs sm:text-sm rounded-xl px-4 py-3 border border-[#E7E7E9] dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0D0C22] dark:text-white">Password</label>
                <button type="button" className="text-[11px] text-[#EA4C89] hover:underline font-semibold">Forgot?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white placeholder-[#9E9EA7] text-xs sm:text-sm rounded-xl px-4 py-3 border border-[#E7E7E9] dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/20 focus:outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#0D0C22] hover:bg-[#3D3D4E] dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#0D0C22] font-bold text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
            >
              {loading && method === 'email' ? (
                success ? (
                  <span className="flex items-center gap-2 text-emerald-400 dark:text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified! Entering Studio...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Authenticating...
                  </span>
                )
              ) : (
                <>Sign In to Studio <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Privacy note */}
          <div className="mt-7 pt-5 border-t border-[#E7E7E9] dark:border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-[#9E9EA7] dark:text-[#666677]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>All ML inference runs locally. No video credentials requested.</span>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-[#6E6D7A] dark:text-[#9E9EA7] mt-5">
          Group M B.Tech Project • Mentor: Prof. Megha Gupta
        </p>
      </div>
    </div>
  );
}
