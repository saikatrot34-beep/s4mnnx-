export type MatchMode = 'SOLO' | 'DUO' | 'SQUAD';
export type MatchMap = 'BERMUDA' | 'PURGATORY' | 'KALAHARI' | 'ALPINE' | 'NEXTERRA';
export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface Participant {
  id: string;
  userId: string;
  username: string;
  ign: string; // In-Game Name
  uid: string; // Free Fire Player UID
  slotNumber: number;
  joinedAt: string;
  kills?: number;
  rank?: number;
  prizeWon?: number;
}

export interface Tournament {
  id: string;
  matchNumber: number;
  title: string;
  map: MatchMap;
  mode: MatchMode;
  version: 'FREE FIRE MAX';
  entryFee: number;
  prizePool: number;
  perKill: number;
  booyahPrize: number;
  runnerUpPrize: number;
  thirdPrize: number;
  totalSlots: number;
  joinedSlots: number;
  participants: Participant[];
  status: MatchStatus;
  startTime: string; // ISO date string or formatted time
  matchDate: string;
  matchTime: string;
  scheduledTimestamp?: number; // Target start time in ms epoch for timer-based notifications
  roomId?: string;
  roomPassword?: string;
  credentialsVisibleBeforeMins?: number;
  rules: string[];
  bannerUrl?: string;
}

export interface ReferralRecord {
  id: string;
  friendUsername: string;
  friendIgn: string;
  bonusAmount: number;
  signedUpAt: string;
  status: 'CREDITED';
}

export interface ToastAlert {
  id: string;
  type: 'MATCH_REMINDER' | 'SUCCESS' | 'INFO';
  title: string;
  message: string;
  tournamentId?: string;
  tournamentTitle?: string;
  minutesRemaining?: number;
  roomId?: string;
  roomPassword?: string;
  duration?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'ENTRY_FEE' | 'WINNING' | 'WITHDRAWAL' | 'REFERRAL_BONUS';
  amount: number;
  description: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: string;
  utr?: string;
  paymentMethod?: string;
  tournamentId?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  ign: string;
  uid: string;
  depositBalance: number;
  winningBalance: number;
  pendingBalance: number;
  matchesPlayed: number;
  totalKills: number;
  booyahCount: number;
  isAdmin?: boolean;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  referralsCount: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: 'UPI' | 'BANK';
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolder?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: string;
  utr: string;
  screenshotUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
