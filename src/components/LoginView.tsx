import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { ShieldCheck, Flame, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onAdminOpen: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onAdminOpen }) => {
  const { login, setAuthView } = useTournaments();
  const [username, setUsername] = useState('s4mnxx');
  const [password, setPassword] = useState('123456');
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleTitleClick = () => {
    const nextCount = adminTapCount + 1;
    setAdminTapCount(nextCount);
    if (nextCount >= 5) {
      setAdminTapCount(0);
      setShowToast('🛡️ Admin Mode Activated!');
      setTimeout(() => {
        onAdminOpen();
        setShowToast(null);
      }, 700);
    } else {
      setShowToast(`Tap ${5 - nextCount} more times for Admin`);
      setTimeout(() => setShowToast(null), 1200);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setShowToast('Please enter your username');
      setTimeout(() => setShowToast(null), 2000);
      return;
    }
    login(username, password);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 pt-16 max-w-[420px] mx-auto relative select-none">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a2332] text-orange-400 border border-orange-500/40 px-4 py-2 rounded-full text-xs font-bold shadow-xl animate-bounce flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Top Brand Banner */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-sm tracking-wider shadow-lg shadow-orange-600/30">
            FF
          </div>
          <div>
            <span className="font-heading font-black tracking-wider text-sm bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              SKILL WAR
            </span>
            <span className="text-[9px] block text-white/50 tracking-widest font-semibold uppercase">
              Esports Arena
            </span>
          </div>
        </div>

        <button
          onClick={() => onAdminOpen()}
          className="text-[11px] font-semibold text-purple-300/80 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-purple-900/60 transition"
        >
          <ShieldCheck className="w-3 h-3 text-purple-400" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="my-auto">
        <h1
          onClick={handleTitleClick}
          className="text-[40px] font-extrabold leading-[44px] cursor-pointer active:scale-98 transition tracking-tight font-heading"
        >
          Welcome to,<br />
          <span className="text-white">Login</span>
        </h1>
        <p className="text-[11px] text-white/30 mt-2 font-medium flex items-center gap-1.5">
          <span>Tip: Tap 5 times for Admin access</span>
          {adminTapCount > 0 && <span className="text-orange-400 font-bold">({adminTapCount}/5)</span>}
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <input
              id="lu"
              type="text"
              placeholder="Email/Mobile No/Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#671eff] rounded-full px-6 py-[18px] text-[15px] outline-none text-white font-medium placeholder-white/80 shadow-lg shadow-purple-900/30 focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#671eff] rounded-full px-6 py-[18px] text-[15px] outline-none text-white font-medium placeholder-white/80 shadow-lg shadow-purple-900/30 focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          <div className="flex justify-between items-center text-[13px] pt-1 px-1">
            <span className="text-white/40">Demo: s4mnxx / 123456</span>
            <button
              type="button"
              onClick={() => {
                setShowToast('Password reset link sent to demo account');
                setTimeout(() => setShowToast(null), 2000);
              }}
              className="text-white/50 hover:text-white transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#671eff] hover:bg-[#5b19e6] active:scale-[0.98] rounded-full py-[18px] mt-6 font-extrabold text-[16px] tracking-wide shadow-xl shadow-[#671eff]/40 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>LOGIN</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="bg-black px-4 text-white/40 uppercase tracking-widest font-semibold text-[11px]">
              Instant Access
            </span>
          </div>
        </div>

        <button
          onClick={() => login('s4mnxx')}
          className="w-full bg-[#151a23] hover:bg-[#1f2838] border border-white/10 rounded-full py-3.5 text-xs font-bold text-white/90 flex items-center justify-center gap-2 transition"
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Quick Login as s4mnxx (Free Fire Pro)</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center pb-4">
        <p className="text-[14px] text-white/70">
          Don't have an account?{' '}
          <button
            onClick={() => setAuthView('signup')}
            className="font-bold text-white hover:text-purple-300 underline underline-offset-4 cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};
