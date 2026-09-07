# BRAIN System Architecture

The **Battery Risk and Analytics Intelligence Network (BRAIN)** framework is an end-to-end multi-tiered architecture that integrates physics-informed modeling, artificial intelligence, virtual telemetry engines, and user interfaces.

## 1. High-Level System Dataflow

```
+------------------------+
| Battery Data Sources   |  (NASA, CALCE, Oxford, Real Sensors)
+-----------+------------+
            |
            v
+------------------------+
| Feature Processing     |  (Feature extraction, filtering, standardization)
+-----------+------------+
            |
            v
+------------------------+
| Prediction Engine      |  (SOC, SOH, RUL, Anomaly Detection & SHAP Explainability)
+-----------+------------+
            |
            v
+------------------------+
| BRAIN Analytics Engine |  (Unified risk scoring & parameter state fusion)
+-----------+------------+
            |
            v
+------------------------+
| Digital Twin Layer     |  (Electrical ECM, Lumped Thermal Balance, Aging Models)
+-----------+------------+
            |
            v
+------------------------+
| Virtual BMS Controller |  (Telemetry generation, safety limits, fault triggers)
+-----------+------------+
            |
            v
+------------------------+
| Mobile Application /   |  (Interactive visual canvas, telemetry UI)
| Cloud Telemetry        |
+------------------------+
```

## 2. Component Descriptions

### 2.1 Physics-Informed Digital Twin (`digital_twin/`)
- **Electrical Subsystem**: Computes open circuit voltage (OCV), internal resistance dynamics, and terminal voltage under dynamic load currents.
- **Thermal Subsystem**: Calculates heat generation ($Q = I^2 R$), thermal conduction, convective cooling, and cell temperature transient response ($m C_p \frac{dT}{dt}$).
- **Aging Subsystem**: Tracks State of Health (SOH) capacity degradation over equivalent full cycles.
- **Virtual BMS Subsystem**: Manages state transitions, sensor fault injection, cell balancing simulation, and telemetry streams.
- **Communication Layer**: Serves RESTful API endpoints (`api.py`) and BLE payload interfaces.

### 2.2 Prediction Engine (`prediction_engine/`)
- **Feature Processing**: Transforms raw time-series voltage, current, and temperature measurements into cycle-level statistical features.
- **Inference Engine**: Executes ML pipeline models (XGBoost, Random Forest, PyTorch/TensorFlow deep networks) for real-time SOC, SOH, and RUL estimation.
- **Explainability (SHAP)**: Provides feature importance attribution for model predictions to explain anomaly alerts.

### 2.3 User Interface Layer (`mobile_application/`)
- **Interactive Node Canvas**: Visualizes battery pack topology, cell node metrics, and fault propagation.
- **Controls & Toolbar**: Allows researchers to inject thermal, sensor, or electrical faults and observe virtual BMS responses in real time.
