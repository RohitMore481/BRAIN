import React from 'react';
import BatteryModule from './BatteryModule';
import { Cpu, ArrowRight, Zap, ShieldAlert, Sparkles } from 'lucide-react';

export default function BatteryPackView({ cells, selectedCellId, onSelectCell, simMode, isCoolingFailed }) {
  // Separate cells by modules (Module 1: Cell 1-4, Module 2: Cell 5-8, Module 3: Cell 9-12)
  const module1Cells = cells.slice(0, 4);
  const module2Cells = cells.slice(4, 8);
  const module3Cells = cells.slice(8, 12);

  const hasThermalWarning = cells.some(c => c.temperature > 45);

  return (
    <div style={{
      flex: 1,
      backgroundColor: '#070a11',
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative'
    }}>
      {/* Viewport Sub-header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>
            Battery Pack Physical &amp; Behavioural Viewport
          </h2>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>
            Interactive Cell Matrix (3 Modules • 12 Smart Nodes) • Real-Time Flow &amp; Heat Propagation
          </p>
        </div>

        {/* Dynamic Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: simMode === 'charging' ? 'rgba(2, 132, 199, 0.2)' : simMode === 'discharging' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(52, 211, 153, 0.2)',
            color: simMode === 'charging' ? '#38bdf8' : simMode === 'discharging' ? '#c084fc' : '#34d399',
            border: `1px solid ${simMode === 'charging' ? '#38bdf8' : simMode === 'discharging' ? '#c084fc' : '#34d399'}`
          }}>
            FLOW MODE: {simMode.toUpperCase()}
          </span>

          {hasThermalWarning && (
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(244, 63, 94, 0.2)',
              color: '#f43f5e',
              border: '1px solid #f43f5e',
              animation: 'thermalPulse 1.5s infinite'
            }}>
              ⚠️ THERMAL PROPAGATION WARNING
            </span>
          )}
        </div>
      </div>

      {/* Energy & Current Flow Overlay Canvas (SVG Lines) */}
      <div style={{ position: 'relative', width: '100%' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
          <line
            x1="5%" y1="50%" x2="95%" y2="50%"
            stroke={simMode === 'charging' ? '#00e5ff' : simMode === 'discharging' ? '#a855f7' : '#334155'}
            strokeWidth="3"
            className={simMode === 'charging' ? 'flow-charge' : simMode === 'discharging' ? 'flow-discharge' : ''}
          />
        </svg>

        {/* 3 MODULE CARDS MATRIX */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 20 }}>
          <BatteryModule
            moduleTitle="MODULE 1 (Cells 1 - 4)"
            cells={module1Cells}
            selectedCellId={selectedCellId}
            onSelectCell={onSelectCell}
          />

          <BatteryModule
            moduleTitle="MODULE 2 (Cells 5 - 8)"
            cells={module2Cells}
            selectedCellId={selectedCellId}
            onSelectCell={onSelectCell}
          />

          <BatteryModule
            moduleTitle="MODULE 3 (Cells 9 - 12)"
            cells={module3Cells}
            selectedCellId={selectedCellId}
            onSelectCell={onSelectCell}
          />
        </div>
      </div>
    </div>
  );
}
