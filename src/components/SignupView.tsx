import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SignupView: React.FC = () => {
  const { signup, setAuthView } = useTournaments();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('s4mnxx');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('s4mnxx@gmail.com');
  const [promoCode, setPromoCode] = useState('BOOYAH30');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [ign, setIgn] = useState('亗 S4MNXX 亗');
  const [uid, setUid] = useState('2847910245');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    signup({
      username: username.trim(),
      fullName: `${firstName} ${lastName}`.trim() || 'Free Fire Champion',
      phone: `+91 ${phone}`,
      email: email.trim(),
      ign: ign.trim() || `亗 ${username.toUpperCase()} 亗`,
      uid: uid.trim() || '2948192041',
      promoCode: promoCode.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-10 max-w-[420px] mx-auto pb-12 select-none">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[36px] font-extrabold leading-[40px] font-heading">
          Welcome to,<br />
          <span className="text-white">Sign Up</span>
        </h1>
        <div className="bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+₹40 with Referral</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-2 rounded-xl text-xs font-semibold mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-[#671eff] rounded-full px-5 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-[#671eff] rounded-full px-5 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium"
          />
        </div>

        <div>
          <input
            id="un"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#671eff] rounded-full px-6 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium"
            required
          />
        </div>

        <div className="flex gap-2">
          <div className="bg-[#671eff] rounded-full px-4 py-[15px] text-[14px] min-w-[85px] flex items-center justify-center font-bold text-white shadow">
            +91 ▼
          </div>
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 bg-[#671eff] rounded-full px-6 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#671eff] rounded-full px-6 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium"
          />
        </div>

        {/* Free Fire In Game Credentials */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <input
            type="text"
            placeholder="FF In-Game Name (IGN)"
            value={ign}
            onChange={(e) => setIgn(e.target.value)}
            className="w-full bg-[#5213d4] border border-white/20 rounded-full px-4 py-[14px] text-[13px] outline-none text-white placeholder-white/70 font-semibold"
          />
          <input
            type="text"
            placeholder="FF Player UID (9-10 digits)"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="w-full bg-[#5213d4] border border-white/20 rounded-full px-4 py-[14px] text-[13px] outline-none text-white placeholder-white/70 font-semibold"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Referral Code (e.g. SKILL-S4MNXX)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full bg-[#671eff] rounded-full px-6 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium uppercase tracking-wider"
          />
          <p className="text-[10px] text-amber-300/80 px-4 mt-1 font-semibold">
            ✨ Tip: Use code <b className="text-white">SKILL-S4MNXX</b> to get ₹40 total welcome cash!
          </p>
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#671eff] rounded-full px-6 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#671eff] rounded-full px-6 py-[15px] text-[14px] outline-none text-white placeholder-white/80 font-medium"
          />
        </div>

        <p className="text-center mt-6 text-[11px] leading-4 text-white/70 pt-2">
          By Registering, I agree to Skill War's<br />
          <b className="text-white hover:underline cursor-pointer">Terms and Conditions</b> and{' '}
          <b className="text-white hover:underline cursor-pointer">Privacy Policy</b>
        </p>

        <button
          type="submit"
          className="w-full bg-[#671eff] hover:bg-[#5b19e6] active:scale-[0.98] rounded-full py-[16px] mt-4 font-bold text-[15px] tracking-wider shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>SIGN UP</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <p className="text-center mt-6 text-[14px] text-white/70 pb-6">
        Already have account?{' '}
        <button
          onClick={() => setAuthView('login')}
          className="font-bold text-white hover:text-purple-300 underline underline-offset-4 cursor-pointer"
        >
          Login
        </button>
      </p>
    </div>
  );
};
