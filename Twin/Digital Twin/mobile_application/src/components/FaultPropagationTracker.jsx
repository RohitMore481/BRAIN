import React, { useState } from 'react';
import { GitCommit, ChevronUp, ChevronDown, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export default function FaultPropagationTracker({ logs, isFaultActive }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!logs || logs.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.96)',
      borderTop: `1.5px solid ${isFaultActive ? '#ef4444' : '#0284c7'}`,
      backdropFilter: 'blur(16px)',
      boxShadow: isFaultActive ? '0 -4px 20px rgba(239, 68, 68, 0.25)' : '0 -4px 16px rgba(0, 0, 0, 0.4)',
      transition: 'all 0.3s ease',
      zIndex: 25
    }}>
      {/* HEADER / BAR */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: isFaultActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(2, 132, 199, 0.2)',
            border: `1px solid ${isFaultActive ? '#ef4444' : '#0284c7'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFaultActive ? '#f87171' : '#38bdf8'
          }}>
            {isFaultActive ? <AlertTriangle size={16} /> : <GitCommit size={16} />}
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Fault Propagation Dynamics Engine
              {isFaultActive && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: '900',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  letterSpacing: '0.6px'
                }}>
                  FAULT RIPPLE ACTIVE
                </span>
              )}
            </h4>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>
              Physical Architecture Unchanged • Dynamic Behavioral Cascade ({logs.length} Steps)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>
          <span>{isExpanded ? 'Collapse Timeline' : 'View Propagation Timeline'}</span>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </div>
      </div>

      {/* EXPANDABLE TIMELINE LOGS */}
      {isExpanded && (
        <div style={{
          padding: '4px 24px 16px 24px',
          maxHeight: '180px',
          overflowY: 'auto',
          display: 'flex',
          gap: '12px',
          alignItems: 'stretch',
          overflowX: 'auto'
        }}>
          {logs.map((item, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                minWidth: '220px',
                maxWidth: '260px',
                backgroundColor: 'rgba(2, 6, 23, 0.7)',
                border: `1px solid ${isFaultActive ? (idx === 0 ? '#ef4444' : 'rgba(239, 68, 68, 0.3)') : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      backgroundColor: isFaultActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(2, 132, 199, 0.2)',
                      color: isFaultActive ? '#f87171' : '#38bdf8',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      Step {item.step} • {item.node}
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>{item.time}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#f1f5f9', marginBottom: '2px' }}>
                    {item.type}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.3' }}>
                    {item.description}
                  </div>
                </div>
              </div>

              {idx < logs.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', color: isFaultActive ? '#ef4444' : '#0284c7', opacity: 0.8 }}>
                  <ArrowRight size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
