
import React from 'react';
import { FieldState } from '../types';

interface Props {
  state: FieldState;
  setState: React.Dispatch<React.SetStateAction<FieldState>>;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
}

const ControlPanel: React.FC<Props> = ({ state, setState, isStreaming, setIsStreaming }) => {
  const updateState = (key: keyof FieldState, val: any) => {
    setState(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-red-500 animate-ping' : 'bg-cyan-400'}`}></span>
          Core Parameters
        </h2>
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={`text-[10px] px-2 py-1 rounded border transition-all flex items-center gap-2 ${
            isStreaming 
              ? 'border-red-500/50 bg-red-500/10 text-red-400' 
              : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          {isStreaming ? 'SYNC ACTIVE' : 'REMOTE SYNC'}
        </button>
      </div>

      <div className="space-y-4">
        <div className={isStreaming ? 'opacity-50 pointer-events-none' : ''}>
          <label className="text-xs uppercase tracking-tighter text-slate-400 mb-2 block flex justify-between">
            Flux Intensity <span>{state.intensity}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={state.intensity}
            onChange={(e) => updateState('intensity', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div className={isStreaming ? 'opacity-50 pointer-events-none' : ''}>
          <label className="text-xs uppercase tracking-tighter text-slate-400 mb-2 block flex justify-between">
            Energy Level <span>{state.energyLevel} eV</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={state.energyLevel}
            onChange={(e) => updateState('energyLevel', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className={isStreaming ? 'opacity-50 pointer-events-none' : ''}>
          <label className="text-xs uppercase tracking-tighter text-slate-400 mb-2 block flex justify-between">
            Particle Spin <span>{state.particleSpin} ℏ</span>
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={state.particleSpin}
            onChange={(e) => updateState('particleSpin', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div className={isStreaming ? 'opacity-50 pointer-events-none' : ''}>
          <label className="text-xs uppercase tracking-tighter text-slate-400 mb-2 block flex justify-between">
            Quantum Fluctuation <span>{state.fluctuation}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={state.fluctuation}
            onChange={(e) => updateState('fluctuation', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div className={isStreaming ? 'opacity-50 pointer-events-none' : ''}>
          <label className="text-xs uppercase tracking-tighter text-slate-400 mb-2 block flex justify-between">
            Entanglement Degree <span>{state.entanglement}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={state.entanglement}
            onChange={(e) => updateState('entanglement', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <label className="text-xs uppercase tracking-tighter text-slate-400 mb-2 block">Anomaly Simulation</label>
        <div className="flex flex-wrap gap-2">
          {['Tachyon Leak', 'Flux Pinch', 'Phase Drift', 'Event Horizon'].map(anomaly => (
            <button
              key={anomaly}
              onClick={() => {
                const current = new Set(state.anomalies);
                if (current.has(anomaly)) current.delete(anomaly);
                else current.add(anomaly);
                updateState('anomalies', Array.from(current));
              }}
              className={`px-3 py-1 text-[10px] rounded border transition-all ${
                state.anomalies.includes(anomaly)
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              {anomaly}
            </button>
          ))}
        </div>
      </div>
      
      {isStreaming && (
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded text-[10px] text-cyan-400 mono">
          <div className="flex justify-between mb-1">
            <span>PACKET_STREAM</span>
            <span className="animate-pulse">CONNECTED</span>
          </div>
          <div className="truncate opacity-60">RECV: 0x{Math.floor(Math.random()*16777215).toString(16).toUpperCase()}...</div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
