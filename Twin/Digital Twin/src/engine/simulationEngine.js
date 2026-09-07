// Real-time Physics & Digital Twin Simulation Engine for EV Lithium-Ion Battery System
// Coupled Cause-and-Effect Physics Engine with Battery Aging Model

export const AMBIENT_TEMP = 25.0; // °C
export const NORMAL_RESISTANCE = 0.020; // 20 mΩ (Healthy Cell)
export const AGED_RESISTANCE = 0.060;   // 60 mΩ (Degraded Cell)

export function createInitialState() {
  const cells = [];
  // 8 Cells in 2 Modules (Module 1: Cells 1-4, Module 2: Cells 5-8)
  for (let i = 1; i <= 8; i++) {
    const moduleId = i <= 4 ? 'module-1' : 'module-2';
    cells.push({
      id: `cell-${i}`,
      name: `Cell ${i}`,
      moduleId,
      moduleName: i <= 4 ? 'Module 1' : 'Module 2',
      voltage: 3.80, // V
      current: 0.0,  // A
      soc: 75.0,     // %
      soh: 98.0,     // %
      temperature: 28.0, // °C
      baseResistance: NORMAL_RESISTANCE, // 20mΩ baseline
      effectiveResistance: NORMAL_RESISTANCE, // calculated dynamically with T & SOH
      heatGeneration: 0.0, // W
      status: 'optimal', // 'optimal' | 'warning' | 'degraded' | 'critical' | 'shorted'
      sensorFault: false,
      sensedTemperature: 28.0,
      sensedVoltage: 3.80
    });
  }

  return {
    simMode: 'discharging', // 'idle' | 'charging' | 'discharging'
    loadCurrent: 10.0,      // Amps drawn by load / supplied by charger
    coolantFlowLPM: 8.5,    // Coolant flow rate (LPM)
    ambientTemp: 25.0,      // Ambient temperature (°C)
    cycleCount: 0,          // Battery Charge/Discharge Cycle Count (0 to 1500 cycles)
    simSpeed: 1,
    isPaused: false,
    activeScenario: 'normal_driving',
    
    // Active Fault Flags
    faults: {
      cellDegradation: false,   // Fault 1: Cell 5 resistance increases 20mΩ -> 60mΩ
      coolingFailure: false,    // Fault 2: BTMS Cooling Pump disabled -> 0 LPM
      internalShort: false,     // Fault 3: Cell 6 internal short circuit surge
      sensorFailure: false,     // Fault 4: Cell 3 Temp Sensor fails (reports 35°C when real is 60°C)
      cellImbalance: false      // Fault 5: Cell 4 capacity drops to 70% -> voltage mismatch
    },

    // 11 Core Interactive Component Nodes
    nodes: {
      pack: {
        id: 'node-pack',
        title: 'Battery Pack Node',
        category: 'Physical Enclosure',
        role: 'Complete HV Battery Enclosure & Voltage Collector',
        input: 'Load Demand / Charging Input • Ambient: 25.0°C • HV Bus Rail',
        process: 'Series String Summing • HV Power Distribution • Structural Protection',
        output: 'Pack Terminal Voltage: 30.4 V • Total Power Delivery',
        connected: ['Module 1 Node', 'Module 2 Node', 'Contactor Node', 'BMS Processing Node'],
        internalState: {
          totalVoltage: 30.4,
          totalCurrent: 10.0,
          packTemperature: 28.0,
          configuration: '8S1P Series String (2 Modules × 4 Cells)',
          enclosureStatus: 'Nominal'
        },
        status: 'optimal'
      },
      module1: {
        id: 'node-module1',
        title: 'Module 1 Node',
        category: 'Sub-Pack Subsystem',
        role: 'Houses & Connects Cells 1, 2, 3, 4',
        input: 'HV Bus In • Current: 10.0 A',
        process: 'Current Distribution • Intra-Module Thermal Exchange • Busbar Balancing',
        output: 'Module 1 Voltage: 15.2 V • Temperature Telemetry',
        connected: ['Battery Pack Node', 'Cell 1', 'Cell 2', 'Cell 3', 'Cell 4', 'Cooling Plate Node'],
        internalState: {
          cellCount: 4,
          moduleVoltage: 15.20,
          avgTemperature: 28.0,
          busbarResistance: 0.002
        },
        status: 'optimal'
      },
      module2: {
        id: 'node-module2',
        title: 'Module 2 Node',
        category: 'Sub-Pack Subsystem',
        role: 'Houses & Connects Cells 5, 6, 7, 8',
        input: 'HV Bus Interconnect • Current: 10.0 A',
        process: 'Current Distribution • Intra-Module Thermal Exchange • Busbar Balancing',
        output: 'Module 2 Voltage: 15.2 V • Temperature Telemetry',
        connected: ['Battery Pack Node', 'Cell 5', 'Cell 6', 'Cell 7', 'Cell 8', 'Cooling Plate Node'],
        internalState: {
          cellCount: 4,
          moduleVoltage: 15.20,
          avgTemperature: 28.0,
          busbarResistance: 0.002
        },
        status: 'optimal'
      },
      cells: {
        id: 'node-cells',
        title: 'Electrochemical Cell Array',
        category: 'Electrochemical Layer',
        role: 'Simulates 8 Individual Lithium-Ion NMC Cells (8S1P)',
        input: 'Ionic Current Flow • OCV(SOC) Curve • Surrounding Heat Conduction',
        process: 'Li+ Intercalation • V = OCV - I*R • Joule Heating P = I²R • Fourier Conduction',
        output: 'Cell Voltages (3.0-4.2V) • Heat Generation (Watts) • SOC & Degradation State',
        connected: ['Module 1', 'Module 2', 'Voltage Sensors', 'Temp Sensors', 'Cooling Plate Node'],
        internalState: {
          avgSoc: 75.0,
          minSoc: 75.0,
          avgTemp: 28.0,
          maxTemp: 28.0,
          avgSoh: 98.0,
          cellList: cells
        },
        status: 'optimal'
      },
      coolingPump: {
        id: 'node-cooling-pump',
        title: 'Cooling Pump Node',
        category: 'BTMS Actuator',
        role: 'Circulates Glycol Coolant Fluid through Battery Plates',
        input: 'Pump Power Input: 12V DC • Flow Target: 8.5 LPM',
        process: 'Hydraulic Pumping • Fluid Pressurization',
        output: 'Flow Rate: 8.5 LPM • Coolant Velocity',
        connected: ['Cooling Channel Node', 'Heat Sink Node'],
        internalState: {
          pumpState: 'ACTIVE',
          flowRateLPM: 8.5,
          pumpPowerW: 45.0,
          status: 'Nominal'
        },
        status: 'optimal'
      },
      coolingPlate: {
        id: 'node-cooling-plate',
        title: 'Cooling Plate Node',
        category: 'Thermal Interface',
        role: 'Aluminum Cold Plate transferring heat from Cell array to Coolant',
        input: 'Cell Conductive Heat Flux Q_gen • Inlet Glycol Flow',
        process: 'Thermal Conduction across Aluminum fins (k = 205 W/mK)',
        output: 'Plate Surface Temp • Transfer Heat Flux to Coolant Channel',
        connected: ['Cells Array', 'Cooling Channel Node'],
        internalState: {
          surfaceTemp: 24.5,
          thermalResistance: '0.04 K/W',
          heatTransferredWatts: 28.5
        },
        status: 'optimal'
      },
      coolingChannel: {
        id: 'node-cooling-channel',
        title: 'Cooling Channel Node',
        category: 'Thermal Interface',
        role: 'Absorbs Heat from Module Cold Plates',
        input: 'Inlet Coolant Temp: 22.0°C • Cell Surface Heat Flux Q_gen',
        process: 'Convective Heat Transfer Q = m_dot * Cp * (T_cell - T_inlet)',
        output: 'Outlet Coolant Temp: 25.4°C • Heat Extracted (Watts)',
        connected: ['Cooling Pump Node', 'Cooling Plate Node', 'Heat Sink Node'],
        internalState: {
          inletTemp: 22.0,
          outletTemp: 25.4,
          heatDissipatedWatts: 28.5,
          coolingEfficiency: 95.0
        },
        status: 'optimal'
      },
      heatSink: {
        id: 'node-heat-sink',
        title: 'Heat Sink Radiator Node',
        category: 'Heat Rejection',
        role: 'Rejects Thermal Heat into Ambient Environment',
        input: 'Warmed Coolant Return from Channels',
        process: 'Radiative & Air-Convective Heat Dissipation',
        output: 'Chilled Coolant Supply (22.0°C)',
        connected: ['Cooling Channel Node', 'Cooling Pump Node'],
        internalState: {
          radiatorAirFlow: '120 CFM',
          ambientAirTemp: 25.0,
          heatRejectedWatts: 28.5
        },
        status: 'optimal'
      },
      bmsSensors: {
        id: 'node-bms-sensors',
        title: 'BMS Sensor Layer Node',
        category: 'Hardware Sensing',
        role: 'Measures Cell Voltages, Surface Temperatures & Pack Current',
        input: 'Voltage Taps (8 ch) • NTC Thermistors (4 probes) • Current Shunt',
        process: 'Analog-to-Digital Signal Conversion • Filtering & Sampling (100 Hz)',
        output: 'Sensed Telemetry Packet (V_cell, T_cell, I_pack)',
        connected: ['Cells Array', 'BMS Processing Node'],
        internalState: {
          voltageTapChannels: 8,
          thermistorProbes: 4,
          shuntAccuracy: '±0.1 A',
          sensorStatus: 'All Channels Nominal'
        },
        status: 'optimal'
      },
      bms: {
        id: 'node-bms',
        title: 'BMS Processing Node',
        category: 'Control & Safety System',
        role: 'Processes Telemetry, Detects Imbalance & Controls Contactors',
        input: 'Sensed Voltage, Temperature & Current Streams from Sensor Layer',
        process: 'Limits Evaluation (V_min, V_max, T_max) • Delta-V Check • Protection Logic',
        output: 'Contactor Control Command (CLOSED / DERATED / TRIPPED) • System Alerts',
        connected: ['BMS Sensor Layer Node', 'Contactor Node', 'Battery Pack Node'],
        internalState: {
          mode: 'MONITORING',
          maxDeltaV: 0.00,
          safetyStatus: 'NORMAL',
          activeAlarms: [],
          contactorState: 'CLOSED',
          balancingActive: false
        },
        status: 'optimal'
      },
      contactor: {
        id: 'node-contactor',
        title: 'Contactor & Load System Node',
        category: 'Power Actuation',
        role: 'Main High-Voltage Safety Relays Connecting Battery to Vehicle Load',
        input: 'Pack Terminal Voltage • BMS Interlock Signal',
        process: 'Solenoid Relay Control • Current Limiting / Isolation',
        output: 'Delivered Net Power (kW) to Vehicle Load Motor',
        connected: ['Battery Pack Node', 'BMS Processing Node', 'Vehicle Load Node'],
        internalState: {
          relayState: 'CLOSED (ON)',
          deliveredVoltage: 30.4,
          deliveredCurrent: 10.0,
          netPowerKW: 0.304,
          deratingFactor: 1.0
        },
        status: 'optimal'
      }
    },

    propagationLogs: [],
    bmsDataStream: []
  };
}

