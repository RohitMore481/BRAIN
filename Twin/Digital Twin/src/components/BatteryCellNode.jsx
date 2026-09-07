import React from 'react';
import { Thermometer, Zap, Activity, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

export default function BatteryCellNode({ cell, isSelected, onClick }) {
  // Determine thermal color status
  const getTempColor = (t) => {
    if (t > 48) return '#f43f5e'; // Danger / Thermal warning
    if (t > 40) return '#f97316'; // High temp
    if (t > 35) return '#ffb703'; // Warm
    return '#34d399'; // Normal
  };

  const tempColor = getTempColor(cell.temperature);

  // Heat glow class
  const glowClass = cell.temperature > 48 ? 'heat-glow-danger' : cell.temperature > 40 ? 'heat-glow-warm' : '';

  return (
    <div
      onClick={onClick}
      className={glowClass}
      style={{
        backgroundColor: isSelected ? '#1e1b4b' : '#0f172a',
        border: `2px solid ${cell.status === 'failed' ? '#f43f5e' : isSelected ? '#00e5ff' : tempColor}`,
        borderRadius: '10px',
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        position: 'relative'
      }}
    >
      {/* Cell Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: '900',
          color: '#f8fafc',
          backgroundColor: '#1e293b',
          padding: '2px 6px',
          borderRadius: '4px',
          fontFamily: 'Fira Code, monospace'
        }}>
          {cell.id}
        </span>

        {/* Temperature Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: tempColor }}>
          <Thermometer size={13} />
          <span style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'monospace' }}>
            {cell.temperature.toFixed(0)}°C
          </span>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <div>
          <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block' }}>VOLTAGE</span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: cell.voltage < 3.2 ? '#f43f5e' : '#38bdf8', fontFamily: 'monospace' }}>
            {cell.voltage.toFixed(2)} V
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', display: 'block' }}>CURRENT</span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#00e5ff', fontFamily: 'monospace' }}>
            {cell.current.toFixed(1)} A
          </span>
        </div>
      </div>

      {/* SOC Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: '700', color: '#94a3b8', marginBottom: '2px' }}>
          <span>SOC</span>
          <span>{cell.soc.toFixed(0)}%</span>
        </div>
        <div style={{ width: '100%', height: '4px', backgroundColor: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.max(0, Math.min(100, cell.soc))}%`,
            height: '100%',
            backgroundColor: cell.soc > 20 ? '#34d399' : '#f43f5e',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Footer Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', fontWeight: '800', marginTop: '2px' }}>
        <span style={{ color: '#64748b' }}>R: {cell.resistance.toFixed(3)}Ω</span>
        <span style={{
          color: cell.status === 'failed' ? '#f43f5e' : cell.status === 'degraded' ? '#ffb703' : '#34d399',
          textTransform: 'uppercase'
        }}>
          {cell.status}
        </span>
      </div>
    </div>
  );
}
