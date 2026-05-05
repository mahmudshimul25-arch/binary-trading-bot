import React, { useState, useEffect, useRef } from 'react';
import { Bot, TrendingUp, TrendingDown, Activity, Info, ChevronDown, CheckCircle2, AlertCircle, Play, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ASSETS = [
  "EUR/USD OTC",
  "GBP/USD OTC",
  "USD/JPY OTC",
  "AUD/USD OTC",
  "USD/CAD OTC",
  "USD/CHF OTC",
  "NZD/USD OTC",
  "EUR/GBP OTC",
  "EUR/JPY OTC",
  "GBP/JPY OTC"
];

const App: React.FC = () => {
  const [asset, setAsset] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState<string>("Waiting for action");
  const [direction, setDirection] = useState<'BUY' | 'SELL' | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [showHowToUse, setShowHowToUse] = useState<boolean>(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Timer Countdown Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !isGenerating) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && direction) {
      setStatus("Signal Expired");
      setDirection(null);
      setConfidence(0);
    }
    return () => clearTimeout(timer);
  }, [countdown, isGenerating, direction]);

  const generateSignal = () => {
    if (!asset) {
      setStatus("Error: Select an asset first!");
      return;
    }

    setIsGenerating(true);
    setStatus("Analyzing Market Data...");
    setDirection(null);
    setConfidence(0);

    // Simulate API delay / analysis process
    setTimeout(() => {
      const isBuy = Math.random() > 0.5;
      const newConfidence = Math.floor(Math.random() * (99 - 85 + 1)) + 85; 
      
      setDirection(isBuy ? 'BUY' : 'SELL');
      setConfidence(newConfidence);
      setStatus("Signal Generated Successfully!");
      setCountdown(60); // 1-minute strict signal window
      setIsGenerating(false);
    }, 2500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-pink-500/30">
      <div className="w-full max-w-md relative z-10">
        
        {/* Animated Background Orbs inside Card Area */}
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-pink-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

        {/* --- Header / Logo Section --- */}
        <div className="flex justify-center mb-6 relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            {/* Glowing rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 blur-md opacity-60 animate-pulse"></div>
            <div className="relative bg-[#0d071a] p-4 rounded-full border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.3)] flex items-center justify-center">
              <Bot size={48} className="text-cyan-400 stroke-[1.5px]" />
              
              {/* Badges */}
              <div className="absolute -left-3 bottom-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-lg border border-green-400/50">
                BUY
              </div>
              <div className="absolute -right-3 bottom-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-lg border border-red-400/50">
                SELL
              </div>
              
              {/* Fake Chart bars in background of icon */}
              <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-30 gap-1 pointer-events-none">
                <div className="w-1 h-3 bg-green-400 rounded-t-sm" />
                <div className="w-1 h-6 bg-green-400 rounded-t-sm" />
                <div className="w-1 h-4 bg-red-400 rounded-t-sm" />
                <div className="w-1 h-7 bg-green-400 rounded-t-sm" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Main App Container --- */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#120a1f]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <h1 className="text-center text-lg sm:text-xl font-bold tracking-widest text-white/90 mb-5 pb-4 border-b border-white/10 uppercase">
            Quotex OTC <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Instant Signal</span>
          </h1>

          {/* Results Screen */}
          <div className="bg-[#0b0512] rounded-2xl p-5 mb-5 border border-pink-500/20 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              {/* Left Side: Direction & Confidence */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Signal Direction</div>
                  <AnimatePresence mode="popLayout">
                    {direction ? (
                      <motion.div
                        key={direction}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xl tracking-wide shadow-lg border ${
                          direction === 'BUY' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/20'
                        }`}
                      >
                        {direction === 'BUY' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        {direction}
                      </motion.div>
                    ) : (
                      <div className="inline-flex items-stretch px-6 py-3 rounded-xl font-medium text-lg text-white/50 bg-white/5 border border-white/10 border-dashed">
                        ---
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-white/40 uppercase tracking-wider">
                    <span>Confidence</span>
                    {direction && <span className="font-mono text-white/70">{confidence}%</span>}
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        direction === 'BUY' ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 
                        direction === 'SELL' ? 'bg-gradient-to-r from-rose-500 to-red-400' : 'bg-transparent'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Status logic / Buttons */}
              <div className="flex flex-col items-start sm:items-end justify-between flex-1 min-h-[110px]">
                <div className="text-right w-full">
                  <div className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Status</div>
                  
                  <div className="flex items-center justify-end gap-1.5 text-sm sm:text-base font-medium">
                    {isGenerating && <Activity size={16} className="text-pink-400 animate-pulse" />}
                    {!isGenerating && direction && <CheckCircle2 size={16} className="text-green-400" />}
                    {!isGenerating && !direction && <AlertCircle size={16} className="text-yellow-400/80" />}
                    
                    <span className={`transition-colors ${
                      status.includes('Error') ? 'text-red-400' : 
                      isGenerating ? 'text-pink-400 animate-pulse' : 
                      direction ? 'text-green-400' : 'text-white/60'
                    }`}>
                      {status}
                    </span>
                  </div>

                  {countdown > 0 && !isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-right"
                    >
                      <span className="text-xs text-white/40 block mb-0.5">Expires in</span>
                      <span className="font-mono font-bold text-xl text-white tracking-tight">
                        {formatTime(countdown)}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="w-full mt-4 sm:mt-0">
                  <button
                    onClick={generateSignal}
                    disabled={isGenerating || (countdown > 0 && direction !== null)}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:opacity-50 disabled:hover:from-pink-500 disabled:hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all outline-none focus:ring-2 focus:ring-pink-500/50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Scanning...
                      </>
                    ) : countdown > 0 && direction ? (
                      <>
                        <Clock size={18} /> Wait...
                      </>
                    ) : (
                      <>
                        <Activity size={18} /> Apply Signal
                      </>
                    )}
                    
                    {/* Button Glint effect on hover */}
                    <div className="absolute inset-x-0 -top-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent group-hover:animate-[glint_1.5s_ease-in-out_infinite] pointer-events-none" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-4">
            
            {/* Custom Asset Select Dropdown */}
            <div className="relative z-20" ref={dropdownRef}>
              <div className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 ml-1">Market Asset</div>
              <button 
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#0b0512] border border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-left px-4 py-4 rounded-xl flex items-center justify-between transition-colors focus:ring-2 focus:ring-purple-500/50 font-medium text-white/90"
              >
                {asset || "Select Asset..."}
                <ChevronDown size={18} className={`text-white/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#120a1f] border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[220px] overflow-y-auto"
                  >
                    {ASSETS.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setAsset(item);
                          setIsDropdownOpen(false);
                          if(!direction && !countdown) setStatus("Market Selected. Ready.");
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5 flex items-center justify-between ${asset === item ? 'bg-pink-500/10 text-pink-400' : 'text-white/70'}`}
                      >
                        {item}
                        {asset === item && <CheckCircle2 size={16} className="text-pink-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Instruction Toggle */}
            <button
              onClick={() => setShowHowToUse(true)}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold py-4 rounded-xl border border-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              <Info size={18} />
              How to use this bot
            </button>
          </div>
        </motion.div>

        {/* Footer info/disclaimer */}
        <p className="text-center text-white/30 text-xs mt-6 px-4">
          Accuracy is simulated. This is a frontend demonstration bot. Trading involves significant risk.
        </p>

      </div>

      {/* --- MODAL FOR INSTRUCTIONS --- */}
      <AnimatePresence>
        {showHowToUse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowHowToUse(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#120a1f] border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Info className="text-blue-400" /> Guide
                  </h2>
                  <button onClick={() => setShowHowToUse(false)} className="text-white/40 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <ul className="space-y-4 text-sm text-white/70">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold font-mono text-white">1</span>
                    <p>Select your desired <strong className="text-white">OTC Market</strong> from the dropdown list menu.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold font-mono text-white">2</span>
                    <p>Click the <strong className="text-pink-400">Apply Signal</strong> button to let the algorithm scan.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold font-mono text-white">3</span>
                    <p>Place your trade based on the generated direction (BUY/SELL) exactly upon generation for a <strong className="text-cyan-400">1-Minute timeframe</strong>.</p>
                  </li>
                  <li className="flex gap-3 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-red-200">
                      <strong>Warning:</strong> The signal expires after 60 seconds. Do not execute late trades.
                    </p>
                  </li>
                </ul>

                <button 
                  onClick={() => setShowHowToUse(false)}
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes glint {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
