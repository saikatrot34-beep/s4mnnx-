import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { 
  Users, Gift, Copy, Check, Share2, Sparkles, 
  ArrowRight, Flame, ShieldCheck, Trophy, Wallet, UserPlus 
} from 'lucide-react';

export const ReferView: React.FC = () => {
  const { user, referrals, simulateReferral, setActiveTab } = useTournaments();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [customFriendName, setCustomFriendName] = useState('');
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  const referralCode = user.referralCode || 'SKILL-S4MNXX';
  const shareText = `🔥 Play Free Fire Max Tournaments on Skill War! Sign up with my code ${referralCode} and get ₹40 instant signup bonus! Play matches & win real cash: https://skillwar.gg?ref=${referralCode}`;

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    sounds.playClick();
    const link = `https://skillwar.gg?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = () => {
    sounds.playClick();
    if (navigator.share) {
      navigator.share({
        title: 'Skill War - Free Fire Tournament',
        text: shareText,
        url: `https://skillwar.gg?ref=${referralCode}`,
      }).catch(() => {
        handleCopyLink();
      });
    } else {
      // WhatsApp share intent or copy
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSimulating(true);
    const friend = customFriendName.trim() || undefined;
    const res = simulateReferral(friend);
    setCustomFriendName('');
    setSimulationNotice(`🎉 Success! @${res.friendName} signed up using your code! +₹${res.bonus} credited to your wallet!`);
    setSimulating(false);

    setTimeout(() => {
      setSimulationNotice(null);
    }, 4000);
  };

  return (
    <div className="p-4 space-y-4 pb-28 select-none">
      {/* Top Banner Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
            <span>Refer & Earn</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Win ₹25
            </span>
          </h1>
          <p className="text-xs text-white/40">Invite squad mates & earn wallet cash</p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black border border-amber-500/30">
          <Gift className="w-5 h-5" />
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/90 via-[#1b1736] to-[#0f1422] rounded-3xl p-5 border border-purple-500/40 shadow-xl shadow-purple-950/40 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[240px]">
            <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Unlimited Rewards
            </span>
            <h2 className="text-2xl font-black text-white font-heading tracking-wide leading-tight">
              Earn ₹25 Cash<br />
              <span className="text-amber-400">For Every Friend!</span>
            </h2>
            <p className="text-[11px] text-white/70 leading-relaxed pt-1">
              Your friend gets <b className="text-emerald-400">₹40 Welcome Cash</b>, and you get <b className="text-amber-400">₹25 Wallet Credit</b> immediately on sign-up.
            </p>
          </div>
          <div className="text-4xl animate-bounce">🎁</div>
        </div>

        {/* Unique Referral Code Box */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-3 border border-purple-400/30 flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-purple-300/80 font-bold">
              Your Unique Referral Code
            </p>
            <p className="text-base font-black text-amber-400 font-mono tracking-wider mt-0.5">
              {referralCode}
            </p>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={handleCopyCode}
              className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-md"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationNotice && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs p-3.5 rounded-2xl flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <div className="w-7 h-7 rounded-full bg-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-[12px]">{simulationNotice}</p>
            <button
              onClick={() => setActiveTab('wallet')}
              className="text-[10px] text-emerald-300 underline font-bold mt-0.5 flex items-center gap-1"
            >
              <span>View in Wallet</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Referral Stats Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#121824] rounded-2xl p-3.5 border border-[#232f42] text-center">
          <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-[10px] text-white/40 uppercase font-semibold">Total Friends Invited</p>
          <p className="text-xl font-black text-white mt-0.5 font-heading">
            {referrals.length}
          </p>
        </div>

        <div className="bg-[#121824] rounded-2xl p-3.5 border border-amber-500/30 text-center">
          <Wallet className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-[10px] text-white/40 uppercase font-semibold">Total Bonus Earned</p>
          <p className="text-xl font-black text-amber-400 mt-0.5 font-heading">
            ₹{referrals.reduce((sum, r) => sum + r.bonusAmount, 0)}
          </p>
        </div>
      </div>

      {/* Quick Test / Simulation Widget */}
      <div className="bg-[#151c28] rounded-2xl p-4 border border-orange-500/30 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            <p className="text-xs font-black uppercase text-white tracking-wider">
              Test Referral Sign-up
            </p>
          </div>
          <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full font-bold">
            Instant ₹25 Credit
          </span>
        </div>

        <p className="text-[11px] text-white/60">
          Simulate a new friend registering with your referral code ({referralCode}):
        </p>

        <form onSubmit={handleSimulate} className="flex gap-2">
          <input
            type="text"
            value={customFriendName}
            onChange={(e) => setCustomFriendName(e.target.value)}
            placeholder="Friend's username (or random)"
            className="flex-1 bg-[#101520] border border-[#26354a] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={simulating}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-orange-950/40 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Simulate</span>
          </button>
        </form>
      </div>

      {/* 3-Step How It Works */}
      <div className="bg-[#121824] rounded-2xl p-4 border border-[#232f42] space-y-3">
        <p className="text-xs font-black uppercase text-white/70 tracking-wider">
          How Refer & Earn Works
        </p>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-[#151c28] p-3 rounded-xl border border-white/5">
            <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-black text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Share Your Code</p>
              <p className="text-[10px] text-white/50 mt-0.5">
                Send your unique referral code or link to your clan, WhatsApp groups, or squad mates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#151c28] p-3 rounded-xl border border-white/5">
            <div className="w-6 h-6 rounded-full bg-orange-600/30 text-orange-300 font-black text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Friend Signs Up</p>
              <p className="text-[10px] text-white/50 mt-0.5">
                Your friend enters your referral code during sign-up and receives a ₹40 welcome bonus!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#151c28] p-3 rounded-xl border border-white/5">
            <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Get ₹25 Instant Wallet Cash</p>
              <p className="text-[10px] text-white/50 mt-0.5">
                ₹25 is directly credited to your wallet balance. Use it to join any ₹7, ₹15, or ₹30 match!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referred Friends Roster */}
      <div className="bg-[#121824] rounded-2xl p-4 border border-[#232f42] space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase text-white/70 tracking-wider">
            Referred Friends ({referrals.length})
          </p>
          <span className="text-[10px] text-emerald-400 font-bold">
            100% Verified
          </span>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-xs">
            No friends referred yet. Share your code above to start earning!
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="bg-[#161d2a] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    {(r.friendUsername || 'F').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-white text-[12px]">{r.friendIgn}</p>
                    <p className="text-[10px] text-white/40">@{r.friendUsername} • {r.signedUpAt}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-emerald-400">
                    +₹{r.bonusAmount}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded block mt-0.5 uppercase">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
