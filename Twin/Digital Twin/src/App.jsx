/**
 * App.jsx — EV Battery Digital Twin Laboratory
 * Clean 4-Section Interface:
 *   1. SECTION 1 & 2: Battery Structure View & Live Particle Flows (Center Canvas)
 *   2. SECTION 3: Fault Injection & Battery Aging Control Panel (Left Sidebar)
 *   3. SECTION 4: Virtual BMS Telemetry Output & Data Exporter (Right Sidebar)
 *   4. CAUSE-EFFECT TIMELINE: Horizontal Physical Propagation Path (Bottom Footer)
 *   5. BLUETOOTH BLE COMMUNICATION LAYER: Real-time telemetry BLE output @ 5Hz (Header Toolbar)
 */
import React, { useState, useEffect, useCallback } from 'react';
import { createInitialState, stepSimulation, applyScenario } from './engine/batteryPhysics';
import FlowCanvas from './components/FlowCanvas';
import FaultInjectionPanel from './components/FaultInjectionPanel';
import BMSOutputPanel from './components/BMSOutputPanel';
import NodeInspectorDrawer from './components/NodeInspectorDrawer';
import CauseEffectTimeline from './components/CauseEffectTimeline';
import BluetoothCommPanel from './components/BluetoothCommPanel';
import { FlaskConical } from 'lucide-react';

export default function App() {
  const [simState, setSimState] = useState(createInitialState);
  const [selectedNode, setSelectedNode] = useState(null);

  // Real-time digital twin physics tick loop (5 Hz = 200ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setSimState(prev => stepSimulation(prev));
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFault = useCallback((faultKey) => {
    setSimState(prev => ({
      ...prev,
      faults: {
        ...prev.faults,
        [faultKey]: !prev.faults[faultKey]
      }
    }));
  }, []);

  const handleClearFaults = useCallback(() => {
    setSimState(prev => ({
      ...prev,
      faults: {
        cellDegradation: false,
        coolingFailure: false,
        internalShort: false,
        sensorFailure: false,
        cellImbalance: false
      }
    }));
  }, []);

  const handleSelectScenario = useCallback((scenarioKey) => {
    setSimState(prev => applyScenario(prev, scenarioKey));
  }, []);

  const handleChangeMode = useCallback((mode) => {
    setSimState(prev => ({ ...prev, simMode: mode }));
  }, []);

  const handleChangeCurrent = useCallback((val) => {
    setSimState(prev => ({ ...prev, loadCurrent: val }));
  }, []);

  const handleChangeCycleCount = useCallback((val) => {
    setSimState(prev => ({ ...prev, cycleCount: val }));
  }, []);

  const handleTogglePause = useCallback(() => {
    setSimState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleReset = useCallback(() => {
    setSimState(createInitialState());
    setSelectedNode(null);
  }, []);

  const handleSelectNode = useCallback((id, nodeData) => {
    setSelectedNode(nodeData);
  }, []);

  const cell3 = (simState.nodes?.cells?.internalState?.cellList || [])[2] || {};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--bg-void, #06090f)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>

      {/* ── MASTER HEADER WITH BLUETOOTH BLE COMMUNICATION LAYER ────────── */}
      <header style={{
        flexShrink: 0,
        height: 52,
        background: 'rgba(6, 9, 15, 0.98)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        zIndex: 30
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
          flexShrink: 0
        }}>
          <FlaskConical size={18} />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 10 }}>
            EV Battery Digital Twin Virtual Laboratory
            <span style={{
              fontSize: 9, fontWeight: 800,
              background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '2px 8px', borderRadius: 8, letterSpacing: '0.5px'
            }}>
              BLE COMMUNICATION READY
            </span>
          </div>
        </div>

        {/* BLUETOOTH BLE COMMUNICATION PANEL (LAYER 5) */}
        <div style={{ marginLeft: 'auto' }}>
          <BluetoothCommPanel state={simState} />
        </div>
      </header>

      {/* ── MAIN 3-COLUMN WORKSPACE ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* SECTION 3: FAULT INJECTION & BATTERY AGING CONTROL PANEL (LEFT) */}
        <FaultInjectionPanel
          faults={simState.faults}
          onToggleFault={handleToggleFault}
          onClearFaults={handleClearFaults}
          simMode={simState.simMode}
          onChangeSimMode={handleChangeMode}
          loadCurrent={simState.loadCurrent}
          onChangeLoadCurrent={handleChangeCurrent}
          cycleCount={simState.cycleCount}
          onChangeCycleCount={handleChangeCycleCount}
          isPaused={simState.isPaused}
          onTogglePause={handleTogglePause}
          onReset={handleReset}
          activeScenario={simState.activeScenario}
          onSelectScenario={handleSelectScenario}
          cell3RealTemp={cell3.temperature || 28.0}
          cell3SensedTemp={cell3.sensedTemperature || 28.0}
        />

        {/* SECTION 1 & 2: BATTERY STRUCTURE VIEW & LIVE PARTICLE FLOWS (CENTER) */}
        <FlowCanvas
          state={simState}
          selectedId={selectedNode?.id}
          onSelectNode={handleSelectNode}
        />

        {/* SECTION 4: VIRTUAL BMS OUTPUT PANEL (RIGHT) */}
        <BMSOutputPanel state={simState} />

      </div>

      {/* ── CAUSE-EFFECT TIMELINE VIEW (BOTTOM FOOTER) ───────────────────── */}
      <CauseEffectTimeline state={simState} />

      {/* ── SLIDE-OUT COMPONENT INSPECTOR DRAWER ─────────────────────────── */}
      {selectedNode && (
        <NodeInspectorDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

    </div>
  );
}
