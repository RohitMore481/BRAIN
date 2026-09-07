/**
 * ComponentNode.jsx
 * The core reusable node card rendered on the flow canvas.
 * Supports standard Battery Components AND distinct Physical Sensor Nodes.
 */
import React from 'react';
import {
  Battery, Layers, Cpu, Zap, Flame, Snowflake,
  ShieldAlert, Power, Share2, ArrowRight, Radio, Activity,
  Gauge, Thermometer, MapPin, Eye
} from 'lucide-react';

export const ICON_MAP = {
  'battery-pack':   Battery,
  'module':         Layers,
  'cell':           Cpu,
  'busbar':         Zap,
  'thermal-path':   Flame,
  'cooling':        Snowflake,
  'bms':            ShieldAlert,
  'interconnect':   Share2,
  'output':         Power,
  'sensor-voltage': Radio,
  'sensor-temp':    Thermometer,
  'sensor-current': Gauge,
  'sensor-coolant': Activity
};

const STATUS_BORDER = {
  optimal:  '1.5px solid rgba(16,185,129,0.45)',
  warning:  '1.5px solid rgba(245,158,11,0.55)',
  critical: '1.5px solid rgba(239,68,68,0.65)',
  degraded: '1.5px solid rgba(168,85,247,0.5)',
  offline:  '1.5px solid rgba(71,85,105,0.4)',
};
const STATUS_GLOW = {
  optimal:  '0 0 14px rgba(16,185,129,0.18)',
  warning:  '0 0 18px rgba(245,158,11,0.22)',
  critical: '0 0 22px rgba(239,68,68,0.28)',
  degraded: '0 0 18px rgba(168,85,247,0.22)',
  offline:  'none',
};
const STATUS_BG = {
  optimal:  'rgba(16,185,129,0.08)',
  warning:  'rgba(245,158,11,0.09)',
  critical: 'rgba(239,68,68,0.12)',
  degraded: 'rgba(168,85,247,0.09)',
  offline:  'rgba(71,85,105,0.06)',
};
const STATUS_TEXT = {
  optimal:  '#10b981',
  warning:  '#f59e0b',
  critical: '#ef4444',
  degraded: '#a855f7',
  offline:  '#475569',
};

