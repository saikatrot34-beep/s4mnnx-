import React from 'react';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { Swords, Trophy, Wallet, User, Award, Gift } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, tournaments, isUserInTournament } = useTournaments();

  const joinedCount = tournaments.filter((t) => isUserInTournament(t.id)).length;

  interface NavItem {
    id: 'home' | 'my-matches' | 'wallet' | 'refer' | 'profile';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    tag?: string;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Matches', icon: Swords },
    { id: 'my-matches', label: 'Joined', icon: Trophy, badge: joinedCount > 0 ? joinedCount : undefined },
    { id: 'refer', label: 'Refer', icon: Gift, tag: '₹25' },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c1017]/95 backdrop-blur-lg border-t border-[#1e293b] py-2 px-3 max-w-[440px] mx-auto select-none">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 relative cursor-pointer ${
                isActive
                  ? 'text-orange-400 scale-105'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-tr from-orange-500 to-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
                {item.tag && (
                  <span className="absolute -top-2 -right-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[8px] font-black px-1 rounded-full shadow animate-pulse">
                    {item.tag}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-orange-400' : 'text-white/40'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-orange-400 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
