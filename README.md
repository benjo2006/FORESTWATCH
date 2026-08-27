# 🌿 FORESTWATCH // Deforestation Early Warning System

> **Turning Satellite Signals Into Early Intervention Alerts**  
> An Earth-Observation & AI-Powered Decision-Support Platform that detects emerging forest canopy disturbances, eliminates environmental false alarms, and dispatches automated action protocols before catastrophic deforestation occurs.

---

## 🌟 Key Features

* **Interactive Geospatial Satellite Radar**: Leaflet-powered multi-spectral observation deck centered on the Western Ghats with layer toggles (True Color RGB, False Color NIR, NDVI Canopy Heatmap, Disturbance Loss Mask).
* **Empirical Before vs. After Split Comparator**: Interactive split slider with real-time **Pixel Spectral Probe** displaying calculated Baseline NDVI, Current NDVI, and Δ NDVI Delta % on hover.
* **Multi-Signal Intelligence (Vegetation Loss ≠ Deforestation)**: 6-vector analysis isolating true anthropogenic deforestation from seasonal phenology, droughts (NDWI), and wildfires (NBR dNBR < 0.1).
* **Sentinel-1 SAR C-Band Radar Backscatter**: 100% cloud-penetrating radar detecting 3D physical wood biomass removal.
* **Dynamic Deforestation Risk Model (0 - 100)**: Scientifically-weighted composite risk model with real-time interactive formula sliders.
* **4-Week Temporal Disturbance Progression**: Step-by-step sequential escalation timeline with Auto-Play mode & 5-year longitudinal trend graphs.
* **AI Ecological Reasoning Terminal**: Data-grounded ecological synthesis with Web Speech API voice briefing readout.
* **Tiered Action Protocols**: Generates GPS waypoints for UAV drones, legal dossiers for Wildlife Wardens under the Forest Acts, and SMS alerts for community watchdogs.
* **Pipeline Simulation Sandbox**: Interactive 5-step detection pipeline runner with streaming execution logs.
* **Printable Executive Dossier**: Court-ready PDF report export modal.

---

## 🚀 Live Demo & Quick Start

Simply open `index.html` in any web browser, or serve it locally:

```bash
# Using Python
python -m http.server 8088

# Open in browser:
# http://localhost:8088
```

---

## 📁 Project Structure

```text
FORESTWATCH/
├── index.html            # Main web application entry point
├── css/
│   └── style.css         # Complete Cutoshi-inspired Nature-Tech stylesheet
├── js/
    ├── data.js           # Procedural satellite synthesizers & 17 hotspot datasets
    ├── map.js            # Leaflet geospatial radar engine & coordinate HUD
    ├── comparator.js     # Before/After split slider & pixel spectral probe
    ├── analytics.js      # Chart.js time-series & weekly step sequence
    ├── ai-engine.js      # AI ecological reasoning engine & speech synthesis
    ├── simulation.js     # 5-step detection pipeline sandbox
    └── app.js            # Application orchestrator & Web Audio feedback
```

---

## 🛰️ Earth Observation Datasets & Attributions
* **ESA Copernicus**: Sentinel-2 (Multispectral Optical) & Sentinel-1 (C-Band SAR)
* **NASA / USGS**: Landsat-9 (OLI-2 / TIRS)
* **Global Forest Watch (GFW / WRI)**
* **Forest Survey of India (FSI ISFR)**

---

## 📄 License
MIT License © 2026 FORESTWATCH. Built for Global Planetary Protection & Environmental AI Hackathon.
