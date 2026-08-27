/**
 * FORESTWATCH // REAL-TIME PIPELINE SIMULATION SANDBOX
 * Simulates the 5-step detection pipeline: Ingestion -> Indices -> Multi-Signal Filter -> Risk Classifier -> AI Synthesis & Dispatch
 */

class SylvaSimulator {
  constructor(onSimulationComplete) {
    this.onSimulationComplete = onSimulationComplete;
    this.isSimulating = false;

    this.initEvents();
  }

  initEvents() {
    const runBtn = document.getElementById('btn-run-simulation');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        if (!this.isSimulating) {
          this.executePipeline();
        }
      });
    }
  }

  async executePipeline() {
    this.isSimulating = true;
    const runBtn = document.getElementById('btn-run-simulation');
    const logStream = document.getElementById('sim-log-stream');
    const scenarioSelect = document.getElementById('sim-preset-select');
    const sensorSelect = document.getElementById('sim-sensor-select');

    if (runBtn) {
      runBtn.disabled = true;
      runBtn.innerHTML = `<span class="pulse-dot green"></span> PROCESSING PIPELINE...`;
    }

    const scenario = scenarioSelect ? scenarioSelect.options[scenarioSelect.selectedIndex].text : "Scenario A";
    const sensor = sensorSelect ? sensorSelect.options[sensorSelect.selectedIndex].text : "Sentinel-2";

    this.resetStages();
    this.log(logStream, `\n[SIM-INIT] Starting satellite spectral pipeline execution...`);
    this.log(logStream, `[CONFIG] Scenario: ${scenario}`);
    this.log(logStream, `[CONFIG] Constellation Sensor: ${sensor}`);

    // Stage 1: Data Ingestion
    await this.runStage(1, "INGESTION", "Fetching Sentinel-2 Level-2A surface reflectance tiles from Copernicus Data Space API...", logStream, 800);
    this.log(logStream, `[INGEST] ✓ Retrieved 4 spectral bands: B02 (Blue), B04 (Red), B08 (NIR), B12 (SWIR-2). Cloud cover: 3.2%`);

    // Stage 2: Spectral Indices
    await this.runStage(2, "INDICES", "Executing raster math: Computing NDVI, EVI, NBR, and NDWI matrices...", logStream, 900);
    this.log(logStream, `[RASTER] ✓ NDVI Baseline: 0.78 | Current: 0.41 | ΔNDVI: -47.4%`);
    this.log(logStream, `[RASTER] ✓ EVI Canopy Index: 0.37 (Δ -42.8%) | NBR: 0.58 | NDWI: 0.45`);

    // Stage 3: Multi-Signal Filter
    await this.runStage(3, "FILTER", "Cross-validating against environmental confounders (wildfire, drought, phenology)...", logStream, 1000);
    this.log(logStream, `[VALIDATE] ✓ NBR Fire Check: dNBR = 0.04 (NO WILDFIRE DETECTED)`);
    this.log(logStream, `[VALIDATE] ✓ NDWI Moisture Check: Surrounding canopy normal (DROUGHT EXCLUDED)`);
    this.log(logStream, `[VALIDATE] ✓ Sentinel-1 SAR Cross-Match: -5.4 dB volume loss confirmed under cloud canopy`);

    // Stage 4: Risk Classifier
    await this.runStage(4, "CLASSIFIER", "Evaluating Dynamic Weighted Deforestation Risk Model...", logStream, 800);
    this.log(logStream, `[MODEL] ✓ Weighted Composite Score Calculated: 87.1 / 100 [CRITICAL HOTSPOT TIER]`);
    this.log(logStream, `[MODEL] ✓ Confidence Metric: 91.4% (Multi-Pass Verified across 4 observation cycles)`);

    // Stage 5: AI Synthesis & Dispatch
    await this.runStage(5, "DISPATCH", "Synthesizing natural language ecological reasoning and generating operational directives...", logStream, 900);
    this.log(logStream, `[AI-REASON] ✓ Grounded evidence summary generated.`);
    this.log(logStream, `[DISPATCH] ✓ Action Protocol P1: Automated GeoJSON boundary payload transmitted to Forest Patrol Vanguard.`);
    this.log(logStream, `[SUCCESS] Complete pipeline execution concluded in 4.4 seconds. Zero false positives.\n`);

    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = `<i data-lucide="play-circle"></i> <span>EXECUTE 5-STEP PIPELINE</span>`;
      if (window.lucide) window.lucide.createIcons();
    }

    this.isSimulating = false;

    if (this.onSimulationComplete) {
      this.onSimulationComplete();
    }
  }

  async runStage(stageNum, name, message, logEl, delayMs) {
    const stageEl = document.getElementById(`pipe-step-${stageNum}`);
    if (stageEl) {
      stageEl.className = "pipe-step processing";
      const statusEl = stageEl.querySelector('.step-status');
      if (statusEl) statusEl.textContent = "PROCESSING...";
    }

    this.log(logEl, `[STAGE ${stageNum} - ${name}] ${message}`);
    await new Promise(r => setTimeout(r, delayMs));

    if (stageEl) {
      stageEl.className = "pipe-step complete";
      const statusEl = stageEl.querySelector('.step-status');
      if (statusEl) statusEl.textContent = "COMPLETED ✓";
    }
  }

  resetStages() {
    for (let i = 1; i <= 5; i++) {
      const stageEl = document.getElementById(`pipe-step-${i}`);
      if (stageEl) {
        stageEl.className = "pipe-step";
        const statusEl = stageEl.querySelector('.step-status');
        if (statusEl) statusEl.textContent = "IDLE";
      }
    }
  }

  log(el, text) {
    if (!el) return;
    el.textContent += text + "\n";
    el.scrollTop = el.scrollHeight;
  }
}

window.SylvaSimulator = SylvaSimulator;
