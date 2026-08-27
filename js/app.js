/**
 * FORESTWATCH // MAIN APPLICATION ORCHESTRATOR
 * Coordinates map, comparator, analytics, AI engine, simulation, sound effects, and briefing exports.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sub-Systems
  let mapEngine = null;
  let comparator = null;
  let analytics = null;
  let aiEngine = null;
  let simulator = null;

  let currentSelectedHotspot = window.SYLVA_DATA.HOTSPOTS_DATA[0];
  let soundEnabled = true;

  // Audio synthesis for UI feedback
  const playSound = (type = 'click') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.22);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.22);
      }
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  };

  // Sound Toggle Handler
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.innerHTML = soundEnabled ? 
        '<i data-lucide="volume-2" class="icon-sm"></i><span>AUDIO ON</span>' : 
        '<i data-lucide="volume-x" class="icon-sm"></i><span>AUDIO MUTED</span>';
      if (window.lucide) window.lucide.createIcons();
      if (soundEnabled) playSound('click');
    });
  }

  // 1. Initialize Leaflet Map Engine
  mapEngine = new SylvaMapEngine('satellite-map', (hotspot) => {
    onSelectHotspot(hotspot);
  });

  // 2. Initialize Before vs After Comparator
  comparator = new SylvaComparator('split-slider-box', 'split-divider', 'layer-after');

  // 3. Initialize Time-Series Analytics & Risk Sliders
  analytics = new SylvaAnalytics();

  // 4. Initialize AI Ecological Engine
  aiEngine = new SylvaAIEngine();

  // 5. Initialize Simulator
  simulator = new SylvaSimulator(() => {
    playSound('success');
  });

  // Render Horizontal Hotspot Queue Carousel
  renderHotspotCarousel();

  // Load initial default hotspot (Silent Valley Buffer #04)
  onSelectHotspot(currentSelectedHotspot);

  // Hotspot selection handler function
  function onSelectHotspot(hotspot) {
    currentSelectedHotspot = hotspot;
    playSound('alert');

    // Update Hotspot Sidebar Card
    const nameEl = document.getElementById('hotspot-name');
    const biomeEl = document.getElementById('hotspot-biome');
    const idBadge = document.getElementById('selected-hotspot-id-badge');
    const riskBadge = document.getElementById('selected-hotspot-risk-badge');
    const scoreVal = document.getElementById('hotspot-risk-score');
    const scoreBar = document.getElementById('hotspot-risk-bar');
    const confVal = document.getElementById('hotspot-confidence');
    const confBar = document.getElementById('hotspot-confidence-bar');
    const coverChange = document.getElementById('hotspot-cover-change');
    const areaEl = document.getElementById('hotspot-area');
    const windowEl = document.getElementById('hotspot-window');
    const primaryInd = document.getElementById('hotspot-primary-ind');
    const proxEl = document.getElementById('hotspot-core-prox');
    const speciesEl = document.getElementById('hotspot-species');

    if (nameEl) nameEl.textContent = hotspot.name;
    if (biomeEl) biomeEl.textContent = `${hotspot.biome} • ${hotspot.coordinates[0].toFixed(3)}° N, ${hotspot.coordinates[1].toFixed(3)}° E`;
    if (idBadge) idBadge.textContent = `HOTSPOT #${hotspot.num} DETAILS`;
    if (riskBadge) {
      riskBadge.textContent = hotspot.tierLabel;
      riskBadge.className = `badge-risk ${hotspot.tier}`;
    }
    if (scoreVal) scoreVal.innerHTML = `${hotspot.riskScore}<span class="score-max">/100</span>`;
    if (scoreBar) {
      scoreBar.style.width = `${hotspot.riskScore}%`;
      scoreBar.className = `score-bar-fill ${hotspot.tier === 'critical' ? 'red' : 'green'}`;
    }
    if (confVal) confVal.innerHTML = `${hotspot.confidence}<span class="score-max">%</span>`;
    if (confBar) confBar.style.width = `${hotspot.confidence}%`;
    if (coverChange) coverChange.textContent = `${hotspot.coverChangePct}%`;
    if (areaEl) areaEl.textContent = `${hotspot.flaggedAreaHa} Hectares`;
    if (windowEl) windowEl.textContent = hotspot.detectionWindow;
    if (primaryInd) primaryInd.textContent = hotspot.primaryIndicator;
    if (proxEl) proxEl.textContent = `${hotspot.coreProximityKm} km (Critical Buffer)`;
    if (speciesEl) speciesEl.textContent = hotspot.speciesAtRisk.join(', ');

    // Update comparator
    if (comparator) comparator.loadHotspot(hotspot);

    // Update Analytics Chart & Stepper
    if (analytics) analytics.loadHotspot(hotspot);

    // Update AI Engine
    if (aiEngine) aiEngine.loadHotspot(hotspot);

    // Update Active Card in Carousel
    const cards = document.querySelectorAll('.queue-card');
    cards.forEach(c => {
      if (c.getAttribute('data-id') === hotspot.id) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        c.classList.remove('active');
      }
    });

    // Update Modal Report Data
    updateReportModalData(hotspot);
  }

  function renderHotspotCarousel() {
    const listScroll = document.getElementById('hotspot-list-scroll');
    if (!listScroll) return;

    listScroll.innerHTML = '';
    const hotspots = window.SYLVA_DATA.HOTSPOTS_DATA;

    hotspots.forEach(h => {
      const card = document.createElement('div');
      card.className = `queue-card ${h.id === currentSelectedHotspot.id ? 'active' : ''}`;
      card.setAttribute('data-id', h.id);

      const tierBadge = h.tier === 'critical' ? '<span class="badge-risk critical">🔴 CRITICAL</span>' : 
                       (h.tier === 'high' ? '<span class="badge-risk high">🟠 HIGH</span>' : '<span class="badge-risk emerging">🟡 EMERGING</span>');

      card.innerHTML = `
        <div class="queue-card-top">
          <span class="queue-card-id">ZONE #${h.num}</span>
          ${tierBadge}
        </div>
        <div class="queue-card-name">${h.name}</div>
        <div class="queue-card-stats">
          <span>Delta: <strong class="text-red">${h.coverChangePct}%</strong></span>
          <span>Risk: <strong>${h.riskScore}/100</strong></span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (mapEngine) {
          mapEngine.selectHotspot(h.id, true);
        }
      });

      listScroll.appendChild(card);
    });
  }

  // Quick Action Buttons in Hotspot Card
  const jumpCompBtn = document.getElementById('btn-jump-comparator');
  if (jumpCompBtn) {
    jumpCompBtn.addEventListener('click', () => {
      playSound('click');
      document.getElementById('comparator-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const readAiBtn = document.getElementById('btn-read-ai-summary');
  if (readAiBtn) {
    readAiBtn.addEventListener('click', () => {
      playSound('click');
      document.getElementById('ai-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Map Filter Buttons
  const filterBtns = document.querySelectorAll('.btn-map-filter');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (mapEngine) mapEngine.setFilter(btn.getAttribute('data-filter'));
    });
  });

  // Map Layer Buttons
  const layerBtns = document.querySelectorAll('.layer-btn');
  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      layerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (mapEngine) mapEngine.setLayer(btn.getAttribute('data-layer'));
    });
  });

  // Region Jumper Pills
  const regionPills = document.querySelectorAll('.region-pill');
  regionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playSound('click');
      regionPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (mapEngine) mapEngine.setRegion(pill.getAttribute('data-region'));
    });
  });

  // Action Protocol Dispatch Buttons
  const protoBtns = document.querySelectorAll('.btn-proto-dispatch');
  protoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('success');
      const proto = btn.getAttribute('data-proto');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i data-lucide="check-circle-2"></i> <span>PACKET DISPATCHED ✓</span>`;
      btn.classList.remove('btn-urgent', 'btn-secondary');
      btn.classList.add('btn-primary');
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-primary');
        if (proto === 'ranger') btn.classList.add('btn-urgent');
        else btn.classList.add('btn-secondary');
        if (window.lucide) window.lucide.createIcons();
      }, 3500);
    });
  });

  // Modal / Executive Dossier Export
  const modalBackdrop = document.getElementById('report-modal');
  const exportBtn = document.getElementById('btn-export-report');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const dismissModalBtn = document.getElementById('btn-dismiss-modal');
  const closeDot = document.getElementById('modal-close-dot');
  const printBtn = document.getElementById('btn-print-report');
  const openScannerBtn = document.getElementById('btn-open-scanner');

  if (openScannerBtn) {
    openScannerBtn.addEventListener('click', () => {
      playSound('click');
      document.getElementById('simulation-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      playSound('click');
      if (modalBackdrop) modalBackdrop.classList.add('open');
    });
  }

  const closeModal = () => {
    playSound('click');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (dismissModalBtn) dismissModalBtn.addEventListener('click', closeModal);
  if (closeDot) closeDot.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  function updateReportModalData(h) {
    const repName = document.getElementById('rep-name');
    const repCoords = document.getElementById('rep-coords');
    const repTier = document.getElementById('rep-tier');
    const repConf = document.getElementById('rep-conf');
    const repCover = document.getElementById('rep-cover');
    const repProx = document.getElementById('rep-prox');
    const repAi = document.getElementById('rep-ai-text');

    if (repName) repName.textContent = `${h.name}, ${h.state}`;
    if (repCoords) repCoords.textContent = `${h.coordinates[0].toFixed(3)}° N, ${h.coordinates[1].toFixed(3)}° E`;
    if (repTier) repTier.textContent = `${h.tierLabel} (Risk Score ${h.riskScore}/100)`;
    if (repConf) repConf.textContent = `${h.confidence}% (Multi-Pass Verified)`;
    if (repCover) repCover.textContent = `${h.coverChangePct}% (${h.flaggedAreaHa} Hectares)`;
    if (repProx) repProx.textContent = `${h.coreProximityKm} km (Critical Buffer Corridor)`;
    if (repAi) repAi.textContent = h.aiVerdict;
  }
});