export function applyScenario(state, scenarioKey) {
  const next = JSON.parse(JSON.stringify(state));
  next.activeScenario = scenarioKey;
  
  next.faults = {
    cellDegradation: false,
    coolingFailure: false,
    internalShort: false,
    sensorFailure: false,
    cellImbalance: false
  };

  switch (scenarioKey) {
    case 'standby_idle':
      next.simMode = 'idle';
      next.loadCurrent = 0.0;
      next.coolantFlowLPM = 8.5;
      next.cycleCount = 0;
      break;
    case 'normal_driving':
      next.simMode = 'discharging';
      next.loadCurrent = 15.0;
      next.coolantFlowLPM = 8.5;
      next.cycleCount = 100;
      break;
    case 'fast_charging':
      next.simMode = 'charging';
      next.loadCurrent = 30.0;
      next.coolantFlowLPM = 12.0;
      next.cycleCount = 100;
      break;
    case 'hill_climb':
      next.simMode = 'discharging';
      next.loadCurrent = 45.0;
      next.coolantFlowLPM = 10.0;
      next.cycleCount = 150;
      break;
    case 'aging_battery':
      next.simMode = 'discharging';
      next.loadCurrent = 20.0;
      next.cycleCount = 800; // Aged battery scenario: 800 cycles
      next.faults.cellDegradation = true;
      break;
    case 'cooling_failure':
      next.simMode = 'discharging';
      next.loadCurrent = 25.0;
      next.faults.coolingFailure = true;
      next.coolantFlowLPM = 0.0;
      break;
    case 'weak_cell':
      next.simMode = 'discharging';
      next.loadCurrent = 15.0;
      next.faults.cellImbalance = true;
      break;
    default:
      break;
  }
  return updateSimulation(next);
}

