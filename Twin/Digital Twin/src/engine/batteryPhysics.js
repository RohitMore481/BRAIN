/**
 * BATTERY DIGITAL TWIN — Unified Physical Engine Interface
 * Re-exports simulationEngine functions with enhanced physics & fault handling.
 */
import { 
  createInitialState as initEngine, 
  updateSimulation, 
  applyScenario as applyEngineScenario,
  getCauseEffectSteps as getEngineCauseEffectSteps
} from './simulationEngine';

export function createInitialState() {
  return initEngine();
}

export function stepSimulation(state) {
  return updateSimulation(state);
}

export function applyScenario(state, scenarioKey) {
  return applyEngineScenario(state, scenarioKey);
}

export function getCauseEffectSteps(state) {
  return getEngineCauseEffectSteps(state);
}

export function getModuleSummary(cells, moduleId) {
  const mc = cells.filter(c => c.moduleId === moduleId);
  if (mc.length === 0) {
    return { voltage: 0, avgTemp: 25, avgSOC: 75, status: 'optimal' };
  }
  return {
    voltage: mc.reduce((s, c) => s + c.voltage, 0),
    avgTemp: mc.reduce((s, c) => s + c.temperature, 0) / mc.length,
    avgSOC:  mc.reduce((s, c) => s + c.soc, 0) / mc.length,
    status:  mc.some(c => c.status === 'critical') ? 'critical' : (mc.some(c => c.status === 'warning') ? 'warning' : 'optimal')
  };
}
