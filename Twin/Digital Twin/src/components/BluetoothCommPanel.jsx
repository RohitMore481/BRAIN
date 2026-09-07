/**
 * BluetoothCommPanel.jsx — Bluetooth BLE Communication & Live Telemetry Inspector
 * Displays:
 *   - Virtual BMS Connection Status (CONNECTED)
 *   - Bluetooth BLE Transmission Status (ACTIVE @ 5 Hz)
 *   - Sequence Counter & Last Transmission Timestamp
 *   - Interactive Raw BLE JSON Packet Inspector Modal (with copy-to-clipboard feature)
 */
import React, { useState } from 'react';
import { Bluetooth, Radio, Copy, Check, X, FileCode, Wifi, Activity } from 'lucide-react';
import { generateTelemetryPacket, getBluetoothBLEStatus } from '../engine/bmsTelemetryEngine';

export default function BluetoothCommPanel({ state }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const bleStatus = getBluetoothBLEStatus(state);
  const currentPacket = generateTelemetryPacket(state);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPacket, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ── HEADER TOOLBAR BLUETOOTH STATUS BAR ──────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: 8,
        padding: '4px 12px'
      }}>
        {/* BLUETOOTH ICON & ANIMATED PULSE */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            border: '1px solid #38bdf8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Bluetooth size={13} />
          </div>
          {!state.isPaused && (
            <div style={{
              position: 'absolute', width: 28, height: 28, borderRadius: '50%',
              border: '1.5px solid #38bdf8', opacity: 0.6,
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
          )}
        </div>

        {/* METRICS READOUT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 10, fontWeight: 700 }}>
          <div>
            <span style={{ color: '#64748b' }}>BMS Status: </span>
            <span style={{ color: '#10b981', fontWeight: 900 }}>{bleStatus.connectionStatus}</span>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>BLE Output: </span>
            <span style={{ color: state.isPaused ? '#f59e0b' : '#38bdf8', fontWeight: 900 }}>
              {bleStatus.transmissionStatus} ({bleStatus.samplingFrequency})
            </span>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>Packet #: </span>
            <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>#{currentPacket.sequence_number}</span>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>Last Sent: </span>
            <span style={{ color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>{currentPacket.timestamp.split('T')[1]}</span>
          </div>
        </div>

        {/* INSPECT BLE JSON BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: 6,
            padding: '3px 8px', fontSize: 10, fontWeight: 800, cursor: 'pointer'
          }}
        >
          <FileCode size={12} /> Inspect BLE JSON
        </button>
      </div>

      {/* ── RAW BLE JSON PACKET INSPECTOR MODAL ────────────────────────────── */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(6, 9, 15, 0.85)', backdropFilter: 'blur(10px)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            width: 600, maxHeight: '85vh',
            backgroundColor: '#0b111e', border: '1.5px solid #38bdf8',
            borderRadius: 14, boxShadow: '0 0 40px rgba(56, 189, 248, 0.3)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            {/* MODAL HEADER */}
            <div style={{
              padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(16,185,129,0.05))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bluetooth size={18} style={{ color: '#38bdf8' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#f8fafc' }}>
                    Raw Bluetooth BLE Telemetry Payload
                  </div>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>
                    GET /battery/telemetry • Device ID: EV001-BLE-BMS
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleCopyJSON}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    backgroundColor: copied ? '#10b981' : 'rgba(255,255,255,0.08)',
                    color: copied ? '#0f172a' : '#cbd5e1',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6,
                    padding: '4px 10px', fontSize: 10, fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy BLE Payload'}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6,
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* RAW JSON DISPLAY BODY */}
            <div style={{
              flex: 1, padding: '16px', overflowY: 'auto',
              backgroundColor: '#06090f', fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11, color: '#34d399', lineHeight: 1.5, whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify(currentPacket, null, 2)}
            </div>

            {/* MODAL FOOTER */}
            <div style={{
              padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: 10, color: '#64748b', display: 'flex', justifyContent: 'space-between'
            }}>
              <span>Sampling Rate: 5 Hz (200ms)</span>
              <span>Ready for Mobile Application Ingestion</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