// ── PHYSICAL CAUSE-AND-EFFECT STEP LOG GENERATOR (CAUSE -> EQUATION -> RESPONSE -> BMS) ──
export function getCauseEffectSteps(state) {
  const { loadCurrent = 10, faults = {}, nodes = {}, coolantFlowLPM = 8.5, cycleCount = 0, simMode = 'discharging' } = state || {};
  const cells = nodes.cells?.internalState?.cellList || [];

  if (faults.cellDegradation) {
    const c5 = cells[4] || {};
    return {
      cause: 'Cell 5 Degradation Injected (Resistance: 20mΩ → 60mΩ)',
      equation: `Q_gen = I² × R_int = (${Math.abs(loadCurrent).toFixed(1)})² × 0.060 = ${c5.heatGeneration?.toFixed(2)} W`,
      response: `Cell 5 Joule heating increases 3x. Temp reaches ${c5.temperature?.toFixed(1)}°C, Fourier conduction Q_cond transfers heat to Cell 4 & Cell 6.`,
      bmsOutput: `BMS measures voltage sag (${c5.voltage?.toFixed(2)}V) & ΔV (${nodes.bms?.internalState?.maxDeltaV}V), flags CELL_DEGRADATION.`
    };
  }
  
  if (faults.coolingFailure || coolantFlowLPM === 0) {
    return {
      cause: 'BTMS Cooling System Failure (Pump Flow: 0.0 LPM)',
      equation: 'Q_removed = m_dot × Cp × ΔT = 0.0 W  |  mCp (dT/dt) = Q_gen - 0',
      response: `Zero convective heat removal. Heat accumulates across all cells, raising pack max temp to ${nodes.pack?.internalState?.packTemperature}°C.`,
      bmsOutput: 'BMS Thermistors detect rapid temperature rise, flag COOLING_FAILURE and trip HV contactors.'
    };
  }

  if (faults.internalShort) {
    const c6 = cells[5] || {};
    return {
      cause: 'Cell 6 Internal Short Circuit (28A Leakage Path)',
      equation: 'V_cell = OCV - (I_load + I_short) × R_int',
      response: `Cell 6 voltage collapses to ${c6.voltage?.toFixed(2)}V. Localized thermal surge (${c6.temperature?.toFixed(1)}°C) radiates to Cell 5 & 7.`,
      bmsOutput: 'BMS detects severe cell undervoltage & over-temp surge, flags INTERNAL_SHORT.'
    };
  }

  if (faults.sensorFailure) {
    const c3 = cells[2] || {};
    return {
      cause: 'Cell 3 Hardware Thermistor Signal Failure',
      equation: 'T_sensed = 35.0°C (Corrupted Hardware Output) vs T_actual = ' + c3.temperature?.toFixed(1) + '°C',
      response: `Cell 3 physical core temp reaches ${c3.temperature?.toFixed(1)}°C while radiating heat to neighboring cells.`,
      bmsOutput: 'BMS receives corrupted 35.0°C telemetry, demonstrating hardware sensor blindness (flags SENSOR_FAILURE alert).'
    };
  }

  if (faults.cellImbalance) {
    const c4 = cells[3] || {};
    return {
      cause: 'Cell 4 Capacity & SOC Imbalance (100% → 70%)',
      equation: 'dSOC/dt = -I / (3600 × Q_capacity)',
      response: `Cell 4 drains faster (SOC: ${c4.soc?.toFixed(1)}%), leading to lower open circuit voltage and module mismatch.`,
      bmsOutput: `BMS measures cell voltage imbalance ΔV = ${nodes.bms?.internalState?.maxDeltaV}V, flags CELL_IMBALANCE.`
    };
  }

  if (cycleCount > 500) {
    return {
      cause: `Battery Aged: ${cycleCount} Charge/Discharge Cycles Accumulated`,
      equation: `SOH = 100 - (${cycleCount}/1500)×30 = ${(100 - (cycleCount / 1500) * 30).toFixed(0)}%  |  R_int = ${(20 + (cycleCount / 1500) * 35).toFixed(0)} mΩ`,
      response: `High cycle aging increases internal resistance and capacity fade, causing higher ohmic losses and baseline temperature.`,
      bmsOutput: 'BMS logs aged battery telemetry packet to Bluetooth stream.'
    };
  }

  return {
    cause: `Nominal Operation (${simMode.toUpperCase()} mode at ${Math.abs(loadCurrent).toFixed(1)}A)`,
    equation: 'V_cell = OCV(SOC) - I × R_int  |  Q_gen = I² × R_int',
    response: `Cells operating within safe bounds (V = 3.75 - 3.82V, Temp = ${nodes.pack?.internalState?.packTemperature}°C). BTMS extracting heat at ${coolantFlowLPM.toFixed(1)} LPM.`,
    bmsOutput: 'BMS streams normal voltages, temperatures, and Bluetooth telemetry packets.'
  };
}

