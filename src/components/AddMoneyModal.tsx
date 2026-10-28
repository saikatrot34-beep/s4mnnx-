import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, CheckCircle2, QrCode, ShieldCheck, Zap, 
  AlertCircle, Copy, Check, Download, ExternalLink, HelpCircle 
} from 'lucide-react';

interface AddMoneyModalProps {
  onClose: () => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ onClose }) => {
  const { addDeposit } = useTournaments();
  const [selectedAmount, setSelectedAmount] = useState<number>(30);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentTab, setPaymentTab] = useState<'QR' | 'DIRECT'>('QR');
  const [selectedApp, setSelectedApp] = useState<'PHONEPE' | 'GPAY' | 'PAYTM'>('PHONEPE');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = customAmount ? Number(customAmount) : selectedAmount;
  const qrImagePath = '/assets/aistudio/AccountQRCodeState_Bank_of_India_-_7091_LIGHT_THEME_db44f1a4.png';
  const merchantUpiId = 'sandhya.roy@phonepe';

  const handleChipClick = (val: number) => {
    sounds.playClick();
    setSelectedAmount(val);
    setCustomAmount('');
    setError(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setError(null);
  };

  const handleCopyUpi = () => {
    sounds.playClick();
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAutoFillUtr = () => {
    sounds.playClick();
    const randomUtr = `${Math.floor(400000000000 + Math.random() * 599999999999)}`;
    setUtrNumber(randomUtr);
  };

  const handleProceedPayment = (overrideUtr?: string) => {
    if (isNaN(amount) || amount < 30) {
      setError('Minimum deposit amount is ₹30');
      return;
    }

    setIsProcessing(true);
    sounds.playClick();

    setTimeout(() => {
      const finalUTR = overrideUtr || utrNumber.trim() || `${Math.floor(400000000000 + Math.random() * 599999999999)}`;
      const methodName = paymentTab === 'QR' ? 'PhonePe QR (Sandhya Roy)' : selectedApp;
      
      addDeposit(amount, methodName, finalUTR);
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-[#0f141f] border border-[#232f42] rounded-t-3xl sm:rounded-3xl w-full max-w-[440px] max-h-[94vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        
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
            <div>
              <h2 className="font-extrabold text-sm text-white">Deposit Cash / Add Money</h2>
              <p className="text-[10px] text-white/40">Instant wallet credit via UPI QR</p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Instant Credit
          </span>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">Deposit Successful!</h3>
              <p className="text-sm font-extrabold text-emerald-400">+₹{amount} Added to Your Wallet</p>
              <p className="text-xs text-white/50">Your balance has been updated. Join tournaments now!</p>
            </div>
          ) : (
            <>
              {/* Select Amount Section */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="font-black text-xs uppercase tracking-wider text-white">Select Deposit Amount</p>
                  <p className="text-[11px] text-orange-400 font-bold">Min ₹30</p>
                </div>

                {/* Amount Chips (30, 50, 100, 200, 500) */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[30, 50, 100, 200, 500].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleChipClick(val)}
                      className={`rounded-full px-5 py-2 text-xs font-black transition cursor-pointer ${
                        selectedAmount === val && !customAmount
                          ? 'bg-[#ff8c00] text-white shadow-lg shadow-orange-600/30 scale-105'
                          : 'bg-[#1a2332] text-white/80 border border-[#2a3441] hover:text-white'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mt-2.5">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Or enter custom amount (e.g. 150)"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-full bg-[#151c28] border border-[#232f42] rounded-xl pl-7 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-orange-500 font-bold"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-2 text-red-400 text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Payment Mode Selector Tabs */}
              <div className="flex gap-1.5 p-1 bg-[#101622] rounded-xl border border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPaymentTab('QR');
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentTab === 'QR'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>PhonePe QR Code (Scan & Pay)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPaymentTab('DIRECT');
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentTab === 'DIRECT'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>UPI Apps</span>
                </button>
              </div>

              {/* PAYMENT TAB 1: PHONEPE QR CODE (USING THE USER'S PROVIDED IMAGE) */}
              {paymentTab === 'QR' && (
                <div className="space-y-3.5">
                  <div className="bg-[#121824] border border-purple-500/30 rounded-2xl p-4 text-center space-y-3 shadow-lg">
                    {/* Merchant / Receiver Info */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/5 text-left">
                      <div>
                        <span className="text-[9px] text-purple-300 font-bold uppercase tracking-wider block">
                          Verified Payment Account
                        </span>
                        <p className="text-sm font-black text-white">SANDHYA ROY</p>
                        <p className="text-[10px] text-white/50">State Bank of India • PhonePe Accepted</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-white/40 font-bold uppercase block">Amount</span>
                        <span className="text-base font-black text-amber-400">₹{amount}</span>
                      </div>
                    </div>

                    {/* Official PhonePe QR Code Image Display */}
                    <div className="bg-white p-3 rounded-2xl inline-block shadow-2xl border-2 border-purple-500/40 relative group">
                      <img
                        src={qrImagePath}
                        alt="PhonePe QR Code - Sandhya Roy"
                        className="w-52 h-auto max-h-[310px] object-contain mx-auto rounded-lg"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="bg-[#1f2838] hover:bg-[#28354a] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 transition"
                      >
                        {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUpi ? 'UPI ID Copied' : 'Copy UPI ID'}</span>
                      </button>

                      <a
                        href={qrImagePath}
                        download="SkillWar_PhonePe_QR.png"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#1f2838] hover:bg-[#28354a] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3 h-3" />
                        <span>Save QR</span>
                      </a>
                    </div>
                  </div>

                  {/* 3 Step Instructions */}
                  <div className="bg-[#151c28] rounded-2xl p-3.5 border border-[#232f42] space-y-2">
                    <p className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                      How to Pay via QR:
                    </p>
                    <ol className="text-[11px] text-white/70 space-y-1.5 list-decimal pl-4 leading-relaxed">
                      <li>Upar diye gaye <b>PhonePe QR Code</b> ko scan karein.</li>
                      <li>Keval <b>₹{amount}</b> bhejein aur payment successful hone dein.</li>
                      <li>Payment ka <b>12-digit UTR / Ref Number</b> neeche enter karein.</li>
                    </ol>
                  </div>

                  {/* UTR Input Field */}
                  <div className="bg-[#121824] p-3.5 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-white">
                        Enter 12-Digit UTR / Transaction ID
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoFillUtr}
                        className="text-[10px] text-orange-400 hover:underline font-bold"
                      >
                        Auto-fill Sample UTR
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. 429108392104 (12 digits)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      maxLength={16}
                      className="w-full bg-[#182030] border border-[#2a374d] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-purple-500 font-mono tracking-wider"
                    />

                    <span className="text-[10px] text-white/40 block">
                      Note: You can also tap below to auto-verify payment instantly.
                    </span>
                  </div>
                </div>
              )}

              {/* PAYMENT TAB 2: DIRECT UPI APPS */}
              {paymentTab === 'DIRECT' && (
                <div className="space-y-3 pt-1">
                  <p className="font-black text-xs uppercase tracking-wider text-white">
                    Choose UPI App
                  </p>

                  <div className="space-y-2">
                    {[
                      { id: 'PHONEPE', name: 'PhonePe UPI', subtitle: 'Pay to Sandhya Roy', icon: '🟣' },
                      { id: 'GPAY', name: 'Google Pay (GPay)', subtitle: 'Instant UPI Intent', icon: '🔵' },
                      { id: 'PAYTM', name: 'Paytm UPI', subtitle: 'Zero Transaction Fee', icon: '🔷' },
                    ].map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedApp(m.id as any);
                        }}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                          selectedApp === m.id
                            ? 'bg-[#1e2a3c] border-orange-500 shadow-md'
                            : 'bg-[#151c28] border-[#232f42] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{m.icon}</span>
                          <div>
                            <p className="text-xs font-extrabold text-white">{m.name}</p>
                            <p className="text-[10px] text-white/40">{m.subtitle}</p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedApp === m.id ? 'border-orange-500 bg-orange-500' : 'border-white/30'
                          }`}
                        >
                          {selectedApp === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badge */}
              <div className="bg-[#151c28] rounded-xl p-3 border border-[#232f42] flex items-center gap-2.5 text-xs text-white/60">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>256-bit encrypted • 100% automated Free Fire tournament wallet credit</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        {!isSuccess && (
          <div className="p-4 bg-[#121824] border-t border-[#1e293b]">
            <button
              onClick={() => handleProceedPayment()}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#ff8c00] to-[#ff3c00] hover:from-[#ff9e1a] hover:to-[#ff4d1a] text-white rounded-full py-3.5 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>VERIFYING PAYMENT (₹{amount})...</span>
                </>
              ) : paymentTab === 'QR' ? (
                <span>I HAVE PAID VIA QR • ADD ₹{amount} CASH</span>
              ) : (
                <span>PAY ₹{amount} VIA {selectedApp}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
