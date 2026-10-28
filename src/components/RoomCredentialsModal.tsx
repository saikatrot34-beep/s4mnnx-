import React, { useState } from 'react';
import { Tournament } from '../types/tournament';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { X, KeyRound, Copy, Check, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';

interface RoomCredentialsModalProps {
  tournament: Tournament;
  onClose: () => void;
}

export const RoomCredentialsModal: React.FC<RoomCredentialsModalProps> = ({
  tournament,
  onClose,
}) => {
  const { getUserParticipant } = useTournaments();
  const participant = getUserParticipant(tournament.id);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const hasCredentials = Boolean(tournament.roomId && tournament.roomPassword);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0f141f] border border-purple-500/40 rounded-3xl w-full max-w-[400px] overflow-hidden shadow-2xl shadow-purple-950/50 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/60 via-[#181d2a] to-indigo-900/60 p-4 border-b border-purple-500/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Custom Room Details</h3>
              <p className="text-[10px] text-purple-300/80">Match #{tournament.matchNumber} • {tournament.map}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* User slot banner */}
          <div className="bg-[#161d2a] rounded-2xl p-3 border border-[#232f42] flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold">Your Registered Slot</p>
              <p className="text-sm font-black text-orange-400 mt-0.5">
                Slot #{participant?.slotNumber || 'Assigned'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase font-bold">Registered IGN</p>
              <p className="text-xs font-bold text-white mt-0.5">{participant?.ign || 'Player'}</p>
            </div>
          </div>

          {hasCredentials ? (
            <div className="space-y-3">
              {/* Room ID */}
              <div className="bg-[#121824] rounded-2xl p-3.5 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-purple-300/80 uppercase font-extrabold tracking-wider">
                    Custom Room ID
                  </p>
                  <p className="text-xl font-black text-white font-mono tracking-wider mt-0.5">
                    {tournament.roomId}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(tournament.roomId || '', 'id')}
                  className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Room Password */}
              <div className="bg-[#121824] rounded-2xl p-3.5 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-purple-300/80 uppercase font-extrabold tracking-wider">
                    Room Password
                  </p>
                  <p className="text-xl font-black text-amber-400 font-mono tracking-wider mt-0.5">
                    {tournament.roomPassword}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(tournament.roomPassword || '', 'pass')}
                  className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedPass ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY PASS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-amber-200">
                Credentials Releasing Soon
              </p>
              <p className="text-[11px] text-amber-200/70 leading-relaxed">
                Room ID and Password are published strictly 15 minutes before the match start time ({tournament.matchTime}).
              </p>
            </div>
          )}

          {/* Quick Steps */}
          <div className="bg-[#151c28] rounded-2xl p-3.5 border border-[#232f42] space-y-2">
            <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              How to Join the Custom Room:
            </p>
            <ol className="text-[11px] text-white/70 space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>Open <b>Free Fire Max</b> on your phone.</li>
              <li>Go to <b>Mode Selection</b> → Tap <b>Custom</b>.</li>
              <li>Tap search icon and paste <b>Room ID</b>.</li>
              <li>Enter <b>Password</b> and tap Join.</li>
              <li>Sit directly in your allotted <b>Slot #{participant?.slotNumber || '1'}</b>!</li>
            </ol>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full bg-[#1e293b] hover:bg-[#28374d] text-white text-xs font-bold py-3 rounded-full transition cursor-pointer"
          >
            GOT IT, CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
