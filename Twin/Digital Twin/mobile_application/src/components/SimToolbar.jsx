/**
 * SimToolbar.jsx
 * Top simulation control bar — mode, current, pause/reset
 */
import React from 'react';
import {
  Play, Pause, RotateCcw, Zap, BatteryCharging, BatteryFull,
  Sliders, Activity, ChevronDown
} from 'lucide-react';

export default function SimToolbar({
  simMode, onChangeMode,
  loadCurrent, onChangeCurrent,
  isPaused, onTogglePause,
  onReset,
  bms,
}) {
  return (
    <div style={{
      flexShrink: 0,
      background: 'rgba(10,15,26,0.98)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 20px',
      height: 50,
      display: 'flex', alignItems: 'center', gap: 20,
    }}>

      {/* Pause / Resume */}
      <button
        className={`btn ${isPaused ? 'btn-primary' : 'btn-ghost'}`}
        onClick={onTogglePause}
        style={{ gap: 6 }}
      >
        {isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} />}
        {isPaused ? 'Resume' : 'Pause'}
      </button>

      <button className="btn btn-ghost" onClick={onReset} style={{ gap: 6 }}>
        <RotateCcw size={13} /> Reset
      </button>

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

      {/* Mode selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mode</span>
        {[
          { id: 'idle',        label: 'Idle',        Icon: BatteryFull    },
          { id: 'discharging', label: 'Discharge',   Icon: Zap            },
          { id: 'charging',    label: 'Charge',      Icon: BatteryCharging },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => onChangeMode(m.id)}
            className={`btn ${simMode === m.id ? 'btn-active' : 'btn-ghost'}`}
            style={{ gap: 5, fontSize: 11 }}
          >
            <m.Icon size={12} /> {m.label}
          </button>
        ))}
      </div>

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

      {/* Load current */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sliders size={13} style={{ color: '#22d3ee' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
          Current: <span style={{ color: '#22d3ee', fontFamily: 'var(--font-mono)' }}>{loadCurrent.toFixed(0)} A</span>
        </span>
        <input
          type="range" min={2} max={35} step={1} value={loadCurrent}
          onChange={e => onChangeCurrent(Number(e.target.value))}
          style={{ width: 90, accentColor: '#22d3ee' }}
        />
      </div>

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

      {/* Live pack telemetry chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <div className="chip chip-elec">
          <Activity size={9} /> {bms.packVoltage.toFixed(1)} V
        </div>
        <div className="chip chip-elec">
          <Zap size={9} /> {Math.abs(bms.packCurrent).toFixed(1)} A
        </div>
        <div className={`chip ${bms.maxTemp > 50 ? 'chip-crit' : bms.maxTemp > 42 ? 'chip-warn' : 'chip-thermal'}`}>
          🌡 {bms.maxTemp.toFixed(1)} °C
        </div>
        <div className={`chip ${bms.status === 'critical' ? 'chip-crit' : bms.status === 'warning' ? 'chip-warn' : 'chip-bms'}`}>
          BMS: {bms.safetyStatus}
        </div>
        <div className="chip chip-ok">
          SOC {bms.packSOC.toFixed(1)} %
        </div>
      </div>

    </div>
  );
}
