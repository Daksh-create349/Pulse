
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Zap, Stethoscope, FlaskConical, Pill, Sparkles, 
  Clock, Heart, Activity, BrainCircuit, Phone, ArrowRight, 
  Loader2, Lock, Sun, Moon, ArrowUpRight, Camera, TrendingUp
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white dark:bg-slate-900/60 rounded-[2rem] border border-slate-100 dark:border-white/5 backdrop-blur-xl premium-shadow overflow-hidden transition-all duration-500 ${className || ''}`}>
    {children}
  </div>
);

const HealthVital: React.FC<{ label: string; value: string; unit: string; icon: React.ReactNode; color: string }> = ({ label, value, unit, icon, color }) => (
  <div className="flex flex-col gap-2 p-5 rounded-[1.8rem] bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100/50 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer group">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}15`, color: color }}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{value}</span>
        <span className="text-[9px] font-bold text-slate-500">{unit}</span>
      </div>
    </div>
  </div>
);

const ServiceTile: React.FC<{ title: string; desc: string; icon: React.ReactNode; color: string; active?: boolean }> = ({ title, desc, icon, color, active }) => (
  <div className="group relative flex flex-col p-8 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-md shadow-slate-200/50 dark:shadow-none" style={{ backgroundColor: `${color}15`, color: color }}>
      {icon}
    </div>
    <div className="relative z-10">
      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">{desc}</p>
    </div>
    {active && (
      <div className="absolute top-6 right-6 bg-primary/10 text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse border border-primary/20">
        FAST
      </div>
    )}
  </div>
);

