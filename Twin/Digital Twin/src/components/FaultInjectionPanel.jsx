/**
 * FaultInjectionPanel.jsx — Section 3: Fault Injection & Battery Aging Control Panel
 * Provides intuitive laboratory controls:
 *   1. Battery Aging Model (Cycle Count Slider 0 to 1500 cycles -> SOH & Resistance)
 *   2. Fault 1: Cell Degradation (Cell 5 resistance 20mΩ -> 60mΩ)
 *   3. Fault 2: Cooling Failure (Disable Cooling Pump)
 *   4. Fault 3: Cell Imbalance (Cell 4 capacity drop to 70%)
 *   5. Fault 4: Internal Short (Cell 6 thermal short circuit)
 *   6. Fault 5: Sensor Failure (Explicit side-by-side: REAL 60°C vs BMS 35°C)
 */
import React from 'react';
import { 
  AlertTriangle, Flame, Snowflake, ZapOff, Radio, Activity, 
  Play, Pause, RotateCcw, CheckCircle2, Sliders, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';

const SCENARIOS = [
  { key: 'standby_idle', label: '1. Standby / Rest', desc: '0A current, rest state, nominal BTMS cooling' },
  { key: 'normal_driving', label: '2. Normal Driving', desc: '15A discharge, nominal BTMS cooling' },
  { key: 'fast_charging', label: '3. Fast Charging', desc: '30A charging flow, rapid heat generation' },
  { key: 'hill_climb', label: '4. Max Acceleration', desc: '45A heavy discharge current, rapid heat surge' },
  { key: 'aging_battery', label: '5. Aging Battery', desc: '20A discharge, 800 cycles, Cell 5 degraded' },
  { key: 'cooling_failure', label: '6. Cooling Loss', desc: '25A discharge, BTMS pump disabled (0 LPM)' },
  { key: 'weak_cell', label: '7. Weak Cell', desc: '15A discharge, Cell 4 capacity imbalance' },
];

export default function FaultInjectionPanel({
  faults,
  onToggleFault,
  onClearFaults,
  simMode,
  onChangeSimMode,
  loadCurrent,
  onChangeLoadCurrent,
  cycleCount = 0,
  onChangeCycleCount,
  isPaused,
  onTogglePause,
  onReset,
  activeScenario,
  onSelectScenario,
  cell3RealTemp = 28.0,
  cell3SensedTemp = 28.0
}) {
  // Simulated SOH and Resistance calculation for slider feedback
  const simulatedSoh = Math.max(60.0, 100.0 - (cycleCount / 1500.0) * 30.0);
  const simulatedResistance = 20.0 + (cycleCount / 1500.0) * 35.0;

  return (
    <div style={{
      width: 320,
      backgroundColor: 'rgba(11, 17, 30, 0.98)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      flexShrink: 0,
      zIndex: 20
    }}>
      {/* ── 1. PANEL HEADER ────────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(56,189,248,0.04))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={15} style={{ color: '#ef4444' }} /> Fault & Aging Controls
          </div>
          <button
            onClick={onReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 6,
              padding: '3px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer'
            }}
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
          Inject physical faults & alter battery aging conditions to observe cause-and-effect responses.
        </div>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── 2. SIMULATION MODE & CONTROLS ────────────────────────────────────── */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12, padding: '12px'
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Operating State</span>
            <button
              onClick={onTogglePause}
              style={{
                backgroundColor: isPaused ? '#10b981' : '#f59e0b',
                color: '#0f172a', border: 'none', borderRadius: 6,
                padding: '3px 8px', fontSize: 9, fontWeight: 900, cursor: 'pointer'
              }}
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
            {['idle', 'discharging', 'charging'].map((m) => (
              <button
                key={m}
                onClick={() => onChangeSimMode(m)}
                style={{
                  backgroundColor: simMode === m ? (m === 'charging' ? '#10b981' : (m === 'discharging' ? '#0284c7' : '#475569')) : 'rgba(255, 255, 255, 0.05)',
                  color: simMode === m ? '#ffffff' : '#94a3b8',
                  border: simMode === m ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 6, padding: '5px', fontSize: 10, fontWeight: 800,
                  textTransform: 'uppercase', cursor: 'pointer'
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* LOAD CURRENT SLIDER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#cbd5e1' }}>
              <span>Load / Charging Current:</span>
              <strong style={{ color: '#38bdf8' }}>{loadCurrent.toFixed(1)} A</strong>
            </div>
            <input
              type="range" min="1" max="50" step="1"
              value={loadCurrent}
              onChange={(e) => onChangeLoadCurrent(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* ── 3. BATTERY AGING MODEL (CYCLE COUNT SLIDER) ────────────────────── */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 12, padding: '12px'
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} /> Battery Aging Model
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#cbd5e1' }}>
              <span>Battery Cycle Count:</span>
              <strong style={{ color: '#fbbf24' }}>{cycleCount} cycles</strong>
            </div>
            <input
              type="range" min="0" max="1500" step="25"
              value={cycleCount}
              onChange={(e) => onChangeCycleCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          {/* AGING FEEDBACK METRICS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>SOH EST.</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: simulatedSoh < 80 ? '#f59e0b' : '#10b981' }}>
                {simulatedSoh.toFixed(0)}%
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>RESISTANCE</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: simulatedResistance > 35 ? '#c084fc' : '#38bdf8' }}>
                {simulatedResistance.toFixed(0)} mΩ
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. RUN BATTERY SCENARIO PRESETS ───────────────────────────────── */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 12, padding: '12px'
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={13} /> Run Battery Scenario
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SCENARIOS.map(sc => (
              <button
                key={sc.key}
                onClick={() => onSelectScenario(sc.key)}
                title={sc.desc}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: activeScenario === sc.key ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: activeScenario === sc.key ? '#38bdf8' : '#cbd5e1',
                  border: `1px solid ${activeScenario === sc.key ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: 8, padding: '6px 10px', fontSize: 10, fontWeight: 800,
                  cursor: 'pointer', textAlign: 'left'
                }}
              >
                <span>{sc.label}</span>
                <span style={{ fontSize: 8, opacity: 0.7 }}>SELECT</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. FAULT INJECTION BUTTONS ─────────────────────────────────────── */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 12, padding: '12px', display: 'flex', flexDirection: 'column', gap: 8
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={13} /> Fault Injection Panel
          </div>

          {/* FAULT 1: CELL DEGRADATION */}
          <FaultButton
            active={faults.cellDegradation}
            onClick={() => onToggleFault('cellDegradation')}
            title="Fault 1: Cell Degradation"
            subtitle="Cell 5 Resistance: 20mΩ → 60mΩ"
            color="#c084fc"
            icon={Activity}
          />

          {/* FAULT 2: COOLING FAILURE */}
          <FaultButton
            active={faults.coolingFailure}
            onClick={() => onToggleFault('coolingFailure')}
            title="Fault 2: Cooling Failure"
            subtitle="Disable BTMS Cooling Pump (0 LPM)"
            color="#f87171"
            icon={Snowflake}
          />

          {/* FAULT 3: CELL IMBALANCE */}
          <FaultButton
            active={faults.cellImbalance}
            onClick={() => onToggleFault('cellImbalance')}
            title="Fault 3: Cell Imbalance"
            subtitle="Cell 4 Capacity: 100% → 70%"
            color="#fbbf24"
            icon={Flame}
          />

          {/* FAULT 4: INTERNAL SHORT */}
          <FaultButton
            active={faults.internalShort}
            onClick={() => onToggleFault('internalShort')}
            title="Fault 4: Internal Short"
            subtitle="Cell 6 Short Circuit Surge (28A)"
            color="#ff4d4d"
            icon={ZapOff}
          />

          {/* FAULT 5: SENSOR FAILURE */}
          <FaultButton
            active={faults.sensorFailure}
            onClick={() => onToggleFault('sensorFailure')}
            title="Fault 5: Sensor Failure"
            subtitle="Cell 3 Thermistor Signal Error"
            color="#38bdf8"
            icon={Radio}
          />

          {/* EXPLICIT SENSOR FAILURE READOUT DISPLAY */}
          {faults.sensorFailure && (
            <div style={{
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 8, padding: '8px 10px', marginTop: 4
            }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={11} /> Sensor Telemetry Mismatch:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, textAlign: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: 6 }}>
                  <div style={{ fontSize: 8, color: '#94a3b8' }}>REAL CORE TEMP</div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#ef4444' }}>{cell3RealTemp.toFixed(1)}°C</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: 6 }}>
                  <div style={{ fontSize: 8, color: '#94a3b8' }}>BMS SENSED TEMP</div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8' }}>{cell3SensedTemp.toFixed(1)}°C</div>
                </div>
              </div>
            </div>
          )}

          {/* CLEAR ALL FAULTS */}
          {Object.values(faults).some(Boolean) && (
            <button
              onClick={onClearFaults}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                backgroundColor: '#10b981', color: '#0f172a', border: 'none',
                borderRadius: 8, padding: '6px', fontSize: 10, fontWeight: 900, cursor: 'pointer', marginTop: 4
              }}
            >
              <CheckCircle2 size={12} /> Clear All Injected Faults
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function FaultButton({ active, onClick, title, subtitle, color, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: active ? `${color}25` : 'rgba(255, 255, 255, 0.04)',
        color: active ? color : '#cbd5e1',
        border: `1px solid ${active ? color : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: 8, padding: '7px 10px', cursor: 'pointer', textAlign: 'left',
        boxShadow: active ? `0 0 10px ${color}40` : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon size={14} style={{ color: active ? color : '#94a3b8' }} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>{subtitle}</div>
        </div>
      </div>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        backgroundColor: active ? color : 'rgba(255,255,255,0.2)',
        boxShadow: active ? `0 0 6px ${color}` : 'none'
      }} />
    </button>
  );
}
