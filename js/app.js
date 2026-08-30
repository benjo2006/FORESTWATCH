/**
 * FORESTWATCH // MAIN APPLICATION ORCHESTRATOR
 * Coordinates map, comparator, analytics, AI engine, simulation,
 * image upload CV analysis, sound effects, and briefing exports.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sub-Systems
  let mapEngine = null;
  let comparator = null;
  let analytics = null;
  let aiEngine = null;
  let simulator = null;

  // Use algorithmically enriched hotspot data (computed via cv-engine algorithms)
  const HOTSPOTS = window.SYLVA_DATA.getEnrichedHotspots
    ? window.SYLVA_DATA.getEnrichedHotspots()
    : window.SYLVA_DATA.HOTSPOTS_DATA;

  let currentSelectedHotspot = HOTSPOTS[0];
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

  // ─────────────────────────────────────────────────────────────
  // IMAGE UPLOAD & COMPUTER VISION MODULE
  // Implements claim c1 (image upload UI) and c2 (CV analysis)
  // ─────────────────────────────────────────────────────────────
  const cvUploadEngine = new ForestCVEngine();
  let uploadedImageData = null;
  let uploadedImageEl   = null;

  const uploadInput    = document.getElementById('satellite-image-upload');
  const uploadDropzone = document.getElementById('upload-dropzone');
  const runCVBtn       = document.getElementById('btn-run-cv-analysis');
  const cvBtnLabel     = document.getElementById('cv-btn-label');
  const previewWrap    = document.getElementById('upload-preview-wrap');
  const previewCanvas  = document.getElementById('upload-preview-canvas');
  const previewMeta    = document.getElementById('upload-preview-meta');
  const cvResultsBody  = document.getElementById('cv-results-body');
  const cvHeatmapWrap  = document.getElementById('cv-heatmap-wrap');

  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPEG, WebP, or GeoTIFF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        uploadedImageEl = img;

        // Decode image to ImageData via offscreen canvas
        const offscreen = document.createElement('canvas');
        // Cap at 640px wide for performance while preserving AR
        const scale  = Math.min(1, 640 / img.width);
        offscreen.width  = Math.round(img.width  * scale);
        offscreen.height = Math.round(img.height * scale);
        const octx = offscreen.getContext('2d');
        octx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
        uploadedImageData = octx.getImageData(0, 0, offscreen.width, offscreen.height);

        // Render preview
        if (previewWrap && previewCanvas) {
          previewWrap.style.display = 'block';
          previewCanvas.width  = offscreen.width;
          previewCanvas.height = offscreen.height;
          previewCanvas.getContext('2d').putImageData(uploadedImageData, 0, 0);
          if (previewMeta) {
            previewMeta.textContent = `${img.width}×${img.height} px (scaled to ${offscreen.width}×${offscreen.height} for analysis) · ${(file.size / 1024).toFixed(1)} KB · ${file.type}`;
          }
        }

        // Enable run button
        if (runCVBtn) { runCVBtn.disabled = false; }
        if (cvBtnLabel) cvBtnLabel.textContent = 'RUN CV ANALYSIS ON IMAGE';

        // Pass to simulator
        if (simulator) simulator.setUploadedImageData(uploadedImageData);

        if (uploadDropzone) uploadDropzone.classList.add('has-file');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // File input change
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      if (e.target.files[0]) handleImageFile(e.target.files[0]);
    });
  }

  // Drag-and-drop support
  if (uploadDropzone) {
    uploadDropzone.addEventListener('dragover', (e) => { e.preventDefault(); uploadDropzone.classList.add('drag-over'); });
    uploadDropzone.addEventListener('dragleave', () => uploadDropzone.classList.remove('drag-over'));
    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleImageFile(file);
    });
  }

  // RUN ANALYSIS button
  if (runCVBtn) {
    runCVBtn.addEventListener('click', () => {
      if (!uploadedImageData) return;
      playSound('alert');

      if (cvBtnLabel) cvBtnLabel.textContent = 'COMPUTING…';
      runCVBtn.disabled = true;

      // Yield to repaint, then compute
      setTimeout(() => {
        const cvMode = document.querySelector('input[name="cv-mode"]:checked')?.value || 'full';
        const metrics = cvUploadEngine.analyzeImage(uploadedImageData);

        // Render visual outputs
        renderCVHeatmaps(uploadedImageData, metrics, cvUploadEngine, cvMode);

        // Render results panel
        renderCVResults(metrics);

        if (cvBtnLabel) cvBtnLabel.textContent = 'RE-RUN ANALYSIS';
        runCVBtn.disabled = false;
        playSound('success');

        // Store for pipeline / AI engine
        window._lastPipelineMetrics = metrics;
        if (simulator) simulator.setUploadedImageData(uploadedImageData);
        if (aiEngine) {
          aiEngine.loadHotspot(currentSelectedHotspot);
        }
      }, 50);
    });
  }

  function renderCVResults(m) {
    if (!cvResultsBody) return;
    const tier = m.threatTier;
    const tierColors = { CRITICAL: '#ff3b5c', HIGH: '#f97316', EMERGING: '#f6ca56', STABLE: '#00f59b' };
    const tc = tierColors[tier] || '#00f59b';

    cvResultsBody.innerHTML = `
      <div class="cv-metrics-grid">
        <div class="cv-metric-card">
          <div class="cv-metric-label">RISK SCORE</div>
          <div class="cv-metric-value" style="color:${tc}">${m.riskScore}<span class="cv-metric-unit">/100</span></div>
          <div class="cv-metric-sub">${tier}</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">CONFIDENCE</div>
          <div class="cv-metric-value" style="color:#00f59b">${m.confidence}<span class="cv-metric-unit">%</span></div>
          <div class="cv-metric-sub">Bayesian Posterior</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">NDVI MEAN</div>
          <div class="cv-metric-value">${m.ndvi.mean.toFixed(4)}</div>
          <div class="cv-metric-sub">σ = ${m.ndvi.std.toFixed(4)}</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">OTSU THRESHOLD</div>
          <div class="cv-metric-value">${m.ndvi.otsuCutpoint.toFixed(4)}</div>
          <div class="cv-metric-sub">Optimal cut-point</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">VEGETATION</div>
          <div class="cv-metric-value" style="color:#10b981">${m.coverage.vegPct.toFixed(1)}<span class="cv-metric-unit">%</span></div>
          <div class="cv-metric-sub">${m.coverage.vegCount.toLocaleString()} px</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">BARE / CLEARED</div>
          <div class="cv-metric-value" style="color:#ff3b5c">${m.coverage.barePct.toFixed(1)}<span class="cv-metric-unit">%</span></div>
          <div class="cv-metric-sub">${m.coverage.bareCount.toLocaleString()} px</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">EDGE DENSITY</div>
          <div class="cv-metric-value">${(m.morphology.edgeDensity * 100).toFixed(3)}</div>
          <div class="cv-metric-sub">Laplacian edges/100px</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">PATCHES (BFS)</div>
          <div class="cv-metric-value">${m.morphology.numPatches}</div>
          <div class="cv-metric-sub">Connected components</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">LINEARITY IDX</div>
          <div class="cv-metric-value">${m.morphology.linearityScore.toFixed(3)}</div>
          <div class="cv-metric-sub">${m.morphology.linearityScore < 0.5 ? 'Linear (road/track)' : 'Clustered (clearing)'}</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">dNBR PROXY</div>
          <div class="cv-metric-value">${m.spectral.dNBR_proxy}</div>
          <div class="cv-metric-sub">${parseFloat(m.spectral.dNBR_proxy) < 0.12 ? 'No fire signature' : 'Possible fire signal'}</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">IMAGE SIZE</div>
          <div class="cv-metric-value">${m.width}×${m.height}</div>
          <div class="cv-metric-sub">${m.totalPixels.toLocaleString()} total pixels</div>
        </div>
        <div class="cv-metric-card">
          <div class="cv-metric-label">LARGEST PATCH</div>
          <div class="cv-metric-value">${m.morphology.largestPatchPx.toLocaleString()}</div>
          <div class="cv-metric-sub">pixels (BFS)</div>
        </div>
      </div>
      <div class="cv-timestamp">Analysis computed at ${new Date(m.timestamp).toLocaleTimeString()} · Engine: ForestCVEngine@1.0</div>
    `;
  }

  function renderCVHeatmaps(imageData, metrics, engine, mode) {
    if (!cvHeatmapWrap) return;
    cvHeatmapWrap.style.display = 'block';

    const { width, height, data } = imageData;
    const total = width * height;
    const EPS   = 1e-6;

    // Original canvas
    const origCanvas = document.getElementById('cv-original-canvas');
    if (origCanvas) {
      origCanvas.width = width; origCanvas.height = height;
      origCanvas.getContext('2d').putImageData(imageData, 0, 0);
    }

    // NDVI Heatmap canvas (green=high, red=low)
    const ndviCanvas = document.getElementById('cv-ndvi-canvas');
    if (ndviCanvas) {
      ndviCanvas.width = width; ndviCanvas.height = height;
      const ndviCtx   = ndviCanvas.getContext('2d');
      const ndviImg   = ndviCtx.createImageData(width, height);
      for (let i = 0; i < total; i++) {
        const R = data[i*4]/255, G = data[i*4+1]/255;
        const ndvi = (R - G) / (R + G + EPS);
        const norm = (ndvi + 1) / 2; // map [-1,1] → [0,1]
        const base = i * 4;
        // Green = high NDVI, Red = low NDVI, via HSL interpolation
        ndviImg.data[base]   = Math.round((1 - norm) * 255);
        ndviImg.data[base+1] = Math.round(norm * 200);
        ndviImg.data[base+2] = 30;
        ndviImg.data[base+3] = 255;
      }
      ndviCtx.putImageData(ndviImg, 0, 0);
    }

    // Vegetation mask canvas (using Otsu threshold)
    const maskCanvas = document.getElementById('cv-mask-canvas');
    if (maskCanvas) {
      maskCanvas.width = width; maskCanvas.height = height;
      const maskCtx  = maskCanvas.getContext('2d');
      const maskImg  = maskCtx.createImageData(width, height);
      const cut      = metrics.ndvi.otsuCutpoint;
      for (let i = 0; i < total; i++) {
        const R = data[i*4]/255, G = data[i*4+1]/255;
        const ndvi = (R - G) / (R + G + EPS);
        const base = i * 4;
        if (ndvi >= cut) {
          maskImg.data[base] = 10; maskImg.data[base+1] = 185; maskImg.data[base+2] = 129; // green
        } else {
          maskImg.data[base] = 255; maskImg.data[base+1] = 59; maskImg.data[base+2] = 92; // red
        }
        maskImg.data[base+3] = 255;
      }
      maskCtx.putImageData(maskImg, 0, 0);
    }

    // Laplacian edge canvas
    const edgeCanvas = document.getElementById('cv-edge-canvas');
    if (edgeCanvas) {
      edgeCanvas.width = width; edgeCanvas.height = height;
      const edgeCtx  = edgeCanvas.getContext('2d');
      const edgeImg  = edgeCtx.createImageData(width, height);
      // Build NDVI array then run Laplacian
      const ndviArr = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const R = data[i*4]/255, G = data[i*4+1]/255;
        ndviArr[i] = (R - G) / (R + G + EPS);
      }
      const edgeMap = engine._laplacianEdge(ndviArr, width, height);
      const edgeMax = Math.max(...edgeMap) || 1;
      for (let i = 0; i < total; i++) {
        const v    = Math.round((edgeMap[i] / edgeMax) * 255);
        const base = i * 4;
        edgeImg.data[base]   = v;
        edgeImg.data[base+1] = Math.round(v * 0.8);
        edgeImg.data[base+2] = 0;
        edgeImg.data[base+3] = 255;
      }
      edgeCtx.putImageData(edgeImg, 0, 0);
    }
  }
  // ──── End of Image Upload & CV Module ────

});

