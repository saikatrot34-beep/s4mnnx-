import React, { useState } from 'react';
import { Tournament } from '../types/tournament';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { 
  X, Trophy, Crosshair, Users, Clock, MapPin, 
  ShieldAlert, KeyRound, CheckCircle, AlertTriangle, ArrowRight, Wallet 
} from 'lucide-react';

interface TournamentDetailsModalProps {
  tournament: Tournament;
  onClose: () => void;
  onOpenRoomCredentials: (tournament: Tournament) => void;
  onGoToWallet: () => void;
}

export const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  tournament,
  onClose,
  onOpenRoomCredentials,
  onGoToWallet,
}) => {
  const { user, isUserInTournament, joinTournament } = useTournaments();
  const joined = isUserInTournament(tournament.id);
  const isFull = tournament.joinedSlots >= tournament.totalSlots;
  const totalBalance = user.depositBalance + user.winningBalance;
  const hasEnoughFunds = totalBalance >= tournament.entryFee;

  const [ign, setIgn] = useState(user.ign || user.username);
  const [uid, setUid] = useState(user.uid || '');
  const [activeTab, setActiveTab] = useState<'info' | 'players' | 'rules'>('info');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleJoin = () => {
    if (!ign.trim()) {
      setErrorMsg('Please enter your Free Fire In-Game Name (IGN)');
      return;
    }
    if (!uid.trim() || uid.length < 6) {
      setErrorMsg('Please enter a valid Free Fire UID (minimum 6 digits)');
      return;
    }

    const res = joinTournament(tournament.id, ign, uid);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-[#0f141f] border border-[#232f42] rounded-t-3xl sm:rounded-3xl w-full max-w-[440px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="relative p-4 pb-3 border-b border-[#1e293b] flex items-center justify-between bg-[#151c28]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white">
              {tournament.map}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded-md bg-[#1f2a3c] text-orange-400">
              {tournament.mode}
            </span>
            <span className="text-xs text-white/50 font-bold">
              #{tournament.matchNumber}
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#1e293b] text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto no-scrollbar p-4 space-y-4 flex-1">
          {/* Title & Timing */}
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {tournament.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{tournament.matchDate} at {tournament.matchTime}</span>
              <span className="text-white/20">•</span>
              <span className="text-emerald-400 font-semibold">{tournament.startTime}</span>
            </div>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-white/60 hover:text-white text-xs">✕</button>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Subtabs */}
          <div className="flex gap-1 p-1 bg-[#151c28] rounded-xl border border-[#1e293b]">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'info' ? 'bg-[#1f2a3c] text-orange-400 shadow' : 'text-white/50'
              }`}
            >
              Prize & Details
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'players' ? 'bg-[#1f2a3c] text-orange-400 shadow' : 'text-white/50'
              }`}
            >
              Players ({tournament.joinedSlots}/{tournament.totalSlots})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === 'rules' ? 'bg-[#1f2a3c] text-orange-400 shadow' : 'text-white/50'
              }`}
            >
              Rules
            </button>
          </div>

          {activeTab === 'info' && (
            <div className="space-y-3.5">
              {/* Prize Pool Breakdown Cards */}
              <div className="bg-gradient-to-br from-[#161d2b] to-[#121722] rounded-2xl p-3.5 border border-[#232f42] space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs font-black uppercase text-white/50 tracking-wider">Prize Pool Breakdown</span>
                  <span className="text-xs font-black text-amber-400">Total: ₹{tournament.prizePool}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#1b2435] p-2.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-sm">
                      🥇
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-semibold">Booyah! (1st)</p>
                      <p className="font-black text-amber-400 text-sm">₹{tournament.booyahPrize}</p>
                    </div>
                  </div>

                  <div className="bg-[#1b2435] p-2.5 rounded-xl border border-orange-500/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-black text-sm">
                      🎯
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase font-semibold">Per Kill</p>
                      <p className="font-black text-orange-400 text-sm">₹{tournament.perKill} / kill</p>
                    </div>
                  </div>

                  <div className="bg-[#151c28] p-2 rounded-lg border border-white/5 flex items-center justify-between px-3">
                    <span className="text-[11px] text-white/60">🥈 2nd Place</span>
                    <span className="font-bold text-white text-xs">₹{tournament.runnerUpPrize}</span>
                  </div>

                  <div className="bg-[#151c28] p-2 rounded-lg border border-white/5 flex items-center justify-between px-3">
                    <span className="text-[11px] text-white/60">🥉 3rd Place</span>
                    <span className="font-bold text-white text-xs">₹{tournament.thirdPrize}</span>
                  </div>
                </div>
              </div>

              {/* Match Specs */}
              <div className="bg-[#121824] rounded-xl p-3 border border-[#232f42] grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-[10px] text-white/40 uppercase">Map</p>
                  <p className="font-extrabold text-white mt-0.5">{tournament.map}</p>
                </div>
                <div className="border-x border-white/5">
                  <p className="text-[10px] text-white/40 uppercase">Mode</p>
                  <p className="font-extrabold text-orange-400 mt-0.5">{tournament.mode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase">Version</p>
                  <p className="font-extrabold text-white mt-0.5">FF MAX</p>
                </div>
              </div>

              {/* Free Fire Profile Details Required */}
              {!joined && (
                <div className="bg-[#151c28] rounded-2xl p-3.5 border border-purple-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-purple-300">
                      Your In-Game Details
                    </label>
                    <span className="text-[10px] text-white/40">Used for verification</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-white/50 block mb-1">Free Fire IGN (In-Game Name)</span>
                      <input
                        type="text"
                        placeholder="e.g. 亗 S4MNXX 亗"
                        value={ign}
                        onChange={(e) => setIgn(e.target.value)}
                        className="w-full bg-[#1f283a] border border-[#2e3b52] rounded-xl px-3.5 py-2 text-xs text-white font-semibold outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/50 block mb-1">Free Fire UID (Numeric ID)</span>
                      <input
                        type="text"
                        placeholder="e.g. 2847910245"
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                        className="w-full bg-[#1f283a] border border-[#2e3b52] rounded-xl px-3.5 py-2 text-xs text-white font-semibold outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Room credentials teaser if joined */}
              {joined && (
                <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">Room Credentials Ready</p>
                      <p className="text-[10px] text-purple-300/80">Room ID & Password available</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenRoomCredentials(tournament)}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow cursor-pointer"
                  >
                    View
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'players' && (
            <div className="space-y-2">
              <p className="text-xs text-white/50 font-semibold px-1">
                Registered Players ({tournament.participants.length})
              </p>
              {tournament.participants.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-xs">
                  No players registered yet. Be the first to join!
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
                  {tournament.participants.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="bg-[#151c28] border border-[#232f42] rounded-xl p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#1f293d] text-white/60 font-bold flex items-center justify-center text-[10px]">
                          #{p.slotNumber || idx + 1}
                        </span>
                        <div>
                          <p className="font-extrabold text-white">{p.ign}</p>
                          <p className="text-[10px] text-white/40">@{p.username} • UID: {p.uid}</p>
                        </div>
                      </div>
                      {p.userId === user.id && (
                        <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#151c28] p-3.5 rounded-xl border border-[#232f42] space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Fair Play & Match Rules</span>
                </div>
                <ul className="space-y-2 text-white/70 list-disc pl-4 text-[11px] leading-relaxed">
                  {tournament.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                  <li>Emulators / iPads / PC players are strictly prohibited. Instant DQ.</li>
                  <li>Room ID & Password will be revealed 15 minutes before match start.</li>
                  <li>Enter the room using the exact in-game name registered above.</li>
                  <li>Take screenshot of final scoreboard in case of result disputes.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-[#121824] border-t border-[#1e293b]">
          {joined ? (
            <div className="flex gap-2">
              <button
                onClick={() => onOpenRoomCredentials(tournament)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>VIEW ROOM ID & PASSWORD</span>
              </button>
            </div>
          ) : !hasEnoughFunds ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-white/60">Wallet: ₹{totalBalance.toFixed(2)}</span>
                <span className="text-red-400 font-bold">Needed: ₹{tournament.entryFee}</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onGoToWallet();
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xs py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>INSUFFICIENT BALANCE • ADD MONEY NOW</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="text-[10px] text-white/50 uppercase font-semibold">Entry Fee</p>
                <p className="text-base font-black text-emerald-400">₹{tournament.entryFee}</p>
              </div>
              <button
                onClick={handleJoin}
                disabled={isFull}
                className={`flex-1 font-black text-xs py-3 rounded-full uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  isFull
                    ? 'bg-[#1e293b] text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#ff8c00] to-[#ff3c00] text-white shadow-orange-600/30 active:scale-98'
                }`}
              >
                <span>{isFull ? 'MATCH HOUSEFULL' : 'CONFIRM & JOIN MATCH'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
