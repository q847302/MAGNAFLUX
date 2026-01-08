
import React, { useState, useEffect, useRef } from 'react';
import FluxVisualizer from './components/FluxVisualizer';
import ControlPanel from './components/ControlPanel';
import QuantumDiagnostic from './components/QuantumDiagnostic';
import { FieldState, DiagnosticReport } from './types';
import { audioEngine } from './services/audioService';

const App: React.FC = () => {
  const [fieldState, setFieldState] = useState<FieldState>({
    intensity: 42,
    fluctuation: 15,
    entanglement: 10,
    frequency: 4.8,
    energyLevel: 80,
    particleSpin: 1.5,
    anomalies: [],
  });

  const [lastReport, setLastReport] = useState<DiagnosticReport | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioInitialized = useRef(false);

  // Audio Control
  const toggleAudio = () => {
    if (!audioInitialized.current) {
      audioEngine.init();
      audioInitialized.current = true;
    }
    setIsMuted(!isMuted);
    audioEngine.resume();
  };

  useEffect(() => {
    audioEngine.update(fieldState, isMuted);
  }, [fieldState, isMuted]);

  // Simulated Real-Time Data Module
  useEffect(() => {
    let interval: number;
    if (isStreaming) {
      interval = window.setInterval(() => {
        setFieldState(prev => {
          const drift = (val: number, range: number, factor = 1) => {
            const delta = (Math.random() - 0.5) * factor;
            let next = val + delta;
            return Math.min(Math.max(next, 0), range);
          };

          return {
            ...prev,
            intensity: drift(prev.intensity, 100, 2),
            energyLevel: drift(prev.energyLevel, 200, 5),
            particleSpin: drift(prev.particleSpin, 10, 0.5),
            fluctuation: drift(prev.fluctuation, 100, 1),
            frequency: drift(prev.frequency, 20, 0.1),
            entanglement: Math.random() > 0.95 
              ? Math.min(100, prev.entanglement + 20) 
              : drift(prev.entanglement, 100, 0.5)
          };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white flex items-center gap-3">
            <span className="bg-cyan-500 w-8 h-8 rounded flex items-center justify-center text-slate-950">Q</span>
            MAGNAFLUX <span className="text-cyan-500 font-light">VISUALISER</span>
          </h1>
          <p className="text-slate-500 mono text-xs mt-1 uppercase tracking-widest">Quantum Magnetic Resonance Interface v3.4.0-Stable</p>
        </div>
        <div className="flex gap-4 items-center mono text-[10px]">
          {/* Audio Entropy Toggle */}
          <button 
            onClick={toggleAudio}
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
              !isMuted ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            {isMuted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
            AUDIO_ENTROPY
          </button>

          <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full bg-green-500 ${isStreaming ? 'animate-ping' : ''}`}></span>
            {isStreaming ? 'REMOTE_FEED_ACTIVE' : 'CORE_ONLINE'}
          </div>
          <div className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
            SYNC_LATENCY: {isStreaming ? (Math.random() * 0.1).toFixed(4) : '0.0400'}ms
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Controls and Status */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="glass p-6 rounded-2xl neon-border">
            <ControlPanel 
              state={fieldState} 
              setState={setFieldState} 
              isStreaming={isStreaming} 
              setIsStreaming={setIsStreaming} 
            />
          </div>

          <div className="glass p-6 rounded-2xl border-slate-800/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sub-System Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Cooling Array', status: 'Optimal', color: 'text-green-400' },
                { label: 'Energy Modulator', status: fieldState.energyLevel > 180 ? 'OVR-LOAD' : 'Stable', color: fieldState.energyLevel > 180 ? 'text-red-400' : 'text-green-400' },
                { label: 'Spin Harmonizer', status: Math.abs(fieldState.particleSpin) > 8 ? 'High Varia' : 'Active', color: 'text-cyan-400' },
                { label: 'Chronal Shielding', status: fieldState.intensity > 80 ? 'Warning' : 'Nominal', color: fieldState.intensity > 80 ? 'text-orange-400' : 'text-slate-400' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Section: Visualiser */}
        <section className="lg:col-span-6 min-h-[500px] flex flex-col gap-4">
          <div className="flex-1 relative">
            <FluxVisualizer state={fieldState} report={lastReport} />
            
            {/* HUD Overlays */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 text-right pointer-events-none">
              <div className="mono text-4xl font-bold text-white/90">
                {fieldState.intensity.toFixed(1)} <span className="text-xl text-cyan-500">μT</span>
              </div>
              <div className="mono text-xs text-slate-500 uppercase tracking-wider">Localized Field Strength</div>
            </div>
          </div>

          <div className="h-24 glass rounded-xl flex items-center px-6 gap-8 overflow-x-auto no-scrollbar">
            <div className="flex-shrink-0">
               <div className="text-[10px] text-slate-500 uppercase mb-1">Entanglement State</div>
               <div className="flex gap-1">
                 {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-6 rounded-full transition-all duration-500 ${
                        i < (fieldState.entanglement / 10) + 1 ? 'bg-cyan-500 shadow-[0_0_5px_cyan]' : 'bg-slate-800'
                      }`}
                    />
                 ))}
               </div>
            </div>
            <div className="flex-shrink-0">
               <div className="text-[10px] text-slate-500 uppercase mb-1">Energy Profile</div>
               <div className="flex gap-1 items-end h-6">
                 {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-purple-900/40 rounded-t transition-all duration-300"
                      style={{ height: `${(fieldState.energyLevel / 200) * (50 + Math.random() * 50)}%` }}
                    />
                 ))}
               </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 border-t-2 border-pink-500 rounded-full animate-spin"
                    style={{ animationDuration: `${Math.max(0.1, 2 / (Math.abs(fieldState.particleSpin) + 0.1))}s` }}
                  ></div>
                  <span className="mono text-[10px] text-pink-400">ℏ</span>
               </div>
               <div>
                  <div className="text-[10px] text-slate-500 uppercase">Spin Correlation</div>
                  <div className="text-xs text-white">SYNC_{Math.abs(fieldState.particleSpin).toFixed(1)}</div>
               </div>
            </div>
          </div>
        </section>

        {/* Right Section: Diagnostics */}
        <section className="lg:col-span-3">
          <QuantumDiagnostic state={fieldState} onReportReceived={setLastReport} />
        </section>

      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-slate-800/50 pt-4 flex flex-col md:flex-row justify-between text-[10px] text-slate-600 mono uppercase tracking-widest gap-2">
        <div>System-ID: QX-990-ALPHA // {isStreaming ? 'EXTERNAL_SYNC: OK' : 'LOCAL_ONLY'}</div>
        <div className="flex gap-6">
          <span>Active Processes: {isStreaming ? '12,941' : '4,012'}</span>
          <span>Security: Level 5</span>
          <span>Buffer: {isStreaming ? '84.2%' : '99.8%'}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