export function updateSimulation(state) {
  if (state.isPaused) return state;

  const nextState = JSON.parse(JSON.stringify(state));
  const { simMode, loadCurrent, faults, coolantFlowLPM = 8.5, ambientTemp = 25.0, cycleCount = 0 } = nextState;

  // 1. DETERMINE OPERATING LOAD CURRENT
  let effectiveLoadI = 0.0;
  if (simMode === 'charging') effectiveLoadI = -Math.abs(loadCurrent);
  else if (simMode === 'discharging') effectiveLoadI = Math.abs(loadCurrent);
  else effectiveLoadI = 0.0;

  // BATTERY CYCLE AGING MODEL CALCULATIONS (Cycle count 0 to 1500)
  // Higher cycles -> Capacity fade (SOH drops 100% -> 70%) -> Resistance increase (20mΩ -> 55mΩ)
  const cycleSohDegradation = (cycleCount / 1500.0) * 30.0; // max 30% drop at 1500 cycles
  const cycleResistanceIncrease = (cycleCount / 1500.0) * 0.035; // +35mΩ at 1500 cycles

  let totalPackJouleHeat = 0.0;
  let totalPackResistance = 0.0;
  let minCellV = 99.0;
  let maxCellV = 0.0;
  let maxCellT = -99.0;

  const cells = nextState.nodes.cells.internalState.cellList;

  // 2. COUPLED THERMO-ELECTRIC & AGING CELL PHYSICS UPDATE
  cells.forEach((cell, idx) => {
    // Base SOH derived from cycle aging
    let cellSoh = Math.max(50.0, 100.0 - cycleSohDegradation);
    cell.baseResistance = NORMAL_RESISTANCE + cycleResistanceIncrease;

    // FAULT 1: CELL DEGRADATION (Cell 5 resistance increases 20mΩ -> 60mΩ)
    if (faults.cellDegradation && cell.id === 'cell-5') {
      cellSoh = 55.0;
      cell.baseResistance = AGED_RESISTANCE; // 60mΩ
      cell.status = 'degraded';
    } else if (!faults.cellDegradation && cell.id === 'cell-5' && cell.status === 'degraded') {
      cell.status = 'optimal';
    }

    // FAULT 3: CELL IMBALANCE (Cell 4 lower capacity / SOC mismatch)
    if (faults.cellImbalance && cell.id === 'cell-4') {
      cellSoh = 70.0; // 70% capacity
      cell.soc = Math.max(15.0, cell.soc - 0.4);
      if (cell.status !== 'shorted') cell.status = 'warning';
    } else if (!faults.cellImbalance && cell.id === 'cell-4' && cell.status === 'warning') {
      cell.status = 'optimal';
    }

    cell.soh = cellSoh;

    // FAULT 4: INTERNAL SHORT CIRCUIT (Cell 6)
    let internalShortCurrent = 0.0;
    if (faults.internalShort && cell.id === 'cell-6') {
      internalShortCurrent = 28.0; // severe internal leak current path
      cell.voltage = Math.max(1.10, cell.voltage - 0.18);
      cell.status = 'shorted';
    } else if (!faults.internalShort && cell.id === 'cell-6' && cell.status === 'shorted') {
      cell.voltage = 3.80;
      cell.status = 'optimal';
    }

    // DYNAMIC INTERNAL RESISTANCE FORMULA (Depends on Temp & SOH)
    const tempFactor = 1.0 + 0.004 * Math.max(0, 25.0 - cell.temperature);
    const sohFactor = 1.0 + 2.5 * Math.pow(1.0 - (cell.soh / 100.0), 2);
    cell.effectiveResistance = cell.baseResistance * tempFactor * sohFactor;
    cell.resistance = cell.effectiveResistance;

    // Open Circuit Voltage (OCV) lookup curve: 3.20V to 4.15V based on SOC
    const cellEffectiveI = effectiveLoadI + internalShortCurrent;
    const ocv = 3.20 + (cell.soc / 100.0) * 0.95;

    // Terminal Voltage under load: V_cell = OCV - I * R_eff (Voltage Sag Equation)
    let vCell = ocv - (cellEffectiveI * cell.effectiveResistance);
    if (cell.status === 'shorted') vCell = Math.min(vCell, 1.45);
    cell.voltage = Math.max(1.0, Math.min(4.25, vCell));

    // SOC Differential Integration over time: dSOC/dt = -I / (3600 * Q_cap)
    if (cellEffectiveI !== 0.0) {
      const socDelta = (cellEffectiveI * 0.05) / (cell.soh / 100.0);
      cell.soc = Math.max(0.0, Math.min(100.0, cell.soc - socDelta));
    }

    // Joule Heat Generation: Q_joule = I² * R_eff (Quadratic Current Dependency)
    const jouleHeat = Math.pow(cellEffectiveI, 2) * cell.effectiveResistance;
    cell.heatGeneration = jouleHeat;
    totalPackJouleHeat += jouleHeat;
    totalPackResistance += cell.effectiveResistance;

    // FOURIER LATERAL CONDUCTION & CONVECTIVE BTMS COOLING
    let qCoolingCell = 0.0;
    const effectiveFlow = faults.coolingFailure ? 0.0 : coolantFlowLPM;
    if (effectiveFlow > 0) {
      qCoolingCell = (effectiveFlow / cells.length) * 0.22 * Math.max(0, cell.temperature - 22.0);
    }

    // Fourier's Law Lateral Conduction between neighboring cells
    let qNeighbourConduction = 0.0;
    const leftNeighbour = cells[idx - 1];
    const rightNeighbour = cells[idx + 1];
    if (leftNeighbour && leftNeighbour.temperature > cell.temperature) {
      qNeighbourConduction += 0.55 * (leftNeighbour.temperature - cell.temperature);
    }
    if (rightNeighbour && rightNeighbour.temperature > cell.temperature) {
      qNeighbourConduction += 0.55 * (rightNeighbour.temperature - cell.temperature);
    }

    // Thermal Differential Equation
    const netThermalPower = cell.heatGeneration + qNeighbourConduction - qCoolingCell;
    const ambientExchange = 0.05 * (ambientTemp - cell.temperature);
    const dT = (netThermalPower + ambientExchange) * 0.10;
    cell.temperature = Math.max(15.0, Math.min(98.0, cell.temperature + dT));

    // FAULT 5: DECOUPLED BMS SENSOR OBSERVATION MODEL (Cell 3 Temperature Sensor)
    // Actual temperature core e.g. 60°C, but thermistor hardware reports 35°C!
    if (faults.sensorFailure && cell.id === 'cell-3') {
      cell.sensorFault = true;
      cell.sensedTemperature = 35.0; // Corrupted sensor reading
      cell.sensedVoltage = cell.voltage;
    } else {
      cell.sensorFault = false;
      cell.sensedTemperature = cell.temperature;
      cell.sensedVoltage = cell.voltage;
    }

    // Evaluate cell health status
    if (cell.temperature > 65.0 || cell.status === 'shorted') {
      cell.status = 'critical';
    } else if (cell.temperature > 45.0 || cell.effectiveResistance > 0.04) {
      cell.status = 'warning';
    } else if (cell.soh < 75.0) {
      cell.status = 'degraded';
    } else {
      cell.status = 'optimal';
    }

    // Track min/max
    if (cell.voltage < minCellV) minCellV = cell.voltage;
    if (cell.voltage > maxCellV) maxCellV = cell.voltage;
    if (cell.temperature > maxCellT) maxCellT = cell.temperature;
  });

  // 3. UPDATE MODULE 1 & MODULE 2 NODES
  const m1Cells = cells.slice(0, 4);
  const m2Cells = cells.slice(4, 8);

  const mV1 = m1Cells.reduce((sum, c) => sum + c.voltage, 0);
  const mV2 = m2Cells.reduce((sum, c) => sum + c.voltage, 0);
  const mT1 = m1Cells.reduce((sum, c) => sum + c.temperature, 0) / m1Cells.length;
  const mT2 = m2Cells.reduce((sum, c) => sum + c.temperature, 0) / m2Cells.length;

  nextState.nodes.module1.internalState.moduleVoltage = mV1.toFixed(2);
  nextState.nodes.module1.internalState.avgTemperature = mT1.toFixed(1);
  nextState.nodes.module1.status = m1Cells.some(c => c.status === 'critical') ? 'critical' : (m1Cells.some(c => c.status === 'warning' || c.status === 'degraded') ? 'warning' : 'optimal');

  nextState.nodes.module2.internalState.moduleVoltage = mV2.toFixed(2);
  nextState.nodes.module2.internalState.avgTemperature = mT2.toFixed(1);
  nextState.nodes.module2.status = m2Cells.some(c => c.status === 'critical') ? 'critical' : (m2Cells.some(c => c.status === 'warning' || c.status === 'degraded') ? 'warning' : 'optimal');

  // 4. UPDATE BATTERY PACK NODE
  const totalPackV = cells.reduce((sum, c) => sum + c.voltage, 0);
  const avgSoc = cells.reduce((sum, c) => sum + c.soc, 0) / cells.length;
  const avgTemp = cells.reduce((sum, c) => sum + c.temperature, 0) / cells.length;

  const packNode = nextState.nodes.pack;
  packNode.internalState.totalVoltage = totalPackV.toFixed(2);
  packNode.internalState.totalCurrent = effectiveLoadI.toFixed(1);
  packNode.internalState.packTemperature = maxCellT.toFixed(1);

  // 5. UPDATE COOLING NODES
  const coolingPump = nextState.nodes.coolingPump;
  const coolingPlate = nextState.nodes.coolingPlate;
  const coolingChannel = nextState.nodes.coolingChannel;
  const heatSink = nextState.nodes.heatSink;

  const effectiveCoolantFlow = faults.coolingFailure ? 0.0 : coolantFlowLPM;

  if (effectiveCoolantFlow === 0.0) {
    coolingPump.internalState.pumpState = 'FAILURE (OFF)';
    coolingPump.internalState.flowRateLPM = 0.0;
    coolingPump.status = 'critical';

    coolingPlate.internalState.surfaceTemp = maxCellT.toFixed(1);
    coolingPlate.internalState.heatTransferredWatts = 0.0;
    coolingPlate.status = 'critical';

    coolingChannel.internalState.flowRate = 0.0;
    coolingChannel.internalState.heatDissipatedWatts = 0.0;
    coolingChannel.internalState.coolingEfficiency = 0.0;
    coolingChannel.status = 'critical';

    heatSink.internalState.heatRejectedWatts = 0.0;
    heatSink.status = 'warning';
  } else {
    coolingPump.internalState.pumpState = `ACTIVE (${effectiveCoolantFlow.toFixed(1)} LPM)`;
    coolingPump.internalState.flowRateLPM = effectiveCoolantFlow;
    coolingPump.status = 'optimal';

    const heatExtracted = Math.max(0, (maxCellT - 22.0) * (effectiveCoolantFlow / 8.5) * 1.35);
    coolingPlate.internalState.surfaceTemp = (22.0 + heatExtracted / 12.0).toFixed(1);
    coolingPlate.internalState.heatTransferredWatts = heatExtracted.toFixed(1);
    coolingPlate.status = 'optimal';

    coolingChannel.internalState.inletTemp = 22.0;
    coolingChannel.internalState.outletTemp = (22.0 + heatExtracted / 8.0).toFixed(1);
    coolingChannel.internalState.heatDissipatedWatts = heatExtracted.toFixed(1);
    coolingChannel.internalState.coolingEfficiency = 95.0;
    coolingChannel.status = 'optimal';

    heatSink.internalState.heatRejectedWatts = heatExtracted.toFixed(1);
    heatSink.status = 'optimal';
  }

  // 6. BMS SENSOR OBSERVATION LAYER & BMS CONTROL DECISION
  const bmsSensors = nextState.nodes.bmsSensors;
  const bmsNode = nextState.nodes.bms;

  const sensedVoltages = cells.map(c => c.sensedVoltage);
  const sensedTemps = cells.map(c => c.sensedTemperature);

  const deltaV = Math.max(...sensedVoltages) - Math.min(...sensedVoltages);
  const bmsSensedMaxTemp = Math.max(...sensedTemps);

  bmsSensors.internalState.sensorStatus = faults.sensorFailure 
    ? 'CORRUPTED: Cell 3 Thermistor Miscalibrated (35°C vs 60°C Actual)' 
    : 'All Channels Nominal';
  bmsSensors.status = faults.sensorFailure ? 'warning' : 'optimal';

  // BMS Alarm Logic based strictly on SENSED variables
  const alarms = [];
  if (bmsSensedMaxTemp > 55.0) alarms.push('CRITICAL: OVER-TEMPERATURE DETECTED');
  else if (bmsSensedMaxTemp > 45.0) alarms.push('WARNING: ELEVATED TEMPERATURE');

  if (deltaV > 0.35) alarms.push('CRITICAL: CELL VOLTAGE UNBALANCE (>0.35V)');
  else if (deltaV > 0.15) alarms.push('WARNING: CELL VOLTAGE DRIFT DETECTED');

  if (faults.sensorFailure) alarms.push('HARDWARE ALERT: SENSOR TELEMETRY CORRUPTED (CELL 3)');
  if (faults.coolingFailure || coolantFlowLPM === 0) alarms.push('SYSTEM FAULT: BTMS COOLANT PUMP LOSS');
  if (faults.internalShort) alarms.push('CRITICAL: INTERNAL SHORT CIRCUIT SURGE');

  bmsNode.internalState.activeAlarms = alarms;
  bmsNode.internalState.maxDeltaV = deltaV.toFixed(3);

  let bmsStatus = 'optimal';
  let contactorAction = 'CLOSED';
  if (alarms.some(a => a.startsWith('CRITICAL') || a.startsWith('SYSTEM FAULT'))) {
    bmsStatus = 'critical';
    contactorAction = 'TRIPPED (OPEN)';
  } else if (alarms.some(a => a.startsWith('WARNING') || a.startsWith('HARDWARE ALERT'))) {
    bmsStatus = 'warning';
    contactorAction = 'DERATED (LIMIT)';
  }

  bmsNode.internalState.safetyStatus = alarms.length > 0 ? (bmsStatus === 'critical' ? 'FAULT TRIP' : 'WARNING') : 'NORMAL';
  bmsNode.internalState.contactorState = contactorAction;
  bmsNode.status = bmsStatus;

  // 7. UPDATE CONTACTOR & VEHICLE LOAD NODE
  const contactorNode = nextState.nodes.contactor;
  let derate = 1.0;
  if (contactorAction === 'DERATED (LIMIT)') derate = 0.5;
  else if (contactorAction === 'TRIPPED (OPEN)') derate = 0.0;

  const deliveredI = effectiveLoadI * derate;
  const deliveredV = contactorAction === 'TRIPPED (OPEN)' ? 0.0 : totalPackV - (deliveredI * totalPackResistance);
  const netPower = (deliveredV * deliveredI) / 1000.0; // kW

  contactorNode.internalState.relayState = contactorAction === 'TRIPPED (OPEN)' ? 'OPEN (TRIPPED)' : (contactorAction === 'DERATED (LIMIT)' ? 'DERATED (50% LIMIT)' : 'CLOSED (ON)');
  contactorNode.internalState.deliveredVoltage = Math.max(0, deliveredV).toFixed(1);
  contactorNode.internalState.deliveredCurrent = deliveredI.toFixed(1);
  contactorNode.internalState.netPowerKW = netPower.toFixed(3);
  contactorNode.internalState.deratingFactor = derate;
  contactorNode.status = derate === 1.0 ? 'optimal' : (derate === 0.5 ? 'warning' : 'critical');

  // Update Summary on Cells Node
  const cellsNode = nextState.nodes.cells;
  cellsNode.internalState.avgSoc = avgSoc.toFixed(1);
  cellsNode.internalState.minSoc = Math.min(...cells.map(c => c.soc)).toFixed(1);
  cellsNode.internalState.avgTemp = avgTemp.toFixed(1);
  cellsNode.internalState.maxTemp = maxCellT.toFixed(1);

  // 8. REAL-TIME PROPAGATION LOG TIMELINE
  nextState.propagationLogs = getCauseEffectSteps(nextState);

  // 9. APPEND TO BMS DATA STREAM FOR DOWNSTREAM EXPORT
  const bmsPacket = {
    timestamp: new Date().toISOString(),
    simMode: nextState.simMode,
    packVoltage: totalPackV.toFixed(2),
    packCurrent: effectiveLoadI.toFixed(1),
    maxTemperature: maxCellT.toFixed(1),
    cellVoltages: cells.map(c => parseFloat(c.sensedVoltage.toFixed(3))),
    cellTemperatures: cells.map(c => parseFloat(c.sensedTemperature.toFixed(1))),
    activeAlarmsCount: alarms.length,
    contactorState: contactorAction
  };

  const currentStream = nextState.bmsDataStream || [];
  nextState.bmsDataStream = [bmsPacket, ...currentStream].slice(0, 100);

  return nextState;
}
