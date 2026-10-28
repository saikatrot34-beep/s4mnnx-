import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { Tournament } from '../types/tournament';
import { sounds } from '../utils/audio';
import { 
  Trophy, Crosshair, KeyRound, Clock, MapPin, 
  CheckCircle, Flame, ExternalLink, Camera, Bell, Timer, Zap, AlertTriangle 
} from 'lucide-react';

interface MyMatchesViewProps {
  onOpenRoomCredentials: (tournament: Tournament) => void;
  onSelectTournament: (tournament: Tournament) => void;
  onBrowseMatches: () => void;
}

export const MyMatchesView: React.FC<MyMatchesViewProps> = ({
  onOpenRoomCredentials,
  onSelectTournament,
  onBrowseMatches,
}) => {
  const { 
    user, 
    tournaments, 
    isUserInTournament, 
    getUserParticipant, 
    triggerTenMinuteAlert,
    fastForwardMatchTimer,
    currentTimeMs 
  } = useTournaments();
  const [tab, setTab] = useState<'UPCOMING' | 'LIVE' | 'COMPLETED'>('UPCOMING');
  const [proofSubmittedMatchId, setProofSubmittedMatchId] = useState<string | null>(null);

  const myTournaments = tournaments.filter((t) => isUserInTournament(t.id));

  const filteredTourneys = myTournaments.filter((t) => {
    if (tab === 'UPCOMING') return t.status === 'UPCOMING';
    if (tab === 'LIVE') return t.status === 'LIVE';
    return t.status === 'COMPLETED';
  });

  const handleSimulateProof = (matchId: string) => {
    sounds.playClick();
    setProofSubmittedMatchId(matchId);
    setTimeout(() => {
      setProofSubmittedMatchId(null);
    }, 3000);
  };

  return (
    <div className="p-4 space-y-4 pb-28 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight">My Matches</h1>
          <p className="text-xs text-white/40">Track your registrations and results</p>
        </div>
        <div className="bg-[#151c28] border border-[#232f42] rounded-full px-3 py-1 text-xs font-bold text-orange-400">
          {myTournaments.length} Joined
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-[#101622] rounded-xl border border-[#1e293b]">
        {(['UPCOMING', 'LIVE', 'COMPLETED'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              sounds.playClick();
              setTab(t);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition uppercase cursor-pointer ${
              tab === t
                ? 'bg-[#1e2a3c] text-orange-400 shadow-sm border border-orange-500/20'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {t === 'UPCOMING'
              ? 'Upcoming'
              : t === 'LIVE'
              ? '🔴 Live'
              : 'Completed'}
          </button>
        ))}
      </div>

      {/* 10-Minute Alert Status Banner */}
      {tab === 'UPCOMING' && myTournaments.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/40 via-[#1a1b2e] to-[#121824] rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-white text-[11px]">10-Min Pre-Match Alerts Active</p>
              <p className="text-[10px] text-white/50">You get an audio & toast reminder 10m before room start</p>
            </div>
          </div>
          <button
            onClick={() => triggerTenMinuteAlert()}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer"
          >
            Test Alert
          </button>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-3">
        {filteredTourneys.length === 0 ? (
          <div className="text-center py-12 bg-[#121824] rounded-2xl border border-[#232f42] p-6 space-y-3">
            <Trophy className="w-10 h-10 text-white/20 mx-auto" />
            <p className="font-bold text-sm text-white/70">
              No {tab.toLowerCase()} matches found
            </p>
            <p className="text-xs text-white/40 max-w-xs mx-auto">
              {tab === 'UPCOMING'
                ? 'You have not joined any upcoming tournaments yet. Join one to claim Booyah cash!'
                : tab === 'LIVE'
                ? 'No matches are currently in progress.'
                : 'You have not completed any tournaments yet.'}
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onBrowseMatches();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-lg shadow-orange-900/30 cursor-pointer"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          filteredTourneys.map((tournament) => {
            const participant = getUserParticipant(tournament.id);
            const targetTime = tournament.scheduledTimestamp || (currentTimeMs + 10.2 * 60 * 1000);
            const remainingMs = Math.max(0, targetTime - currentTimeMs);
            const remainingTotalSec = Math.floor(remainingMs / 1000);
            const remainingMin = Math.floor(remainingTotalSec / 60);
            const remainingSec = remainingTotalSec % 60;
            const isUnder10Min = remainingMs <= 600000 && remainingMs > 0;
            const hasStarted = remainingMs <= 0;

            return (
              <div
                key={tournament.id}
                className="bg-[#121824] border border-[#232f42] rounded-2xl p-4 shadow-md space-y-3 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {tournament.map} • {tournament.mode}
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">
                      #{tournament.matchNumber}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Slot #{participant?.slotNumber || 1}
                  </span>
                </div>

                {/* Title & Info */}
                <div>
                  <h3 className="font-extrabold text-sm text-white">{tournament.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-white/50 mt-1">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>{tournament.matchDate} at {tournament.matchTime}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-orange-400">{tournament.startTime}</span>
                  </div>
                </div>

                {/* Live Match Countdown & 10-Min Timer Status */}
                {tournament.status === 'UPCOMING' && (
                  <div
                    className={`rounded-xl p-2.5 border flex items-center justify-between gap-2.5 transition-all ${
                      isUnder10Min
                        ? 'bg-gradient-to-r from-amber-950/40 via-[#1e172a] to-[#141b29] border-amber-500/50 shadow-inner'
                        : 'bg-[#0d121c] border-[#1e293b]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isUnder10Min
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                            : 'bg-[#151d2a] text-orange-400 border border-[#223046]'
                        }`}
                      >
                        <Timer className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-white/50">
                            {hasStarted ? 'Status' : 'Starts In'}
                          </span>
                          <span
                            className={`text-xs font-black font-mono tracking-wider ${
                              isUnder10Min ? 'text-amber-400' : 'text-white'
                            }`}
                          >
                            {hasStarted
                              ? 'LIVE NOW'
                              : `${remainingMin.toString().padStart(2, '0')}:${remainingSec
                                  .toString()
                                  .padStart(2, '0')}`}
                          </span>
                          {isUnder10Min && (
                            <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 animate-pulse">
                              10M ALERT SENT
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/40 truncate">
                          {hasStarted
                            ? 'Match in progress in Free Fire Max'
                            : isUnder10Min
                            ? 'Room ID & password are ready! Join now.'
                            : 'Toast reminder will alert you at the 10:00 mark'}
                        </p>
                      </div>
                    </div>

                    {/* Fast Forward Test Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fastForwardMatchTimer(tournament.id, 3);
                      }}
                      title="Test 10m Toast Alert in 3 seconds"
                      className="bg-orange-500/15 hover:bg-orange-500/25 active:scale-95 text-orange-300 border border-orange-500/30 text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Test (3s)</span>
                    </button>
                  </div>
                )}

                {/* Performance or Details Banner */}
                {tournament.status === 'COMPLETED' ? (
                  <div className="bg-[#182030] rounded-xl p-3 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Your Result</p>
                      <p className="text-sm font-black text-amber-400 mt-0.5">
                        {participant?.rank === 1
                          ? '👑 BOOYAH! WINNER'
                          : participant?.rank
                          ? `Rank #${participant.rank}`
                          : 'Rank #4'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Kills</p>
                      <p className="text-sm font-black text-white mt-0.5">
                        {participant?.kills ?? 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Won Cash</p>
                      <p className="text-sm font-black text-emerald-400 mt-0.5">
                        ₹{participant?.prizeWon ?? 0}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 bg-[#0d121c] rounded-xl p-2.5 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Prize Pool</p>
                      <p className="font-black text-amber-400">₹{tournament.prizePool}</p>
                    </div>
                    <div className="border-l border-white/5">
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Per Kill</p>
                      <p className="font-black text-orange-400">₹{tournament.perKill}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  {tournament.status !== 'COMPLETED' ? (
                    <button
                      onClick={() => onOpenRoomCredentials(tournament)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30 transition cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>ROOM ID & PASSWORD</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSimulateProof(tournament.id)}
                      className="flex-1 bg-[#1a2332] hover:bg-[#232f42] text-white/90 border border-[#2a374d] text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-orange-400" />
                      <span>
                        {proofSubmittedMatchId === tournament.id
                          ? '✓ Screenshot Verified'
                          : 'Upload Score Screenshot'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectTournament(tournament)}
                    className="bg-[#1f293d] hover:bg-[#28354f] text-white/80 font-bold text-xs py-2.5 px-4 rounded-full transition cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
