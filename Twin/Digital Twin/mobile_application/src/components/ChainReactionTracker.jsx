/**
 * ChainReactionTracker.jsx — Physical Cause-and-Effect Chain Reaction Visualizer
 * Renders the explicit multi-stage physics pipeline:
 * Input Change → Physical Equation → Component Response → Thermal Conduction → BMS Observation → System Effect
 */
import React from 'react';
import { 
  GitCommit, ArrowRight, Zap, Flame, Thermometer, ShieldAlert, Cpu, Activity
} from 'lucide-react';
import { computeChainReaction } from '../engine/batteryPhysics';

export default function ChainReactionTracker({ state }) {
  const chains = computeChainReaction(state);

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'rgba(11, 17, 30, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '12px 24px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
      zIndex: 22
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff'
          }}>
            <GitCommit size={15} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              Physical Cause-and-Effect Chain Reaction Visualizer
              <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.4)', padding: '1px 6px', borderRadius: 6 }}>
                INPUT → EQUATION → RESPONSE → SYSTEM EFFECT
              </span>
            </div>
            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>
              Live multi-variable physics dependencies (Joule Heating Q=I²R, Fourier Conduction, Arrhenius Degradation)
            </div>
          </div>
        </div>
      </div>

      {/* CHAIN PIPELINES CAROUSEL / GRID */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {chains.map((chain) => (
          <div
            key={chain.id}
            style={{
              flexShrink: 0,
              minWidth: 700,
              maxWidth: 900,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {/* STEP 1: TRIGGER / INPUT CHANGE */}
            <StepCard
              step="1"
              title="Input Parameter"
              text={chain.trigger}
              icon={Zap}
              color="#38bdf8"
            />

            <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

            {/* STEP 2: PHYSICAL FORMULA APPLIED */}
            <StepCard
              step="2"
              title="Physics Equation"
              text={chain.equation}
              icon={Activity}
              color="#c084fc"
            />

            <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

            {/* STEP 3: COMPONENT RESPONSE */}
            <StepCard
              step="3"
              title="Component Response"
              text={chain.componentResponse}
              icon={Flame}
              color="#fbbf24"
            />

            <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

            {/* STEP 4: SPATIAL CONDUCTION */}
            <StepCard
              step="4"
              title="Heat Conduction"
              text={chain.spatialConduction}
              icon={Thermometer}
              color="#f97316"
            />

            <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

            {/* STEP 5: BMS TELEMETRY SENSING */}
            <StepCard
              step="5"
              title="BMS Telemetry"
              text={chain.bmsObservation}
              icon={Cpu}
              color="#818cf8"
            />

            <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

            {/* STEP 6: SAFETY ACTION */}
            <StepCard
              step="6"
              title="System Effect"
              text={chain.safetyAction}
              icon={ShieldAlert}
              color="#10b981"
            />

          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, title, text, icon: Icon, color }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      border: `1px solid ${color}30`,
      borderRadius: 8,
      padding: '7px 9px',
      minWidth: 110
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
        <div style={{
          fontSize: 8, fontWeight: 900, color: '#0f172a',
          backgroundColor: color, width: 14, height: 14, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {step}
        </div>
        <div style={{ fontSize: 9, fontWeight: 800, color, textTransform: 'uppercase' }}>
          {title}
        </div>
      </div>
      <div style={{ fontSize: 10, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.3 }}>
        {text}
      </div>
    </div>
  );
}
