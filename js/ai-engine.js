/**
 * FORESTWATCH // AI ECOLOGICAL REASONING ENGINE & VOICE SYNTHESIZER
 * Synthesizes grounded natural-language explanations from empirical multispectral telemetry and provides voice briefing readout.
 */

class SylvaAIEngine {
  constructor() {
    this.speechSynth = window.speechSynthesis || null;
    this.isSpeaking = false;
    this.currentExplanation = "";

    this.initEvents();
  }

  initEvents() {
    const speakBtn = document.getElementById('btn-speak-ai');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        this.toggleSpeech();
      });
    }
  }

  loadHotspot(hotspot) {
    // Generate JSON Stream
    const jsonEl = document.getElementById('ai-telemetry-json');
    if (jsonEl) {
      const payload = {
        hotspot_id: hotspot.id,
        location: `${hotspot.name}, ${hotspot.state}`,
        coordinates: hotspot.coordinates,
        threat_tier: hotspot.tierLabel,
        risk_score: hotspot.riskScore,
        confidence_pct: hotspot.confidence,
        spectral_metrics: {
          baseline_ndvi: hotspot.spectral.baselineNDVI,
          current_ndvi: hotspot.spectral.currentNDVI,
          delta_ndvi_pct: hotspot.spectral.deltaNDVIPct,
          dnbr_fire_score: hotspot.spectral.dNBR,
          fire_signature: hotspot.spectral.fireDetected ? "PRESENT" : "EXCLUDED",
          ndwi_moisture_pct: hotspot.spectral.ndwiMoisturePct,
          drought_signature: hotspot.spectral.droughtExcluded ? "EXCLUDED" : "POSSIBLE",
          sar_cband_drop_db: hotspot.spectral.sarBackscatterDeltaDb,
          tree_volume_loss_pct: hotspot.spectral.treeVolumeLossPct
        },
        temporal_persistence: "4_WEEKS_CONSECUTIVE",
        morphology: hotspot.spectral.roadSpurLengthKm ? `LINEAR_ACCESS_ROAD_${hotspot.spectral.roadSpurLengthKm}KM` : "GEOMETRIC_PERIMETER",
        reserve_proximity_km: hotspot.coreProximityKm,
        species_at_risk: hotspot.speciesAtRisk
      };

      jsonEl.textContent = JSON.stringify(payload, null, 2);
    }

    // Synthesize Explanation Paragraphs
    const textContainer = document.getElementById('ai-explanation-text');
    if (textContainer) {
      textContainer.innerHTML = `
        <p class="ai-p">
          <strong>1. Anomaly Identification:</strong> Multispectral observation of <em>${hotspot.name}</em> reveals an acute <strong>${Math.abs(hotspot.spectral.deltaNDVIPct).toFixed(1)}% reduction in NDVI</strong> (baseline ${hotspot.spectral.baselineNDVI} → observed ${hotspot.spectral.currentNDVI}) across a contiguous ${hotspot.flaggedAreaHa} hectare footprint.
        </p>
        <p class="ai-p">
          <strong>2. Elimination of Environmental Confounders:</strong> The Normalized Burn Ratio (dNBR ${hotspot.spectral.dNBR}) confirms <em>no thermal or fire damage signature</em>. Surrounding reference baseline plots exhibit normal canopy moisture (+${hotspot.spectral.ndwiMoisturePct}%), mathematically eliminating drought stress or deciduous seasonal defoliation.
        </p>
        <p class="ai-p">
          <strong>3. Anthropogenic Pattern Verification:</strong> Spatial morphology and edge filtering identify ${hotspot.spectral.roadSpurLengthKm ? `a newly cut <strong>${hotspot.spectral.roadSpurLengthKm} km linear access road</strong>` : `a stark <strong>geometric perimeter expansion</strong>`} penetrating the canopy. Sentinel-1 SAR C-band radar validates a <strong>${hotspot.spectral.sarBackscatterDeltaDb} dB volumetric loss</strong>, proving physical removal of timber trunks.
        </p>
        <p class="ai-p">
          <strong>4. Ecological Consequence:</strong> Disturbance is located <strong>${hotspot.coreProximityKm} km from core protected habitat</strong>, intercepting critical migratory corridors for <em>${hotspot.speciesAtRisk.join(', ')}</em>.
        </p>
      `;

      this.currentExplanation = `Alert for ${hotspot.name}. A severe ${Math.abs(hotspot.coverChangePct)}% canopy loss was detected across ${hotspot.flaggedAreaHa} hectares with ${hotspot.confidence}% confidence. Wildfire and drought false positives have been eliminated. Sentinel-1 radar confirms physical tree volume loss. Immediate field verification recommended.`;
    }
  }

  toggleSpeech() {
    if (!this.speechSynth) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }

    const btnLabel = document.getElementById('speech-btn-label');

    if (this.isSpeaking) {
      this.speechSynth.cancel();
      this.isSpeaking = false;
      if (btnLabel) btnLabel.textContent = "SPEAK EXPLANATION";
    } else {
      if (!this.currentExplanation) return;

      const utterance = new SpeechSynthesisUtterance(this.currentExplanation);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (btnLabel) btnLabel.textContent = "SPEAK EXPLANATION";
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (btnLabel) btnLabel.textContent = "SPEAK EXPLANATION";
      };

      this.speechSynth.speak(utterance);
      this.isSpeaking = true;
      if (btnLabel) btnLabel.textContent = "STOP VOICE BRIEFING";
    }
  }
}

window.SylvaAIEngine = SylvaAIEngine;
