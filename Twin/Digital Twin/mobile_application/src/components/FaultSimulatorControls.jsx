import React from 'react';
import { Zap, AlertTriangle, ShieldAlert, Fan, RefreshCw, BatteryCharging, Flame } from 'lucide-react';

export default function FaultSimulatorControls({
  simMode,
  onStartCharging,
  onStartDischarging,
  onInjectDegradationFault,
  onInjectCellFailure,
  onToggleCoolingFailure,
  isCoolingFailed,
  onResetBattery
}) {
  return (
    <div style={{
      backgroundColor: '#0f172a',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Simulation Controls Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          SIMULATION MODES:
        </span>

        {/* START CHARGING BUTTON */}
        <button
          onClick={onStartCharging}
          style={{
            height: '36px',
            padding: '0 14px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: simMode === 'charging' ? '#0284c7' : '#1e293b',
            color: simMode === 'charging' ? '#fff' : '#38bdf8',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: simMode === 'charging' ? '0 0 14px rgba(2, 132, 199, 0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <BatteryCharging size={15} />
          <span>START CHARGING</span>
        </button>

        {/* START DISCHARGING BUTTON */}
        <button
          onClick={onStartDischarging}
          style={{
            height: '36px',
            padding: '0 14px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: simMode === 'discharging' ? '#a855f7' : '#1e293b',
            color: simMode === 'discharging' ? '#fff' : '#c084fc',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: simMode === 'discharging' ? '0 0 14px rgba(168, 85, 247, 0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Zap size={15} />
          <span>START DISCHARGING</span>
        </button>
      </div>

      {/* Fault Injection Panel Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          FAULT INJECTION:
        </span>

        {/* INJECT DEGRADATION FAULT */}
        <button
          onClick={onInjectDegradationFault}
          style={{
            height: '36px',
            padding: '0 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 183, 3, 0.4)',
            backgroundColor: 'rgba(255, 183, 3, 0.12)',
            color: '#ffb703',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Flame size={15} />
          <span>INJECT CELL DEGRADATION</span>
        </button>

        {/* CELL FAILURE BUTTON */}
        <button
          onClick={onInjectCellFailure}
          style={{
            height: '36px',
            padding: '0 14px',
            borderRadius: '8px',
            border: '1px solid rgba(244, 63, 94, 0.5)',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            color: '#f43f5e',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldAlert size={15} />
          <span>CELL FAILURE (SHORT)</span>
        </button>

        {/* COOLING FAILURE TOGGLE */}
        <button
          onClick={onToggleCoolingFailure}
          style={{
            height: '36px',
            padding: '0 14px',
            borderRadius: '8px',
            border: `1px solid ${isCoolingFailed ? '#f43f5e' : '#475569'}`,
            backgroundColor: isCoolingFailed ? '#f43f5e' : '#1e293b',
            color: isCoolingFailed ? '#fff' : '#94a3b8',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Fan size={15} />
          <span>{isCoolingFailed ? 'COOLING: FAILED (OFF)' : 'COOLING: NORMAL (ON)'}</span>
        </button>

        {/* RESET BATTERY */}
        <button
          onClick={onResetBattery}
          style={{
            height: '36px',
            padding: '0 14px',
            borderRadius: '8px',
            border: '1px solid #334155',
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} />
          <span>RESET</span>
        </button>
      </div>
    </div>
  );
}
