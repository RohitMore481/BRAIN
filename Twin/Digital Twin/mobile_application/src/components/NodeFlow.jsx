import React from 'react';
import BatteryNode from './BatteryNode';
import { ArrowDown, Workflow } from 'lucide-react';

export default function NodeFlow({ nodes, selectedNodeId, onSelectNode, isSimulating }) {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#070a11',
      padding: '20px 24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Workflow Header */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25))',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            flexShrink: 0
          }}>
            <Workflow size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc' }}>
              Digital Twin Node Graph Workflow
            </h2>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>
              6-Node Behavioural Simulation Pipeline  •  Click any node to inspect
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Live / Simulation Pill */}
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            color: isSimulating ? '#00e5ff' : '#38bdf8',
            backgroundColor: isSimulating ? 'rgba(0, 229, 255, 0.12)' : 'rgba(56, 189, 248, 0.08)',
            padding: '5px 12px',
            borderRadius: '20px',
            border: `1px solid ${isSimulating ? 'rgba(0, 229, 255, 0.4)' : 'rgba(56, 189, 248, 0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isSimulating ? '#00e5ff' : '#38bdf8',
              boxShadow: isSimulating ? '0 0 8px #00e5ff' : 'none',
              animation: isSimulating ? 'pulse 1s infinite' : 'none'
            }} />
            {isSimulating ? 'RUNNING SIMULATION' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Node Flow Sequence */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '0px'
      }}>
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <BatteryNode
              node={node}
              isSelected={selectedNodeId === node.id}
              onClick={() => onSelectNode(node.id)}
              isSimulating={isSimulating}
            />

            {/* Animated Connection Arrow between Nodes */}
            {index < nodes.length - 1 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 0',
                position: 'relative'
              }}>
                {/* Vertical Connector Line */}
                <div style={{
                  width: '2px',
                  height: '18px',
                  background: isSimulating
                    ? 'linear-gradient(to bottom, #00e5ff, #38bdf8)'
                    : '#1e293b',
                  boxShadow: isSimulating ? '0 0 10px rgba(0, 229, 255, 0.5)' : 'none',
                  transition: 'all 0.4s ease'
                }} />
                {/* Arrow Head */}
                <ArrowDown
                  size={16}
                  color={isSimulating ? '#00e5ff' : '#334155'}
                  style={{ transition: 'color 0.4s ease' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom Phase Label */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        marginTop: '20px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4), rgba(7, 10, 17, 0.2))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: '600' }}>
          Phase 1: Battery Behaviour Replica &nbsp;✓&nbsp; Complete
        </p>
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
          Phase 2: AI + PINN Prediction Layer will connect from the right panel →
        </p>
      </div>
    </div>
  );
}
