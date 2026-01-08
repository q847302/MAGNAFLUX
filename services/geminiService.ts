
import { GoogleGenAI, Type } from "@google/genai";
import { FieldState, DiagnosticReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getQuantumDiagnostic = async (state: FieldState): Promise<DiagnosticReport> => {
  const prompt = `Analyze this simulated quantum magnetic field state. 
  Current Field Parameters:
  - Intensity: ${state.intensity}%
  - Energy Level: ${state.energyLevel} eV
  - Particle Spin: ${state.particleSpin} h-bar
  - Fluctuation: ${state.fluctuation}%
  - Entanglement Degree: ${state.entanglement}%
  - Resonance Frequency: ${state.frequency} GHz
  - Anomalies Detected: ${state.anomalies.join(", ") || "None"}

  Act as a Lead Quantum Field Engineer. Provide a detailed report in JSON format.
  Include:
  1. A technical summary.
  2. Operational recommendations.
  3. Risk level.
  4. Specific parameter adjustments (suggestedAdjustments) to stabilize the field.
  5. A visual intervention mode (visualIntervention) based on the situation:
     - VECTOR_TRACE: If energy is high or spin is erratic.
     - RESONANCE_SCAN: If frequency is unstable or anomalies like Tachyon Leak are present.
     - VOID_ANALYSIS: If an Event Horizon or Flux Pinch is detected.
     - FLUX_GLOW: If entanglement is the primary focus.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'Critical', 'Quantum Collapse'] },
            suggestedAdjustments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  value: { type: Type.STRING },
                  direction: { type: Type.STRING, enum: ['increase', 'decrease', 'stabilize'] }
                },
                required: ["parameter", "value", "direction"]
              }
            },
            visualIntervention: { 
              type: Type.STRING, 
              enum: ['VECTOR_TRACE', 'RESONANCE_SCAN', 'VOID_ANALYSIS', 'FLUX_GLOW'] 
            }
          },
          required: ["summary", "recommendation", "riskLevel", "suggestedAdjustments", "visualIntervention"]
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      timestamp: new Date().toLocaleTimeString(),
      summary: data.summary,
      recommendation: data.recommendation,
      riskLevel: data.riskLevel,
      suggestedAdjustments: data.suggestedAdjustments || [],
      visualIntervention: data.visualIntervention,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      timestamp: new Date().toLocaleTimeString(),
      summary: "Communication link with the Quantum Core was severed.",
      recommendation: "Manual override suggested.",
      riskLevel: "Critical",
      suggestedAdjustments: [],
    };
  }
};
