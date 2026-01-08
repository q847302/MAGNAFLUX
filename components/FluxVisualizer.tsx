
import React, { useEffect, useRef } from 'react';
import { FieldState, Particle, DiagnosticReport } from '../types';

interface Props {
  state: FieldState;
  report: DiagnosticReport | null;
}

const FluxVisualizer: React.FC<Props> = ({ state, report }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    const resize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Particle system
    const particleCount = Math.floor(250 * (state.intensity / 50));
    let particles: Particle[] = [];

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random() * 100 + 50,
      color: state.entanglement > 70 
        ? '#f472b6' 
        : state.energyLevel > 150 
          ? '#fbbf24' 
          : '#22d3ee',
    });

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const getVector = (x: number, y: number, t: number) => {
      let scale = 0.005;
      if (state.anomalies.includes('Phase Drift')) {
        scale = 0.005 + Math.sin(t * 0.5) * 0.002;
      }

      const spinOffset = (state.particleSpin / 10) * Math.PI;
      let angle = Math.sin(x * scale + t) * Math.cos(y * scale + t) * Math.PI * 2 
                    * (state.frequency / 10) 
                    + spinOffset;
      
      if (state.anomalies.includes('Phase Drift')) {
        angle += Math.sin(t * 2) * 0.5;
      }

      const mag = (state.intensity / 20) * (1 + state.energyLevel / 200);
      return {
        x: Math.cos(angle) * mag,
        y: Math.sin(angle) * mag,
      };
    };

    let t = 0;
    const render = () => {
      t += 0.01 * (state.fluctuation / 50);
      
      // AI Intervention: VOID_ANALYSIS darkens the background more significantly
      const intervention = report?.visualIntervention;
      const baseAlpha = intervention === 'VOID_ANALYSIS' ? 0.4 : 0.08;
      const fadeAlpha = Math.max(baseAlpha, 0.2 - (state.energyLevel / 1000));
      ctx.fillStyle = `rgba(2, 6, 23, ${fadeAlpha})`;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const hasEventHorizon = state.anomalies.includes('Event Horizon');
      const hasFluxPinch = state.anomalies.includes('Flux Pinch');
      const horizonRadius = 40;

      particles.forEach((p, i) => {
        const force = getVector(p.x, p.y, t);
        const accel = 0.1 * (1 + state.energyLevel / 100);
        
        p.vx += force.x * accel;
        p.vy += force.y * accel;

        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (hasEventHorizon) {
          if (dist < 250) {
            const pull = (250 - dist) / 400;
            p.vx += dx * pull;
            p.vy += dy * pull;
          }
          if (dist < horizonRadius) {
            p.life = 0; 
          }
        }

        if (hasFluxPinch) {
          if (dist < 150) {
            const pull = (150 - dist) / 100;
            const swirl = (150 - dist) / 50;
            p.vx += dx * pull + dy * swirl;
            p.vy += dy * pull - dx * swirl;
          }
        }

        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.5;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (p.life <= 0) {
          particles[i] = createParticle();
        }

        // AI Intervention: VECTOR_TRACE makes particles leave longer streaks
        ctx.beginPath();
        const radius = 1.2 + (state.energyLevel / 200);
        if (intervention === 'VECTOR_TRACE') {
          ctx.moveTo(p.x - p.vx * 10, p.y - p.vy * 10);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = radius;
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          
          if (state.entanglement > 80 || intervention === 'FLUX_GLOW') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      });

      // AI Intervention: RESONANCE_SCAN circles
      if (intervention === 'RESONANCE_SCAN') {
        const scanR = (t * 500) % width;
        ctx.beginPath();
        ctx.arc(centerX, centerY, scanR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Background Grid with Lensing
      ctx.shadowBlur = 0;
      ctx.strokeStyle = intervention === 'VOID_ANALYSIS' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(34, 211, 238, 0.05)';
      const gridSize = 40;
      for (let x = 0; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y < height + gridSize; y += 10) {
          let drawX = x;
          let drawY = y;
          if (hasEventHorizon) {
            const dx = x - centerX;
            const dy = y - centerY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > horizonRadius && d < 300) {
              const lens = (horizonRadius * horizonRadius * 2) / d;
              drawX -= (dx / d) * lens;
              drawY -= (dy / d) * lens;
            }
          }
          if (y === 0) ctx.moveTo(drawX, drawY);
          else ctx.lineTo(drawX, drawY);
        }
        ctx.stroke();
      }

      // Anomaly Overlays
      state.anomalies.forEach(anomaly => {
        ctx.shadowBlur = 0;
        switch (anomaly) {
          case 'Tachyon Leak':
            for (let j = 0; j < 8; j++) {
              ctx.beginPath();
              const seed = (t + j * 0.5) % 1;
              const sx = (Math.sin(j * 1.5) * 0.5 + 0.5) * width;
              const sy = seed * height;
              const len = 40 + Math.random() * 60;
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx, sy + len);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * (1 - seed)})`;
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.fillStyle = 'white';
              ctx.fillRect(sx - 1, sy + len - 1, 3, 3);
            }
            break;
          case 'Flux Pinch':
            ctx.beginPath();
            const pinchR = 60 + Math.sin(t * 20) * 15;
            ctx.arc(centerX, centerY, pinchR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(236, 72, 153, ${0.4 + Math.random() * 0.4})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            for (let k = 0; k < 4; k++) {
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              let lx = centerX, ly = centerY;
              const angle = (k / 4) * Math.PI * 2 + t * 5;
              for (let step = 0; step < 5; step++) {
                lx += Math.cos(angle) * 20 + (Math.random() - 0.5) * 30;
                ly += Math.sin(angle) * 20 + (Math.random() - 0.5) * 30;
                ctx.lineTo(lx, ly);
              }
              ctx.strokeStyle = '#f472b6';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            break;
          case 'Event Horizon':
            const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, horizonRadius + 15);
            grad.addColorStop(0, '#000000');
            grad.addColorStop(0.9, '#000000');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, horizonRadius + 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            for (let d = 0; d < 3; d++) {
              ctx.beginPath();
              const diskW = horizonRadius * (2 + d * 0.5) + Math.sin(t * 3 + d) * 10;
              const diskH = diskW * 0.3;
              ctx.ellipse(centerX, centerY, diskW, diskH, t * 1.5 + d, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(251, 191, 36, ${0.6 - d * 0.2})`;
              ctx.stroke();
            }
            break;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [state, report]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-950 rounded-lg border border-cyan-900/30">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* AI Intervention HUD */}
      {report?.visualIntervention && (
        <div className="absolute top-4 right-4 text-[10px] mono bg-purple-500/20 text-purple-400 px-3 py-1 rounded border border-purple-500/50 animate-pulse">
          AI_INTERVENTION: {report.visualIntervention}
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-none">
        {state.anomalies.map(anomaly => (
          <div key={anomaly} className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/50 rounded text-[9px] text-red-400 mono animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            CRITICAL DETECTION: {anomaly.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="text-[10px] uppercase tracking-widest text-cyan-500 mb-1 font-bold">Vector Field Dynamics</div>
        <div className="w-32 h-[1px] bg-gradient-to-r from-cyan-500 to-transparent"></div>
        <div className="mt-1 flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <div className="text-[8px] mono text-cyan-700">RESONANCE: {state.frequency.toFixed(2)} GHz</div>
        </div>
      </div>
    </div>
  );
};

export default FluxVisualizer;
