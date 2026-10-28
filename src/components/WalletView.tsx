import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, 
  Clock, CheckCircle, AlertCircle, Sparkles, Filter, Gift, ArrowRight 
} from 'lucide-react';

interface WalletViewProps {
  onOpenAddMoney: () => void;
  onOpenWithdraw: () => void;
  onBack: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  onOpenAddMoney,
  onOpenWithdraw,
  onBack,
}) => {
  const { user, transactions, setActiveTab } = useTournaments();
  const [filter, setFilter] = useState<'ALL' | 'DEPOSIT' | 'WINNING' | 'ENTRY_FEE' | 'WITHDRAWAL' | 'REFERRAL_BONUS'>('ALL');

  const totalBalance = (user.depositBalance + user.winningBalance).toFixed(2);
  const depositBalance = user.depositBalance.toFixed(2);
  const winningBalance = user.winningBalance.toFixed(2);

  const filteredTx = transactions.filter((t) => (filter === 'ALL' ? true : t.type === filter));

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'WINNING':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'REFERRAL_BONUS':
        return <Gift className="w-4 h-4 text-purple-400" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="w-4 h-4 text-purple-400" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-orange-400" />;
    }
  };

  const getAmountColor = (type: string) => {
    if (type === 'DEPOSIT' || type === 'WINNING' || type === 'REFERRAL_BONUS') return 'text-emerald-400';
    return 'text-white/80';
  };

  return (
    <div className="p-4 space-y-4 pb-28 select-none">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="w-8 h-8 bg-[#1a2332] hover:bg-[#232f42] rounded-full flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-black text-white tracking-tight">My Wallet</h1>
      </div>

      {/* Main Balance Card (matching prompt's bg-[#151a23] rounded-[20px] p-5 border border-[#1e293b]) */}
      <div className="bg-[#151a23] rounded-[22px] p-5 border border-[#1e293b] shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Balance</p>
            <p className="text-3xl font-black mt-1 text-white tracking-tight font-heading">
              ₹<span id="wb">{totalBalance}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <p className="text-[11px] text-white/30 mt-2 font-medium">
          Pending: ₹<span id="wp">{user.pendingBalance.toFixed(2)}</span>
        </p>

        {/* Deposit vs Winning Cash Breakdown */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
          <div className="bg-[#0f141f] rounded-xl p-3 border border-white/5">
            <span className="text-[10px] text-white/40 uppercase font-semibold block">Deposit Cash</span>
            <span className="text-sm font-black text-white mt-0.5 block">₹{depositBalance}</span>
            <span className="text-[9px] text-white/30 block mt-0.5">Use in tournaments</span>
          </div>

          <div className="bg-[#0f141f] rounded-xl p-3 border border-amber-500/20">
            <span className="text-[10px] text-amber-400/80 uppercase font-semibold block">Winning Cash</span>
            <span className="text-sm font-black text-amber-400 mt-0.5 block">₹{winningBalance}</span>
            <span className="text-[9px] text-emerald-400/80 block mt-0.5">100% Withdrawable</span>
          </div>
        </div>

        {/* Action Buttons: Add Money & Withdraw */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAddMoney();
            }}
            className="bg-[#ff8c00] hover:bg-[#ff9e1a] text-white rounded-full py-3.5 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-orange-600/30 transition cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>ADD MONEY</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenWithdraw();
            }}
            className="bg-[#1a2332] hover:bg-[#232f42] text-white border border-[#2a374d] rounded-full py-3.5 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
          >
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
            <span>WITHDRAW</span>
          </button>
        </div>
      </div>

      {/* Refer & Earn Wallet Booster Card */}
      <div 
        onClick={() => {
          sounds.playClick();
          setActiveTab('refer');
        }}
        className="bg-gradient-to-r from-purple-950/70 via-[#181a2e] to-[#121824] rounded-2xl p-3.5 border border-purple-500/30 flex items-center justify-between cursor-pointer group hover:border-purple-400 transition shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition">
            <Gift className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-black text-white">Referral Bonus Cash</p>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 rounded">
                +₹{user.referralEarnings || 50}
              </span>
            </div>
            <p className="text-[10px] text-white/50">
              Code: <span className="font-mono text-amber-300 font-bold">{user.referralCode || 'SKILL-S4MNXX'}</span> • {user.referralsCount || 2} friends joined
            </p>
          </div>
        </div>

        <div className="bg-purple-600/30 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 group-hover:bg-purple-600 group-hover:text-white transition">
          <span>INVITE</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#151a23] rounded-2xl p-4 border border-[#1e293b] space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase text-white/70 tracking-wider">
            Recent Transactions
          </p>
          <div className="flex items-center gap-1 text-[11px] text-white/40">
            <Filter className="w-3 h-3" />
            <span>{filteredTx.length} records</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[10px]">
          {(['ALL', 'DEPOSIT', 'WINNING', 'ENTRY_FEE', 'WITHDRAWAL', 'REFERRAL_BONUS'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                sounds.playClick();
                setFilter(type);
              }}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                filter === type
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#1f2838] text-white/50 hover:text-white'
              }`}
            >
              {type === 'ALL'
                ? 'All'
                : type === 'DEPOSIT'
                ? 'Deposits'
                : type === 'WINNING'
                ? 'Winnings'
                : type === 'ENTRY_FEE'
                ? 'Entry Fees'
                : type === 'WITHDRAWAL'
                ? 'Withdrawals'
                : 'Referral Bonus'}
            </button>
          ))}
        </div>

        {/* Transaction Items */}
        <div id="txList" className="space-y-2 pt-1">
          {filteredTx.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-xs">
              No transactions found
            </div>
          ) : (
            filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#0f141f] rounded-xl p-3 border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a2332] flex items-center justify-center shrink-0">
                    {getTxIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-extrabold text-white text-[12px] line-clamp-1">
                      {tx.description}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {tx.createdAt}
                      {tx.utr && <span> • UTR: {tx.utr.slice(-6)}</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`font-black text-sm ${getAmountColor(tx.type)}`}>
                    {tx.type === 'DEPOSIT' || tx.type === 'WINNING' ? '+' : '-'}₹{tx.amount}
                  </p>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase block mt-0.5 ${
                      tx.status === 'SUCCESS'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : tx.status === 'PENDING'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-red-400 bg-red-500/10'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
