
export interface FieldState {
  intensity: number;
  fluctuation: number;
  entanglement: number;
  frequency: number;
  energyLevel: number;
  particleSpin: number;
  anomalies: string[];
}

export interface SuggestedAdjustment {
  parameter: string;
  value: string;
  direction: 'increase' | 'decrease' | 'stabilize';
}

export interface DiagnosticReport {
  timestamp: string;
  summary: string;
  recommendation: string;
  riskLevel: 'Low' | 'Moderate' | 'Critical' | 'Quantum Collapse';
  suggestedAdjustments: SuggestedAdjustment[];
  visualIntervention?: 'VECTOR_TRACE' | 'RESONANCE_SCAN' | 'VOID_ANALYSIS' | 'FLUX_GLOW';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}
