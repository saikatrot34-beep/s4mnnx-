import React, { useState, useMemo } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { 
  Trophy, Crosshair, Award, Crown, Search, 
  Flame, Target, ArrowUp, ArrowDown, Sparkles, Shield, ChevronRight 
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface PlayerStanding {
  id: string;
  username: string;
  ign: string;
  wins: number;
  matches: number;
  kills: number;
  deaths: number;
  kdRatio: number;
  winRate: number;
  tier: string;
  tierColor: string;
  earnings: number;
  isCurrentUser: boolean;
  rank?: number;
}

export const LeaderboardView: React.FC = () => {
  const { user, tournaments } = useTournaments();
  const [sortBy, setSortBy] = useState<'WINS' | 'KD' | 'KILLS'>('WINS');
  const [timeframe, setTimeframe] = useState<'ALL_TIME' | 'WEEKLY' | 'DAILY'>('ALL_TIME');
  const [searchQuery, setSearchQuery] = useState('');

  // Base community Free Fire pro players
  const BASE_PLAYERS = useMemo(() => [
    {
      id: 'usr_raistar',
      username: 'raistar_op',
      ign: '亗 ʀᴀɪsᴛᴀʀ 亗',
      baseWins: 48,
      baseMatches: 64,
      baseKills: 268,
      earnings: 4850,
    },
    {
      id: 'usr_toxic',
      username: 'toxic_v',
      ign: '꧁༺ᴛᴏxɪᴄ༻꧂',
      baseWins: 39,
      baseMatches: 55,
      baseKills: 215,
      earnings: 3920,
    },
    {
      id: 'usr_thunder',
      username: 'thunder_ff',
      ign: '⚡THUNDER⚡',
      baseWins: 31,
      baseMatches: 48,
      baseKills: 178,
      earnings: 3100,
    },
    {
      id: 'usr_killer',
      username: 'killer_boy',
      ign: 'KILLER★BOY',
      baseWins: 23,
      baseMatches: 41,
      baseKills: 138,
      earnings: 2240,
    },
    {
      id: 'usr_shadow',
      username: 'shadow99',
      ign: 'SHADOW×99',
      baseWins: 19,
      baseMatches: 36,
      baseKills: 112,
      earnings: 1780,
    },
    {
      id: 'usr_vampire',
      username: 'vampire_k',
      ign: 'VAMPIRE⚡FF',
      baseWins: 16,
      baseMatches: 33,
      baseKills: 96,
      earnings: 1450,
    },
    {
      id: 'usr_boss',
      username: 'boss_player',
      ign: 'BOSS•GAMER',
      baseWins: 13,
      baseMatches: 29,
      baseKills: 82,
      earnings: 1180,
    },
    {
      id: 'usr_headshot',
      username: 'headshot_king',
      ign: '★HEADSHOT★',
      baseWins: 11,
      baseMatches: 25,
      baseKills: 74,
      earnings: 980,
    },
    {
      id: 'usr_sniper',
      username: 'sniper_queen',
      ign: '★SNIPER×QUEEN★',
      baseWins: 8,
      baseMatches: 21,
      baseKills: 59,
      earnings: 750,
    },
    {
      id: 'usr_hunter',
      username: 'hunter_op',
      ign: '乂HUNTER乂',
      baseWins: 6,
      baseMatches: 18,
      baseKills: 46,
      earnings: 520,
    },
  ], []);

  // Compute live real-time standings merging tournaments and user state
  const computedStandings = useMemo(() => {
    // Current user's live stats
    const userMatches = Math.max(user.matchesPlayed || 8, user.booyahCount || 3);
    const userWins = user.booyahCount || 3;
    const userKills = user.totalKills || 26;
    const userDeaths = Math.max(1, userMatches - userWins);
    const userKd = parseFloat((userKills / userDeaths).toFixed(2));
    const userWinRate = Math.round((userWins / userMatches) * 100);

    const currentUserStanding: PlayerStanding = {
      id: user.id,
      username: user.username,
      ign: user.ign || `亗 ${user.username.toUpperCase()} 亗`,
      wins: userWins,
      matches: userMatches,
      kills: userKills,
      deaths: userDeaths,
      kdRatio: userKd,
      winRate: userWinRate,
      earnings: (user.winningBalance || 0) + 1240,
      tier: userWins >= 25 ? 'Master' : userWins >= 10 ? 'Diamond IV' : 'Diamond II',
      tierColor: 'from-cyan-500 to-blue-600',
      isCurrentUser: true,
    };

    // Build standings for all other players
    const communityStandings: PlayerStanding[] = BASE_PLAYERS.map((bp) => {
      // Check if player participated in any completed tournaments in state
      let addedWins = 0;
      let addedKills = 0;

      tournaments.forEach((t) => {
        if (t.status === 'COMPLETED') {
          const part = t.participants.find(
            (p) => p.username.toLowerCase() === bp.username.toLowerCase()
          );
          if (part) {
            if (part.rank === 1) addedWins += 1;
            if (part.kills) addedKills += part.kills;
          }
        }
      });

      // Adjust for timeframe simulation if weekly/daily selected
      const multiplier = timeframe === 'DAILY' ? 0.2 : timeframe === 'WEEKLY' ? 0.5 : 1;
      const wins = Math.max(1, Math.round((bp.baseWins + addedWins) * multiplier));
      const matches = Math.max(wins + 1, Math.round((bp.baseMatches + (addedWins ? 1 : 0)) * multiplier));
      const kills = Math.max(wins * 2, Math.round((bp.baseKills + addedKills) * multiplier));
      const deaths = Math.max(1, matches - wins);
      const kdRatio = parseFloat((kills / deaths).toFixed(2));
      const winRate = Math.round((wins / matches) * 100);

      let tier = 'Gold I';
      let tierColor = 'from-amber-600 to-yellow-700';

      if (wins >= 35 || kdRatio >= 5.5) {
        tier = 'Grandmaster';
        tierColor = 'from-red-500 via-amber-500 to-yellow-400';
      } else if (wins >= 20 || kdRatio >= 4.0) {
        tier = 'Master';
        tierColor = 'from-purple-500 to-indigo-600';
      } else if (wins >= 10 || kdRatio >= 2.8) {
        tier = 'Diamond';
        tierColor = 'from-cyan-400 to-blue-600';
      } else if (wins >= 5 || kdRatio >= 2.0) {
        tier = 'Platinum';
        tierColor = 'from-emerald-400 to-teal-600';
      }

      return {
        id: bp.id,
        username: bp.username,
        ign: bp.ign,
        wins,
        matches,
        kills,
        deaths,
        kdRatio,
        winRate,
        tier,
        tierColor,
        earnings: Math.round(bp.earnings * multiplier),
        isCurrentUser: false,
      };
    });

    const allPlayers = [currentUserStanding, ...communityStandings];

    // Sort according to selected criteria:
    allPlayers.sort((a, b) => {
      if (sortBy === 'WINS') {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.kdRatio !== a.kdRatio) return b.kdRatio - a.kdRatio;
        return b.kills - a.kills;
      } else if (sortBy === 'KD') {
        if (b.kdRatio !== a.kdRatio) return b.kdRatio - a.kdRatio;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.kills - a.kills;
      } else {
        if (b.kills !== a.kills) return b.kills - a.kills;
        if (b.kdRatio !== a.kdRatio) return b.kdRatio - a.kdRatio;
        return b.wins - a.wins;
      }
    });

    // Assign rank #1 to #N
    return allPlayers.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  }, [user, tournaments, sortBy, timeframe, BASE_PLAYERS]);

  // Filter with search query
  const filteredStandings = useMemo(() => {
    if (!searchQuery.trim()) return computedStandings;
    const q = searchQuery.toLowerCase();
    return computedStandings.filter(
      (p) => p.ign.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)
    );
  }, [computedStandings, searchQuery]);

  // Current user's specific standing in the current ranking
  const userStanding = computedStandings.find((p) => p.isCurrentUser);

  return (
    <div className="p-4 space-y-4 pb-28 select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Hall of Champions</span>
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              LIVE RANKINGS
            </span>
          </h1>
          <p className="text-xs text-white/40">Real-time ranking by Wins & K/D ratio</p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black border border-amber-500/30">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      {/* Primary Ranking Metric Toggle (Wins vs K/D Ratio vs Total Kills) */}
      <div className="bg-[#121824] rounded-2xl p-1.5 border border-[#232f42] space-y-1.5">
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
            Rank Players By:
          </span>
          <span className="text-[10px] text-orange-400 font-extrabold">
            {sortBy === 'WINS' ? '🏆 Total Booyah Wins' : sortBy === 'KD' ? '🎯 Kill / Death Ratio' : '⚔️ Total Frags'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => {
              sounds.playClick();
              setSortBy('WINS');
            }}
            className={`py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              sortBy === 'WINS'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-[#182030] text-white/60 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Total Wins</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSortBy('KD');
            }}
            className={`py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              sortBy === 'KD'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-[#182030] text-white/60 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>K/D Ratio</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSortBy('KILLS');
            }}
            className={`py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              sortBy === 'KILLS'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-[#182030] text-white/60 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Kills</span>
          </button>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="flex gap-1.5 p-1 bg-[#101622] rounded-xl border border-[#1e293b]">
        {(['ALL_TIME', 'WEEKLY', 'DAILY'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              sounds.playClick();
              setTimeframe(t);
            }}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition uppercase cursor-pointer ${
              timeframe === t
                ? 'bg-[#1e2a3c] text-amber-400 shadow-sm border border-amber-500/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {t === 'DAILY' ? 'Today' : t === 'WEEKLY' ? 'This Week' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Top 3 Podium (Visual Showcase) */}
      {computedStandings.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 items-end pt-3 pb-1">
          {/* Rank 2 */}
          <div className="bg-[#121824] border border-slate-500/30 rounded-2xl p-3 text-center space-y-1 relative shadow-lg">
            <div className="w-10 h-10 rounded-full bg-slate-400/20 border-2 border-slate-300 flex items-center justify-center mx-auto text-lg shadow">
              🥈
            </div>
            <p className="text-[11px] font-black text-white truncate">{computedStandings[1].ign}</p>
            <div className="bg-[#182030] rounded-lg py-1 px-1.5 border border-white/5">
              <p className="text-xs font-black text-amber-400">
                {sortBy === 'KD' ? `${computedStandings[1].kdRatio} K/D` : `${computedStandings[1].wins} Wins`}
              </p>
              <span className="text-[9px] text-white/40 block">
                {sortBy === 'KD' ? `${computedStandings[1].wins} Wins` : `${computedStandings[1].kdRatio} K/D`}
              </span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="bg-gradient-to-b from-amber-500/20 via-[#181a28] to-[#121824] border-2 border-amber-400/60 rounded-2xl p-3.5 text-center space-y-1 relative -top-3 shadow-2xl shadow-amber-950/50">
            <Crown className="w-5 h-5 text-amber-400 mx-auto animate-bounce" />
            <div className="w-12 h-12 rounded-full bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center mx-auto text-xl shadow-lg shadow-amber-500/30">
              🥇
            </div>
            <p className="text-xs font-black text-white truncate">{computedStandings[0].ign}</p>
            <div className="bg-amber-500/20 rounded-lg py-1 px-1.5 border border-amber-500/30">
              <p className="text-sm font-black text-amber-300">
                {sortBy === 'KD' ? `${computedStandings[0].kdRatio} K/D` : `${computedStandings[0].wins} Wins`}
              </p>
              <span className="text-[10px] text-amber-200/80 font-bold block">
                {sortBy === 'KD' ? `${computedStandings[0].wins} Wins • ${computedStandings[0].kills} Kills` : `${computedStandings[0].kdRatio} K/D • ${computedStandings[0].kills} Kills`}
              </span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="bg-[#121824] border border-amber-700/40 rounded-2xl p-3 text-center space-y-1 relative shadow-lg">
            <div className="w-10 h-10 rounded-full bg-amber-800/20 border-2 border-amber-600 flex items-center justify-center mx-auto text-lg shadow">
              🥉
            </div>
            <p className="text-[11px] font-black text-white truncate">{computedStandings[2].ign}</p>
            <div className="bg-[#182030] rounded-lg py-1 px-1.5 border border-white/5">
              <p className="text-xs font-black text-amber-400">
                {sortBy === 'KD' ? `${computedStandings[2].kdRatio} K/D` : `${computedStandings[2].wins} Wins`}
              </p>
              <span className="text-[9px] text-white/40 block">
                {sortBy === 'KD' ? `${computedStandings[2].wins} Wins` : `${computedStandings[2].kdRatio} K/D`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Your Live Position Card */}
      {userStanding && (
        <div className="bg-gradient-to-r from-orange-950/60 via-[#1b1c2e] to-[#141d2c] border border-orange-500/50 rounded-2xl p-3.5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-black text-orange-400 text-base">
              #{userStanding.rank}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{userStanding.ign}</span>
                <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 rounded">YOU</span>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5">
                🏆 <b>{userStanding.wins} Wins</b> • 🎯 <b>{userStanding.kdRatio} K/D</b> • ⚔️ {userStanding.kills} Kills
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-400 font-black block">
              {userStanding.winRate}% Win Rate
            </span>
            <span className="text-[9px] text-orange-400 font-bold uppercase block">
              {userStanding.tier}
            </span>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search warrior by IGN or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121824] border border-[#232f42] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-amber-500"
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

      {/* Detailed Full Standings Table */}
      <div className="bg-[#121824] rounded-2xl p-3 border border-[#232f42] space-y-2">
        <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/40 px-2 tracking-wider">
          <span>Rank & Player</span>
          <div className="flex gap-4">
            <span className={sortBy === 'WINS' ? 'text-amber-400 font-bold' : ''}>Wins</span>
            <span className={sortBy === 'KD' ? 'text-orange-400 font-bold' : ''}>K/D</span>
            <span className={sortBy === 'KILLS' ? 'text-purple-400 font-bold' : ''}>Kills</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {filteredStandings.map((player) => (
            <div
              key={player.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                player.isCurrentUser
                  ? 'bg-orange-500/10 border-orange-500/50 shadow-md'
                  : 'bg-[#161d2a] border-white/5 hover:border-white/20'
              }`}
            >
              {/* Left: Rank & Player Tag */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                    player.rank === 1
                      ? 'bg-amber-400 text-black shadow-sm'
                      : player.rank === 2
                      ? 'bg-slate-300 text-black shadow-sm'
                      : player.rank === 3
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-[#1e293b] text-white/60'
                  }`}
                >
                  #{player.rank}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-white text-[12px] truncate">
                      {player.ign}
                    </p>
                    {player.isCurrentUser && (
                      <span className="bg-orange-500 text-white text-[8px] font-black px-1 rounded shrink-0">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                    <span>@{player.username}</span>
                    <span>•</span>
                    <span className="text-white/60 font-semibold">{player.tier}</span>
                  </div>
                </div>
              </div>

              {/* Right: Wins, K/D Ratio, Kills */}
              <div className="flex items-center gap-4 text-right shrink-0">
                <div className="w-10">
                  <span className={`font-black text-xs block ${sortBy === 'WINS' ? 'text-amber-400 font-extrabold text-sm' : 'text-white'}`}>
                    {player.wins}
                  </span>
                  <span className="text-[8px] text-white/30 uppercase block">Wins</span>
                </div>

                <div className="w-12">
                  <span className={`font-black text-xs block ${sortBy === 'KD' ? 'text-orange-400 font-extrabold text-sm' : 'text-emerald-400'}`}>
                    {player.kdRatio}
                  </span>
                  <span className="text-[8px] text-white/30 uppercase block">K/D</span>
                </div>

                <div className="w-10">
                  <span className={`font-black text-xs block ${sortBy === 'KILLS' ? 'text-purple-400 font-extrabold text-sm' : 'text-white/70'}`}>
                    {player.kills}
                  </span>
                  <span className="text-[8px] text-white/30 uppercase block">Kills</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
