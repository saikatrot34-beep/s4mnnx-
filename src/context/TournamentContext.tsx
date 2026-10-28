import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tournament, UserProfile, Transaction, DepositRequest, WithdrawalRequest, Participant, ReferralRecord, ToastAlert } from '../types/tournament';
import { INITIAL_USER, INITIAL_TOURNAMENTS, INITIAL_TRANSACTIONS, INITIAL_REFERRALS } from '../data/mockTournaments';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TournamentContextType {
  user: UserProfile;
  tournaments: Tournament[];
  transactions: Transaction[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  referrals: ReferralRecord[];
  toasts: ToastAlert[];
  isAuthenticated: boolean;
  activeTab: 'home' | 'my-matches' | 'wallet' | 'leaderboard' | 'refer' | 'admin' | 'profile';
  setActiveTab: (tab: 'home' | 'my-matches' | 'wallet' | 'leaderboard' | 'refer' | 'admin' | 'profile') => void;
  authView: 'login' | 'signup' | 'app';
  setAuthView: (view: 'login' | 'signup' | 'app') => void;
  login: (username: string, password?: string) => boolean;
  signup: (userData: { username: string; fullName: string; phone: string; email: string; ign: string; uid: string; promoCode?: string }) => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  joinTournament: (tournamentId: string, ign: string, uid: string) => { success: boolean; message: string };
  addDeposit: (amount: number, method: string, utr: string) => void;
  requestWithdrawal: (amount: number, method: 'UPI' | 'BANK', details: { upiId?: string; accountNumber?: string; ifscCode?: string; accountHolder?: string }) => { success: boolean; message: string };
  simulateReferral: (friendUsername?: string, friendIgn?: string) => { success: boolean; bonus: number; friendName: string };
  addToast: (toast: Omit<ToastAlert, 'id'>) => string;
  dismissToast: (id: string) => void;
  triggerTenMinuteAlert: (tournamentId?: string) => void;
  fastForwardMatchTimer: (tournamentId: string, secondsUntilTenMin?: number) => void;
  currentTimeMs: number;
  // Admin actions
  updateRoomCredentials: (tournamentId: string, roomId: string, roomPassword: string) => void;
  createTournament: (newTourney: Omit<Tournament, 'id' | 'joinedSlots' | 'participants'>) => void;
  declareMatchResult: (
    tournamentId: string,
    results: { userId: string; username: string; ign: string; rank: number; kills: number }[]
  ) => void;
  approveDeposit: (depositId: string) => void;
  rejectDeposit: (depositId: string) => void;
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string) => void;
  resetAllData: () => void;
  isUserInTournament: (tournamentId: string) => boolean;
  getUserParticipant: (tournamentId: string) => Participant | undefined;
}

