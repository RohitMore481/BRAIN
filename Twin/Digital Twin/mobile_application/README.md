# BRAIN Mobile Application & Web Dashboard

This component provides the frontend user interface, real-time visualization canvas, fault injection controls, and telemetry dashboard for the BRAIN framework.

## Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Installation

1. Navigate to the mobile application directory:
   ```bash
   cd mobile_application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Development Server

Start the local development server:
```bash
npm run dev
```

Open the application URL (typically `http://localhost:5173`) in your browser to view the interactive Virtual BMS interface, digital twin topology node graphs, and telemetry stream monitors.

## Key UI Components
- **Battery Pack & Cell Node Inspector**: Real-time voltage, temperature, and internal resistance monitoring.
- **Fault Injection & Simulation Toolbar**: Inject thermal runaway, sensor offset, and capacity degradation faults.
- **BMS Telemetry & Output Panel**: Real-time telemetry monitoring and alarm notifications.
