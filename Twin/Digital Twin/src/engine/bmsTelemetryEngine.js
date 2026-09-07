/**
 * bmsTelemetryEngine.js — Communication & Telemetry Layer
 * Implementations:
 *   - Layer 2: Virtual Sensor Layer (Voltage Taps, Thermistors, Current Shunt, Cooling Sensors)
 *   - Layer 3: Virtual BMS Controller (Decoupled ECU limits & fault categorization)
 *   - Layer 4: Telemetry Packet Generator (Standardized EV JSON Schema)
 *   - Layer 5: Bluetooth BLE Simulation Engine (Sequence Counter, 5Hz frequency, GET /battery/telemetry API)
 */

let sequenceCounter = 12560;

/**
 * LAYER 2: VIRTUAL SENSOR LAYER
 * Measures physical parameters from Layer 1 Digital Twin state.
 */
export function readVirtualSensors(state) {
  const { nodes, faults, coolantFlowLPM = 8.5, loadCurrent = 10.0, simMode = 'discharging' } = state || {};
  const cells = nodes?.cells?.internalState?.cellList || [];

  // 1. Voltage Sensors
  const cellVoltages = cells.map((c, i) => ({
    cell_id: i + 1,
    voltage: parseFloat((c.sensedVoltage !== undefined ? c.sensedVoltage : c.voltage).toFixed(2))
  }));

  const moduleVoltages = [
    {
      module_id: 1,
      voltage: parseFloat((cells.slice(0, 4).reduce((sum, c) => sum + (c.sensedVoltage || c.voltage), 0)).toFixed(2))
    },
    {
      module_id: 2,
      voltage: parseFloat((cells.slice(4, 8).reduce((sum, c) => sum + (c.sensedVoltage || c.voltage), 0)).toFixed(2))
    }
  ];

  const packVoltage = parseFloat((cells.reduce((sum, c) => sum + (c.sensedVoltage || c.voltage), 0)).toFixed(1));

  // 2. Temperature Sensors (Decoupled: Sensed vs Core)
  const cellTemps = cells.map((c, i) => ({
    cell_id: i + 1,
    temperature: parseFloat((c.sensedTemperature !== undefined ? c.sensedTemperature : c.temperature).toFixed(1))
  }));

  const m1Temp = cells.slice(0, 4).reduce((sum, c) => sum + (c.sensedTemperature || c.temperature), 0) / 4;
  const m2Temp = cells.slice(4, 8).reduce((sum, c) => sum + (c.sensedTemperature || c.temperature), 0) / 4;

  const moduleTemps = [
    { module_id: 1, temperature: parseFloat(m1Temp.toFixed(1)) },
    { module_id: 2, temperature: parseFloat(m2Temp.toFixed(1)) }
  ];

  const maxTemp = parseFloat(Math.max(...cells.map(c => c.sensedTemperature || c.temperature)).toFixed(1));

  // 3. Current Sensor
  let currentVal = 0.0;
  if (simMode === 'charging') currentVal = Math.abs(loadCurrent);
  else if (simMode === 'discharging') currentVal = -Math.abs(loadCurrent);

  // 4. Cooling System Sensor
  const pumpStatus = (faults?.coolingFailure || coolantFlowLPM === 0) ? 'OFF' : 'ACTIVE';
  const effectiveCoolantFlow = (faults?.coolingFailure || coolantFlowLPM === 0) ? 0.0 : parseFloat(coolantFlowLPM.toFixed(1));

  return {
    cellVoltages,
    moduleVoltages,
    packVoltage,
    cellTemps,
    moduleTemps,
    maxTemp,
    currentVal,
    simMode: simMode.toUpperCase(),
    pumpStatus,
    effectiveCoolantFlow
  };
}

/**
 * LAYER 3: VIRTUAL BMS CONTROLLER
 * Decoupled BMS ECU evaluating sensor telemetry and classifying fault state.
 */
export function processVirtualBMS(sensors, faults) {
  let faultDetected = false;
  let faultType = 'NONE';

  if (faults?.cellDegradation) {
    faultDetected = true;
    faultType = 'CELL_DEGRADATION';
  } else if (faults?.coolingFailure || sensors.pumpStatus === 'OFF') {
    faultDetected = true;
    faultType = 'COOLING_FAILURE';
  } else if (faults?.internalShort) {
    faultDetected = true;
    faultType = 'INTERNAL_SHORT';
  } else if (faults?.sensorFailure) {
    faultDetected = true;
    faultType = 'SENSOR_FAILURE';
  } else if (faults?.cellImbalance) {
    faultDetected = true;
    faultType = 'CELL_IMBALANCE';
  }

  return {
    fault_detected: faultDetected,
    fault_type: faultType
  };
}

/**
 * LAYER 4: TELEMETRY PACKET GENERATOR
 * Formats standardized JSON telemetry packet matching EV schema specification.
 */
export function generateTelemetryPacket(state) {
  sequenceCounter += 1;
  const now = new Date();

  // Format ISO timestamp without milliseconds for clean EV schema compatibility
  const timeStr = now.toISOString().split('.')[0];
  const fullTimestamp = now.toISOString();

  const sensors = readVirtualSensors(state);
  const bmsAnalysis = processVirtualBMS(sensors, state.faults);

  // Layer 4 JSON Packet Schema
  const packet = {
    battery_id: "EV001",
    timestamp: timeStr,
    full_timestamp: fullTimestamp,
    sequence_number: sequenceCounter,
    operating_mode: sensors.simMode,
    pack_data: {
      voltage: sensors.packVoltage,
      current: sensors.currentVal,
      power: parseFloat(Math.abs(sensors.packVoltage * sensors.currentVal).toFixed(1)),
      maximum_temperature: sensors.maxTemp
    },
    module_data: [
      {
        module_id: 1,
        voltage: sensors.moduleVoltages[0].voltage,
        temperature: sensors.moduleTemps[0].temperature
      },
      {
        module_id: 2,
        voltage: sensors.moduleVoltages[1].voltage,
        temperature: sensors.moduleTemps[1].temperature
      }
    ],
    cell_data: sensors.cellVoltages.map((cv, idx) => ({
      cell_id: cv.cell_id,
      voltage: cv.voltage,
      temperature: sensors.cellTemps[idx].temperature
    })),
    cooling_system: {
      pump_status: sensors.pumpStatus,
      coolant_flow: sensors.effectiveCoolantFlow
    },
    fault_status: bmsAnalysis,
    aging_data: {
      cycle_count: state.cycleCount || 0,
      soh_percentage: Math.round(Math.max(50, 100 - ((state.cycleCount || 0) / 1500) * 30))
    }
  };

  return packet;
}

/**
 * LAYER 5: BLUETOOTH BLE SIMULATION & MOCK API ENDPOINT
 */
export function getBluetoothBLEStatus(state) {
  const isPaused = state?.isPaused || false;
  return {
    connectionStatus: 'CONNECTED',
    transmissionStatus: isPaused ? 'PAUSED' : 'ACTIVE',
    samplingFrequency: '5 Hz',
    samplingIntervalMs: 200,
    sequenceCounter
  };
}

/**
 * Mock Telemetry Endpoint: GET /battery/telemetry
 * Callable programmatically by mobile application layers.
 */
export function getBatteryTelemetryEndpoint(state) {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Bluetooth-Device-ID': 'EV001-BLE-BMS'
    },
    data: generateTelemetryPacket(state)
  };
}
