import React, { useState } from 'react';
import { useTournaments } from '../context/TournamentContext';
import { MatchMap, MatchMode, Tournament } from '../types/tournament';
import { sounds } from '../utils/audio';
import { 
  ArrowLeft, Shield, KeyRound, Plus, Trophy, 
  CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft, RefreshCw, Save 
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const {
    tournaments,
    updateRoomCredentials,
    createTournament,
    declareMatchResult,
    deposits,
    withdrawals,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    resetAllData,
  } = useTournaments();

  const [activeTab, setActiveTab] = useState<'rooms' | 'create' | 'results' | 'requests'>('rooms');

  // Room Credentials State
  const [selectedMatchId, setSelectedMatchId] = useState(tournaments[0]?.id || '');
  const [newRoomId, setNewRoomId] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [roomSaved, setRoomSaved] = useState(false);

  // Create Tournament State
  const [title, setTitle] = useState('');
  const [map, setMap] = useState<MatchMap>('BERMUDA');
  const [mode, setMode] = useState<MatchMode>('SOLO');
  const [entryFee, setEntryFee] = useState(15);
  const [prizePool, setPrizePool] = useState(450);
  const [perKill, setPerKill] = useState(12);
  const [booyahPrize, setBooyahPrize] = useState(180);
  const [totalSlots, setTotalSlots] = useState(48);
  const [matchDate, setMatchDate] = useState('Today');
  const [matchTime, setMatchTime] = useState('07:00 PM');
  const [createdNotice, setCreatedNotice] = useState(false);

  // Result Declaration State
  const [resultMatchId, setResultMatchId] = useState(tournaments[0]?.id || '');
  const [resultKills, setResultKills] = useState<number>(5);
  const [resultRank, setResultRank] = useState<number>(1);
  const [resultSuccess, setResultSuccess] = useState(false);

  const selectedTournament = tournaments.find((t) => t.id === selectedMatchId);

  const handleUpdateRooms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomId || !newRoomPassword) return;
    updateRoomCredentials(selectedMatchId, newRoomId.trim(), newRoomPassword.trim());
    setRoomSaved(true);
    setTimeout(() => setRoomSaved(false), 2000);
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const matchNum = Math.floor(100 + tournaments.length + 1);
    createTournament({
      matchNumber: matchNum,
      title: title.trim() || `Daily Fire Clash #${matchNum}`,
      map,
      mode,
      version: 'FREE FIRE MAX',
      entryFee: Number(entryFee),
      prizePool: Number(prizePool),
      perKill: Number(perKill),
      booyahPrize: Number(booyahPrize),
      runnerUpPrize: Math.round(Number(booyahPrize) * 0.5),
      thirdPrize: Math.round(Number(booyahPrize) * 0.25),
      totalSlots: Number(totalSlots),
      status: 'UPCOMING',
      startTime: 'In 30 mins',
      matchDate,
      matchTime,
      credentialsVisibleBeforeMins: 15,
      rules: ['Mobile only', 'Gun attributes OFF', 'No hackers allowed'],
    });

    setCreatedNotice(true);
    setTitle('');
    setTimeout(() => setCreatedNotice(false), 2000);
  };

  const handleDeclareResults = () => {
    const t = tournaments.find((item) => item.id === resultMatchId);
    if (!t) return;

    declareMatchResult(resultMatchId, [
      {
        userId: 'usr_s4mnxx',
        username: 's4mnxx',
        ign: '亗 S4MNXX 亗',
        rank: Number(resultRank),
        kills: Number(resultKills),
      },
    ]);

    setResultSuccess(true);
    setTimeout(() => setResultSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-[#0c1017] border border-purple-500/50 rounded-t-3xl sm:rounded-3xl w-full max-w-[440px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-purple-950/60 animate-in slide-in-from-bottom duration-200">
        
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
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <h2 className="font-extrabold text-sm text-white">Skill War Admin</h2>
              </div>
              <p className="text-[10px] text-purple-300/70">Esports Match Management</p>
            </div>
          </div>
          <button
            onClick={resetAllData}
            title="Reset data"
            className="w-8 h-8 bg-[#1f293d] rounded-full flex items-center justify-center text-white/60 hover:text-amber-400 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 p-2 bg-[#101622] border-b border-[#1e293b] text-xs">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'rooms' ? 'bg-purple-600 text-white' : 'text-white/50'
            }`}
          >
            Room ID
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'create' ? 'bg-purple-600 text-white' : 'text-white/50'
            }`}
          >
            + Match
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'results' ? 'bg-purple-600 text-white' : 'text-white/50'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition relative ${
              activeTab === 'requests' ? 'bg-purple-600 text-white' : 'text-white/50'
            }`}
          >
            Approvals
            {(deposits.some((d) => d.status === 'PENDING') || withdrawals.some((w) => w.status === 'PENDING')) && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1"></span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <p className="text-xs text-white/60">
                Publish Room ID & Password to registered players:
              </p>

              <div>
                <label className="text-[11px] font-semibold text-white/70 block mb-1">
                  Select Tournament
                </label>
                <select
                  value={selectedMatchId}
                  onChange={(e) => {
                    setSelectedMatchId(e.target.value);
                    const t = tournaments.find((item) => item.id === e.target.value);
                    if (t) {
                      setNewRoomId(t.roomId || '');
                      setNewRoomPassword(t.roomPassword || '');
                    }
                  }}
                  className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      #{t.matchNumber} - {t.title} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTournament && (
                <div className="bg-[#151c28] p-3 rounded-xl border border-white/5 text-xs space-y-1">
                  <p className="text-white font-bold">{selectedTournament.title}</p>
                  <p className="text-white/40">
                    Slots Filled: {selectedTournament.joinedSlots}/{selectedTournament.totalSlots} • Mode: {selectedTournament.mode}
                  </p>
                </div>
              )}

              <form onSubmit={handleUpdateRooms} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-white/70 block mb-1">
                    Custom Room ID
                  </label>
                  <input
                    type="text"
                    value={newRoomId}
                    onChange={(e) => setNewRoomId(e.target.value)}
                    placeholder="e.g. 9847291"
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/70 block mb-1">
                    Room Password
                  </label>
                  <input
                    type="text"
                    value={newRoomPassword}
                    onChange={(e) => setNewRoomPassword(e.target.value)}
                    placeholder="e.g. 123"
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40"
                >
                  {roomSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>ROOM UPDATED!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>PUBLISH ROOM CREDENTIALS</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'create' && (
            <form onSubmit={handleCreateTournament} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70 block mb-1">Match Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Booyah Grand Rush"
                  className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-white/70 block mb-1">Map</label>
                  <select
                    value={map}
                    onChange={(e) => setMap(e.target.value as MatchMap)}
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="BERMUDA">Bermuda</option>
                    <option value="PURGATORY">Purgatory</option>
                    <option value="KALAHARI">Kalahari</option>
                    <option value="ALPINE">Alpine</option>
                    <option value="NEXTERRA">Nexterra</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/70 block mb-1">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as MatchMode)}
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="SOLO">Solo</option>
                    <option value="DUO">Duo</option>
                    <option value="SQUAD">Squad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-white/60 block mb-1">Entry (₹)</label>
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/60 block mb-1">Pool (₹)</label>
                  <input
                    type="number"
                    value={prizePool}
                    onChange={(e) => setPrizePool(Number(e.target.value))}
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/60 block mb-1">Per Kill (₹)</label>
                  <input
                    type="number"
                    value={perKill}
                    onChange={(e) => setPerKill(Number(e.target.value))}
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-white/60 block mb-1">Booyah 1st (₹)</label>
                  <input
                    type="number"
                    value={booyahPrize}
                    onChange={(e) => setBooyahPrize(Number(e.target.value))}
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/60 block mb-1">Match Time</label>
                  <input
                    type="text"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    placeholder="08:00 PM"
                    className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-2.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
              >
                {createdNotice ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span>MATCH CREATED & PUBLISHED!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>LAUNCH NEW TOURNAMENT</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'results' && (
            <div className="space-y-3">
              <p className="text-xs text-white/60">
                Declare winners & automatically distribute wallet prizes:
              </p>

              <div>
                <label className="text-[11px] font-semibold text-white/70 block mb-1">
                  Select Match to Conclude
                </label>
                <select
                  value={resultMatchId}
                  onChange={(e) => setResultMatchId(e.target.value)}
                  className="w-full bg-[#182030] border border-[#2a364d] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      #{t.matchNumber} - {t.title} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#151c28] p-3 rounded-xl border border-white/5 space-y-2">
                <p className="text-xs font-bold text-amber-400">Award Player (s4mnxx):</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-white/60 block mb-1">Rank</label>
                    <select
                      value={resultRank}
                      onChange={(e) => setResultRank(Number(e.target.value))}
                      className="w-full bg-[#1f2838] border border-white/10 rounded-lg p-2 text-white outline-none"
                    >
                      <option value="1">1st Place (Booyah!)</option>
                      <option value="2">2nd Place</option>
                      <option value="3">3rd Place</option>
                      <option value="4">4th+ Place</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-white/60 block mb-1">Kills Made</label>
                    <input
                      type="number"
                      value={resultKills}
                      onChange={(e) => setResultKills(Number(e.target.value))}
                      className="w-full bg-[#1f2838] border border-white/10 rounded-lg p-2 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleDeclareResults}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {resultSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span>PRIZES CREDITED TO WALLET!</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    <span>DISTRIBUTE WINNINGS & COMPLETE MATCH</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {/* Withdrawals */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-purple-300">
                  Withdrawal Requests ({withdrawals.filter((w) => w.status === 'PENDING').length} Pending)
                </p>
                {withdrawals.length === 0 ? (
                  <p className="text-xs text-white/40">No withdrawal requests.</p>
                ) : (
                  withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="bg-[#151c28] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">₹{w.amount} • {w.method}</p>
                        <p className="text-[10px] text-white/40">{w.upiId || w.accountNumber}</p>
                      </div>
                      {w.status === 'PENDING' ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => approveWithdrawal(w.id)}
                            className="bg-emerald-600 px-2.5 py-1 rounded-md text-[10px] font-bold text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectWithdrawal(w.id)}
                            className="bg-red-600 px-2.5 py-1 rounded-md text-[10px] font-bold text-white"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${w.status === 'APPROVED' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {w.status}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
