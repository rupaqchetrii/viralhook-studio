import React, { useState } from 'react';
import { Flame, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';

export function LoginPage() {
  const { loginBack, setUserName, setUserEmail } = useHookStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState(null); // 'google' | 'email'
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setLoginMethod('google');

    // Simulate authentic Google OAuth redirect/flow animation
    setTimeout(() => {
      setIsSuccess(true);
      setUserName('Meenmoy Bhuyan');
      setUserEmail('lop94474@gmail.com');
      setTimeout(() => {
        loginBack();
      }, 700);
    }, 1200);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoggingIn(true);
    setLoginMethod('email');

    setTimeout(() => {
      setIsSuccess(true);
      const namePart = email.split('@')[0];
      setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
      setUserEmail(email);
      setTimeout(() => {
        loginBack();
      }, 700);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-white to-[#F8F7F4] dark:from-[#0F0F1A] dark:to-[#161626] transition-colors">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white dark:bg-[#1A1A2E] border border-[#E7E7E9] dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-2xl relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EA4C89] via-pink-400 to-[#0D0C22]" />

          {/* Logo & Headline */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0D0C22] text-white shadow-md mx-auto mb-2">
              <Flame className="w-6 h-6 fill-current text-[#EA4C89]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0D0C22] dark:text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>ViralHook</span>
              <span className="text-[#EA4C89]">Studio</span>
            </h1>
            <p className="text-xs text-[#6E6D7A] dark:text-[#9E9EA7]">
              Pre-production creator intelligence lab & virality predictor
            </p>
          </div>

          {/* Social / Google Login */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-[#E7E7E9] dark:border-white/15 bg-white dark:bg-white/5 hover:bg-[#F8F7F4] dark:hover:bg-white/10 text-xs sm:text-sm font-bold text-[#0D0C22] dark:text-white transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer disabled:opacity-60 ${
                isLoggingIn && loginMethod === 'google' ? 'scale-[0.99] border-[#EA4C89] ring-2 ring-[#EA4C89]/20' : ''
              }`}
            >
              {isLoggingIn && loginMethod === 'google' ? (
                isSuccess ? (
                  <span className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in zoom-in-95">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Welcome back! Signing in...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5 text-[#0D0C22] dark:text-white font-medium">
                    <svg className="animate-spin h-4 w-4 text-[#EA4C89]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Connecting to Google...</span>
                  </span>
                )
              ) : (
                <>
                  {/* Official Google 'G' SVG Logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E7E7E9] dark:bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-[#9E9EA7] dark:text-[#666677] font-semibold">
                or with email
              </span>
              <div className="flex-1 h-px bg-[#E7E7E9] dark:bg-white/10" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0D0C22] dark:text-white mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white placeholder-[#9E9EA7] dark:placeholder-[#666677] text-xs sm:text-sm rounded-xl px-4 py-3 border border-[#E7E7E9] dark:border-white/10 focus:bg-white dark:focus:bg-[#1A1A2E] focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/20 focus:outline-none transition-all shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#0D0C22] dark:text-white">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo mode: any password works or use "Continue with Google".')}
                    className="text-[11px] text-[#EA4C89] hover:underline font-semibold"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F8F7F4] dark:bg-white/5 text-[#0D0C22] dark:text-white placeholder-[#9E9EA7] dark:placeholder-[#666677] text-xs sm:text-sm rounded-xl px-4 py-3 border border-[#E7E7E9] dark:border-white/10 focus:bg-white dark:focus:bg-[#1A1A2E] focus:border-[#EA4C89] focus:ring-2 focus:ring-[#EA4C89]/20 focus:outline-none transition-all shadow-sm"
                />
              </div>

              {/* Submit Button with Smooth Animation */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full py-3.5 px-4 rounded-full bg-[#0D0C22] hover:bg-[#3D3D4E] dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#0D0C22] font-bold text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer disabled:opacity-60 ${
                  isLoggingIn && loginMethod === 'email' ? 'ring-2 ring-[#EA4C89]' : ''
                }`}
              >
                {isLoggingIn && loginMethod === 'email' ? (
                  isSuccess ? (
                    <span className="flex items-center gap-2 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Verified! Entering Studio...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 font-medium">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Authenticating...</span>
                    </span>
                  )
                ) : (
                  <>
                    <span>Sign In to Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Privacy Note */}
          <div className="mt-8 pt-5 border-t border-[#E7E7E9] dark:border-white/10 text-center flex items-center justify-center gap-1.5 text-[11px] text-[#6E6D7A] dark:text-[#9E9EA7]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Local privacy guaranteed. No video credentials requested.</span>
          </div>
        </div>

        {/* Bottom Switch Note */}
        <p className="text-center text-xs text-[#6E6D7A] dark:text-[#9E9EA7] mt-6">
          Don't have an account?{' '}
          <button
            onClick={handleGoogleLogin}
            className="text-[#EA4C89] font-bold hover:underline"
          >
            Create one instantly with Google
          </button>
        </p>
      </div>
    </div>
  );
}
