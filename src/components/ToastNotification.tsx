import React from 'react';
import { ToastAlert } from '../types/tournament';
import { sounds } from '../utils/audio';
import { Clock, KeyRound, X, Bell, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ToastNotificationProps {
  toasts: ToastAlert[];
  onDismiss: (id: string) => void;
  onOpenRoomCredentials: (tournamentId: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
  onOpenRoomCredentials,
}) => {
  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Match Notifications"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[410px] pointer-events-none select-none space-y-2.5"
    >
      {toasts.map((toast) => {
        const isMatchReminder = toast.type === 'MATCH_REMINDER';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-3.5 shadow-2xl transition-all duration-300 animate-in slide-in-from-top-4 border ${
              isMatchReminder
                ? 'bg-[#151226]/95 border-amber-500/80 shadow-orange-950/60 ring-2 ring-orange-500/30'
                : toast.type === 'SUCCESS'
                ? 'bg-[#0f1f1a]/95 border-emerald-500/60 shadow-emerald-950/50'
                : 'bg-[#151c28]/95 border-[#2e3b52] shadow-black/60'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isMatchReminder
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/40 animate-pulse'
                    : toast.type === 'SUCCESS'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/20 text-purple-300'
                }`}
              >
                {isMatchReminder ? (
                  <Clock className="w-5 h-5" />
                ) : toast.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isMatchReminder && (
                    <span className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Starts in 10 Mins
                    </span>
                  )}
                  <h4 className="font-extrabold text-xs text-white tracking-tight truncate">
                    {toast.title}
                  </h4>
                </div>

                <p className="text-[11px] text-white/80 mt-1 leading-snug">
                  {toast.message}
                </p>

                {/* Pre-Match Action Button */}
                {isMatchReminder && toast.tournamentId && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenRoomCredentials(toast.tournamentId!);
                        onDismiss(toast.id);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-950/40 transition active:scale-95 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>View Room ID & Password</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onDismiss(toast.id);
                }}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
