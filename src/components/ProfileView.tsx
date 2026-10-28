import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { 
  User, Shield, Trophy, Crosshair, Flame, 
  LogOut, RefreshCw, Save, Check, KeyRound, Phone, Mail, Gift, ArrowRight 
} from 'lucide-react';

interface ProfileViewProps {
  onOpenAdmin: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAdmin }) => {
  const { user, updateUserProfile, logout, resetAllData, setActiveTab } = useTournaments();
  const [ign, setIgn] = useState(user.ign || '');
  const [uid, setUid] = useState(user.uid || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    updateUserProfile({ ign: ign.trim(), uid: uid.trim() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 pb-28 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight">Player Profile</h1>
          <p className="text-xs text-white/40">Free Fire Max gamer settings</p>
        </div>
        <button
          onClick={onOpenAdmin}
          className="text-xs font-bold text-purple-300 bg-purple-900/40 border border-purple-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-purple-800/40 transition cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>Admin</span>
        </button>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-br from-[#161d2b] to-[#101520] rounded-2xl p-4 border border-[#232f42] flex items-center gap-3.5 shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-orange-950/50">
          {(user.username || 'S').charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white">{user.username}</h2>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-md font-bold">
              Level 58
            </span>
          </div>
          <p className="text-xs text-orange-400 font-extrabold mt-0.5">{user.ign || 'No IGN set'}</p>
          <p className="text-[10px] text-white/40">UID: {user.uid || 'Not linked'}</p>
        </div>
      </div>

      {/* Esports Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#121824] rounded-2xl p-3 border border-[#232f42] text-center">
          <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-[10px] text-white/40 uppercase font-semibold">Booyahs</p>
          <p className="text-lg font-black text-white mt-0.5">{user.booyahCount || 3}</p>
        </div>

        <div className="bg-[#121824] rounded-2xl p-3 border border-[#232f42] text-center">
          <Crosshair className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-[10px] text-white/40 uppercase font-semibold">Total Kills</p>
          <p className="text-lg font-black text-white mt-0.5">{user.totalKills || 26}</p>
        </div>

        <div className="bg-[#121824] rounded-2xl p-3 border border-[#232f42] text-center">
          <Flame className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-[10px] text-white/40 uppercase font-semibold">Matches</p>
          <p className="text-lg font-black text-white mt-0.5">{user.matchesPlayed || 8}</p>
        </div>
      </div>

      {/* Refer & Earn Promo Card */}
      <div 
        onClick={() => {
          sounds.playClick();
          setActiveTab('refer');
        }}
        className="bg-gradient-to-r from-purple-900/60 via-[#1b1c34] to-[#121824] rounded-2xl p-4 border border-purple-500/40 flex items-center justify-between cursor-pointer group hover:border-purple-400 transition shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Gift className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-white">Refer & Earn ₹25</p>
              <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 rounded-full">BONUS</span>
            </div>
            <p className="text-[10px] text-white/50 mt-0.5">
              Code: <span className="font-mono text-amber-400 font-bold">{user.referralCode || 'SKILL-S4MNXX'}</span> • ₹{user.referralEarnings || 50} earned
            </p>
          </div>
        </div>

        <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow group-hover:scale-105 transition flex items-center gap-1">
          <span>Invite</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Edit In-Game Profile Details */}
      <form onSubmit={handleSave} className="bg-[#121824] rounded-2xl p-4 border border-[#232f42] space-y-3">
        <p className="text-xs font-black uppercase text-white/60 tracking-wider">
          Game Credentials
        </p>

        <div>
          <label className="text-[11px] font-semibold text-white/70 block mb-1">
            Free Fire In-Game Name (IGN)
          </label>
          <input
            type="text"
            value={ign}
            onChange={(e) => setIgn(e.target.value)}
            placeholder="e.g. 亗 S4MNXX 亗"
            className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-white/70 block mb-1">
            Free Fire Player UID
          </label>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="e.g. 2847910245"
            className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl py-2.5 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-950/30 active:scale-98"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>SAVED SUCCESSFULLY!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>UPDATE GAME CREDENTIALS</span>
            </>
          )}
        </button>
      </form>

      {/* 24/7 WhatsApp Official Support Card */}
      <a
        href="https://wa.me/919883184962?text=Hi%20Skill%20War%20Support"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#11241a] hover:bg-[#142e20] border border-green-500/40 rounded-2xl p-3.5 flex items-center justify-between transition cursor-pointer shadow-lg group block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-xl group-hover:scale-105 transition">
            💬
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">Official WhatsApp Support</span>
              <span className="bg-green-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">24/7 ACTIVE</span>
            </div>
            <p className="text-[10px] text-green-300/80 mt-0.5">+91 9883184962 • Instant Match & Deposit Help</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-green-400 group-hover:translate-x-1 transition">
          CHAT →
        </span>
      </a>

      {/* Account actions */}
      <div className="space-y-2">
        <button
          onClick={resetAllData}
          className="w-full bg-[#151c28] hover:bg-[#1a2332] border border-[#232f42] text-white/70 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>Reset App & Tournaments Demo Data</span>
        </button>

        <button
          onClick={logout}
          className="w-full bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-300 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
