/**
 * FORESTWATCH // TIME-SERIES ANALYTICS & DYNAMIC RISK MODEL
 * 5-Year longitudinal canopy chart, 4-step disturbance escalation sequence, and interactive weighted risk formula.
 */

class SylvaAnalytics {
  constructor() {
    this.chart = null;
    this.currentStep = 4;
    this.isPlaying = false;
    this.playInterval = null;
    this.currentHotspot = null;

    this.initChart();
    this.initStepper();
    this.initRiskSliders();
  }

  initChart() {
    const ctx = document.getElementById('historical-trend-chart');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025', '2026 (Now)'],
        datasets: [
          {
            label: 'Canopy Density Index (%)',
            data: [98.4, 95.1, 91.0, 84.2, 76.5, 66.0],
            borderColor: '#ff3b5c',
            backgroundColor: 'rgba(255, 59, 92, 0.12)',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#ff3b5c',
            pointBorderColor: '#000',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: 'Healthy Forest Baseline (95%)',
            data: [95, 95, 95, 95, 95, 95],
            borderColor: '#10b981',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#94a3b8',
              font: { family: 'Outfit, sans-serif', size: 11, weight: 'bold' }
            }
          },
          tooltip: {
            backgroundColor: '#040805',
            borderColor: '#00f59b',
            borderWidth: 1,
            titleFont: { family: 'Outfit, sans-serif', weight: 'bold' },
            bodyFont: { family: 'Space Grotesk, monospace' }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { family: 'Outfit, sans-serif', weight: 'bold' } }
          },
          y: {
            min: 40,
            max: 105,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#64748b',
              callback: (val) => `${val}%`,
              font: { family: 'Outfit, sans-serif' }
            }
          }
        }
      }
    });
  }

  updateChart(hotspot) {
    if (!this.chart || !hotspot || !hotspot.history5Year) return;

    const labels = hotspot.history5Year.map(h => h.year);
    const dataValues = hotspot.history5Year.map(h => h.canopyIndex);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = dataValues;
    this.chart.update();
  }

  initStepper() {
    const weekTabs = document.querySelectorAll('.week-tab-btn');
    weekTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.getAttribute('data-step'), 10);
        this.setStep(step);
      });
    });

    const playBtn = document.getElementById('btn-play-sequence');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.toggleAutoPlay();
      });
    }
  }

  setStep(step) {
    this.currentStep = step;
    const weekTabs = document.querySelectorAll('.week-tab-btn');
    weekTabs.forEach(btn => {
      const bStep = parseInt(btn.getAttribute('data-step'), 10);
      if (bStep === step) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const assets = window.SYLVA_DATA.ASSETS;
    const imgEl = document.getElementById('week-step-img');
    const badgeEl = document.getElementById('week-badge-overlay');
    const titleEl = document.getElementById('week-step-title');
    const descEl = document.getElementById('week-step-desc');
    const chipNdvi = document.getElementById('week-chip-ndvi');
    const chipRisk = document.getElementById('week-chip-risk');
    const chipStatus = document.getElementById('week-chip-status');

    if (!imgEl) return;

    const data = this.currentHotspot && this.currentHotspot.weeklyDisturbance ? 
                 this.currentHotspot.weeklyDisturbance[step - 1] : null;

    if (step === 1) {
      imgEl.src = assets.week1;
      if (badgeEl) { badgeEl.textContent = "WEEK 1: NORMAL BASELINE"; badgeEl.style.borderColor = "#10b981"; badgeEl.style.color = "#00f59b"; }
      if (titleEl) titleEl.textContent = "Week 1: Intact Ecological Baseline";
      if (descEl) descEl.textContent = data ? data.desc : "Dense canopy reflectance baseline. Zero linear road intrusion or canopy perforation.";
      if (chipNdvi) { chipNdvi.textContent = data ? data.ndvi : "0.79"; chipNdvi.className = "text-green"; }
      if (chipRisk) { chipRisk.textContent = data ? `${data.risk} / 100` : "14 / 100"; chipRisk.className = "text-green"; }
      if (chipStatus) { chipStatus.textContent = "STABLE CANOPY"; chipStatus.className = "text-green"; }
    } else if (step === 2) {
      imgEl.src = assets.week2;
      if (badgeEl) { badgeEl.textContent = "WEEK 2: EARLY ANOMALY"; badgeEl.style.borderColor = "#f6ca56"; badgeEl.style.color = "#f6ca56"; }
      if (titleEl) titleEl.textContent = "Week 2: Emerging Canopy Perforation";
      if (descEl) descEl.textContent = data ? data.desc : "Early multispectral drop detected (-7.6% NDVI decline concentrated on perimeter).";
      if (chipNdvi) { chipNdvi.textContent = data ? data.ndvi : "0.73"; chipNdvi.className = "text-amber"; }
      if (chipRisk) { chipRisk.textContent = data ? `${data.risk} / 100` : "36 / 100"; chipRisk.className = "text-amber"; }
      if (chipStatus) { chipStatus.textContent = "EMERGING DISTURBANCE"; chipStatus.className = "text-amber"; }
    } else if (step === 3) {
      imgEl.src = assets.week3;
      if (badgeEl) { badgeEl.textContent = "WEEK 3: ROAD ENCROACHMENT"; badgeEl.style.borderColor = "#f97316"; badgeEl.style.color = "#f97316"; }
      if (titleEl) titleEl.textContent = "Week 3: Linear Access Track Slicing Canopy";
      if (descEl) descEl.textContent = data ? data.desc : "Linear logging spur confirmed. SAR radar registers volumetric trunk loss.";
      if (chipNdvi) { chipNdvi.textContent = data ? data.ndvi : "0.58"; chipNdvi.className = "text-red"; }
      if (chipRisk) { chipRisk.textContent = data ? `${data.risk} / 100` : "68 / 100"; chipRisk.className = "text-red"; }
      if (chipStatus) { chipStatus.textContent = "HIGH THREAT"; chipStatus.className = "text-red"; }
    } else {
      imgEl.src = assets.week4;
      if (badgeEl) { badgeEl.textContent = "WEEK 4: CONFIRMED DEFORESTATION"; badgeEl.style.borderColor = "#ff3b5c"; badgeEl.style.color = "#ff3b5c"; }
      if (titleEl) titleEl.textContent = "Week 4: Persistent Multi-Observation Deforestation";
      if (descEl) descEl.textContent = data ? data.desc : "Persistent clear-cut timber extraction zone fully resolved by Sentinel-2 & SAR radar.";
      if (chipNdvi) { chipNdvi.textContent = data ? data.ndvi : "0.41"; chipNdvi.className = "text-red"; }
      if (chipRisk) { chipRisk.textContent = data ? `${data.risk} / 100` : "87 / 100"; chipRisk.className = "text-red"; }
      if (chipStatus) { chipStatus.textContent = "CRITICAL HOTSPOT"; chipStatus.className = "text-red"; }
    }
  }

  toggleAutoPlay() {
    const playBtn = document.getElementById('btn-play-sequence');
    if (this.isPlaying) {
      clearInterval(this.playInterval);
      this.isPlaying = false;
      if (playBtn) playBtn.innerHTML = '<i data-lucide="play"></i> AUTO-PLAY';
      if (window.lucide) window.lucide.createIcons();
    } else {
      this.isPlaying = true;
      if (playBtn) playBtn.innerHTML = '<i data-lucide="pause"></i> PAUSE';
      if (window.lucide) window.lucide.createIcons();

      this.playInterval = setInterval(() => {
        let nextStep = this.currentStep + 1;
        if (nextStep > 4) nextStep = 1;
        this.setStep(nextStep);
      }, 2200);
    }
  }

  initRiskSliders() {
    const sliders = ['veg', 'cover', 'trend', 'land', 'persist'];
    sliders.forEach(s => {
      const el = document.getElementById(`range-${s}`);
      if (el) {
        el.addEventListener('input', () => {
          this.recalculateRiskScore();
        });
      }
    });
  }

  recalculateRiskScore() {
    const valVeg = parseInt(document.getElementById('range-veg').value, 10);
    const valCover = parseInt(document.getElementById('range-cover').value, 10);
    const valTrend = parseInt(document.getElementById('range-trend').value, 10);
    const valLand = parseInt(document.getElementById('range-land').value, 10);
    const valPersist = parseInt(document.getElementById('range-persist').value, 10);

    // Update label values
    document.getElementById('val-weight-veg').textContent = `${valVeg}%`;
    document.getElementById('val-weight-cover').textContent = `${valCover}%`;
    document.getElementById('val-weight-trend').textContent = `${valTrend}%`;
    document.getElementById('val-weight-land').textContent = `${valLand}%`;
    document.getElementById('val-weight-persist').textContent = `${valPersist}%`;

    // Formula: (Veg * 0.40) + (Cover * 0.25) + (Trend * 0.15) + (Land * 0.15) + (Persist * 0.05)
    const compositeScore = (valVeg * 0.40) + (valCover * 0.25) + (valTrend * 0.15) + (valLand * 0.15) + (valPersist * 0.05);

    const scoreEl = document.getElementById('calc-final-score');
    const tierEl = document.getElementById('calc-final-tier');

    if (scoreEl) scoreEl.textContent = compositeScore.toFixed(1);
    if (tierEl) {
      if (compositeScore >= 80) {
        tierEl.textContent = "CRITICAL HOTSPOT";
        tierEl.className = "result-score-tier text-red";
        scoreEl.className = "result-score-number text-red";
      } else if (compositeScore >= 60) {
        tierEl.textContent = "HIGH THREAT ZONE";
        tierEl.className = "result-score-tier text-amber";
        scoreEl.className = "result-score-number text-amber";
      } else if (compositeScore >= 40) {
        tierEl.textContent = "EMERGING DISTURBANCE";
        tierEl.className = "result-score-tier text-amber";
        scoreEl.className = "result-score-number text-amber";
      } else {
        tierEl.textContent = "STABLE / LOW THREAT";
        tierEl.className = "result-score-tier text-green";
        scoreEl.className = "result-score-number text-green";
      }
    }
  }

  loadHotspot(hotspot) {
    this.currentHotspot = hotspot;
    this.updateChart(hotspot);
    this.setStep(4);

    if (hotspot.weights) {
      document.getElementById('range-veg').value = hotspot.weights.vegLoss;
      document.getElementById('range-cover').value = hotspot.weights.coverChange;
      document.getElementById('range-trend').value = hotspot.weights.trend;
      document.getElementById('range-land').value = hotspot.weights.landUse;
      document.getElementById('range-persist').value = hotspot.weights.persistence;
      this.recalculateRiskScore();
    }
  }
}

window.SylvaAnalytics = SylvaAnalytics;
