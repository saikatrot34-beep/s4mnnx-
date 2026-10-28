import React, { useState } from 'react';
import { TournamentProvider, useTournaments } from './context/TournamentContext';
import { LoginView } from './components/LoginView';
import { SignupView } from './components/SignupView';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { WalletView } from './components/WalletView';
import { MyMatchesView } from './components/MyMatchesView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { ReferView } from './components/ReferView';
import { BottomNav } from './components/BottomNav';
import { TournamentDetailsModal } from './components/TournamentDetailsModal';
import { RoomCredentialsModal } from './components/RoomCredentialsModal';
import { AddMoneyModal } from './components/AddMoneyModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AdminPanel } from './components/AdminPanel';
import { ToastNotification } from './components/ToastNotification';
import { Tournament } from './types/tournament';
import { Smartphone, Monitor } from 'lucide-react';

const MainApp: React.FC = () => {
  const { authView, activeTab, setActiveTab, toasts, dismissToast, tournaments } = useTournaments();

  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [credentialsTournament, setCredentialsTournament] = useState<Tournament | null>(null);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState(false);

  // If in auth flow
  if (authView === 'login') {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="w-full max-w-[420px] min-h-screen bg-black">
          <LoginView onAdminOpen={() => setShowAdmin(true)} />
          {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
        </div>
      </div>
    );
  }

  if (authView === 'signup') {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="w-full max-w-[420px] min-h-screen bg-black">
          <SignupView />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#05070a] text-white flex flex-col justify-center items-center ${deviceFrame ? 'p-4' : ''}`}>
      {/* Device frame toggle indicator for desktop testers */}
      <div className="hidden lg:flex fixed top-4 right-4 z-50 bg-[#121824] border border-[#232f42] rounded-full p-1.5 shadow-xl items-center gap-1 text-xs">
        <button
          onClick={() => setDeviceFrame(false)}
          className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1.5 ${
            !deviceFrame ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Fluid</span>
        </button>
        <button
          onClick={() => setDeviceFrame(true)}
          className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1.5 ${
            deviceFrame ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone Frame</span>
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-[440px] min-h-screen bg-[#070a0f] flex flex-col relative ${
          deviceFrame ? 'rounded-[40px] border-[6px] border-[#1e293b] shadow-2xl overflow-hidden my-4 max-h-[880px]' : ''
        }`}
      >
        {/* Gaming App Header */}
        <Header onAdminClick={() => setShowAdmin(true)} />

        {/* Floating Toast Notification System */}
        <ToastNotification
          toasts={toasts}
          onDismiss={dismissToast}
          onOpenRoomCredentials={(tId) => {
            const found = tournaments.find((t) => t.id === tId);
            if (found) setCredentialsTournament(found);
          }}
        />

        {/* View Routing */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'home' && (
            <HomeView
              onSelectTournament={(tourney) => setSelectedTournament(tourney)}
              onOpenRoomCredentials={(tourney) => setCredentialsTournament(tourney)}
            />
          )}

          {activeTab === 'my-matches' && (
            <MyMatchesView
              onOpenRoomCredentials={(tourney) => setCredentialsTournament(tourney)}
              onSelectTournament={(tourney) => setSelectedTournament(tourney)}
              onBrowseMatches={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'wallet' && (
            <WalletView
              onOpenAddMoney={() => setShowAddMoney(true)}
              onOpenWithdraw={() => setShowWithdraw(true)}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'leaderboard' && <LeaderboardView />}

          {activeTab === 'refer' && <ReferView />}

          {activeTab === 'profile' && (
            <ProfileView onOpenAdmin={() => setShowAdmin(true)} />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Fixed WhatsApp Support Floating Button */}
        <a
          href="https://wa.me/919883184962?text=Hi%20Skill%20War%20Support"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-4 z-50 bg-green-500 hover:bg-green-600 active:scale-95 transition-transform duration-150 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl text-2xl select-none"
          title="WhatsApp Support +91 9883184962"
          aria-label="WhatsApp Support"
        >
          💬
        </a>

        {/* Modals & Dialogs */}
        {selectedTournament && (
          <TournamentDetailsModal
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
            onOpenRoomCredentials={(tourney) => {
              setSelectedTournament(null);
              setCredentialsTournament(tourney);
            }}
            onGoToWallet={() => {
              setSelectedTournament(null);
              setShowAddMoney(true);
            }}
          />
        )}

        {credentialsTournament && (
          <RoomCredentialsModal
            tournament={credentialsTournament}
            onClose={() => setCredentialsTournament(null)}
          />
        )}

        {showAddMoney && (
          <AddMoneyModal onClose={() => setShowAddMoney(false)} />
        )}

        {showWithdraw && (
          <WithdrawModal onClose={() => setShowWithdraw(false)} />
        )}

        {showAdmin && (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <MainApp />
    </TournamentProvider>
  );
}
