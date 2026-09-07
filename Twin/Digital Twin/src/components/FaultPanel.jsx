/**
 * FaultPanel.jsx
 * Fault injection sidebar — 5 faults with live controls and descriptions
 */
import React from 'react';
import {
  AlertTriangle, Activity, Flame, ZapOff, Radio, ThermometerSun,
  CheckCircle, XCircle, Info
} from 'lucide-react';

const FAULT_DEFS = [
  {
    key: 'cellDegradation',
    label: 'Cell Degradation',
    targetLabel: 'Cell 3 (Module 1)',
    icon: Activity,
    color: '#a855f7',
    bg:   'rgba(168,85,247,0.1)',
    border: 'rgba(168,85,247,0.35)',
    description: 'Capacity fade & R_int increase',
    chain: ['SOH falls below 80%', 'R_int increases → more Joule heat', 'Voltage sag under load', 'BMS detects cell voltage imbalance'],
  },
  {
    key: 'increasedResistance',
    label: 'Resistance Spike',
    targetLabel: 'Cell 7 (Module 2)',
    icon: Flame,
    color: '#f59e0b',
    bg:   'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    description: 'R_int spikes to ~0.18 Ω (6×)',
    chain: ['High I²·R heat generation', 'Cell temperature rises', 'Thermal conduction to neighbours', 'BMS voltage imbalance alarm'],
  },
  {
    key: 'coolingFailure',
    label: 'Cooling Failure',
    targetLabel: 'Entire Pack',
    icon: ThermometerSun,
    color: '#ef4444',
    bg:   'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.35)',
    description: 'Coolant pump offline — 0 LPM',
    chain: ['Heat rejection stops', 'All cell temperatures rise', 'BMS thermal alarm triggers', 'Contactor opens if temp > 55°C'],
  },
  {
    key: 'internalShort',
    label: 'Internal Short Circuit',
    targetLabel: 'Cell 5 (Module 2)',
    icon: ZapOff,
    color: '#ef4444',
    bg:   'rgba(239,68,68,0.14)',
    border: 'rgba(239,68,68,0.45)',
    description: 'Dendritic short — 35A leakage',
    chain: ['Voltage collapses to ~1V', 'Extreme I²·R heat generation', 'Rapid temperature rise', 'Emergency contactor OPEN'],
  },
  {
    key: 'sensorFailure',
    label: 'Sensor Failure',
    targetLabel: 'Cell 10 (Module 3)',
    icon: Radio,
    color: '#22d3ee',
    bg:   'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.3)',
    description: 'Thermistor wire open circuit',
    chain: ['BMS reads frozen 26°C', 'Real temp unmonitored', 'Thermal blind-spot in BMS', 'Mobile app receives wrong data'],
  },
];

function FaultCard({ def, isActive, onToggle }) {
  const Icon = def.icon;
  return (
    <div
      className={`fault-btn${isActive ? ' fault-active' : ''}`}
      onClick={onToggle}
      style={{
        borderColor: isActive ? def.color : 'rgba(255,255,255,0.1)',
        background:  isActive ? def.bg : 'rgba(13,20,36,0.6)',
        boxShadow:   isActive ? `0 0 16px ${def.border}` : 'none',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: isActive ? def.bg : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isActive ? def.color : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isActive ? def.color : '#475569',
          }}>
            <Icon size={13} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: isActive ? def.color : '#f1f5f9' }}>{def.label}</div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>Target: {def.targetLabel}</div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '2px 7px', borderRadius: 10,
          background: isActive ? def.bg : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isActive ? def.border : 'rgba(255,255,255,0.08)'}`,
          color: isActive ? def.color : '#475569',
          fontSize: 9, fontWeight: 800,
        }}>
          {isActive ? <><CheckCircle size={9}/> ACTIVE</> : <><XCircle size={9}/> OFF</>}
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginBottom: isActive ? 8 : 0, lineHeight: 1.4 }}>
        {def.description}
      </div>

      {/* Propagation chain (when active) */}
      {isActive && (
        <div style={{
          borderTop: `1px solid ${def.border}`,
          paddingTop: 8,
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: def.color, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Info size={9} /> Propagation cascade:
          </div>
          {def.chain.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
              <span style={{ color: def.color, fontWeight: 800, fontSize: 9, marginTop: 1, flexShrink: 0 }}>Step {i + 1}.</span>
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FaultPanel({ faults, onToggle, onClearAll }) {
  const anyActive = Object.values(faults).some(f => f.active);
  return (
    <div style={{
      width: 280,
      background: 'rgba(6,9,15,0.97)',
      borderLeft: '1px solid rgba(239,68,68,0.25)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid rgba(239,68,68,0.15)',
        background: 'rgba(239,68,68,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f87171',
          }}>
            <AlertTriangle size={15} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>Fault Injection</div>
            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>Click fault to activate</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8, padding: '6px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: 7 }}>
          {[
            { color: '#22d3ee', label: 'Green flow — Electrical current' },
            { color: '#f97316', label: 'Orange flow — Thermal / heat' },
            { color: '#818cf8', label: 'Blue flow — BMS sensor data' },
          ].map(l => (
            <div key={l.color} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, fontWeight: 600, color: '#94a3b8' }}>
              <div style={{ width: 18, height: 3, borderRadius: 2, background: l.color, boxShadow: `0 0 4px ${l.color}` }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Fault cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FAULT_DEFS.map(def => (
          <FaultCard
            key={def.key}
            def={def}
            isActive={faults[def.key]?.active}
            onToggle={() => onToggle(def.key)}
          />
        ))}
      </div>

      {/* Clear all */}
      {anyActive && (
        <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            className="btn btn-active"
            onClick={onClearAll}
            style={{ width: '100%', fontSize: 12 }}
          >
            <CheckCircle size={13} /> Clear All Faults
          </button>
        </div>
      )}
    </div>
  );
}
