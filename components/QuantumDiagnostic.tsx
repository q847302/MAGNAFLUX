
import React, { useState } from 'react';
import { FieldState, DiagnosticReport } from '../types';
import { getQuantumDiagnostic } from '../services/geminiService';

interface Props {
  state: FieldState;
  onReportReceived: (report: DiagnosticReport) => void;
}

const QuantumDiagnostic: React.FC<Props> = ({ state, onReportReceived }) => {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunDiagnostic = async () => {
    setLoading(true);
    const result = await getQuantumDiagnostic(state);
    setReport(result);
    onReportReceived(result);
    setLoading(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-orange-500';
      case 'Quantum Collapse': return 'text-red-500 animate-pulse';
      case 'Moderate': return 'text-yellow-500';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          AI Diagnostic Engine
        </h2>
        <button
          onClick={handleRunDiagnostic}
          disabled={loading}
          className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
            loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]'
          }`}
        >
          {loading ? 'ANALYZING FIELD...' : 'RUN FULL DIAGNOSTIC'}
        </button>
      </div>

      <div className="flex-1 glass rounded-xl p-6 relative overflow-hidden flex flex-col justify-start min-h-[400px] overflow-y-auto">
        {!report && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <svg className="w-12 h-12 text-cyan-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-slate-500 text-sm italic">Waiting for quantum telemetry...</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4 w-full mt-12">
            <div className="h-4 bg-slate-800/50 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-slate-800/50 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-slate-800/50 rounded animate-pulse w-5/6"></div>
            <div className="flex justify-center mt-8">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {report && !loading && (
          <div className="w-full space-y-6">
            <div className="flex justify-between items-start border-b border-cyan-900/30 pb-2">
              <div className="mono text-[10px] text-cyan-700">SCAN_COMPLETE // {report.timestamp}</div>
              {report.visualIntervention && (
                <div className="mono text-[10px] bg-purple-500/10 text-purple-400 px-2 rounded border border-purple-500/30">
                  MODE: {report.visualIntervention}
                </div>
              )}
            </div>
            
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                Field Summary
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRiskColor(report.riskLevel)} border-current bg-opacity-10`}>
                  {report.riskLevel}
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-slate-200">{report.summary}</p>
            </section>

            <section className="bg-cyan-950/20 p-4 rounded-lg border border-cyan-900/30">
              <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-3">Granular Adjustments</h3>
              <div className="space-y-2">
                {report.suggestedAdjustments.map((adj, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] bg-slate-900/50 p-2 rounded">
                    <span className="text-slate-400">{adj.parameter}</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      adj.direction === 'increase' ? 'text-green-400' : adj.direction === 'decrease' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {adj.direction === 'increase' ? '▲' : adj.direction === 'decrease' ? '▼' : '●'}
                      {adj.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Protocol Recommendation</h3>
              <p className="text-sm text-cyan-200/80 italic border-l-2 border-cyan-700 pl-3">"{report.recommendation}"</p>
            </section>
          </div>
        )}

        {/* Decorative Grid Lines */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-cyan-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-cyan-500/10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default QuantumDiagnostic;