function SectionRow({ label, color, children }) {
  return (
    <div style={{
      background: 'rgba(2,6,15,0.5)',
      borderRadius: 8,
      padding: '7px 9px',
      borderLeft: `2.5px solid ${color}`,
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function DataLine({ label, value, unit, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1px 0' }}>
      <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.8)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', color: highlight || '#f1f5f9' }}>
        {value}{unit && <span style={{ color: 'rgba(148,163,184,0.6)', fontWeight: 400, marginLeft: 2 }}>{unit}</span>}
      </span>
    </div>
  );
}

export default function ComponentNode({ node, isSelected, onClick, width = 260 }) {
  const status   = node.status || 'optimal';
  const IconComp = ICON_MAP[node.type] || Cpu;
  const isSensor = node.isSensorNode;

  return (
    <div
      className={`twin-node status-${status}-node${isSelected ? ' selected' : ''}`}
      onClick={onClick}
      style={{
        width,
        background: isSensor ? 'rgba(15,23,42,0.95)' : 'rgba(13,20,36,0.92)',
        border:     isSensor ? '1.5px solid rgba(129,140,248,0.5)' : (STATUS_BORDER[status] || STATUS_BORDER.optimal),
        boxShadow:  isSensor ? '0 0 16px rgba(129,140,248,0.2)' : STATUS_GLOW[status],
        borderRadius: 14,
        padding: '13px 13px 11px',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Scanline shimmer */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: isSensor 
          ? 'linear-gradient(135deg, rgba(129,140,248,0.06) 0%, transparent 60%)' 
          : 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)',
      }} />

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: isSensor ? 'rgba(129,140,248,0.15)' : STATUS_BG[status],
            border: `1px solid ${isSensor ? '#818cf8' : STATUS_TEXT[status]}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isSensor ? '#818cf8' : STATUS_TEXT[status],
            flexShrink: 0,
          }}>
            <IconComp size={16} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>{node.title}</div>
            <div style={{ fontSize: 9, color: isSensor ? '#818cf8' : 'rgba(148,163,184,0.7)', fontWeight: 600, letterSpacing: '0.4px' }}>
              {node.subtitle}
            </div>
          </div>
        </div>
        {/* Status pill */}
        <div style={{
          padding: '2px 7px', borderRadius: 12,
          background: isSensor ? 'rgba(129,140,248,0.15)' : STATUS_BG[status],
          border: `1px solid ${isSensor ? '#818cf8' : STATUS_TEXT[status]}50`,
          color: isSensor ? '#818cf8' : STATUS_TEXT[status],
          fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
          flexShrink: 0,
        }}>
          {isSensor ? 'SENSOR NODE' : status}
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* ── PHYSICAL SENSOR ATTACHMENT BOX (IF SENSOR NODE) ─────── */}
      {isSensor && (
        <React.Fragment>
          <div style={{
            background: 'rgba(129,140,248,0.08)',
            border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 8,
            padding: '7px 9px',
            display: 'flex', flexDirection: 'column', gap: 4
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} /> Physical Attachment Point
            </div>
            <div style={{ fontSize: 10, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.3 }}>
              {node.attachedTo}
            </div>
          </div>

          <div style={{
            background: 'rgba(34,211,238,0.08)',
            border: '1px solid rgba(34,211,238,0.3)',
            borderRadius: 8,
            padding: '7px 9px',
            display: 'flex', flexDirection: 'column', gap: 4
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#22d3ee', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={10} /> Captured Data Signal
            </div>
            <div style={{ fontSize: 10, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.3 }}>
              {node.capturingData}
            </div>
          </div>
        </React.Fragment>
      )}

      {/* ── Input section ───────────────────────────────── */}
      {node.inputs && node.inputs.length > 0 && (
        <SectionRow label="📥 Input" color="#22d3ee">
          {node.inputs.map((inp, i) => (
            <div key={i} style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginTop: i ? 2 : 0, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <ArrowRight size={9} style={{ marginTop: 2, color: '#22d3ee', flexShrink: 0 }} />{inp}
            </div>
          ))}
        </SectionRow>
      )}

      {/* ── Process section ─────────────────────────────── */}
      {node.processes && node.processes.length > 0 && (
        <SectionRow label="⚙️ Process" color="#a78bfa">
          {node.processes.map((p, i) => (
            <div key={i} style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginTop: i ? 2 : 0, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <span style={{ fontSize: 9, color: '#a78bfa', flexShrink: 0 }}>▸</span>{p}
            </div>
          ))}
        </SectionRow>
      )}

      {/* ── Output section ──────────────────────────────── */}
      {node.outputs && node.outputs.length > 0 && (
        <SectionRow label="📤 Output" color="#34d399">
          {node.outputs.map((o, i) => (
            <div key={i} style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginTop: i ? 2 : 0, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <span style={{ fontSize: 9, color: '#34d399', flexShrink: 0 }}>→</span>{o}
            </div>
          ))}
        </SectionRow>
      )}

      {/* ── BMS Sensors section (only if present) ───────── */}
      {node.sensors && node.sensors.length > 0 && (
        <SectionRow label="🛰 BMS Sensors" color="#818cf8">
          {node.sensors.map((s, i) => (
            <DataLine key={i} label={s.label} value={s.value} unit={s.unit} highlight={s.highlight} />
          ))}
        </SectionRow>
      )}

      {/* ── Live metrics (bottom) ───────────────────────── */}
      {node.metrics && node.metrics.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '6px 8px',
          background: 'rgba(2,6,15,0.4)',
          borderRadius: 8,
          padding: '7px 9px',
          border: '1px dashed rgba(255,255,255,0.07)',
        }}>
          {node.metrics.map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: m.color || '#f1f5f9', marginTop: 1 }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click to inspect hint */}
      <div style={{ fontSize: 9, color: '#334155', textAlign: 'right', fontWeight: 600, marginTop: -4 }}>
        {isSelected ? '◀ INSPECTING' : 'click to inspect ▶'}
      </div>
    </div>
  );
}
