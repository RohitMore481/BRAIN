import React from 'react';
import { Thermometer, Zap, Activity, ShieldCheck, Cpu, X, Flame, AlertTriangle } from 'lucide-react';

export default function CellInspectorDrawer({ cell, onClose }) {
  if (!cell) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '560px',
        backgroundColor: '#0f172a',
        border: `1.5px solid ${cell.temperature > 45 ? '#f43f5e' : '#38bdf8'}`,
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(56, 189, 248, 0.3)',
        overflow: 'hidden'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '18px 24px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '13px', fontWeight: '900', padding: '4px 10px', borderRadius: '6px', fontFamily: 'monospace' }}>
              {cell.id.toUpperCase()}
            </span>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#f8fafc' }}>
                Smart Cell Node Telemetry
              </h2>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Module: {cell.module}</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>
            &times;
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Live Parameter Grid */}
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', marginBottom: '8px' }}>
              Live Electrical &amp; Thermal Parameters
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', display: 'block' }}>CELL VOLTAGE</span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8', fontFamily: 'monospace' }}>{cell.voltage.toFixed(2)} V</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', display: 'block' }}>CURRENT FLOW</span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#00e5ff', fontFamily: 'monospace' }}>{cell.current.toFixed(1)} A</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', display: 'block' }}>TEMPERATURE</span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: cell.temperature > 45 ? '#f43f5e' : '#ffb703', fontFamily: 'monospace' }}>{cell.temperature.toFixed(1)} °C</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', display: 'block' }}>INTERNAL RESISTANCE</span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#a855f7', fontFamily: 'monospace' }}>{cell.resistance.toFixed(3)} Ω</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', display: 'block' }}>STATE OF CHARGE</span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#34d399', fontFamily: 'monospace' }}>{cell.soc.toFixed(0)} %</span>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', display: 'block' }}>STATE OF HEALTH</span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: cell.soh < 80 ? '#f43f5e' : '#e2e8f0', fontFamily: 'monospace' }}>{cell.soh.toFixed(0)} %</span>
              </div>
            </div>
          </div>

          {/* Future AI Model Hook Section */}
          <div style={{ backgroundColor: '#190e28', border: '1px solid #a855f7', borderRadius: '10px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Cpu size={16} color="#c084fc" />
              <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#c084fc' }}>
                Future PINN AI Connection Slot
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#e9d5ff', lineHeight: '1.4' }}>
              Connects directly to PINN thermal loss solver and LSTM remaining useful life (RUL) regression model endpoint (`/api/v1/cells/{cell.id}`).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
