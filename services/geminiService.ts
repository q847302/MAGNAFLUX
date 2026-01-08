
import { GoogleGenAI, Type } from "@google/genai";
import { FieldState, DiagnosticReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getQuantumDiagnostic = async (state: FieldState): Promise<DiagnosticReport> => {
  const prompt = `Analyze this simulated quantum magnetic field state and provide a technical diagnostic report. 
  Current Field Parameters:
  - Intensity: ${state.intensity}%
  - Fluctuation: ${state.fluctuation}%
  - Entanglement Degree: ${state.entanglement}%
  - Resonance Frequency: ${state.frequency} GHz
  - Anomalies Detected: ${state.anomalies.join(", ") || "None"}

  Act as a Lead Quantum Field Engineer. Provide a report in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A technical summary of the field condition." },
            recommendation: { type: Type.STRING, description: "Operational advice for the user." },
            riskLevel: { type: Type.STRING, description: "One of: Low, Moderate, Critical, Quantum Collapse." },
          },
          required: ["summary", "recommendation", "riskLevel"]
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      timestamp: new Date().toLocaleTimeString(),
      summary: data.summary || "Unable to parse field harmonics.",
      recommendation: data.recommendation || "Maintain current containment protocols.",
      riskLevel: data.riskLevel || "Low",
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      timestamp: new Date().toLocaleTimeString(),
      summary: "Communication link with the Quantum Core was severed.",
      recommendation: "Manual override suggested.",
      riskLevel: "Critical",
    };
  }
};
