/* ==========================================================================
   BATTERY DIGITAL TWIN ARCHITECTURE - PRESENTATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DATA DEFINITIONS FOR 4 FUNCTIONAL BLOCKS
  const blockDatabase = [
    {
      id: 'B1',
      badge: 'B1',
      title: '1. Electrical Behaviour',
      desc: 'Simulates terminal voltage response, current flow distribution, and internal resistance.',
      vector: 'V_terminal = V_ocv - I · R_int',
      params: [
        { name: 'Voltage Response', desc: 'Terminal voltage drop under load' },
        { name: 'Current Flow', desc: 'Dynamic charge/discharge excitation' },
        { name: 'Internal Resistance', desc: 'Ohmic drops (R_int)' },
        { name: 'Power I/O', desc: 'P = V · I power transfer' }
      ],
      intelligence: 'Receives dynamic resistance recalibration updates from Phase 2 PINN AI models.'
    },
    {
      id: 'B2',
      badge: 'B2',
      title: '2. Battery Cell Behaviour',
      desc: 'Replicates energy storage, charge acceptance, and real-time State of Charge (SOC) tracking.',
      vector: 'SOC = ∫ (I / Q_nominal) dt',
      params: [
        { name: 'Energy Storage', desc: 'Capacity charge accumulation' },
        { name: 'Charging / Discharging', desc: 'CC-CV & variable load profiles' },
        { name: 'Real-Time SOC', desc: 'Coulomb counting & OCV curve map' },
        { name: 'OCV Equilibrium', desc: 'Open circuit voltage state' }
      ],
      intelligence: 'Mapped to Phase 2 GNN and LSTM machine learning state estimators.'
    },
    {
      id: 'B3',
      badge: 'B3',
      title: '3. Thermal Behaviour',
      desc: 'Models Joule heat generation (I²R) and thermal dissipation to the environment.',
      vector: 'q_gen = I² · R_int + T · ΔS',
      params: [
        { name: 'Joule Heat Generation', desc: 'Internal resistive heat' },
        { name: 'Temperature Rise', desc: 'Core & surface temp change' },
        { name: 'Heat Dissipation', desc: 'Convection & cooling exchange' },
        { name: 'Thermal Boundary', desc: 'Ambient condition interaction' }
      ],
      intelligence: 'Monitored by Phase 2 AI Thermal Prediction for hotspot and runaway prevention.'
    },
    {
      id: 'B4',
      badge: 'B4',
      title: '4. Battery Health State',
      desc: 'Tracks internal degradation, capacity fade, and State of Health (SOH) aging over operational cycles.',
      vector: 'SOH = Q_max / Q_nominal',
      params: [
        { name: 'Capacity Fade', desc: 'Accumulated capacity loss' },
        { name: 'Resistance Growth', desc: 'Aging-induced impedance rise' },
        { name: 'Degradation Model', desc: 'Cycle & calendar aging' },
        { name: 'State of Health (SOH)', desc: 'Percentage remaining health' }
      ],
      intelligence: 'Feeds Phase 2 SOH & Remaining Useful Life (RUL) prediction engines.'
    }
  ];

  // 2. POPULATE SIDEBAR QUICK LIST
  const quickListContainer = document.getElementById('node-quick-list');
  blockDatabase.forEach((block) => {
    const item = document.createElement('div');
    item.className = 'node-item';
    item.innerHTML = `
      <span>${block.title}</span>
      <span class="node-tag">${block.badge}</span>
    `;
    item.addEventListener('click', () => openInspector(block.id));
    quickListContainer.appendChild(item);
  });

  // 3. LOAD SVG ARCHITECTURE DIAGRAM INTO VIEWPORT
  fetch('battery_digital_twin_architecture.svg')
    .then(response => response.text())
    .then(svgText => {
      document.getElementById('svg-wrapper').innerHTML = svgText;
      attachSvgInteractivity();
      initParticleEngine();
    })
    .catch(err => console.error('Failed to load SVG diagram:', err));

  // 4. MODAL INSPECTOR LOGIC
  const modal = document.getElementById('inspector-modal');
  const modalClose = document.getElementById('modal-close');

  function openInspector(blockId) {
    const block = blockDatabase.find(b => b.id === blockId);
    if (!block) return;

    document.getElementById('modal-node-badge').textContent = block.badge;
    document.getElementById('modal-node-title').textContent = block.title;
    document.getElementById('modal-node-desc').textContent = block.desc;
    document.getElementById('modal-node-vector').textContent = block.vector;
    document.getElementById('modal-node-intelligence').textContent = block.intelligence;

    const paramsGrid = document.getElementById('modal-node-params');
    paramsGrid.innerHTML = '';
    block.params.forEach(p => {
      const card = document.createElement('div');
      card.className = 'param-card';
      card.innerHTML = `
        <div class="param-title">${p.name}</div>
        <div class="param-desc">${p.desc}</div>
      `;
      paramsGrid.appendChild(card);
    });

    modal.classList.remove('hidden');
  }

  modalClose.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  function attachSvgInteractivity() {
    blockDatabase.forEach(block => {
      const svgTexts = document.querySelectorAll('#svg-wrapper text');
      svgTexts.forEach(t => {
        if (t.textContent.includes(block.title.split('.')[1].trim().toUpperCase()) ||
            t.textContent.includes(block.badge)) {
          const parentGroup = t.closest('g');
          if (parentGroup) {
            parentGroup.style.cursor = 'pointer';
            parentGroup.addEventListener('click', () => openInspector(block.id));
          }
        }
      });
    });
  }

  // 5. LAYER VISIBILITY FILTER LOGIC
  const layerButtons = document.querySelectorAll('.layer-btn');
  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      layerButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetLayer = btn.getAttribute('data-layer');
      applyLayerFilter(targetLayer);
    });
  });

  function applyLayerFilter(layerKey) {
    const svg = document.querySelector('#svg-wrapper svg');
    if (!svg) return;

    const layerGroups = svg.querySelectorAll('g');
    layerGroups.forEach(g => {
      const text = g.textContent || '';
      if (layerKey === 'all') {
        g.style.opacity = '1';
      } else if (layerKey === 'l1') {
        g.style.opacity = text.includes('INPUT PARAMETERS') || text.includes('Current') || text.includes('Voltage') ? '1' : '0.15';
      } else if (layerKey === 'l2') {
        g.style.opacity = text.includes('ELECTRICAL') || text.includes('CELL') || text.includes('THERMAL') || text.includes('HEALTH') ? '1' : '0.15';
      } else if (layerKey === 'out') {
        g.style.opacity = text.includes('VIRTUAL BATTERY OUTPUT') ? '1' : '0.15';
      } else if (layerKey === 'l3') {
        g.style.opacity = text.includes('PHASE 2') || text.includes('AI') || text.includes('Prediction') ? '1' : '0.15';
      }
    });
  }

  // 6. DYNAMIC PARTICLE FLOW ENGINE
  let animationActive = true;
  const particleBtn = document.getElementById('btn-toggle-particles');
  const particleStatus = document.getElementById('particle-status-text');

  particleBtn.addEventListener('click', () => {
    animationActive = !animationActive;
    particleBtn.classList.toggle('active', animationActive);
    particleStatus.textContent = `Flow Particles: ${animationActive ? 'ON' : 'OFF'}`;
  });

  function initParticleEngine() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const colors = ['#38bdf8', '#818cf8', '#ffb703', '#34d399', '#c084fc'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() + 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 0.8,
        color: colors[i % colors.length],
        size: Math.random() * 2 + 2,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (animationActive) {
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  // 7. EXPORT SVG BUTTON
  document.getElementById('btn-export-svg').addEventListener('click', () => {
    const svgElement = document.querySelector('#svg-wrapper svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'battery_digital_twin_architecture.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
});
