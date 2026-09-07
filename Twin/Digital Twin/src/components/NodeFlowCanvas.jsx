import React, { useRef, useEffect, useState } from 'react';
import DigitalTwinNode from './DigitalTwinNode';

const NODE_KEYS = [
  'pack',
  'modules',
  'cells',
  'electrical',
  'thermal',
  'cooling',
  'bms',
  'output'
];

export default function NodeFlowCanvas({ nodes, selectedNodeId, onSelectNode, faults }) {
  const containerRef = useRef(null);
  const [connections, setConnections] = useState([]);

  // Calculate SVG connector paths dynamically between node elements
  useEffect(() => {
    const updateConnectorPaths = () => {
      if (!containerRef.current) return;
      const nodeEls = containerRef.current.querySelectorAll('.digital-twin-node');
      if (nodeEls.length < 8) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newConns = [];

      for (let i = 0; i < nodeEls.length - 1; i++) {
        const fromRect = nodeEls[i].getBoundingClientRect();
        const toRect = nodeEls[i + 1].getBoundingClientRect();

        const x1 = fromRect.right - containerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
        const x2 = toRect.left - containerRect.left;
        const y2 = toRect.top + toRect.height / 2 - containerRect.top;

        // Determine Flow Type:
        // 0-3 (Pack -> Modules -> Cells -> Elec) = Green Electrical Flow
        // 3-5 (Elec -> Thermal -> Cooling) = Orange Thermal Flow
        // 5-7 (Cooling -> BMS -> Output) = Blue BMS / Data Flow
        let flowType = 'electrical';
        if (i >= 3 && i <= 4) flowType = 'thermal';
        else if (i >= 5) flowType = 'communication';

        newConns.push({
          id: `conn-${i}`,
          x1, y1, x2, y2,
          flowType,
          isFaulted: (faults.increasedResistance && (i === 2 || i === 3)) ||
                     (faults.coolingFailure && i === 5) ||
                     (faults.internalShort && (i === 2 || i === 6)) ||
                     (faults.sensorFailure && i === 6)
        });
      }

      setConnections(newConns);
    };

    updateConnectorPaths();
    window.addEventListener('resize', updateConnectorPaths);
    const interval = setInterval(updateConnectorPaths, 500);

    return () => {
      window.removeEventListener('resize', updateConnectorPaths);
      clearInterval(interval);
    };
  }, [nodes, faults]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#040711',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 60%),
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        overflowX: 'auto',
        overflowY: 'auto',
        padding: '40px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* CANVAS LEGEND BANNER */}
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '12px 20px',
        backdropFilter: 'blur(12px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.2px' }}>
            System Physical Flow Architecture
          </h2>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
            (Interactive Digital Twin Canvas • 8 Sequential Component Nodes)
          </span>
        </div>

        {/* FLOW ANIMATION TYPE LEGEND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '11px', fontWeight: '700' }}>
          {/* ELECTRICAL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
            <span className="legend-particle electrical-particle" />
            <span>Green = Current Flow (Electrical)</span>
          </div>

          {/* THERMAL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb923c' }}>
            <span className="legend-particle thermal-particle" />
            <span>Orange = Heat Flow (Thermal)</span>
          </div>

          {/* COMMUNICATION */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
            <span className="legend-particle comms-particle" />
            <span>Blue = BMS Data / Signal Flow</span>
          </div>
        </div>
      </div>

      {/* SVG CONNECTOR OVERLAY FOR FLOW PIPELINES */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        <defs>
          {/* GRADIENTS */}
          <linearGradient id="elec-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="thermal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="comms-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>

          {/* FILTER FOR GLOW */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {connections.map((conn) => {
          const dx = conn.x2 - conn.x1;
          const curveFactor = Math.abs(dx) * 0.4;
          const pathD = `M ${conn.x1} ${conn.y1} C ${conn.x1 + curveFactor} ${conn.y1}, ${conn.x2 - curveFactor} ${conn.y2}, ${conn.x2} ${conn.y2}`;

          let strokeColor = 'url(#elec-grad)';
          let particleClass = 'particle-green';
          if (conn.flowType === 'thermal') {
            strokeColor = 'url(#thermal-grad)';
            particleClass = 'particle-orange';
          } else if (conn.flowType === 'communication') {
            strokeColor = 'url(#comms-grad)';
            particleClass = 'particle-blue';
          }

          if (conn.isFaulted) {
            strokeColor = '#ef4444';
          }

          return (
            <g key={conn.id}>
              {/* BASE PIPELINE PATH */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={conn.isFaulted ? '4' : '2.5'}
                strokeDasharray={conn.flowType === 'communication' ? '6 4' : 'none'}
                filter="url(#glow)"
                opacity={conn.isFaulted ? '1' : '0.85'}
              />

              {/* ANIMATED PARTICLES ALONG PATH */}
              <circle r={conn.isFaulted ? "6" : "4"} className={`flow-particle ${particleClass}`}>
                <animateMotion path={pathD} dur={conn.isFaulted ? "0.8s" : "2s"} repeatCount="indefinite" />
              </circle>
              <circle r={conn.isFaulted ? "5" : "3"} className={`flow-particle ${particleClass}`}>
                <animateMotion path={pathD} dur={conn.isFaulted ? "0.8s" : "2s"} begin="0.7s" repeatCount="indefinite" />
              </circle>
              <circle r={conn.isFaulted ? "5" : "3"} className={`flow-particle ${particleClass}`}>
                <animateMotion path={pathD} dur={conn.isFaulted ? "0.8s" : "2s"} begin="1.4s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* 8 SEQUENTIAL NODE CARDS IN WRAPPED OR MULTI-ROW FLEX ARCHITECTURE */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '1400px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '36px 40px',
        justifyItems: 'center',
        alignItems: 'center',
        padding: '10px 0'
      }}>
        {NODE_KEYS.map((key, idx) => {
          const nodeData = nodes[key];
          if (!nodeData) return null;

          return (
            <DigitalTwinNode
              key={nodeData.id}
              node={nodeData}
              index={idx}
              isSelected={selectedNodeId === nodeData.id}
              onClick={() => onSelectNode(nodeData.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
