/**
 * FlowCanvas.jsx — 3 Physical Flow Layers & 5-Section Component Node Structure
 * Layer 1: GREEN PARTICLES — Sequential Series Electrical Flow (Pack -> Modules -> Busbar -> Cell 1 -> Cell 2 -> ... -> Cell 8)
 * Layer 2: ORANGE/RED PARTICLES — Fourier Thermal Conduction Network (Cell Joule heat -> Neighbor Conduction -> Cooling Plate)
 * Layer 3: BLUE PARTICLES — BTMS Coolant Loop (Pump -> Channel -> Plate -> Heat Removal Q_removed = m_dot*Cp*dT)
 *
 * Component Node Cards contain 5 explicit sections:
 *   1. Component Name
 *   2. Current State
 *   3. INPUT
 *   4. PROCESS
 *   5. OUTPUT
 */
import React, { useRef, useEffect, useCallback, useReducer } from 'react';
import { Zap, Thermometer, Snowflake, Activity, Layers } from 'lucide-react';

function FlowLine({ id, d, type, speed = 1, isReversed = false, isStopped = false }) {
  if (isStopped) return null;

  const colors = {
    elec: '#10b981',    // Green particles for Electrical current flow
    thermal: '#f97316', // Orange particles for Heat movement
    coolant: '#38bdf8', // Blue particles for Cooling flow
  };

  const col  = colors[type] || '#10b981';
  const dur  = (type === 'elec' ? 0.8 : type === 'thermal' ? 1.0 : 0.9) / speed;
  const dash = type === 'elec' ? '10 6' : type === 'thermal' ? '8 5' : '12 6';

  return (
    <g key={id}>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
      <path
        d={d} fill="none"
        stroke={col} strokeWidth={2.5}
        strokeDasharray={dash}
        opacity={0.85}
        style={{
          filter: `drop-shadow(0 0 6px ${col})`,
          animation: `${type}Dash ${dur}s linear infinite`,
          animationDirection: isReversed ? 'reverse' : 'normal'
        }}
      />
      <circle r={4} fill={col} style={{ filter: `drop-shadow(0 0 8px ${col})` }}>
        <animateMotion path={d} dur={`${dur * 1.5}s`} repeatCount="indefinite" keyPoints={isReversed ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
      </circle>
    </g>
  );
}

function edgePts(rect, containerRect, scrollLeft = 0, scrollTop = 0) {
  const x = (rect.left - containerRect.left) + scrollLeft;
  const y = (rect.top  - containerRect.top)  + scrollTop;
  const w = rect.width, h = rect.height;
  return {
    top:    { x: x + w / 2, y },
    bottom: { x: x + w / 2, y: y + h },
    left:   { x,            y: y + h / 2 },
    right:  { x: x + w,     y: y + h / 2 },
    cx:     x + w / 2,
    cy:     y + h / 2,
  };
}

function vertBez(from, to) {
  if (!from || !to) return '';
  const dy = Math.abs(to.y - from.y) * 0.5;
  return `M${from.x},${from.y} C${from.x},${from.y + dy} ${to.x},${to.y - dy} ${to.x},${to.y}`;
}

function cubicBez(from, to) {
  if (!from || !to) return '';
  const dx = Math.abs(to.x - from.x) * 0.5;
  return `M${from.x},${from.y} C${from.x + dx},${from.y} ${to.x - dx},${to.y} ${to.x},${to.y}`;
}

export default function FlowCanvas({ state, selectedId, onSelectNode }) {
  const containerRef = useRef(null);
  const rectsRef = useRef({});
  const svgSizeRef = useRef({ w: 1800, h: 1200 });
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const { simMode, nodes, faults, coolantFlowLPM = 8.5 } = state;
  const isCharging = simMode === 'charging';
  const isCoolingActive = !faults.coolingFailure && coolantFlowLPM > 0;
  const cells = nodes.cells.internalState.cellList || [];

  const measureRects = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const sLeft = containerRef.current.scrollLeft;
    const sTop  = containerRef.current.scrollTop;
    const map   = {};

    containerRef.current.querySelectorAll('[data-node-id]').forEach(el => {
      const id = el.getAttribute('data-node-id');
      map[id] = edgePts(el.getBoundingClientRect(), containerRect, sLeft, sTop);
    });
    rectsRef.current = map;

    let maxX = 0, maxY = 0;
    containerRef.current.querySelectorAll('[data-node-id]').forEach(el => {
      const r  = el.getBoundingClientRect();
      const rx = (r.right  - containerRect.left) + sLeft + 60;
      const ry = (r.bottom - containerRect.top)  + sTop  + 60;
      if (rx > maxX) maxX = rx;
      if (ry > maxY) maxY = ry;
    });
    svgSizeRef.current = { w: Math.max(1600, maxX), h: Math.max(1000, maxY) };
  }, []);

  useEffect(() => {
    let rafId;
    const doMeasure = () => {
      measureRects();
      forceUpdate();
    };
    rafId = requestAnimationFrame(doMeasure);

    const observer = new ResizeObserver(() => forceUpdate());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [measureRects]);

  // Build SVG particle paths for 3 distinct layers
  function buildPaths() {
    const rects = rectsRef.current;
    const paths = [];

    // LAYER 1: ELECTRICAL FLOW (Green) — Pack -> Modules & Sequential Series Cell Chain
    const pPack = rects['node-pack'];
    const pM1   = rects['node-module1'];
    const pM2   = rects['node-module2'];

    if (pPack && pM1) paths.push({ id: 'p-m1', d: vertBez(pPack.bottom, pM1.top), type: 'elec', isReversed: isCharging });
    if (pPack && pM2) paths.push({ id: 'p-m2', d: vertBez(pPack.bottom, pM2.top), type: 'elec', isReversed: isCharging });

    // Sequential Series Cell Electrical Busbar Chain: Cell 1 -> Cell 2 -> Cell 3 -> ... -> Cell 8
    for (let i = 0; i < cells.length - 1; i++) {
      const currRect = rects[`node-${cells[i].id}`];
      const nextRect = rects[`node-${cells[i+1].id}`];
      if (currRect && nextRect) {
        paths.push({
          id: `elec-chain-${i}`,
          d: cubicBez(currRect.right, nextRect.left),
          type: 'elec',
          isReversed: isCharging
        });
      }
    }

    // LAYER 2: THERMAL FLOW (Orange/Red) — Fourier Conduction between neighbors & Cooling Plate
    const pCoolPlate = rects['node-cooling-plate'];
    for (let i = 0; i < cells.length - 1; i++) {
      const c1 = cells[i];
      const c2 = cells[i+1];
      const r1 = rects[`node-${c1.id}`];
      const r2 = rects[`node-${c2.id}`];

      // Heat transfer between neighboring cells if temperature gradient exists (>1.0°C)
      if (Math.abs(c1.temperature - c2.temperature) > 1.0 && r1 && r2) {
        const isFromLeftToRight = c1.temperature > c2.temperature;
        paths.push({
          id: `thermal-cond-${i}`,
          d: cubicBez(r1.right, r2.left),
          type: 'thermal',
          isReversed: !isFromLeftToRight
        });
      }
    }

    // Cell surface heat propagation to cold plate whenever heat is generated (Q_gen > 0.5W or T > 28°C)
    cells.forEach(c => {
      if (c.heatGeneration > 0.5 || c.temperature > 28.0 || c.status !== 'optimal') {
        const pCell = rects[`node-${c.id}`];
        if (pCell && pCoolPlate) {
          paths.push({
            id: `${c.id}-heat-plate`,
            d: vertBez(pCell.bottom, pCoolPlate.top),
            type: 'thermal'
          });
        }
      }
    });

    // LAYER 3: COOLING FLOW (Blue) — Cooling Pump -> Cooling Channel -> Cooling Plate
    const pCoolPump = rects['node-cooling-pump'];
    if (pCoolPump && pCoolPlate) {
      paths.push({
        id: 'pump-plate-coolant',
        d: cubicBez(pCoolPump.right, pCoolPlate.left),
        type: 'coolant',
        isStopped: !isCoolingActive
      });
    }

    return paths.map(p => <FlowLine key={p.id} {...p} />);
  }

  const m1Cells = cells.slice(0, 4);
  const m2Cells = cells.slice(4, 8);

  return (
    <div
      ref={containerRef}
      className="canvas-wrapper"
      style={{ position: 'relative', flex: 1, overflow: 'auto', background: 'var(--bg-deep, #06090f)' }}
    >
      {/* SVG Particle Motion Layer */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
        width={svgSizeRef.current.w} height={svgSizeRef.current.h}
      >
        {buildPaths()}
      </svg>

      {/* Sticky Physical Layer Legend Bar */}
      <div style={{
        position: 'sticky', top: 10, left: 0,
        zIndex: 20, display: 'flex', justifyContent: 'center', pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 16,
          background: 'rgba(15, 23, 42, 0.90)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '6px 16px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
        }}>
          <FlowLegendDot color="#10b981" label="Layer 1: Green = Electrical Series Flow" />
          <FlowLegendDot color="#f97316" label="Layer 2: Orange = Fourier Heat Conduction" />
          <FlowLegendDot color="#38bdf8" label={isCoolingActive ? "Layer 3: Blue = Coolant Flow (ACTIVE)" : "Layer 3: Blue = Coolant Flow (OFF)"} disabled={!isCoolingActive} />
        </div>
      </div>

      {/* ── CANVAS WORKSPACE ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2, padding: '20px 40px 60px', minWidth: 1550 }}>

        {/* 1. BATTERY PACK NODE */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div data-node-id="node-pack">
            <div
              onClick={() => onSelectNode('node-pack', nodes.pack)}
              style={{
                width: 340,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '2px solid #10b981',
                borderRadius: 14,
                padding: '12px 18px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 900, color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase' }}>
                BATTERY PACK NODE
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#f8fafc', marginTop: 2 }}>
                High Voltage Battery System
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, fontSize: 11, color: '#cbd5e1', fontWeight: 700 }}>
                <span>Voltage: <strong style={{ color: '#10b981' }}>{nodes.pack.internalState.totalVoltage}V</strong></span>
                <span>Current: <strong style={{ color: '#38bdf8' }}>{nodes.pack.internalState.totalCurrent}A</strong></span>
                <span>Max Temp: <strong style={{ color: '#f97316' }}>{nodes.pack.internalState.packTemperature}°C</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MODULE 1 & MODULE 2 NODES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 160, marginBottom: 32 }}>
          <div data-node-id="node-module1">
            <div
              onClick={() => onSelectNode('node-module1', nodes.module1)}
              style={{
                width: 280,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid #38bdf8',
                borderRadius: 12, padding: '10px 14px', textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>MODULE 1</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc', marginTop: 2 }}>Cells 1 – 4 Subsystem</div>
              <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4, fontWeight: 700 }}>
                Voltage: {nodes.module1.internalState.moduleVoltage}V • Avg Temp: {nodes.module1.internalState.avgTemperature}°C
              </div>
            </div>
          </div>

          <div data-node-id="node-module2">
            <div
              onClick={() => onSelectNode('node-module2', nodes.module2)}
              style={{
                width: 280,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid #38bdf8',
                borderRadius: 12, padding: '10px 14px', textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>MODULE 2</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc', marginTop: 2 }}>Cells 5 – 8 Subsystem</div>
              <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4, fontWeight: 700 }}>
                Voltage: {nodes.module2.internalState.moduleVoltage}V • Avg Temp: {nodes.module2.internalState.avgTemperature}°C
              </div>
            </div>
          </div>
        </div>

        {/* 3. STRUCTURED 5-SECTION COMPONENT NODE CARDS (MODULE 1 & MODULE 2) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginBottom: 40 }}>
          
          {/* Module 1 Cells (Cell 1..4) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', textAlign: 'center' }}>
              Module 1 Series Chain (Cells 1 – 4)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {m1Cells.map(c => (
                <FiveSectionCellNode
                  key={c.id}
                  cell={c}
                  loadCurrent={state.loadCurrent}
                  isSelected={selectedId === `node-${c.id}`}
                  onClick={() => onSelectNode(`node-${c.id}`, {
                    ...c,
                    title: c.name,
                    category: 'Electrochemical Cell',
                    role: `Lithium-Ion NMC Cell in ${c.moduleName}`,
                    input: `Current = ${Math.abs(c.current).toFixed(1)} A • OCV = (3.20 + 0.95*SOC) V`,
                    process: `Joule Heat Q_gen = I²R = ${c.heatGeneration.toFixed(2)} W • Fourier Conduction`,
                    output: `Voltage = ${c.voltage.toFixed(3)} V • Temp = ${c.temperature.toFixed(1)} °C`,
                    connected: ['Module 1 Node', 'Voltage Sensor', 'Temp Sensor', 'Cooling Plate Node'],
                    internalState: {
                      voltage: c.voltage.toFixed(3) + ' V',
                      current: Math.abs(c.current).toFixed(1) + ' A',
                      resistance: (c.resistance * 1000).toFixed(0) + ' mΩ',
                      temperature: c.temperature.toFixed(1) + ' °C',
                      heatGenerated: c.heatGeneration.toFixed(2) + ' W',
                      soc: c.soc.toFixed(1) + ' %',
                      soh: c.soh.toFixed(0) + ' %',
                      status: c.status
                    }
                  })}
                />
              ))}
            </div>
          </div>

          {/* Module 2 Cells (Cell 5..8) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', textAlign: 'center' }}>
              Module 2 Series Chain (Cells 5 – 8)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {m2Cells.map(c => (
                <FiveSectionCellNode
                  key={c.id}
                  cell={c}
                  loadCurrent={state.loadCurrent}
                  isSelected={selectedId === `node-${c.id}`}
                  onClick={() => onSelectNode(`node-${c.id}`, {
                    ...c,
                    title: c.name,
                    category: 'Electrochemical Cell',
                    role: `Lithium-Ion NMC Cell in ${c.moduleName}`,
                    input: `Current = ${Math.abs(c.current).toFixed(1)} A • OCV = (3.20 + 0.95*SOC) V`,
                    process: `Joule Heat Q_gen = I²R = ${c.heatGeneration.toFixed(2)} W • Fourier Conduction`,
                    output: `Voltage = ${c.voltage.toFixed(3)} V • Temp = ${c.temperature.toFixed(1)} °C`,
                    connected: ['Module 2 Node', 'Voltage Sensor', 'Temp Sensor', 'Cooling Plate Node'],
                    internalState: {
                      voltage: c.voltage.toFixed(3) + ' V',
                      current: Math.abs(c.current).toFixed(1) + ' A',
                      resistance: (c.resistance * 1000).toFixed(0) + ' mΩ',
                      temperature: c.temperature.toFixed(1) + ' °C',
                      heatGenerated: c.heatGeneration.toFixed(2) + ' W',
                      soc: c.soc.toFixed(1) + ' %',
                      soh: c.soh.toFixed(0) + ' %',
                      status: c.status
                    }
                  })}
                />
              ))}
            </div>
          </div>

        </div>

        {/* 4. BTMS COOLING SYSTEM NODES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 10 }}>
          <div data-node-id="node-cooling-pump">
            <div
              onClick={() => onSelectNode('node-cooling-pump', nodes.coolingPump)}
              style={{
                width: 220,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: `1.5px solid ${isCoolingActive ? '#38bdf8' : '#ef4444'}`,
                borderRadius: 10, padding: '8px 12px', textAlign: 'center', cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 900, color: isCoolingActive ? '#38bdf8' : '#ef4444', textTransform: 'uppercase' }}>
                COOLING PUMP
              </div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#f8fafc', marginTop: 1 }}>
                {isCoolingActive ? `${coolantFlowLPM.toFixed(1)} LPM` : '0.0 LPM (PUMP OFF)'}
              </div>
            </div>
          </div>

          <div data-node-id="node-cooling-plate">
            <div
              onClick={() => onSelectNode('node-cooling-plate', nodes.coolingPlate)}
              style={{
                width: 220,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid #38bdf8',
                borderRadius: 10, padding: '8px 12px', textAlign: 'center', cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                COOLING PLATE
              </div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#f8fafc', marginTop: 1 }}>
                Plate Temp: {nodes.coolingPlate.internalState.surfaceTemp}°C
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── 5-SECTION COMPONENT NODE CARD (Exclusively requested by prompt) ─────────
function FiveSectionCellNode({ cell, loadCurrent, isSelected, onClick }) {
  const isCrit = cell.status === 'critical' || cell.status === 'shorted';
  const isWarn = cell.status === 'warning' || cell.status === 'degraded';

  const healthColor = isCrit ? '#ef4444' : (isWarn ? '#f59e0b' : '#10b981');
  const healthBadge = isCrit ? 'FAULT' : (isWarn ? 'WARNING' : 'HEALTHY');
  const bgColor     = isCrit ? 'rgba(239, 68, 68, 0.15)' : (isWarn ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.08)');

  return (
    <div
      data-node-id={`node-${cell.id}`}
      onClick={onClick}
      style={{
        width: 195,
        backgroundColor: bgColor,
        border: `2px solid ${isSelected ? '#ffffff' : healthColor}`,
        borderRadius: 12,
        padding: '10px 12px',
        cursor: 'pointer',
        boxShadow: isSelected ? '0 0 16px rgba(255,255,255,0.4)' : `0 0 12px ${healthColor}30`,
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }}
    >
      {/* 1. COMPONENT NAME */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: '#f8fafc' }}>{cell.name}</span>
        <span style={{
          fontSize: 8, fontWeight: 900, color: healthColor,
          backgroundColor: `${healthColor}20`, border: `1px solid ${healthColor}50`,
          padding: '1px 5px', borderRadius: 6
        }}>
          {healthBadge}
        </span>
      </div>

      {/* 2. CURRENT STATE */}
      <div style={{ fontSize: 9, color: healthColor, fontWeight: 800, textTransform: 'uppercase' }}>
        State: {cell.status} ({(cell.resistance * 1000).toFixed(0)}mΩ)
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '2px 0' }} />

      {/* 3. INPUT */}
      <div style={{ fontSize: 9, color: '#cbd5e1', fontWeight: 600 }}>
        <span style={{ color: '#38bdf8', fontWeight: 800 }}>INPUT: </span>
        Current = {Math.abs(loadCurrent).toFixed(1)}A
      </div>

      {/* 4. PROCESS */}
      <div style={{ fontSize: 9, color: '#cbd5e1', fontWeight: 600 }}>
        <span style={{ color: '#c084fc', fontWeight: 800 }}>PROCESS: </span>
        Q_gen = I²R = {cell.heatGeneration.toFixed(2)}W
      </div>

      {/* 5. OUTPUT */}
      <div style={{ fontSize: 9, color: '#cbd5e1', fontWeight: 600 }}>
        <span style={{ color: '#10b981', fontWeight: 800 }}>OUTPUT: </span>
        V = {cell.voltage.toFixed(2)}V  •  T = {cell.temperature.toFixed(1)}°C
      </div>
    </div>
  );
}

function FlowLegendDot({ color, label, disabled = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: disabled ? 0.4 : 1 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ fontSize: 10, fontWeight: 700, color: '#cbd5e1', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}
