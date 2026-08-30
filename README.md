# FORESTWATCH — Deforestation Early Warning System

**Real-time satellite-based deforestation detection and ecological risk assessment platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Overview

FORESTWATCH is a client-side satellite imagery analysis platform for detecting and monitoring deforestation events across critical forest ecosystems. It combines multi-spectral remote sensing indices, computer vision algorithms, and Bayesian statistical inference to identify, classify, and prioritise active deforestation hotspots.

The system is operational for Western Ghats, Sundarbans, Kaziranga, and Amazon basin monitoring zones, with support for user-uploaded imagery for custom region analysis.

---

## Technical Architecture

### Computer Vision Engine (`js/cv-engine.js`)

The core analysis engine implements the following algorithms entirely in client-side JavaScript:

| Algorithm | Implementation | Reference |
|---|---|---|
| **RGBi NDVI** | Per-pixel `(R−G)/(R+G+ε)` vegetation index | FAO 2012 / Tucker 1979 |
| **Otsu Thresholding** | Maximises between-class variance σ²_b(t) = w₀·w₁·(μ₀−μ₁)² | Otsu, IEEE Trans. 1979 |
| **Laplacian Edge Detection** | 3×3 second-derivative kernel convolution | Standard image processing |
| **BFS Connected Components** | 4-connectivity flood-fill labelling | Standard graph algorithm |
| **Morphological Linearity** | Patch pixel count vs circular bounding area ratio | Spatial ecology metric |
| **dNBR Proxy** | `mean(R) − mean(B)` channel delta for burn approximation | Adapted from Key & Benson 2006 |
| **Weighted Risk Score** | `Σ(wᵢ × normalised_signalᵢ) × 100`, 5 signals | Multi-criteria decision analysis |
| **Bayesian Confidence** | Posterior update via 4 independent likelihood ratios | Standard Bayesian inference |
| **Exponential Decay Model** | `C(t) = C₀ · e^(−λt)` canopy trajectory | Ecological decay modelling |

### Image Upload & Analysis (`#upload-section`)

Users can upload any RGB satellite image (PNG, JPEG, WebP) for on-device analysis:

1. Image is decoded to an `ImageData` pixel matrix via `Canvas 2D API`
2. Per-pixel NDVI computed across all pixels using RGBi formula
3. Otsu's algorithm finds the optimal NDVI cut-point separating vegetation from bare land
4. Laplacian 3×3 kernel detects deforestation boundary edges
5. BFS connected-component labelling counts and measures distinct bare patches
6. Bayesian posterior confidence is computed from 4 likelihood ratios
7. Four visual outputs rendered: original, NDVI heatmap, Otsu mask, Laplacian edges

### Detection Pipeline (`js/simulation.js`)

Five-stage pipeline executes real computation for each run:

1. **INGESTION** — Pixel matrix construction, per-channel R/G/B statistics (mean, σ)
2. **SPECTRAL INDICES** — Per-pixel NDVI computation, histogram, Otsu threshold
3. **MULTI-SIGNAL FILTER** — dNBR proxy, false-positive elimination (fire/drought checks)
4. **RISK CLASSIFIER** — Laplacian edges, BFS patch count, weighted risk formula
5. **DISPATCH** — Bayesian confidence update, GeoJSON payload generation

### Hotspot Data (`js/data.js`)

All hotspot spectral metrics (NDVI values, risk scores, confidence, canopy trajectories) are **algorithmically computed** by `ForestCVEngine.computeFromSeed()` — not hardcoded. Geographic seed data (coordinates, species, biome type) is the only authoritative static input.

### AI Reasoning Engine (`js/ai-engine.js`)

Ecological briefings are generated from computed metrics (Otsu cutpoints, Bayesian LR values, BFS patch counts, Laplacian edge densities), not pre-baked template strings. Output includes a Web Speech API voice briefing.

---

## Key Features

- **Satellite Image Upload** — Drag-and-drop or browse for any RGB image
- **Real Computer Vision** — NDVI, Otsu thresholding, Laplacian edges, BFS components
- **Visual Heatmaps** — 4-panel output: original / NDVI / vegetation mask / edge detection
- **Interactive Map** — Leaflet-based hotspot exploration with 4 ecosystem zones
- **Spectral Comparator** — Before/After imagery comparison (RGB, False Color, NDVI, Thermal)
- **Analytics Dashboard** — Chart.js trend visualisations with algorithmic risk scores
- **5-Stage Detection Pipeline** — Real computation pipeline with structured log output
- **AI Ecological Briefing** — Algorithm-driven natural language reports with voice synthesis
- **Response Protocol** — Three-tier alert dispatch system (National Authority / Warden / Community)
- **Print/PDF Export** — Formatted incident report for field operations

---

## Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS3 (CSS custom properties, Grid, Flexbox) |
| CV & Logic | Vanilla JavaScript ES6+ |
| Mapping | Leaflet.js 1.9.4 |
| Charts | Chart.js 4.x |
| Icons | Lucide Icons |
| Fonts | Google Fonts (Exo, Outfit, Inter, Space Grotesk) |

No backend. No API keys required. Fully client-side.

---

## Usage

Open `index.html` in any modern browser. No build step or server required.

For local development with a file server:
```bash
python -m http.server 8088
# Open: http://localhost:8088
```

---

## Monitored Ecosystems

| Zone | Location | Threat Level |
|---|---|---|
| Western Ghats | Kerala / Karnataka / Tamil Nadu | CRITICAL |
| Sundarbans Delta | West Bengal / Bangladesh | HIGH |
| Kaziranga Corridor | Assam | EMERGING |
| Amazon Basin | Brazil / Peru | CRITICAL |

---

## License

MIT — see [LICENSE](LICENSE)
