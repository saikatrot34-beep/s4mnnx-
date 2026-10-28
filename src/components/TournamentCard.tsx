import React from 'react';
import { Tournament } from '../types/tournament';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { Trophy, Crosshair, Users, Clock, MapPin, KeyRound, CheckCircle2 } from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  onSelect: (tournament: Tournament) => void;
  onOpenRoomCredentials: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onSelect,
  onOpenRoomCredentials,
}) => {
  const { isUserInTournament } = useTournaments();
  const joined = isUserInTournament(tournament.id);
  const isFull = tournament.joinedSlots >= tournament.totalSlots;
  const percentJoined = Math.min(100, Math.round((tournament.joinedSlots / tournament.totalSlots) * 100));

  const getMapBadgeColor = (map: string) => {
    switch (map) {
      case 'BERMUDA':
        return 'from-emerald-600/80 to-teal-800/80 border-emerald-500/40 text-emerald-200';
      case 'PURGATORY':
        return 'from-amber-600/80 to-orange-800/80 border-amber-500/40 text-amber-200';
      case 'KALAHARI':
        return 'from-yellow-600/80 to-amber-900/80 border-yellow-500/40 text-yellow-200';
      case 'ALPINE':
        return 'from-cyan-600/80 to-blue-800/80 border-cyan-500/40 text-cyan-200';
      default:
        return 'from-purple-600/80 to-indigo-800/80 border-purple-500/40 text-purple-200';
    }
  };

  return (
    <div
      onClick={() => {
        sounds.playClick();
        onSelect(tournament);
      }}
      className="bg-[#121824] hover:bg-[#161e2c] border border-[#232f42] rounded-2xl p-4 transition-all duration-200 shadow-md relative overflow-hidden cursor-pointer group active:scale-[0.99]"
    >
      {/* Top Banner Stripe for Live / Joined */}
      {tournament.status === 'LIVE' && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-lg tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          LIVE MATCH
        </div>
      )}

      {joined && tournament.status !== 'LIVE' && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-lg tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          JOINED
        </div>
      )}

      {/* Match Meta: Map & Mode */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border bg-gradient-to-r ${getMapBadgeColor(
              tournament.map
            )} flex items-center gap-1`}
          >
            <MapPin className="w-2.5 h-2.5" />
            {tournament.map}
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#1a2332] text-orange-400 border border-orange-500/30">
            {tournament.mode}
          </span>
        </div>
        <span className="text-[11px] text-white/40 font-semibold">
          #{tournament.matchNumber}
        </span>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h3 className="font-extrabold text-[15px] text-white group-hover:text-orange-400 transition tracking-tight">
          {tournament.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-white/50 mt-1">
          <Clock className="w-3 h-3 text-orange-400" />
          <span>{tournament.matchDate} at {tournament.matchTime}</span>
          <span className="text-white/20">•</span>
          <span className="text-orange-400/90 font-medium">{tournament.startTime}</span>
        </div>
      </div>

      {/* Prize & Entry stats grid */}
      <div className="grid grid-cols-3 gap-2 bg-[#0d121c] rounded-xl p-2.5 border border-[#1a2433] mb-3 text-center">
        <div>
          <p className="text-[10px] text-white/40 uppercase font-semibold">Prize Pool</p>
          <p className="text-sm font-black text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            ₹{tournament.prizePool}
          </p>
        </div>
        <div className="border-x border-white/5">
          <p className="text-[10px] text-white/40 uppercase font-semibold">Per Kill</p>
          <p className="text-sm font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
            <Crosshair className="w-3.5 h-3.5 text-orange-400" />
            ₹{tournament.perKill}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase font-semibold">Entry Fee</p>
          <p className="text-sm font-black text-emerald-400 mt-0.5">
            ₹{tournament.entryFee}
          </p>
        </div>
      </div>

      {/* Slot Fill Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-[11px] mb-1">
          <span className="text-white/50 flex items-center gap-1 font-medium">
            <Users className="w-3 h-3 text-white/40" />
            Slots: <b className="text-white">{tournament.joinedSlots}/{tournament.totalSlots}</b>
          </span>
          <span className={`font-bold ${isFull ? 'text-red-400' : 'text-orange-400'}`}>
            {isFull ? 'Housefull' : `${tournament.totalSlots - tournament.joinedSlots} spots left`}
          </span>
        </div>
        <div className="w-full bg-[#1e293b] rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFull
                ? 'bg-red-500'
                : percentJoined > 80
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-orange-500 to-amber-400'
            }`}
            style={{ width: `${percentJoined}%` }}
          ></div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {joined ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenRoomCredentials(tournament);
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30 transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>ROOM DETAILS</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(tournament);
              }}
              className="bg-[#1f293d] hover:bg-[#28354f] text-white/80 font-bold text-xs py-2.5 px-4 rounded-full transition cursor-pointer"
            >
              INFO
            </button>
          </>
        ) : tournament.status === 'COMPLETED' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tournament);
            }}
            className="w-full bg-[#1a2332] text-white/70 hover:text-white font-bold text-xs py-2.5 rounded-full transition border border-white/10 flex items-center justify-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>VIEW MATCH RESULTS</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tournament);
            }}
            disabled={isFull}
            className={`w-full font-black text-xs py-2.5 rounded-full tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer ${
              isFull
                ? 'bg-[#1e293b] text-white/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#ff8c00] to-[#ff3c00] hover:from-[#ff9e1a] hover:to-[#ff4d1a] text-white shadow-orange-600/30 active:scale-98'
            }`}
          >
            <span>{isFull ? 'MATCH FULL' : `JOIN NOW • ₹${tournament.entryFee}`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
