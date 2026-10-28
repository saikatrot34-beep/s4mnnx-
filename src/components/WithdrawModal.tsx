import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { ArrowLeft, ArrowUpRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface WithdrawModalProps {
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose }) => {
  const { user, requestWithdrawal } = useTournaments();
  const [method, setMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [amount, setAmount] = useState<string>('50');
  const [upiId, setUpiId] = useState('s4mnxx@oksbi');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolder, setAccountHolder] = useState(user.fullName || 'Samir Naskar');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const winningBal = user.winningBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmt = Number(amount);

    if (isNaN(withdrawAmt) || withdrawAmt < 50) {
      setError('Minimum withdrawal amount is ₹50');
      return;
    }

    if (withdrawAmt > winningBal) {
      setError(`Cannot withdraw more than winning cash (₹${winningBal.toFixed(2)} available)`);
      return;
    }

    if (method === 'UPI' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@upi or mobile@paytm)');
      return;
    }

    if (method === 'BANK') {
      if (!accountNumber || accountNumber.length < 8) {
        setError('Please enter a valid bank account number');
        return;
      }
      if (!ifscCode || ifscCode.length < 5) {
        setError('Please enter a valid bank IFSC code');
        return;
      }
    }

    const res = requestWithdrawal(withdrawAmt, method, {
      upiId,
      accountNumber,
      ifscCode,
      accountHolder,
    });

    if (!res.success) {
      setError(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-[#0f141f] border border-[#232f42] rounded-t-3xl sm:rounded-3xl w-full max-w-[420px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#151c28]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-8 h-8 bg-[#1a2332] rounded-full flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-extrabold text-sm text-white">Withdraw Winning Cash</h2>
          </div>
          <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            Available: ₹{winningBal.toFixed(2)}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {successMsg ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">Withdrawal Requested!</h3>
              <p className="text-xs text-white/60">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Winning Balance Notice */}
              <div className="bg-[#151c28] rounded-2xl p-4 border border-[#232f42] space-y-1">
                <span className="text-[10px] text-white/40 uppercase font-semibold">Withdrawable Winnings</span>
                <p className="text-2xl font-black text-amber-400 font-heading">
                  ₹{winningBal.toFixed(2)}
                </p>
                <p className="text-[10px] text-white/30">
                  Note: Only winning cash won from tournaments can be withdrawn.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="text-xs font-bold text-white block mb-1">
                  Withdrawal Amount (Min ₹50)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="50"
                    className="w-full bg-[#151c28] border border-[#232f42] rounded-xl pl-8 pr-4 py-3 text-xs text-white placeholder-white/40 outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              {/* Method Tabs */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMethod('UPI');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      method === 'UPI'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-[#151c28] border-[#232f42] text-white/50'
                    }`}
                  >
                    UPI ID (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMethod('BANK');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      method === 'BANK'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-[#151c28] border-[#232f42] text-white/50'
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>
              </div>

              {method === 'UPI' ? (
                <div>
                  <label className="text-xs font-bold text-white block mb-1">
                    Your UPI Address
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@paytm or name@oksbi"
                    className="w-full bg-[#151c28] border border-[#232f42] rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 outline-none focus:border-orange-500 font-medium"
                  />
                  <span className="text-[10px] text-white/40 block mt-1">
                    Money will be transferred directly to your UPI ID within 15-30 mins.
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-white/60 block mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      placeholder="Full name as in bank"
                      className="w-full bg-[#151c28] border border-[#232f42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-white/60 block mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account number"
                      className="w-full bg-[#151c28] border border-[#232f42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-white/60 block mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className="w-full bg-[#151c28] border border-[#232f42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-orange-500 uppercase"
                    />
                  </div>
                </div>
              )}

              <div className="bg-[#151c28] rounded-xl p-3 border border-[#232f42] flex items-center gap-2.5 text-xs text-white/50">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Zero deduction fee • Fast automated bank processing</span>
              </div>

              {/* Submit button inside form */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full py-3.5 font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-950/40 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-4"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>REQUEST WITHDRAWAL (₹{amount || '0'})</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
