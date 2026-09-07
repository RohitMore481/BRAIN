# BRAIN Telemetry & Communication API Specification

This document details the telemetry JSON schema and API endpoints for communication between the Virtual BMS, Digital Twin, Prediction Engine, and User Interfaces.

---

## 1. BMS Telemetry JSON Schema

Every telemetry packet emitted by the BRAIN Virtual BMS or received by the prediction engine follows this JSON format:

```json
{
  "battery_id": "BRAIN001",
  "voltage": 48.5,
  "current": 15.0,
  "temperature": 32.0,
  "cycle_number": 350,
  "capacity": 1.85,
  "resistance": 0.035,
  "fault": "NORMAL"
}
```

### Field Definitions

| Field Name | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `battery_id` | String | - | Unique identifier of the battery pack or module |
| `voltage` | Float | Volts (V) | Instantaneous pack terminal voltage |
| `current` | Float | Amperes (A) | Pack load current (Positive = Discharge, Negative = Charge) |
| `temperature` | Float | °C | Average pack/cell temperature |
| `cycle_number` | Integer | Cycles | Total equivalent charge/discharge cycle count |
| `capacity` | Float | Ah | Estimated current discharge capacity |
| `resistance` | Float | Ohms ($\Omega$) | Estimated internal resistance |
| `fault` | String | - | Status indicator: `"NORMAL"`, `"THERMAL_RUNAWAY"`, `"OVER_VOLTAGE"`, `"UNDER_VOLTAGE"`, `"HIGH_RESISTANCE"` |

---

## 2. API Endpoints Reference

The FastAPI service (`digital_twin/communication/api.py`) exposes the following endpoints:

### GET `/`
- **Description**: Health check endpoint.
- **Response**: `{"status": "online", "system": "BRAIN Digital Twin API"}`

### POST `/api/v1/telemetry`
- **Description**: Receive single BMS telemetry packet and pass to Digital Twin state update.
- **Request Body**: BMS Telemetry JSON schema (see section 1).
- **Response**:
  ```json
  {
    "status": "success",
    "timestamp": 1725700000,
    "soc_prediction": 84.5,
    "soh_prediction": 92.1,
    "thermal_state": "STABLE"
  }
  ```

### GET `/api/v1/twin/state`
- **Description**: Retrieve current Digital Twin state variables (Electrical, Thermal, Aging parameters).
- **Response**:
  ```json
  {
    "terminal_voltage": 48.5,
    "temperature": 32.0,
    "soc": 0.845,
    "soh": 0.921,
    "internal_resistance": 0.035
  }
  ```

### POST `/api/v1/fault/inject`
- **Description**: Inject a simulated fault into the Virtual BMS layer.
- **Request Body**:
  ```json
  {
    "fault_type": "THERMAL_RUNAWAY",
    "severity": "HIGH",
    "cell_index": 2
  }
  ```
