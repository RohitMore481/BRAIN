/**
 * BMSOutputPanel.jsx — Section 4: Virtual BMS Telemetry Output Panel
 * Represents sensor telemetry sent via Bluetooth to downstream mobile apps & prediction models:
 *   - Pack Voltage (e.g., 30.4V / 45.6V)
 *   - Pack Current (e.g., 20A)
 *   - Maximum Cell Temperature (e.g., 36°C)
 *   - Cell Voltage Difference (ΔV, e.g., 0.05V)
 *   - Cooling System Status (ACTIVE / OFF)
 *   - BMS Operational Status (NORMAL / WARNING / CRITICAL)
 *   - Export Bluetooth Telemetry Dataset (JSON / CSV)
 */
import React from 'react';
import {
  ShieldCheck, ShieldAlert, ShieldX,
  Thermometer, Zap, Activity,
  Radio, Bluetooth, Download, FileText
} from 'lucide-react';

export default function BMSOutputPanel({ state }) {
  const { nodes, faults, bmsDataStream = [] } = state;
  const bms = nodes.bms.internalState;
  const pack = nodes.pack.internalState;
  const cells = nodes.cells.internalState.cellList || [];

  const maxTemp = parseFloat(pack.packTemperature || 28);
  const minTemp = cells.length > 0 ? Math.min(...cells.map(c => c.sensedTemperature || c.temperature)).toFixed(1) : '25.0';
  const avgTemp = cells.length > 0 ? (cells.reduce((s, c) => s + (c.sensedTemperature || c.temperature), 0) / cells.length).toFixed(1) : '28.0';

  // Evaluate Overall Battery Operational Status
  const isCritical = nodes.bms.status === 'critical' || faults.coolingFailure || faults.internalShort;
  const isWarning = nodes.bms.status === 'warning' || Object.values(faults).some(Boolean);
  const batteryStatus = isCritical ? 'CRITICAL' : (isWarning ? 'WARNING' : 'NORMAL');
  
  const statusColor = isCritical ? '#ef4444' : (isWarning ? '#f59e0b' : '#10b981');
  const StatusIcon = isCritical ? ShieldX : (isWarning ? ShieldAlert : ShieldCheck);

  // Exporter Functions
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bmsDataStream, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bms_telemetry_bluetooth_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    if (bmsDataStream.length === 0) return;
    
    const headers = [
      'timestamp', 'simMode', 'packVoltage', 'packCurrent', 'maxTemperature',
      'cell1_v', 'cell2_v', 'cell3_v', 'cell4_v', 'cell5_v', 'cell6_v', 'cell7_v', 'cell8_v',
      'cell1_t', 'cell2_t', 'cell3_t', 'cell4_t', 'cell5_t', 'cell6_t', 'cell7_t', 'cell8_t',
      'alarmsCount', 'contactorState'
    ];

    const rows = bmsDataStream.map(row => [
      row.timestamp,
      row.simMode,
      row.packVoltage,
      row.packCurrent,
      row.maxTemperature,
      ...(row.cellVoltages || []),
      ...(row.cellTemperatures || []),
      row.activeAlarmsCount,
      row.contactorState
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bms_sensor_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{
      width: 320,
      background: 'rgba(11, 17, 30, 0.98)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      flexShrink: 0,
      zIndex: 20
    }}>
      {/* ── 1. HEADER: BLUETOOTH TELEMETRY PAYLOAD ───────────────────────────── */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(56,189,248,0.04))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Bluetooth size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.2px', textTransform: 'uppercase' }}>
                Virtual BMS Output
              </div>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>
                Bluetooth Payload → Mobile App
              </div>
            </div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 900, color: '#10b981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 6px', borderRadius: 6 }}>
            STREAMING
          </span>
        </div>

        {/* STATUS BADGE */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: 8,
          background: `${statusColor}15`,
          border: `1px solid ${statusColor}40`,
          color: statusColor, marginTop: 4
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusIcon size={16} />
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Fault Status
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                {batteryStatus}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>BTMS Status</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: faults.coolingFailure ? '#ef4444' : '#10b981' }}>
              {faults.coolingFailure ? 'OFF (FAILURE)' : 'ACTIVE'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MEASURED TELEMETRY VALUES ────────────────────────────────────── */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Measurable BMS Sensor Output
        </div>

        {/* METRIC GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <MetricCard label="Pack Voltage" value={`${pack.totalVoltage} V`} color="#10b981" icon={Zap} />
          <MetricCard label="Pack Current" value={`${pack.totalCurrent} A`} color="#38bdf8" icon={Activity} />
          <MetricCard label="Max Temperature" value={`${maxTemp.toFixed(1)} °C`} color={maxTemp > 45 ? '#ef4444' : '#f97316'} icon={Thermometer} />
          <MetricCard label="Cell Voltage Diff" value={`${bms.maxDeltaV} V`} color={parseFloat(bms.maxDeltaV) > 0.15 ? '#fbbf24' : '#c084fc'} icon={Radio} />
        </div>

        {/* CELL HEAT MAP (SENSED VALUES) */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12, padding: '10px'
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: 8 }}>
            Sensed Cell Readings (Cells 1 – 8)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {cells.map(c => {
              const isCellCrit = c.status === 'critical' || c.status === 'shorted';
              const isCellWarn = c.status === 'warning' || c.status === 'degraded';
              const cellBg = isCellCrit ? 'rgba(239,68,68,0.25)' : (isCellWarn ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.15)');
              const cellBorder = isCellCrit ? '#ef4444' : (isCellWarn ? '#f59e0b' : '#10b981');
              const displayTemp = c.sensedTemperature !== undefined ? c.sensedTemperature : c.temperature;
              return (
                <div key={c.id} style={{
                  backgroundColor: cellBg,
                  border: `1px solid ${cellBorder}`,
                  borderRadius: 6, padding: '5px 2px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: '#f8fafc' }}>{c.name}</div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: cellBorder, marginTop: 1 }}>
                    {displayTemp.toFixed(1)}°C
                  </div>
                  <div style={{ fontSize: 8, color: '#94a3b8' }}>{c.voltage.toFixed(2)}V</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLUETOOTH TELEMETRY DATASET EXPORTER */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 12, padding: '10px'
        }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={13} /> Export Telemetry Dataset
          </div>
          <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 8, lineHeight: 1.3 }}>
            Export generated sensor dataset ({bmsDataStream.length} frames) to send to downstream AI prediction models.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <button
              onClick={handleExportJSON}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 6,
                padding: '6px', fontSize: 10, fontWeight: 800, cursor: 'pointer'
              }}
            >
              <FileText size={12} /> JSON
            </button>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: 6,
                padding: '6px', fontSize: 10, fontWeight: 800, cursor: 'pointer'
              }}
            >
              <Download size={12} /> CSV
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ label, value, color, icon: Icon }) {
  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 8, padding: '8px 10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 9, fontWeight: 600 }}>
        <Icon size={11} style={{ color }} /> {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 900, color, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
        {value}
      </div>
    </div>
  );
}
