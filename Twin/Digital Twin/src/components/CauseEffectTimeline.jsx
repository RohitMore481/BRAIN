/**
 * CauseEffectTimeline.jsx — 4-Stage Physical Cause-and-Effect Panel
 * Displays exact physical sequence:
 * CAUSE -> EQUATION -> PHYSICAL RESPONSE -> BMS OUTPUT
 */
import React from 'react';
import { GitCommit, ArrowRight, Zap, Flame, Activity, ShieldAlert } from 'lucide-react';
import { getCauseEffectSteps } from '../engine/batteryPhysics';

export default function CauseEffectTimeline({ state }) {
  const data = getCauseEffectSteps(state);
  const isFaultActive = Object.values(state.faults || {}).some(Boolean);

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'rgba(11, 17, 30, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '10px 24px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
      zIndex: 22
    }}>
      {/* PANEL HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: isFaultActive ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
            border: `1px solid ${isFaultActive ? '#ef4444' : '#10b981'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isFaultActive ? '#ef4444' : '#10b981'
          }}>
            <GitCommit size={14} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              Physical Cause-and-Effect Engine
              <span style={{
                fontSize: 9, fontWeight: 800,
                background: isFaultActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isFaultActive ? '#f87171' : '#34d399',
                border: `1px solid ${isFaultActive ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
                padding: '1px 6px', borderRadius: 6
              }}>
                CAUSE → EQUATION → PHYSICAL RESPONSE → BMS OUTPUT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-STAGE PIPELINE GRID */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>

        {/* STAGE 1: CAUSE */}
        <StageCard
          num="1"
          label="CAUSE"
          text={data.cause}
          color="#38bdf8"
          icon={Zap}
        />

        <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

        {/* STAGE 2: EQUATION */}
        <StageCard
          num="2"
          label="EQUATION APPLIED"
          text={data.equation}
          color="#c084fc"
          icon={Activity}
        />

        <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

        {/* STAGE 3: PHYSICAL RESPONSE */}
        <StageCard
          num="3"
          label="PHYSICAL RESPONSE"
          text={data.response}
          color="#fbbf24"
          icon={Flame}
        />

        <ArrowRight size={14} style={{ color: '#475569', flexShrink: 0 }} />

        {/* STAGE 4: BMS OUTPUT */}
        <StageCard
          num="4"
          label="BMS TELEMETRY OUTPUT"
          text={data.bmsOutput}
          color={isFaultActive ? "#f87171" : "#10b981"}
          icon={ShieldAlert}
        />

      </div>
    </div>
  );
}

function StageCard({ num, label, text, color, icon: Icon }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 220,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      border: `1px solid ${color}40`,
      borderRadius: 8,
      padding: '8px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 9, fontWeight: 900,
          backgroundColor: color, color: '#0f172a',
          width: 16, height: 16, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {num}
        </span>
        <span style={{ fontSize: 9, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 10, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.35 }}>
        {text}
      </div>
    </div>
  );
}
