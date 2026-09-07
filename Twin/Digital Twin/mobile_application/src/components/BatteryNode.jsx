import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, AlertTriangle, Cpu, Zap } from 'lucide-react';

export default function BatteryNode({ node, isSelected, onClick, isSimulating }) {
  const [hovered, setHovered] = useState(false);

  const borderColor = node.status === 'warning'
    ? '#f43f5e'
    : isSelected
    ? '#00e5ff'
    : hovered
    ? '#38bdf8'
    : '#1e293b';

  const bgColor = isSelected
    ? 'rgba(30, 27, 75, 0.95)'
    : hovered
    ? 'rgba(30, 41, 59, 0.9)'
    : 'rgba(15, 23, 42, 0.9)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected
          ? `0 0 20px rgba(0, 229, 255, 0.2), 0 4px 20px rgba(0,0,0,0.4)`
          : hovered
          ? '0 0 12px rgba(56, 189, 248, 0.12), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.25)',
        transform: hovered && !isSelected ? 'translateX(2px)' : 'none',
        outline: isSimulating && isSelected ? '2px solid rgba(0, 229, 255, 0.3)' : 'none',
        outlineOffset: '3px'
      }}
    >
      {/* Node Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Node ID Badge */}
          <span style={{
            fontSize: '10px',
            fontWeight: '900',
            padding: '3px 8px',
            borderRadius: '5px',
            backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.25)' : 'rgba(56, 189, 248, 0.15)',
            color: isSelected ? '#00e5ff' : '#38bdf8',
            fontFamily: 'Fira Code, monospace',
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            {node.id.replace('NODE-', 'N')}
          </span>

          {/* Node Name */}
          <h3 style={{
            fontSize: '14px',
            fontWeight: '800',
            color: isSelected ? '#f8fafc' : '#e2e8f0',
            letterSpacing: '-0.2px'
          }}>
            {node.name}
          </h3>
        </div>

        {/* Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {node.status === 'warning'
            ? <AlertTriangle size={14} color="#f43f5e" />
            : <CheckCircle2 size={14} color="#34d399" />
          }
          <span style={{
            fontSize: '10px',
            fontWeight: '700',
            color: node.status === 'warning' ? '#f43f5e' : '#34d399',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {node.statusText}
          </span>
        </div>
      </div>

      {/* Parameters Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '12px'
      }}>
        {node.parameters.map((param, idx) => (
          <div key={idx} style={{
            backgroundColor: '#070a11',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '7px',
            padding: '8px 10px'
          }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
              {param.label}
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '800',
              color: isSimulating && isSelected ? '#00e5ff' : '#e2e8f0',
              fontFamily: 'Fira Code, monospace',
              transition: 'color 0.3s ease'
            }}>
              {param.value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {/* AI Future Hook Chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '20px',
          padding: '3px 10px'
        }}>
          <Cpu size={11} color="#a855f7" />
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#c084fc' }}>
            {node.futureHookShort}
          </span>
        </div>

        {/* Inspect Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isSelected ? '#00e5ff' : '#38bdf8' }}>
          <span style={{ fontSize: '11px', fontWeight: '700' }}>
            {isSelected ? 'Inspecting' : 'Click to Inspect'}
          </span>
          <ChevronRight size={13} />
        </div>
      </div>
    </div>
  );
}
