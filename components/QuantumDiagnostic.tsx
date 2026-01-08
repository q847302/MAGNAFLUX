
import React, { useState } from 'react';
import { FieldState, DiagnosticReport } from '../types';
import { getQuantumDiagnostic } from '../services/geminiService';

interface Props {
  state: FieldState;
}

const QuantumDiagnostic: React.FC<Props> = ({ state }) => {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunDiagnostic = async () => {
    setLoading(true);
    const result = await getQuantumDiagnostic(state);
    setReport(result);
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

      <div className="flex-1 glass rounded-xl p-6 relative overflow-hidden flex flex-col justify-center items-center min-h-[300px]">
        {!report && !loading && (
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-dashed border-cyan-800 rounded-full flex items-center justify-center mb-4 mx-auto opacity-40">
              <svg className="w-8 h-8 text-cyan-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm italic">Initiate scan to begin quantum field analysis</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4 w-full">
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
            <div className="flex justify-between items-start">
              <div className="mono text-[10px] text-cyan-700">REPORT_ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
              <div className="mono text-[10px] text-cyan-700">{report.timestamp}</div>
            </div>
            
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                Field Summary
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRiskColor(report.riskLevel)} border-current bg-opacity-10`}>
                  {report.riskLevel}
                </span>
              </h3>
              <p className="text-lg leading-relaxed text-slate-200 font-light">{report.summary}</p>
            </section>

            <section className="bg-cyan-950/20 p-4 rounded-lg border border-cyan-900/30">
              <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Protocol Recommendation</h3>
              <p className="text-sm text-cyan-200/80 italic">"{report.recommendation}"</p>
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
