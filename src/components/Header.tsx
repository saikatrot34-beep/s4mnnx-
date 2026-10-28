import React from 'react';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { Volume2, VolumeX, Shield, Gift } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  const { user, setActiveTab } = useTournaments();
  const [soundOn, setSoundOn] = React.useState(sounds.isEnabled());

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const state = sounds.toggleSound();
    setSoundOn(state);
  };

  const totalBalance = (user.depositBalance + user.winningBalance).toFixed(2);
  const firstLetter = (user.username || 'S').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-[#0f141f]/95 backdrop-blur-md border-b border-[#1e293b] px-4 py-3 flex items-center justify-between select-none">
      {/* User profile & game info */}
      <div 
        onClick={() => setActiveTab('profile')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 rounded-full flex items-center justify-center font-black text-white text-base shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
          {firstLetter}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-black tracking-tight text-white group-hover:text-orange-400 transition">
              {user.username}
            </p>
            {user.isAdmin && (
              <span className="bg-purple-600 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-white">
                Admin
              </span>
            )}
          </div>
          <p className="text-[10px] text-orange-400 font-extrabold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            FREE FIRE MAX
          </p>
        </div>
      </div>

      {/* Right controls: Sound, Refer, Admin, Wallet */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSoundToggle}
          title={soundOn ? 'Sound is on' : 'Sound muted'}
          className="w-8 h-8 rounded-full bg-[#151c28] border border-[#232f42] flex items-center justify-center text-white/70 hover:text-white transition"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('refer');
          }}
          title="Refer & Earn ₹25"
          className="w-8 h-8 rounded-full bg-[#151c28] border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:border-amber-400 transition"
        >
          <Gift className="w-4 h-4" />
        </button>

        <button
          onClick={onAdminClick}
          title="Admin Panel"
          className="w-8 h-8 rounded-full bg-[#151c28] border border-[#232f42] flex items-center justify-center text-purple-400 hover:text-purple-300 hover:border-purple-500/50 transition"
        >
          <Shield className="w-4 h-4" />
        </button>

        {/* Wallet Badge with quick Add (+) button */}
        <div
          onClick={() => {
            sounds.playClick();
            setActiveTab('wallet');
          }}
          className="bg-[#1a2332] hover:bg-[#222d40] border border-orange-500/40 rounded-full px-3.5 py-1.5 flex gap-2 items-center cursor-pointer transition shadow-lg shadow-black/40 group active:scale-95"
        >
          <div className="flex items-baseline gap-0.5">
            <span className="text-orange-400 font-bold text-xs">₹</span>
            <span className="font-black text-sm tracking-tight text-white">{totalBalance}</span>
          </div>
          <span className="bg-gradient-to-tr from-orange-500 to-red-500 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm group-hover:rotate-90 transition-transform">
            +
          </span>
        </div>
      </div>
    </header>
  );
};
