/**
 * NodeInspectorDrawer.jsx — Interactive Component Inspector
 * Displays full physical role, input parameters, internal state matrix, output parameters, and connected components when any node is clicked.
 */
import React from 'react';
import { X, Cpu, ArrowDown, ArrowUp, Activity, Layers, Share2, Zap } from 'lucide-react';

export default function NodeInspectorDrawer({ node, onClose }) {
  if (!node) return null;

  const connectedList = node.connected || node.connectedComponents || [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '460px',
      height: '100vh',
      backgroundColor: 'rgba(11, 17, 30, 0.98)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1.5px solid rgba(56, 189, 248, 0.3)',
      boxShadow: '-8px 0 36px rgba(0, 0, 0, 0.7)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      overflowY: 'auto'
    }}>
      {/* ── 1. COMPONENT NAME & CATEGORY HEADER ───────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
              {node.title || node.name}
            </h2>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700' }}>
              {node.category || 'Battery Digital Twin Component'}
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#94a3b8',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', marginBottom: '18px' }} />

      {/* ── 2. PHYSICAL ROLE ─────────────────────────────────────────────────── */}
      {node.role && (
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '14px'
        }}>
          <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} /> Physical System Role
          </h4>
          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, fontWeight: '600', lineHeight: '1.4' }}>
            {node.role}
          </p>
        </div>
      )}

      {/* ── 3. INPUT PARAMETERS ──────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '14px'
      }}>
        <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowDown size={14} /> Input Parameters
        </h4>
        <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500', lineHeight: '1.4' }}>
          {Array.isArray(node.inputs) ? node.inputs.join(' • ') : (node.input || 'N/A')}
        </div>
      </div>

      {/* ── 4. INTERNAL PROCESS / BEHAVIOR ───────────────────────────────────── */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '14px'
      }}>
        <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#c084fc', textTransform: 'uppercase', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} /> Internal Electrical & Thermal Process
        </h4>
        <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500', lineHeight: '1.4' }}>
          {Array.isArray(node.processes) ? node.processes.join(' • ') : (node.process || 'N/A')}
        </div>
      </div>

      {/* ── 5. OUTPUT PARAMETERS ─────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(52, 211, 153, 0.25)',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '14px'
      }}>
        <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#34d399', textTransform: 'uppercase', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUp size={14} /> Output Parameters
        </h4>
        <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500', lineHeight: '1.4' }}>
          {Array.isArray(node.outputs) ? node.outputs.join(' • ') : (node.output || 'N/A')}
        </div>
      </div>

      {/* ── 6. REAL-TIME INTERNAL STATE MATRIX ───────────────────────────────── */}
      {node.internalState && (
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '14px'
        }}>
          <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} /> Real-Time Internal State Matrix
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.entries(node.internalState)
              .filter(([k]) => k !== 'cellList' && k !== 'activeAlarms')
              .map(([key, val]) => (
                <div key={key} style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  padding: '6px 10px', borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'capitalize', fontWeight: '600' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#f8fafc', marginTop: '2px' }}>
                    {String(val)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── 7. CONNECTED COMPONENTS ─────────────────────────────────────────── */}
      {connectedList.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(129, 140, 248, 0.25)',
          borderRadius: '12px',
          padding: '14px'
        }}>
          <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#818cf8', textTransform: 'uppercase', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Share2 size={14} /> Connected Components
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {connectedList.map((c, i) => (
              <span key={i} style={{
                backgroundColor: 'rgba(129, 140, 248, 0.12)',
                border: '1px solid rgba(129, 140, 248, 0.3)',
                color: '#cbd5e1', fontSize: '10px', fontWeight: '700',
                padding: '4px 10px', borderRadius: '6px'
              }}>
                • {c}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