const RobotMascot = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="relative float-bot select-none pointer-events-none drop-shadow-2xl scale-90 md:scale-100">
    <svg viewBox="0 0 200 240" className="w-[280px] h-[320px] md:w-[440px] md:h-[500px]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6F61" stopOpacity={isDarkMode ? "0.3" : "0.1"} />
          <stop offset="100%" stopColor="#FF6F61" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="110" r="110" fill="url(#aura)" />
      <rect x="60" y="80" width="80" height="100" rx="36" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1" />
      <rect x="72" y="105" width="56" height="40" rx="16" fill="#F8FAFC" />
      <path d="M85 125 Q100 110 115 125 Q100 140 85 125" fill="#FF8D7F" fillOpacity="0.9" className="animate-pulse" />
      <rect x="70" y="30" width="60" height="52" rx="24" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1" />
      <line x1="100" y1="30" x2="100" y2="15" stroke="#FF6F61" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="15" r="5" fill="#FF6F61" />
      <rect x="78" y="44" width="44" height="22" rx="11" fill="#1C212E" />
      <circle cx="88" cy="55" r="4" fill="#FF6F61" />
      <circle cx="112" cy="55" r="4" fill="#FF6F61" />
      <g className="wave-hand">
        <path d="M140 105 L165 75 L185 45" stroke="#FF8D7F" strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="185" cy="45" r="18" fill="#FF8D7F" />
      </g>
    </svg>
  </div>
);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appState, setAppState] = useState<'welcome' | 'login' | 'dashboard'>('welcome');
  const [loginStep, setLoginStep] = useState<'phone' | 'verify'>('phone');
  const [isRapidMode, setIsRapidMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setIsSendingOtp(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setLoginStep('verify');
      setIsSendingOtp(false);
      window.alert(`[PULSE+ GATEWAY] Verification Code: ${code}`);
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const verifyOtp = () => {
    if (otp.join('') === generatedOtp) setAppState('dashboard');
  };

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Health Consultant: Answer concisely to "${searchQuery}" with a premium clinical tone.`,
      });
      setAiResponse(response.text || "Pulse AI is currently syncing.");
    } catch (e) { 
      setAiResponse("AI Node connection reset. Please retry.");
    } finally { 
      setIsAiLoading(false); 
    }
  };

  if (appState === 'welcome' || appState === 'login') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#020617] flex items-center justify-center overflow-hidden relative transition-colors duration-500">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="fixed top-8 right-8 z-50 p-4 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-500 shadow-xl"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full h-screen relative flex flex-col md:flex-row items-center">
          <div className={`w-full md:w-1/2 flex flex-col justify-center space-y-10 transition-all duration-700 ${appState === 'welcome' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}`}>
            <div className="inline-flex self-start items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-black text-[9px] uppercase tracking-[0.3em]">
              <Sparkles size={12} /> INTELLIGENT CARE
            </div>
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-none transition-all">
                Pulse<span className="text-primary">+</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-md leading-relaxed">
                Precision diagnostics, hyper-speed delivery, and elite support.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button 
                onClick={() => setAppState('login')} 
                className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                AUTHENTICATE
              </button>
            </div>
          </div>

          <div className={`w-full md:w-1/2 ml-auto transition-all duration-700 transform ${appState === 'login' ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-90 pointer-events-none absolute'}`}>
            <div className="w-full max-w-sm mx-auto space-y-10">
              <div className={loginStep === 'phone' ? 'block' : 'hidden'}>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 transition-all">Secure Entry.</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={20} />
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile ID"
                      className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl py-6 pl-16 pr-6 text-xl font-bold dark:text-white focus:outline-none focus:border-primary/30 transition-all"
                    />
                  </div>
                  <button onClick={handleSendOtp} disabled={isSendingOtp} className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all">
                    {isSendingOtp ? <Loader2 className="animate-spin" /> : <>TRANSMIT <ArrowRight size={18} /></>}
                  </button>
                </div>
              </div>
              <div className={loginStep === 'verify' ? 'block' : 'hidden'}>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-8">Verification.</h2>
                <div className="space-y-8">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpRefs.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-20 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl text-center text-3xl font-black dark:text-white focus:outline-none focus:border-primary/30 transition-all"
                      />
                    ))}
                  </div>
                  <button onClick={verifyOtp} className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                    UNLOCK CORE <Lock size={18} />
                  </button>
                </div>
              </div>
              <button onClick={() => { setAppState('welcome'); setLoginStep('phone'); }} className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest hover:text-primary transition-colors">BACK TO START</button>
            </div>
          </div>

          <div className={`absolute top-0 bottom-0 w-full md:w-1/2 flex items-center justify-center transition-all duration-1000 z-20 pointer-events-none ${appState === 'welcome' ? 'left-0 md:left-1/2' : 'left-0'}`}>
            <RobotMascot isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${isRapidMode ? 'bg-[#FFF9F9] dark:bg-[#0C0505]' : 'bg-slate-50 dark:bg-[#020617]'} pb-32`}>
      <nav className="sticky top-0 z-[100] glass py-5 transition-all">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setAppState('welcome')}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20" style={{ backgroundColor: isRapidMode ? '#FF4D4D' : '#FF6F61' }}>P+</div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Pulse <span className="text-primary">+</span></h1>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-slate-400">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-white/5 px-5 py-2.5 rounded-full border border-slate-100 dark:border-white/5">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">SECURE-NODE</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/10 border-2 border-white dark:border-white/5 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${phone || 'Felix'}`} alt="User" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-16">
        <section className="text-center space-y-12">
          <div className="flex bg-white dark:bg-white/5 p-1.5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl w-full max-w-[340px] mx-auto h-16 relative">
            <button onClick={() => setIsRapidMode(false)} className={`flex-1 flex items-center justify-center gap-2 rounded-full text-[10px] font-black transition-all z-10 ${!isRapidMode ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}><Clock size={16} /> STANDARD</button>
            <button onClick={() => setIsRapidMode(true)} className={`flex-1 flex items-center justify-center gap-2 rounded-full text-[10px] font-black transition-all z-10 ${isRapidMode ? 'text-white' : 'text-slate-400'}`}><Zap size={16} fill={isRapidMode ? "white" : "none"} /> 15M RAPID</button>
            <div className={`absolute top-1.5 bottom-1.5 w-[48%] rounded-full transition-all duration-500 ${isRapidMode ? 'translate-x-[104%] bg-primary shadow-lg shadow-primary/30' : 'translate-x-[2%] bg-white dark:bg-white/10 shadow-md'}`} />
          </div>

          <div className="w-full max-w-4xl mx-auto relative group">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
              placeholder="Ask Pulse AI health assistant..."
              className="w-full bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-white/5 rounded-[3rem] py-10 pl-16 pr-52 text-2xl font-bold dark:text-white shadow-2xl focus:outline-none focus:border-primary/20 transition-all placeholder:text-slate-200 dark:placeholder:text-slate-800"
            />
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-200 dark:text-slate-800" size={32} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
              <button onClick={handleSmartSearch} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white transition-all">
                {isAiLoading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />} PULSE AI
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-20">
          <div className="lg:col-span-8 space-y-12">
            {aiResponse && (
               <Card className="bg-slate-900 text-white p-12 relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
                  <div className="flex gap-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-lg">
                      <Sparkles size={32} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">AI Diagnosis Node</h4>
                      <p className="text-2xl font-medium leading-relaxed tracking-tight text-slate-100">"{aiResponse}"</p>
                    </div>
                  </div>
               </Card>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ServiceTile title="Pharmacy" desc="Hyper Delivery" icon={<Pill size={32} />} color="#FF6F61" active={isRapidMode} />
                <ServiceTile title="Bio-Labs" desc="Atomic Prep" icon={<FlaskConical size={32} />} color="#4834D4" />
                <ServiceTile title="Consult" desc="Neural-Doc" icon={<Stethoscope size={32} />} color="#686DE0" />
                <ServiceTile title="Cloud Vault" desc="Bio-Storage" icon={<Lock size={32} />} color="#F0932B" />
            </div>
          </div>
          <aside className="lg:col-span-4">
             <Card className="p-10 bg-slate-900 dark:bg-slate-900/40 text-white shadow-2xl h-full border-none">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <h4 className="text-3xl font-black tracking-tighter">Biometrics</h4>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mt-2">Active Stream</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <Activity size={28} className="text-secondary animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <HealthVital label="Cardiac Velocity" value="76" unit="bpm" icon={<Heart size={20} fill="currentColor" />} color="#FF4D4D" />
                <HealthVital label="Bio-Availability" value="94" unit="%" icon={<TrendingUp size={20} />} color="#00D2A0" />
              </div>
              <button className="w-full mt-16 py-6 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl">
                DOWNLOAD CORE REPORT <ArrowUpRight size={16} />
              </button>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
