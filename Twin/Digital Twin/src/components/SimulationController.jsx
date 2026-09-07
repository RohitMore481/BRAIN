import React from 'react';
import { Play, Pause, Code, Zap } from 'lucide-react';

export default function SimulationController({
  isSimulating,
  onToggleSimulation,
  isAutoTicking,
  onToggleAutoTick,
  onRunStepSimulation,
  onOpenApiModal
}) {
  return (
    <footer style={{
      height: '60px',
      backgroundColor: '#0f172a',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 40
    }}>
      {/* Left: Primary Simulation Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onRunStepSimulation}
          className="pulsing"
          style={{
            height: '40px',
            padding: '0 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #0284c7, #00e5ff)',
            color: '#070a11',
            fontSize: '13px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 16px rgba(0, 229, 255, 0.4)',
            transition: 'transform 0.15s ease'
          }}
        >
          <Zap size={16} fill="#070a11" />
          <span>Run Battery Simulation</span>
        </button>

        <button
          onClick={onToggleAutoTick}
          style={{
            height: '38px',
            padding: '0 14px',
            borderRadius: '8px',
            border: `1px solid ${isAutoTicking ? '#34d399' : '#475569'}`,
            backgroundColor: isAutoTicking ? 'rgba(52, 211, 153, 0.15)' : '#1e293b',
            color: isAutoTicking ? '#34d399' : '#94a3b8',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isAutoTicking ? <Pause size={14} /> : <Play size={14} />}
          <span>{isAutoTicking ? 'Auto-Tick: ACTIVE' : 'Auto-Tick: OFF'}</span>
        </button>
      </div>

      {/* Center: Status Banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isSimulating || isAutoTicking ? '#00e5ff' : '#64748b',
          boxShadow: isSimulating || isAutoTicking ? '0 0 10px #00e5ff' : 'none'
        }} />
        <span style={{ fontWeight: '600' }}>
          {isSimulating
            ? 'Executing Digital Twin Flow Vector...'
            : isAutoTicking
            ? 'Live Real-Time Telemetry Streaming...'
            : 'Simulator Ready. Tweak inputs or click Run Simulation.'}
        </span>
      </div>

      {/* Right: REST API Schema Drawer Button */}
      <button
        onClick={onOpenApiModal}
        style={{
          height: '38px',
          padding: '0 14px',
          borderRadius: '8px',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          backgroundColor: 'rgba(168, 85, 247, 0.12)',
          color: '#e9d5ff',
          fontSize: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Code size={14} color="#a855f7" />
        <span>Inspect REST API Payload</span>
      </button>
    </footer>
  );
}
