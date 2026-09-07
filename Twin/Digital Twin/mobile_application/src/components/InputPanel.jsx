import React from 'react';
import { Zap, Activity, Thermometer, BatteryCharging, Gauge, ShieldAlert } from 'lucide-react';

export default function InputPanel({ inputs, setInputs, isSimulating }) {
  const handleChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{
      width: '320px',
      backgroundColor: '#0f172a',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      overflowY: 'auto'
    }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', color: '#94a3b8', textTransform: 'uppercase' }}>
            Battery Inputs
          </h2>
          <p style={{ fontSize: '11px', color: '#64748b' }}>Live Sensory Telemetry Vector</p>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: '700',
          padding: '3px 8px',
          borderRadius: '12px',
          backgroundColor: isSimulating ? 'rgba(52, 211, 153, 0.15)' : 'rgba(148, 163, 184, 0.15)',
          color: isSimulating ? '#34d399' : '#94a3b8',
          border: `1px solid ${isSimulating ? '#34d399' : '#475569'}`
        }}>
          {isSimulating ? 'LIVE SENSORS' : 'STANDBY'}
        </span>
      </div>

      {/* Live Sensor Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* SENSOR 1: CURRENT */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Zap size={16} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>Current (I)</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#00e5ff', fontFamily: 'monospace' }}>
              {inputs.current.toFixed(1)} A
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={inputs.current}
            onChange={(e) => handleChange('current', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#00e5ff', cursor: 'pointer' }}
          />
        </div>

        {/* SENSOR 2: VOLTAGE */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <Activity size={16} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>Voltage (V)</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8', fontFamily: 'monospace' }}>
              {inputs.voltage.toFixed(2)} V
            </span>
          </div>
          <input
            type="range"
            min="2.5"
            max="4.2"
            step="0.05"
            value={inputs.voltage}
            onChange={(e) => handleChange('voltage', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
          />
        </div>

        {/* SENSOR 3: TEMPERATURE */}
        <div style={{
          backgroundColor: '#1e293b',
          border: `1px solid ${inputs.temperature > 45 ? '#f43f5e' : 'rgba(255, 183, 3, 0.2)'}`,
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(255, 183, 3, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb703' }}>
                <Thermometer size={16} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>Temperature</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '900', color: inputs.temperature > 45 ? '#f43f5e' : '#ffb703', fontFamily: 'monospace' }}>
              {inputs.temperature.toFixed(0)} °C
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="65"
            step="1"
            value={inputs.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: inputs.temperature > 45 ? '#f43f5e' : '#ffb703', cursor: 'pointer' }}
          />
        </div>

        {/* SENSOR 4: SOC */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <BatteryCharging size={16} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>State of Charge</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#34d399', fontFamily: 'monospace' }}>
              {inputs.soc.toFixed(0)} %
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={inputs.soc}
            onChange={(e) => handleChange('soc', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
          />
        </div>

        {/* SENSOR 5: CHARGING STATUS */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
              <Gauge size={16} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>Charging Status</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Discharging', 'Charging', 'Idle'].map(mode => (
              <button
                key={mode}
                onClick={() => handleChange('chargingStatus', mode)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: inputs.chargingStatus === mode ? '#a855f7' : '#0f172a',
                  color: inputs.chargingStatus === mode ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* SENSOR 6: BATTERY AGE / SOH */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(148, 163, 184, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <ShieldAlert size={16} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>Battery Age / SOH</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '900', color: '#e2e8f0', fontFamily: 'monospace' }}>
              {inputs.soh.toFixed(0)}% SOH
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="100"
            step="1"
            value={inputs.soh}
            onChange={(e) => handleChange('soh', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#94a3b8', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#64748b' }}>
            <span>Cycles: {Math.round((100 - inputs.soh) * 20)}</span>
            <span>Health: {inputs.soh > 90 ? 'Optimal' : inputs.soh > 80 ? 'Good' : 'Degraded'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
