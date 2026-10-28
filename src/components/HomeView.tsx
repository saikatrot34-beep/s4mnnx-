import React, { useState, useMemo } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { TournamentCard } from './TournamentCard';
import { Tournament } from '../types/tournament';
import { sounds } from '../utils/audio';
import { Trophy, Zap, Shield, Search, Flame, Sparkles, Gift, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onSelectTournament: (tournament: Tournament) => void;
  onOpenRoomCredentials: (tournament: Tournament) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTournament,
  onOpenRoomCredentials,
}) => {
  const { user, tournaments, setActiveTab } = useTournaments();
  const [feeFilter, setFeeFilter] = useState<'all' | number>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'SOLO' | 'DUO' | 'SQUAD'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const liveMatchesCount = tournaments.filter((t) => t.status === 'LIVE' || t.status === 'UPCOMING').length;

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      // Fee match
      if (feeFilter !== 'all' && t.entryFee !== feeFilter) {
        return false;
      }
      // Mode match
      if (modeFilter !== 'all' && t.mode !== modeFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesMap = t.map.toLowerCase().includes(query);
        const matchesNum = t.matchNumber.toString().includes(query);
        if (!matchesTitle && !matchesMap && !matchesNum) return false;
      }
      return true;
    });
  }, [tournaments, feeFilter, modeFilter, searchQuery]);

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Trust Badge in Home header below title */}
      <div className="flex justify-center gap-2 mt-1 flex-wrap">
        <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-500/30 font-semibold flex items-center gap-1 shadow-sm">
          ✅ 100% Trusted
        </span>
        <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1 shadow-sm">
          ⚡ Instant Withdrawal
        </span>
        <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-500/30 font-semibold flex items-center gap-1 shadow-sm">
          🛡️ 100% Fair Play
        </span>
      </div>

      {/* Hero Banner: Free Fire Booyah Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff8c00] via-[#ff5500] to-[#e61e00] rounded-2xl p-4.5 text-white shadow-xl shadow-orange-950/40 border border-orange-400/30">
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase text-amber-200">
              <Flame className="w-3 h-3 text-amber-300" />
              <span>FREE FIRE MAX TOURNAMENT</span>
            </div>
            <h2 className="font-heading font-black text-[22px] leading-tight tracking-wide drop-shadow-md">
              BOOYAH!<br />WIN UPTO ₹5000
            </h2>

            {/* In-Banner Trust Badges */}
            <div className="flex justify-start gap-1.5 pt-1 flex-wrap">
              <span className="bg-black/35 backdrop-blur-sm text-green-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-400/30 flex items-center gap-1">
                ✅ 100% Trusted
              </span>
              <span className="bg-black/35 backdrop-blur-sm text-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-400/30 flex items-center gap-1">
                ⚡ Instant Withdrawal
              </span>
              <span className="bg-black/35 backdrop-blur-sm text-blue-200 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-400/30 flex items-center gap-1">
                🛡️ Verified Rooms
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-white/90 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {liveMatchesCount} Matches Live
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-200">
                <Zap className="w-3 h-3 text-amber-300" />
                Instant Withdraw
              </span>
            </div>
          </div>
          <div className="text-[52px] select-none filter drop-shadow-xl animate-pulse">
            🏆
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Refer & Earn Quick Banner */}
      <div
        onClick={() => {
          sounds.playClick();
          setActiveTab('refer');
        }}
        className="bg-gradient-to-r from-purple-900/60 via-[#1b1c34] to-[#121824] border border-purple-500/40 hover:border-purple-400 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition">
            <Gift className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-white">Refer Squad & Earn ₹25</p>
              <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">FREE CASH</span>
            </div>
            <p className="text-[10px] text-white/50">Your code: <span className="font-mono text-amber-300 font-bold">{user.referralCode || 'SKILL-S4MNXX'}</span> • Instant wallet bonus</p>
          </div>
        </div>
        <div className="flex items-center text-xs font-extrabold text-purple-300 group-hover:translate-x-1 transition">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Quick Action bar: Add Money prompt & Anti-Cheat badge */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('wallet');
          }}
          className="bg-[#151c28] hover:bg-[#1b2536] border border-[#26354a] rounded-xl p-3 flex items-center gap-2.5 transition text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[12px] font-black text-white">Add Cash</p>
            <p className="text-[10px] text-white/40">Min ₹30 • Instant UPI</p>
          </div>
        </button>

        <div className="bg-[#151c28] border border-[#26354a] rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[12px] font-black text-white">100% Anti-Cheat</p>
            <p className="text-[10px] text-white/40">Strict Mobile Only</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search match #, map or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121824] border border-[#232f42] rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-orange-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Entry Fee Filters (Matching prompt's chips: All, ₹7, ₹15, ₹30, ₹50) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-white/60 px-1">
          <span>Filter by Entry Fee</span>
          <span className="text-[11px] text-orange-400">
            {filteredTournaments.length} available
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              sounds.playClick();
              setFeeFilter('all');
            }}
            className={`rounded-full px-5 py-2 text-xs font-black transition whitespace-nowrap cursor-pointer ${
              feeFilter === 'all'
                ? 'bg-[#ff8c00] text-white shadow-md shadow-orange-600/30'
                : 'bg-[#1a2332] text-white/70 border border-[#2a3441] hover:text-white'
            }`}
          >
            All {tournaments.length}
          </button>

          {[7, 15, 30, 50].map((fee) => (
            <button
              key={fee}
              onClick={() => {
                sounds.playClick();
                setFeeFilter(feeFilter === fee ? 'all' : fee);
              }}
              className={`rounded-full px-5 py-2 text-xs font-black transition whitespace-nowrap cursor-pointer ${
                feeFilter === fee
                  ? 'bg-[#ff8c00] text-white shadow-md shadow-orange-600/30'
                  : 'bg-[#1a2332] text-white/70 border border-[#2a3441] hover:text-white'
              }`}
            >
              ₹{fee}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Filters: All, Solo, Duo, Squad */}
      <div className="flex gap-1.5 p-1 bg-[#101622] rounded-xl border border-[#1e293b]">
        {(['all', 'SOLO', 'DUO', 'SQUAD'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              sounds.playClick();
              setModeFilter(mode);
            }}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition uppercase cursor-pointer ${
              modeFilter === mode
                ? 'bg-[#1e2a3c] text-orange-400 shadow-sm border border-orange-500/20'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {mode === 'all' ? 'All Modes' : mode}
          </button>
        ))}
      </div>

      {/* Tournament Cards List */}
      <div className="space-y-3 pt-1">
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12 bg-[#121824] rounded-2xl border border-[#232f42] p-6">
            <Trophy className="w-10 h-10 text-white/20 mx-auto mb-2" />
            <p className="font-bold text-sm text-white/70">No matches found</p>
            <p className="text-xs text-white/40 mt-1">Try clearing filters or search query</p>
            <button
              onClick={() => {
                setFeeFilter('all');
                setModeFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 bg-[#1a2332] text-orange-400 border border-orange-500/30 text-xs px-4 py-2 rounded-full font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              onSelect={onSelectTournament}
              onOpenRoomCredentials={onOpenRoomCredentials}
            />
          ))
        )}
      </div>
    </div>
  );
};
