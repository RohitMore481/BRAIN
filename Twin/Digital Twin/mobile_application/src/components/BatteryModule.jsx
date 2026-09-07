import React from 'react';
import BatteryCellNode from './BatteryCellNode';
import { Box, Layers } from 'lucide-react';

export default function BatteryModule({ moduleTitle, cells, selectedCellId, onSelectCell }) {
  // Compute module telemetry summaries
  const avgVoltage = (cells.reduce((sum, c) => sum + c.voltage, 0) / cells.length).toFixed(2);
  const maxTemp = Math.max(...cells.map(c => c.temperature)).toFixed(0);
  const hasWarning = cells.some(c => c.temperature > 45 || c.status === 'failed');

  return (
    <div style={{
      backgroundColor: '#1e293b',
      border: `1.5px solid ${hasWarning ? 'rgba(244, 63, 94, 0.5)' : 'rgba(56, 189, 248, 0.2)'}`,
      borderRadius: '14px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
    }}>
      {/* Module Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Layers size={16} />
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc' }}>
            {moduleTitle}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ color: '#38bdf8' }}>Avg V: {avgVoltage}V</span>
          <span style={{ color: maxTemp > 45 ? '#f43f5e' : '#ffb703' }}>Max T: {maxTemp}°C</span>
        </div>
      </div>

      {/* 4 Battery Cell Nodes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px'
      }}>
        {cells.map(cell => (
          <BatteryCellNode
            key={cell.id}
            cell={cell}
            isSelected={selectedCellId === cell.id}
            onClick={() => onSelectCell(cell.id)}
          />
        ))}
      </div>
    </div>
  );
}
