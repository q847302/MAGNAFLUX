
export interface FieldState {
  intensity: number;
  fluctuation: number;
  entanglement: number;
  frequency: number;
  energyLevel: number; // Added
  particleSpin: number; // Added
  anomalies: string[];
}

export interface DiagnosticReport {
  timestamp: string;
  summary: string;
  recommendation: string;
  riskLevel: 'Low' | 'Moderate' | 'Critical' | 'Quantum Collapse';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}