const STORAGE_KEYS = {
  USER: 'skillwar_user_v2',
  TOURNAMENTS: 'skillwar_tournaments_v2',
  TRANSACTIONS: 'skillwar_transactions_v2',
  DEPOSITS: 'skillwar_deposits_v2',
  WITHDRAWALS: 'skillwar_withdrawals_v2',
  REFERRALS: 'skillwar_referrals_v2',
  AUTH: 'skillwar_auth_v2',
};

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_USER;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_TOURNAMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_REFERRALS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === 'true';
  });

  const [authView, setAuthView] = useState<'login' | 'signup' | 'app'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === 'true' ? 'app' : 'login';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'my-matches' | 'wallet' | 'leaderboard' | 'refer' | 'admin' | 'profile'>('home');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());
  const [notifiedMatches, setNotifiedMatches] = useState<string[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (toast: Omit<ToastAlert, 'id'>): string => {
    const id = `toast_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newToast: ToastAlert = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || (toast.type === 'MATCH_REMINDER' ? 14000 : 5000);
    setTimeout(() => {
      dismissToast(id);
    }, duration);

    return id;
  };

  const triggerTenMinuteAlert = (tournamentId?: string) => {
    const target = tournamentId
      ? tournaments.find((t) => t.id === tournamentId)
      : tournaments.find((t) => t.status === 'UPCOMING' && t.participants.some((p) => p.userId === user.id || p.username.toLowerCase() === user.username.toLowerCase())) || tournaments[0];

    if (!target) return;

    sounds.playAlert();
    addToast({
      type: 'MATCH_REMINDER',
      title: `⏰ 10-Min Alert: ${target.title}`,
      message: `Match starts in 10 minutes! Custom Room ID (${target.roomId || '9482103'}) and Password (${target.roomPassword || '778'}) are now ready. Open Free Fire Max and sit in your slot!`,
      tournamentId: target.id,
      tournamentTitle: target.title,
      roomId: target.roomId,
      roomPassword: target.roomPassword,
      minutesRemaining: 10,
      duration: 15000,
    });
  };

  // Real-time ticking timer loop: checks every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTimeMs(now);

      if (!isAuthenticated) return;

      tournaments.forEach((tourney) => {
        if (tourney.status !== 'UPCOMING') return;

        const isUserJoined = tourney.participants.some(
          (p) => p.userId === user.id || p.username.toLowerCase() === user.username.toLowerCase()
        );
        if (!isUserJoined) return;

        const targetTime = tourney.scheduledTimestamp || (now + 10.2 * 60 * 1000);
        const remainingMs = targetTime - now;

        // 10 minutes = 600,000 ms. Trigger when remainingMs <= 600,000 and > 0
        if (remainingMs <= 600000 && remainingMs > 0) {
          if (!notifiedMatches.includes(tourney.id)) {
            setNotifiedMatches((prev) => [...prev, tourney.id]);
            sounds.playAlert();
            addToast({
              type: 'MATCH_REMINDER',
              title: `⏰ 10-Min Pre-Match Alert: ${tourney.title}`,
              message: `Your match starts in 10 minutes! Room ID (${tourney.roomId || '9482103'}) & Password (${tourney.roomPassword || '778'}) are unlocked. Join your allotted slot now!`,
              tournamentId: tourney.id,
              tournamentTitle: tourney.title,
              roomId: tourney.roomId,
              roomPassword: tourney.roomPassword,
              minutesRemaining: Math.ceil(remainingMs / 60000),
              duration: 15000,
            });
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, tournaments, user, notifiedMatches]);

  const fastForwardMatchTimer = (tournamentId: string, secondsUntilTenMin: number = 3) => {
    sounds.playClick();
    // Set scheduledTimestamp so that countdown reaches 10m in exactly `secondsUntilTenMin` seconds
    const target = Date.now() + 600000 + secondsUntilTenMin * 1000;

    // Reset notification tracker for this match to test again
    setNotifiedMatches((prev) => prev.filter((id) => id !== tournamentId));

    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, scheduledTimestamp: target } : t))
    );

    addToast({
      type: 'INFO',
      title: 'Timer Fast-Forwarded!',
      message: `Match countdown set to 10:0${secondsUntilTenMin}. In ${secondsUntilTenMin}s, timer will hit 10:00 and fire the pre-match toast alert!`,
      duration: 4000,
    });
  };

  const login = (username: string) => {
    sounds.playClick();
    const cleanUser = username.trim() || 's4mnxx';
    setUser((prev) => ({
      ...prev,
      username: cleanUser,
    }));
    setIsAuthenticated(true);
    setAuthView('app');
    return true;
  };

  const signup = (userData: {
    username: string;
    fullName: string;
    phone: string;
    email: string;
    ign: string;
    uid: string;
    promoCode?: string;
  }) => {
    sounds.playClick();
    const cleanUsername = userData.username.trim() || 's4mnxx';
    const hasPromo = Boolean(userData.promoCode && userData.promoCode.trim().length > 0);
    const signupBonus = hasPromo ? 40 : 30; // Extra ₹10 welcome bonus when using referral code!

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      fullName: userData.fullName || 'Free Fire Champion',
      email: userData.email || `${cleanUsername}@skillwar.gg`,
      phone: userData.phone || '+91 99999 88888',
      ign: userData.ign || `亗 ${cleanUsername.toUpperCase()} 亗`,
      uid: userData.uid || '2948192041',
      depositBalance: signupBonus,
      winningBalance: 0.0,
      pendingBalance: 0,
      matchesPlayed: 0,
      totalKills: 0,
      booyahCount: 0,
      isAdmin: false,
      referralCode: `SKILL-${cleanUsername.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`,
      referredBy: hasPromo ? userData.promoCode : undefined,
      referralEarnings: 0,
      referralsCount: 0,
    };
    setUser(newUser);

    // Add welcome transaction
    const welcomeTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: newUser.id,
      type: 'DEPOSIT',
      amount: signupBonus,
      description: hasPromo
        ? `Skill War Welcome (₹30) + Referral Booster (₹10) [Code: ${userData.promoCode}]`
        : 'Skill War Signup Bonus ₹30 Added',
      status: 'SUCCESS',
      createdAt: 'Just now',
      paymentMethod: hasPromo ? 'Referral Bonus' : 'Promo Bonus',
    };
    setTransactions((prev) => [welcomeTx, ...prev]);
    setIsAuthenticated(true);
    setAuthView('app');
    try {
      confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
    } catch { /* ignore */ }
    return true;
  };

  const simulateReferral = (friendUsername?: string, friendIgn?: string) => {
    sounds.playCoin();
    const demoPool = [
      { username: 'sk_vampire', ign: '⚡VAMPIRE_FF⚡' },
      { username: 'ff_pro_gamer', ign: '꧁༺PRO×BOY༻꧂' },
      { username: 'hunter_op', ign: '乂HUNTER乂' },
      { username: 'rohit_ff99', ign: 'ROHIT★KILLER' },
      { username: 'headshot_god', ign: 'HEADSHOT•GOD' },
      { username: 'sniper_queen', ign: '★SNIPER×QUEEN★' },
    ];
    const pick = demoPool[Math.floor(Math.random() * demoPool.length)];
    const chosenUsername = friendUsername || pick.username;
    const chosenIgn = friendIgn || pick.ign;
    const bonus = 25; // ₹25 per referral!

    // Credit bonus directly to user's deposit balance so they can enter matches!
    setUser((prev) => ({
      ...prev,
      depositBalance: prev.depositBalance + bonus,
      referralEarnings: (prev.referralEarnings || 0) + bonus,
      referralsCount: (prev.referralsCount || 0) + 1,
    }));

    const newRecord: ReferralRecord = {
      id: `ref_${Date.now()}`,
      friendUsername: chosenUsername,
      friendIgn: chosenIgn,
      bonusAmount: bonus,
      signedUpAt: 'Just now',
      status: 'CREDITED',
    };

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'REFERRAL_BONUS',
      amount: bonus,
      description: `Referral Bonus: @${chosenUsername} joined with code ${user.referralCode || 'SKILL-S4MNXX'}`,
      status: 'SUCCESS',
      createdAt: 'Just now',
    };

    setReferrals((prev) => [newRecord, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch { /* ignore */ }

    return {
      success: true,
      bonus,
      friendName: chosenUsername,
    };
  };

  const logout = () => {
    sounds.playClick();
    setIsAuthenticated(false);
    setAuthView('login');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const isUserInTournament = (tournamentId: string): boolean => {
    const tourney = tournaments.find((t) => t.id === tournamentId);
    if (!tourney) return false;
    return tourney.participants.some((p) => p.userId === user.id || p.username.toLowerCase() === user.username.toLowerCase());
  };

  const getUserParticipant = (tournamentId: string): Participant | undefined => {
    const tourney = tournaments.find((t) => t.id === tournamentId);
    if (!tourney) return undefined;
    return tourney.participants.find((p) => p.userId === user.id || p.username.toLowerCase() === user.username.toLowerCase());
  };

  const joinTournament = (tournamentId: string, ign: string, uid: string): { success: boolean; message: string } => {
    const tourney = tournaments.find((t) => t.id === tournamentId);
    if (!tourney) {
      return { success: false, message: 'Tournament not found' };
    }

    if (tourney.status === 'COMPLETED' || tourney.status === 'CANCELLED') {
      return { success: false, message: 'Tournament has already ended' };
    }

    if (tourney.joinedSlots >= tourney.totalSlots) {
      return { success: false, message: 'Match is already full (Housefull)' };
    }

    if (isUserInTournament(tournamentId)) {
      return { success: false, message: 'You have already joined this match!' };
    }

    const totalBalance = user.depositBalance + user.winningBalance;
    if (totalBalance < tourney.entryFee) {
      return {
        success: false,
        message: `Insufficient balance! You need ₹${tourney.entryFee}. Your balance is ₹${totalBalance.toFixed(2)}. Please add money.`,
      };
    }

    // Deduct entry fee: prioritize deposit balance, then winning balance
    let deductDeposit = 0;
    let deductWinning = 0;

    if (user.depositBalance >= tourney.entryFee) {
      deductDeposit = tourney.entryFee;
    } else {
      deductDeposit = user.depositBalance;
      deductWinning = tourney.entryFee - user.depositBalance;
    }

    setUser((prev) => ({
      ...prev,
      depositBalance: Math.max(0, prev.depositBalance - deductDeposit),
      winningBalance: Math.max(0, prev.winningBalance - deductWinning),
      matchesPlayed: prev.matchesPlayed + 1,
      ign: ign || prev.ign,
      uid: uid || prev.uid,
    }));

    const newParticipant: Participant = {
      id: `p_${Date.now()}`,
      userId: user.id,
      username: user.username,
      ign: ign || user.ign || user.username,
      uid: uid || user.uid || '123456789',
      slotNumber: tourney.joinedSlots + 1,
      joinedAt: 'Just now',
    };

    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            joinedSlots: t.joinedSlots + 1,
            participants: [...t.participants, newParticipant],
          };
        }
        return t;
      })
    );

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'ENTRY_FEE',
      amount: tourney.entryFee,
      description: `Joined ${tourney.title} (${tourney.mode})`,
      status: 'SUCCESS',
      createdAt: 'Just now',
      tournamentId: tourney.id,
    };
    setTransactions((prev) => [tx, ...prev]);

    sounds.playJoin();
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    } catch { /* ignore */ }

    addToast({
      type: 'SUCCESS',
      title: 'Joined Match Successfully!',
      message: `Slot #${newParticipant.slotNumber} allocated for ${tourney.title}. You will receive a toast alert 10 minutes before the match!`,
      tournamentId: tourney.id,
      duration: 6000,
    });

    // Schedule 10-minute pre-match toast alert
    setTimeout(() => {
      triggerTenMinuteAlert(tourney.id);
    }, 7000);

    return { success: true, message: `Successfully registered for ${tourney.title}! Slot #${newParticipant.slotNumber}` };
  };

  const addDeposit = (amount: number, method: string, utr: string) => {
    sounds.playCoin();
    // Simulate instantaneous verified UPI deposit
    setUser((prev) => ({
      ...prev,
      depositBalance: prev.depositBalance + amount,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'DEPOSIT',
      amount,
      description: `Deposit via ${method} (Instant UPI)`,
      status: 'SUCCESS',
      createdAt: 'Just now',
      utr,
      paymentMethod: method,
    };

    const depositReq: DepositRequest = {
      id: `dep_${Date.now()}`,
      userId: user.id,
      username: user.username,
      amount,
      method,
      utr,
      status: 'APPROVED',
      createdAt: 'Just now',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setDeposits((prev) => [depositReq, ...prev]);

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch { /* ignore */ }
  };

  const requestWithdrawal = (
    amount: number,
    method: 'UPI' | 'BANK',
    details: { upiId?: string; accountNumber?: string; ifscCode?: string; accountHolder?: string }
  ): { success: boolean; message: string } => {
    if (amount < 50) {
      return { success: false, message: 'Minimum withdrawal amount is ₹50' };
    }

    if (user.winningBalance < amount) {
      return {
        success: false,
        message: `Insufficient winning balance! You can only withdraw winnings (₹${user.winningBalance.toFixed(2)} available). Deposit cash must be used in tournaments.`,
      };
    }

    sounds.playClick();

    // Deduct winning balance immediately
    setUser((prev) => ({
      ...prev,
      winningBalance: prev.winningBalance - amount,
    }));

    const withdrawReq: WithdrawalRequest = {
      id: `wth_${Date.now()}`,
      userId: user.id,
      username: user.username,
      amount,
      method,
      upiId: details.upiId,
      accountNumber: details.accountNumber,
      ifscCode: details.ifscCode,
      accountHolder: details.accountHolder,
      status: 'PENDING',
      requestedAt: 'Just now',
    };

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'WITHDRAWAL',
      amount,
      description: `Withdrawal to ${method === 'UPI' ? details.upiId : 'Bank A/c ' + details.accountNumber?.slice(-4)}`,
      status: 'PENDING',
      createdAt: 'Just now',
    };

    setWithdrawals((prev) => [withdrawReq, ...prev]);
    setTransactions((prev) => [tx, ...prev]);

    return {
      success: true,
      message: `Withdrawal request for ₹${amount} submitted! It will be credited within 10-30 minutes.`,
    };
  };

  // ADMIN METHODS
  const updateRoomCredentials = (tournamentId: string, roomId: string, roomPassword: string) => {
    sounds.playClick();
    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, roomId, roomPassword } : t))
    );
  };

  const createTournament = (newTourney: Omit<Tournament, 'id' | 'joinedSlots' | 'participants'>) => {
    sounds.playClick();
    const tournament: Tournament = {
      ...newTourney,
      id: `ff-match-${Date.now()}`,
      joinedSlots: 0,
      participants: [],
    };
    setTournaments((prev) => [tournament, ...prev]);
  };

  const declareMatchResult = (
    tournamentId: string,
    results: { userId: string; username: string; ign: string; rank: number; kills: number }[]
  ) => {
    const tourney = tournaments.find((t) => t.id === tournamentId);
    if (!tourney) return;

    sounds.playBooyah();

    // Calculate prizes
    let totalPrizeCreditedToCurrentUser = 0;

    const updatedParticipants = tourney.participants.map((p) => {
      const res = results.find((r) => r.userId === p.userId || r.username.toLowerCase() === p.username.toLowerCase());
      if (res) {
        let prize = res.kills * tourney.perKill;
        if (res.rank === 1) prize += tourney.booyahPrize;
        else if (res.rank === 2) prize += tourney.runnerUpPrize;
        else if (res.rank === 3) prize += tourney.thirdPrize;

        if (p.userId === user.id || p.username.toLowerCase() === user.username.toLowerCase()) {
          totalPrizeCreditedToCurrentUser += prize;
        }

        return {
          ...p,
          rank: res.rank,
          kills: res.kills,
          prizeWon: prize,
        };
      }
      return p;
    });

    if (totalPrizeCreditedToCurrentUser > 0) {
      setUser((prev) => ({
        ...prev,
        winningBalance: prev.winningBalance + totalPrizeCreditedToCurrentUser,
        booyahCount: prev.booyahCount + (results.find((r) => r.userId === prev.id)?.rank === 1 ? 1 : 0),
        totalKills: prev.totalKills + (results.find((r) => r.userId === prev.id)?.kills || 0),
      }));

      const winTx: Transaction = {
        id: `tx_${Date.now()}`,
        userId: user.id,
        type: 'WINNING',
        amount: totalPrizeCreditedToCurrentUser,
        description: `Winnings for ${tourney.title}`,
        status: 'SUCCESS',
        createdAt: 'Just now',
        tournamentId: tourney.id,
      };
      setTransactions((prev) => [winTx, ...prev]);
    }

    setTournaments((prev) =>
      prev.map((t) => (t.id === tournamentId ? { ...t, status: 'COMPLETED', participants: updatedParticipants } : t))
    );

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch { /* ignore */ }
  };

  const approveDeposit = (depositId: string) => {
    sounds.playCoin();
    setDeposits((prev) =>
      prev.map((d) => (d.id === depositId ? { ...d, status: 'APPROVED' } : d))
    );
  };

  const rejectDeposit = (depositId: string) => {
    sounds.playClick();
    setDeposits((prev) =>
      prev.map((d) => (d.id === depositId ? { ...d, status: 'REJECTED' } : d))
    );
  };

  const approveWithdrawal = (withdrawalId: string) => {
    sounds.playCoin();
    const withdraw = withdrawals.find((w) => w.id === withdrawalId);
    if (withdraw) {
      setTransactions((prev) =>
        prev.map((t) => (t.description.includes(withdraw.amount.toString()) && t.status === 'PENDING' ? { ...t, status: 'SUCCESS' } : t))
      );
    }
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'APPROVED' } : w))
    );
  };

  const rejectWithdrawal = (withdrawalId: string) => {
    sounds.playClick();
    const withdraw = withdrawals.find((w) => w.id === withdrawalId);
    if (withdraw && withdraw.userId === user.id) {
      // Refund back to winning balance
      setUser((prev) => ({
        ...prev,
        winningBalance: prev.winningBalance + withdraw.amount,
      }));
    }
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'REJECTED' } : w))
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOURNAMENTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.DEPOSITS);
    localStorage.removeItem(STORAGE_KEYS.WITHDRAWALS);
    localStorage.removeItem(STORAGE_KEYS.REFERRALS);
    setUser(INITIAL_USER);
    setTournaments(INITIAL_TOURNAMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setDeposits([]);
    setWithdrawals([]);
    setReferrals(INITIAL_REFERRALS);
    sounds.playClick();
  };

  return (
    <TournamentContext.Provider
      value={{
        user,
        tournaments,
        transactions,
        deposits,
        withdrawals,
        referrals,
        toasts,
        isAuthenticated,
        activeTab,
        setActiveTab,
        authView,
        setAuthView,
        login,
        signup,
        logout,
        updateUserProfile,
        joinTournament,
        addDeposit,
        requestWithdrawal,
        simulateReferral,
        addToast,
        dismissToast,
        triggerTenMinuteAlert,
        fastForwardMatchTimer,
        currentTimeMs,
        updateRoomCredentials,
        createTournament,
        declareMatchResult,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        resetAllData,
        isUserInTournament,
        getUserParticipant,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournaments = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournaments must be used within a TournamentProvider');
  }
  return context;
};
