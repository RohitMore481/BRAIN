import React from 'react';
import { 
  Zap, 
  Layers, 
  Cpu, 
  Activity, 
  Flame, 
  Snowflake, 
  ShieldAlert, 
  Power,
  ArrowRight,
  Info
} from 'lucide-react';

const NODE_ICONS = {
  'node-pack': Zap,
  'node-modules': Layers,
  'node-cells': Cpu,
  'node-electrical': Activity,
  'node-thermal': Flame,
  'node-cooling': Snowflake,
  'node-bms': ShieldAlert,
  'node-output': Power
};

const STATUS_COLORS = {
  optimal: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', text: '#34d399', glow: 'rgba(16, 185, 129, 0.35)' },
  warning: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.10)', text: '#fbbf24', glow: 'rgba(245, 158, 11, 0.40)' },
  critical: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', glow: 'rgba(239, 68, 68, 0.50)' },
  degraded: { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc', glow: 'rgba(168, 85, 247, 0.40)' }
};

export default function DigitalTwinNode({ node, isSelected, onClick, index }) {
  const IconComponent = NODE_ICONS[node.id] || Zap;
  const statusStyle = STATUS_COLORS[node.status] || STATUS_COLORS.optimal;

  return (
    <div 
      onClick={onClick}
      className={`digital-twin-node ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'relative',
        width: '320px',
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(16px)',
        border: `1.5px solid ${isSelected ? '#38bdf8' : statusStyle.border}`,
        borderRadius: '16px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected 
          ? '0 0 24px rgba(56, 189, 248, 0.4), inset 0 0 12px rgba(56, 189, 248, 0.1)'
          : `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 12px ${statusStyle.glow}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* NODE INDEX BADGE */}
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '20px',
        backgroundColor: '#0f172a',
        border: `1px solid ${statusStyle.border}`,
        color: statusStyle.text,
        fontSize: '10px',
        fontWeight: '800',
        padding: '2px 10px',
        borderRadius: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
      }}>
        Step {index + 1} • {node.category}
      </div>

      {/* NODE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: statusStyle.text
          }}>
            <IconComponent size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.2px' }}>
              {node.title}
            </h3>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
              ID: {node.id}
            </span>
          </div>
        </div>

        {/* STATUS PILL */}
        <div style={{
          backgroundColor: statusStyle.bg,
          color: statusStyle.text,
          border: `1px solid ${statusStyle.border}`,
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {node.status}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* 4 CORE DIGITAL TWIN SECTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
        
        {/* 1. INPUT */}
        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '8px 10px', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '2px' }}>
            📥 Input
          </div>
          <div style={{ color: '#cbd5e1', lineHeight: '1.3', fontWeight: '500' }}>
            {node.input}
          </div>
        </div>

        {/* 2. PROCESS */}
        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '8px 10px', borderRadius: '8px', borderLeft: '3px solid #a855f7' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: '#c084fc', textTransform: 'uppercase', marginBottom: '2px' }}>
            ⚙️ Process
          </div>
          <div style={{ color: '#cbd5e1', lineHeight: '1.3', fontWeight: '500' }}>
            {node.process}
          </div>
        </div>

        {/* 3. OUTPUT */}
        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '8px 10px', borderRadius: '8px', borderLeft: '3px solid #34d399' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: '#34d399', textTransform: 'uppercase', marginBottom: '2px' }}>
            📤 Output
          </div>
          <div style={{ color: '#cbd5e1', lineHeight: '1.3', fontWeight: '500' }}>
            {node.output}
          </div>
        </div>

        {/* 4. INTERNAL STATE HIGHLIGHTS */}
        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.7)', padding: '8px 10px', borderRadius: '8px', border: '1px dashed rgba(255, 255, 255, 0.12)' }}>
          <div style={{ fontSize: '9px', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🧠 Internal State</span>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>Click to inspect</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {Object.entries(node.internalState)
              .filter(([key]) => key !== 'cellList' && key !== 'activeAlarms')
              .slice(0, 4)
              .map(([key, val]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {Array.isArray(val) ? val.join(', ') : String(val)}
                  </span>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* FOOTER CALL-TO-ACTION */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        fontSize: '10px', 
        color: isSelected ? '#38bdf8' : '#64748b',
        fontWeight: '700',
        paddingTop: '2px'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Info size={12} /> Live Twin Node
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          Inspect Metrics <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}
