/**
 * FORESTWATCH // BEFORE VS AFTER SATELLITE COMPARATOR
 * Smooth split-slider with spectral pixel probe and multi-band layer toggling (RGB True Color, False Color NIR, NDVI Mask).
 */

class SylvaComparator {
  constructor(sliderBoxId, dividerId, layerAfterId) {
    this.sliderBox = document.getElementById(sliderBoxId);
    this.divider = document.getElementById(dividerId);
    this.layerAfter = document.getElementById(layerAfterId);
    
    this.imgBefore = document.getElementById('img-before');
    this.imgAfter = document.getElementById('img-after');
    this.inspectorHud = document.getElementById('pixel-inspector');

    this.currentMode = 'truecolor'; // 'truecolor', 'falsecolor', 'ndvimask'
    this.currentHotspot = null;
    this.isDragging = false;

    this.initEvents();
  }

  initEvents() {
    if (!this.sliderBox || !this.divider) return;

    // Mouse / Touch Dragging Events
    const handleMove = (clientX) => {
      const rect = this.sliderBox.getBoundingClientRect();
      let xPos = clientX - rect.left;
      if (xPos < 0) xPos = 0;
      if (xPos > rect.width) xPos = rect.width;

      const pct = (xPos / rect.width) * 100;
      this.divider.style.left = `${pct}%`;
      this.layerAfter.style.clipPath = `inset(0 0 0 ${pct}%)`;
    };

    this.sliderBox.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      handleMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        handleMove(e.clientX);
      }
      this.updatePixelProbe(e);
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch events for mobile
    this.sliderBox.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Mode Toggle Buttons
    const modeBtns = document.querySelectorAll('.comp-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setMode(btn.getAttribute('data-mode'));
      });
    });
  }

  loadHotspot(hotspot) {
    this.currentHotspot = hotspot;

    // Update titles and dates
    const titleEl = document.getElementById('comp-region-title');
    const dateBefore = document.getElementById('comp-date-before');
    const dateAfter = document.getElementById('comp-date-after');
    const ndviBefore = document.getElementById('comp-ndvi-before');
    const ndviAfter = document.getElementById('comp-ndvi-after');

    if (titleEl) titleEl.textContent = `${hotspot.name} (#${hotspot.num})`;
    if (dateBefore) dateBefore.textContent = `BASELINE (June 2024)`;
    if (dateAfter) dateAfter.textContent = `OBSERVED (${hotspot.detectionWindow})`;
    if (ndviBefore) ndviBefore.textContent = `Canopy NDVI: ${hotspot.spectral.baselineNDVI} (Healthy)`;
    if (ndviAfter) ndviAfter.textContent = `Current NDVI: ${hotspot.spectral.currentNDVI} (Degraded)`;

    // Update bottom metrics bar
    const bNDVI = document.getElementById('stat-comp-base-ndvi');
    const cNDVI = document.getElementById('stat-comp-curr-ndvi');
    const dNDVI = document.getElementById('stat-comp-delta-ndvi');
    const probEl = document.getElementById('stat-comp-prob');

    if (bNDVI) bNDVI.textContent = hotspot.spectral.baselineNDVI.toFixed(2);
    if (cNDVI) cNDVI.textContent = hotspot.spectral.currentNDVI.toFixed(2);
    if (dNDVI) dNDVI.textContent = `${hotspot.spectral.deltaNDVIPct.toFixed(1)}%`;
    if (probEl) probEl.textContent = `${(hotspot.confidence + 2.8).toFixed(1)}%`;

    this.updateImages();
  }

  setMode(mode) {
    this.currentMode = mode;
    this.updateImages();
  }

  updateImages() {
    const assets = window.SYLVA_DATA.ASSETS;
    if (!this.imgBefore || !this.imgAfter) return;

    if (this.currentMode === 'truecolor') {
      this.imgBefore.src = assets.truecolor_before;
      this.imgAfter.src = assets.truecolor_after;
    } else if (this.currentMode === 'falsecolor') {
      this.imgBefore.src = assets.falsecolor_before;
      this.imgAfter.src = assets.falsecolor_after;
    } else if (this.currentMode === 'ndvimask') {
      this.imgBefore.src = assets.ndvimask_before;
      this.imgAfter.src = assets.ndvimask_after;
    }
  }

  updatePixelProbe(e) {
    if (!this.sliderBox || !this.inspectorHud) return;

    const rect = this.sliderBox.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Simulate spectral variation based on probe position
    const probeBase = document.getElementById('probe-baseline');
    const probeCurr = document.getElementById('probe-current');
    const probeDelta = document.getElementById('probe-delta');
    const probeClass = document.getElementById('probe-class');

    // In the cleared center-right quadrant
    const isClearingArea = xRatio > 0.45 && yRatio > 0.2 && yRatio < 0.8;

    const baseVal = this.currentHotspot ? this.currentHotspot.spectral.baselineNDVI : 0.78;
    let currVal = baseVal;
    let delta = 0;
    let classification = "Stable Dense Canopy";

    if (isClearingArea) {
      currVal = this.currentHotspot ? this.currentHotspot.spectral.currentNDVI : 0.41;
      delta = ((currVal - baseVal) / baseVal) * 100;
      classification = "Anthropogenic Clear-Cut";
    } else {
      currVal = (baseVal - 0.02 + (Math.sin(xRatio * 10) * 0.03));
      delta = ((currVal - baseVal) / baseVal) * 100;
    }

    if (probeBase) probeBase.textContent = baseVal.toFixed(2);
    if (probeCurr) {
      probeCurr.textContent = currVal.toFixed(2);
      probeCurr.className = isClearingArea ? "text-red font-bold" : "text-green";
    }
    if (probeDelta) {
      probeDelta.textContent = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
      probeDelta.className = isClearingArea ? "text-red font-bold" : "text-green";
    }
    if (probeClass) {
      probeClass.textContent = classification;
      probeClass.className = isClearingArea ? "text-red font-bold" : "text-green";
    }
  }
}

window.SylvaComparator = SylvaComparator;
