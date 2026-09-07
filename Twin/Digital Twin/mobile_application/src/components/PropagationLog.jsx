/**
 * PropagationLog.jsx
 * Bottom bar showing the live physical cascade / event log
 */
import React, { useRef, useEffect } from 'react';
import { Zap, Flame, Radio, AlertTriangle, CheckCircle } from 'lucide-react';

const TYPE_STYLE = {
  elec:    { icon: Zap,           color: '#22d3ee', bg: 'rgba(34,211,238,0.08)',   border: 'rgba(34,211,238,0.25)' },
  thermal: { icon: Flame,         color: '#f97316', bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.25)' },
  bms:     { icon: Radio,         color: '#818cf8', bg: 'rgba(129,140,248,0.08)',  border: 'rgba(129,140,248,0.25)' },
  fault:   { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',     border: 'rgba(239,68,68,0.3)' },
  output:  { icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.25)' },
};

function LogEntry({ entry, index, total }) {
  const style = TYPE_STYLE[entry.type] || TYPE_STYLE.bms;
  const Icon  = style.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      flexShrink: 0, minWidth: 240, maxWidth: 340,
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: 8, padding: '7px 10px',
    }}>
      {/* Arrow between entries */}
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: `${style.color}18`,
        border: `1px solid ${style.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={11} style={{ color: style.color }} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: style.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
          Step {index + 1} • {entry.node}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, lineHeight: 1.4 }}>
          {entry.msg}
        </div>
      </div>
    </div>
  );
}

export default function PropagationLog({ logs, isFaultActive }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [logs]);

  if (!logs || logs.length === 0) return null;

  return (
    <div style={{
      flexShrink: 0,
      background: 'rgba(6,9,15,0.97)',
      borderTop: `1.5px solid ${isFaultActive ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'}`,
      boxShadow: isFaultActive ? '0 -6px 24px rgba(239,68,68,0.12)' : 'none',
      transition: 'border-color 0.4s, box-shadow 0.4s',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 16px 6px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 800, color: isFaultActive ? '#ef4444' : '#475569',
        }}>
          {isFaultActive && <AlertTriangle size={13} />}
          Physical Cascade — Live Event Log
        </div>
        {isFaultActive && (
          <div style={{
            padding: '1px 7px', borderRadius: 10,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
            fontSize: 9, fontWeight: 800, color: '#f87171',
          }}>
            FAULT RIPPLE ACTIVE
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {[
            { c: '#22d3ee', l: 'Electrical' },
            { c: '#f97316', l: 'Thermal' },
            { c: '#818cf8', l: 'BMS/Data' },
            { c: '#ef4444', l: 'Fault' },
          ].map(x => (
            <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 600, color: '#475569' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: x.c, boxShadow: `0 0 4px ${x.c}` }} />
              {x.l}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable entries */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px',
          overflowX: 'auto',
        }}
      >
        {logs.map((entry, idx) => (
          <React.Fragment key={idx}>
            <LogEntry entry={entry} index={idx} total={logs.length} />
            {idx < logs.length - 1 && (
              <div style={{ color: '#1e293b', fontSize: 18, flexShrink: 0 }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
