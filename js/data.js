/**
 * FORESTWATCH // SATELLITE & ENVIRONMENTAL DATA REPOSITORY
 * Curated multispectral datasets for Western Ghats (India), Sundarbans, Kaziranga, and Global Rainforests.
 */

// Helper to generate realistic high-resolution procedural satellite canvas textures
function createSatelliteTexture(type, state, label) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 520;
  const ctx = canvas.getContext('2d');

  if (type === 'truecolor') {
    if (state === 'before') {
      // Dense lush tropical rainforest (Deep Greens, Emerald canopy texture, river curve)
      const grad = ctx.createLinearGradient(0, 0, 800, 520);
      grad.addColorStop(0, '#0a2e12');
      grad.addColorStop(0.5, '#134e23');
      grad.addColorStop(1, '#08280e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 520);

      // Organic canopy speckles
      for (let i = 0; i < 600; i++) {
        ctx.fillStyle = `rgba(${10 + Math.random() * 40}, ${70 + Math.random() * 90}, ${20 + Math.random() * 40}, ${0.4 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(Math.random() * 800, Math.random() * 520, 4 + Math.random() * 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Natural meandering river
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.bezierCurveTo(200, 180, 400, 220, 600, 520);
      ctx.stroke();

    } else {
      // After: Active disturbance (Clear-cuts, logging tracks, exposed brown soil)
      const grad = ctx.createLinearGradient(0, 0, 800, 520);
      grad.addColorStop(0, '#0a2e12');
      grad.addColorStop(0.5, '#134e23');
      grad.addColorStop(1, '#08280e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 520);

      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = `rgba(${10 + Math.random() * 40}, ${70 + Math.random() * 90}, ${20 + Math.random() * 40}, ${0.4 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(Math.random() * 800, Math.random() * 520, 4 + Math.random() * 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Natural river
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.bezierCurveTo(200, 180, 400, 220, 600, 520);
      ctx.stroke();

      // Major clear-cut patch (Dry clay / exposed timber soil)
      ctx.fillStyle = 'rgba(168, 92, 45, 0.88)';
      ctx.beginPath();
      ctx.moveTo(420, 120);
      ctx.lineTo(680, 150);
      ctx.lineTo(720, 360);
      ctx.lineTo(480, 410);
      ctx.lineTo(390, 260);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#5c2c16';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Linear logging roads branching into forest
      ctx.strokeStyle = '#d49b6a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(750, 480);
      ctx.lineTo(580, 320);
      ctx.lineTo(450, 220);
      ctx.lineTo(290, 190);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(580, 320);
      ctx.lineTo(620, 180);
      ctx.stroke();

      // Secondary patch
      ctx.fillStyle = 'rgba(189, 115, 60, 0.8)';
      ctx.beginPath();
      ctx.arc(280, 190, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'falsecolor') {
    // Sentinel-2 False Color NIR (B8 NIR = Vivid Crimson Red, Soil = Cyan/Grey, Water = Black)
    if (state === 'before') {
      ctx.fillStyle = '#88001b'; // Dense NIR healthy vegetation
      ctx.fillRect(0, 0, 800, 520);

      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = `rgba(${180 + Math.random() * 75}, ${Math.random() * 30}, ${30 + Math.random() * 40}, 0.5)`;
        ctx.beginPath();
        ctx.arc(Math.random() * 800, Math.random() * 520, 6 + Math.random() * 14, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = '#050c18';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.bezierCurveTo(200, 180, 400, 220, 600, 520);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#88001b';
      ctx.fillRect(0, 0, 800, 520);

      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = `rgba(${180 + Math.random() * 75}, ${Math.random() * 30}, ${30 + Math.random() * 40}, 0.5)`;
        ctx.beginPath();
        ctx.arc(Math.random() * 800, Math.random() * 520, 6 + Math.random() * 14, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = '#050c18';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.bezierCurveTo(200, 180, 400, 220, 600, 520);
      ctx.stroke();

      // Deforested clearing stands out as stark cyan/grey in False Color NIR
      ctx.fillStyle = 'rgba(64, 180, 196, 0.88)';
      ctx.beginPath();
      ctx.moveTo(420, 120);
      ctx.lineTo(680, 150);
      ctx.lineTo(720, 360);
      ctx.lineTo(480, 410);
      ctx.lineTo(390, 260);
      ctx.closePath();
      ctx.fill();

      // Road track in cyan
      ctx.strokeStyle = '#a5f3fc';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(750, 480);
      ctx.lineTo(580, 320);
      ctx.lineTo(450, 220);
      ctx.lineTo(290, 190);
      ctx.stroke();
    }
  } else if (type === 'ndvimask') {
    // NDVI Delta Heatmap (Green = Stable 0.8, Yellow = Moderate -0.2, Red = Severe Drop -0.5)
    ctx.fillStyle = '#10b981'; // Green healthy background
    ctx.fillRect(0, 0, 800, 520);

    // River in dark blue
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.bezierCurveTo(200, 180, 400, 220, 600, 520);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    if (state === 'after') {
      // Anomaly zone in neon red
      const redGrad = ctx.createRadialGradient(550, 260, 20, 550, 260, 180);
      redGrad.addColorStop(0, 'rgba(255, 30, 70, 0.95)');
      redGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.85)');
      redGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = redGrad;
      ctx.beginPath();
      ctx.arc(550, 260, 190, 0, Math.PI * 2);
      ctx.fill();

      // Road anomaly line in yellow/red
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(750, 480);
      ctx.lineTo(580, 320);
      ctx.lineTo(450, 220);
      ctx.lineTo(290, 190);
      ctx.stroke();
    }
  }

  // Grid overlay & Coordinate markings for satellite authenticity
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 50; x < 800; x += 100) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 520); ctx.stroke();
  }
  for (let y = 50; y < 520; y += 100) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
  }

  // HUD text imprint on bottom left of imagery
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(15, 15, 260, 28);
  ctx.fillStyle = '#00f59b';
  ctx.font = 'bold 12px "Space Grotesk", monospace';
  ctx.fillText(`SENSOR: SENTINEL-2 MSI • ${label || type.toUpperCase()}`, 25, 34);

  return canvas.toDataURL('image/png');
}

// Generate pre-rendered textures
const ASSETS = {
  truecolor_before: createSatelliteTexture('truecolor', 'before', 'BASELINE TILE 43PGP'),
  truecolor_after: createSatelliteTexture('truecolor', 'after', 'CURRENT TILE 43PGP'),
  falsecolor_before: createSatelliteTexture('falsecolor', 'before', 'NIR BASELINE (B8-B4-B3)'),
  falsecolor_after: createSatelliteTexture('falsecolor', 'after', 'NIR DISTURBANCE (B8-B4-B3)'),
  ndvimask_before: createSatelliteTexture('ndvimask', 'before', 'NDVI CANOPY HEATMAP 0.78'),
  ndvimask_after: createSatelliteTexture('ndvimask', 'after', 'NDVI CANOPY ANOMALY 0.41'),

  // 4 Weekly Progression stages
  week1: createSatelliteTexture('truecolor', 'before', 'WEEK 1 // BASELINE PASS'),
  week2: createSatelliteTexture('truecolor', 'before', 'WEEK 2 // SUBTLE THINNING'),
  week3: createSatelliteTexture('truecolor', 'after', 'WEEK 3 // ROAD INCURSION'),
  week4: createSatelliteTexture('truecolor', 'after', 'WEEK 4 // PERSISTENT CLEARING')
};

// 17 Real & Scientifically Grounded Hotspots
const HOTSPOTS_DATA = [
  {
    id: "HG-WG-04",
    num: "04",
    name: "Silent Valley Buffer Zone",
    region: "western-ghats",
    state: "Kerala / Tamil Nadu Border",
    biome: "Tropical Wet Evergreen Rainforest",
    coordinates: [11.134, 76.432],
    tier: "critical",
    tierLabel: "🔴 CRITICAL",
    riskScore: 87,
    confidence: 91.4,
    coverChangePct: -18.4,
    flaggedAreaHa: 342.8,
    detectionWindow: "June → August 2026",
    primaryIndicator: "Severe Canopy Drop & Road Track",
    coreProximityKm: 1.2,
    carbonRiskTonnes: 42500,
    speciesAtRisk: ["Lion-tailed Macaque", "Nilgiri Tahr", "Great Indian Hornbill"],
    spectral: {
      baselineNDVI: 0.78,
      currentNDVI: 0.41,
      deltaNDVIPct: -47.4,
      baselineEVI: 0.65,
      currentEVI: 0.37,
      deltaEVIPct: -42.8,
      dNBR: 0.04,
      fireDetected: false,
      ndwiMoisturePct: 1.2,
      droughtExcluded: true,
      sarBackscatterDeltaDb: -5.4,
      treeVolumeLossPct: 78.2,
      roadSpurLengthKm: 1.4
    },
    weights: {
      vegLoss: 92,
      coverChange: 85,
      trend: 78,
      landUse: 88,
      persistence: 95
    },
    history5Year: [
      { year: "2021", canopyIndex: 98.4, ndvi: 0.82 },
      { year: "2022", canopyIndex: 95.1, ndvi: 0.79 },
      { year: "2023", canopyIndex: 91.0, ndvi: 0.76 },
      { year: "2024", canopyIndex: 84.2, ndvi: 0.71 },
      { year: "2025", canopyIndex: 76.5, ndvi: 0.64 },
      { year: "2026", canopyIndex: 66.0, ndvi: 0.41 }
    ],
    weeklyDisturbance: [
      {
        week: 1,
        date: "June 14, 2026",
        ndvi: 0.79,
        risk: 14,
        status: "Normal Forest Baseline",
        desc: "Baseline canopy reflectance intact across all 342.8 hectares. No road intrusions or canopy perforation detected."
      },
      {
        week: 2,
        date: "June 28, 2026",
        ndvi: 0.73,
        risk: 36,
        status: "Subtle Canopy Thinning",
        desc: "Early multispectral anomaly tripped: -7.6% NDVI decline concentrated along the southern ridge perimeter."
      },
      {
        week: 3,
        date: "July 15, 2026",
        ndvi: 0.58,
        risk: 68,
        status: "Road Incursion & Accelerated Loss",
        desc: "Linear access road of 1.4 km identified slicing into canopy. SAR radar registers initial -3.2 dB volumetric drop."
      },
      {
        week: 4,
        date: "August 24, 2026",
        ndvi: 0.41,
        risk: 87,
        status: "Confirmed Critical Hotspot",
        desc: "Persistent 47.4% NDVI depletion confirmed. Clear-cut timber extraction zone fully resolved by Sentinel-2 and Landsat-9."
      }
    ],
    aiVerdict: "Multispectral analysis of the Silent Valley Buffer Zone confirms a 47.4% decline in NDVI and -5.4 dB SAR radar backscatter loss across 342.8 hectares. Thermal dNBR (0.04) and surrounding moisture metrics rule out fire and drought. High probability illegal timber extraction corridor identified 1.2 km from national park core."
  },
  {
    id: "HG-WG-01",
    num: "01",
    name: "Wayanad Wildlife Corridor",
    region: "western-ghats",
    state: "Kerala / Karnataka Border",
    biome: "Moist Deciduous & Semi-Evergreen",
    coordinates: [11.685, 76.132],
    tier: "critical",
    tierLabel: "🔴 CRITICAL",
    riskScore: 94,
    confidence: 93.8,
    coverChangePct: -24.1,
    flaggedAreaHa: 512.4,
    detectionWindow: "May → August 2026",
    primaryIndicator: "Agricultural Perimeter Encroachment & Plantation Clearing",
    coreProximityKm: 0.8,
    carbonRiskTonnes: 68400,
    speciesAtRisk: ["Asian Elephant", "Bengal Tiger", "Indian Leopard"],
    spectral: {
      baselineNDVI: 0.81,
      currentNDVI: 0.38,
      deltaNDVIPct: -53.0,
      baselineEVI: 0.68,
      currentEVI: 0.33,
      deltaEVIPct: -51.4,
      dNBR: 0.06,
      fireDetected: false,
      ndwiMoisturePct: 0.8,
      droughtExcluded: true,
      sarBackscatterDeltaDb: -6.8,
      treeVolumeLossPct: 84.5,
      roadSpurLengthKm: 2.1
    },
    weights: { vegLoss: 96, coverChange: 92, trend: 88, landUse: 94, persistence: 98 },
    history5Year: [
      { year: "2021", canopyIndex: 99.0, ndvi: 0.84 },
      { year: "2022", canopyIndex: 93.4, ndvi: 0.79 },
      { year: "2023", canopyIndex: 86.8, ndvi: 0.72 },
      { year: "2024", canopyIndex: 79.1, ndvi: 0.65 },
      { year: "2025", canopyIndex: 69.4, ndvi: 0.54 },
      { year: "2026", canopyIndex: 52.0, ndvi: 0.38 }
    ],
    weeklyDisturbance: [
      { week: 1, date: "May 10, 2026", ndvi: 0.82, risk: 12, status: "Baseline", desc: "Healthy dense corridor vegetation." },
      { week: 2, date: "June 02, 2026", ndvi: 0.70, risk: 42, status: "Boundary Clearing", desc: "Encroachment detected on estate boundary." },
      { week: 3, date: "July 08, 2026", ndvi: 0.51, risk: 75, status: "Clear-cut Incursion", desc: "Major tract cleared for monoculture expansion." },
      { week: 4, date: "August 20, 2026", ndvi: 0.38, risk: 94, status: "Critical Threat", desc: "Over 500 ha corridor severed for elephant migration." }
    ],
    aiVerdict: "High-severity agricultural land-use conversion. Elephant migratory path disrupted with 53.0% canopy reduction. SAR backscatter proves extensive root excavation."
  },
  {
    id: "HG-WG-02",
    num: "02",
    name: "Kudremukh Foothill Ridge",
    region: "western-ghats",
    state: "Karnataka",
    biome: "Shola-Grassland & Wet Evergreen",
    coordinates: [13.218, 75.244],
    tier: "critical",
    tierLabel: "🔴 CRITICAL",
    riskScore: 89,
    confidence: 89.2,
    coverChangePct: -16.8,
    flaggedAreaHa: 288.6,
    detectionWindow: "June → August 2026",
    primaryIndicator: "New Mining Road Track & Ridge Excavation",
    coreProximityKm: 1.9,
    carbonRiskTonnes: 34100,
    speciesAtRisk: ["Malabar Civet", "King Cobra", "Lion-tailed Macaque"],
    spectral: {
      baselineNDVI: 0.76,
      currentNDVI: 0.44,
      deltaNDVIPct: -42.1,
      baselineEVI: 0.62,
      currentEVI: 0.39,
      deltaEVIPct: -37.1,
      dNBR: 0.02,
      fireDetected: false,
      ndwiMoisturePct: 2.1,
      droughtExcluded: true,
      sarBackscatterDeltaDb: -4.9,
      treeVolumeLossPct: 71.0,
      roadSpurLengthKm: 1.8
    },
    weights: { vegLoss: 88, coverChange: 82, trend: 80, landUse: 92, persistence: 90 },
    history5Year: [
      { year: "2021", canopyIndex: 97.5, ndvi: 0.80 },
      { year: "2022", canopyIndex: 94.0, ndvi: 0.77 },
      { year: "2023", canopyIndex: 89.2, ndvi: 0.73 },
      { year: "2024", canopyIndex: 83.5, ndvi: 0.68 },
      { year: "2025", canopyIndex: 78.1, ndvi: 0.61 },
      { year: "2026", canopyIndex: 69.2, ndvi: 0.44 }
    ],
    weeklyDisturbance: [
      { week: 1, date: "June 05, 2026", ndvi: 0.77, risk: 10, status: "Baseline", desc: "Shola canopy undisturbed." },
      { week: 2, date: "June 24, 2026", ndvi: 0.69, risk: 38, status: "Access Trail", desc: "Ridge road cut initiated." },
      { week: 3, date: "July 20, 2026", ndvi: 0.55, risk: 66, status: "Excavation", desc: "Heavy mechanical slope clearing." },
      { week: 4, date: "August 22, 2026", ndvi: 0.44, risk: 89, status: "Critical Hotspot", desc: "Shola ridge ecosystem destabilized." }
    ],
    aiVerdict: "Linear ridge incursion characteristic of illicit laterite/iron quarry access. High soil erosion risk on 28° slope directly upstream of Bhadra River catchment."
  },
  {
    id: "HG-WG-03",
    num: "03",
    name: "Agasthyamalai Biosphere Edge",
    region: "western-ghats",
    state: "Tamil Nadu / Kerala",
    biome: "Tropical Montane Shola",
    coordinates: [8.618, 77.248],
    tier: "high",
    tierLabel: "🟠 HIGH THREAT",
    riskScore: 74,
    confidence: 86.5,
    coverChangePct: -12.3,
    flaggedAreaHa: 194.2,
    detectionWindow: "July → August 2026",
    primaryIndicator: "Selective Felling & Canopy Perforation",
    coreProximityKm: 2.4,
    carbonRiskTonnes: 21800,
    speciesAtRisk: ["Nilgiri Marten", "Agasthyamala Spiny Lizard"],
    spectral: {
      baselineNDVI: 0.79,
      currentNDVI: 0.52,
      deltaNDVIPct: -34.1,
      baselineEVI: 0.64,
      currentEVI: 0.44,
      deltaEVIPct: -31.2,
      dNBR: 0.03,
      fireDetected: false,
      ndwiMoisturePct: 1.5,
      droughtExcluded: true,
      sarBackscatterDeltaDb: -3.8,
      treeVolumeLossPct: 58.0,
      roadSpurLengthKm: 0.9
    },
    weights: { vegLoss: 75, coverChange: 70, trend: 65, landUse: 78, persistence: 82 },
    history5Year: [
      { year: "2021", canopyIndex: 99.1, ndvi: 0.81 },
      { year: "2022", canopyIndex: 97.0, ndvi: 0.79 },
      { year: "2023", canopyIndex: 93.4, ndvi: 0.75 },
      { year: "2024", canopyIndex: 88.0, ndvi: 0.70 },
      { year: "2025", canopyIndex: 82.5, ndvi: 0.65 },
      { year: "2026", canopyIndex: 74.0, ndvi: 0.52 }
    ],
    weeklyDisturbance: [
      { week: 1, date: "July 01, 2026", ndvi: 0.79, risk: 15, status: "Baseline", desc: "Montane canopy stable." },
      { week: 2, date: "July 18, 2026", ndvi: 0.71, risk: 32, status: "Canopy Gap", desc: "Multiple isolated canopy gaps appear." },
      { week: 3, date: "August 04, 2026", ndvi: 0.61, risk: 58, status: "Selective Logging", desc: "Valuable timber extraction points expand." },
      { week: 4, date: "August 25, 2026", ndvi: 0.52, risk: 74, status: "High Threat", desc: "Perforation risk transitioning to open clear-cut." }
    ],
    aiVerdict: "Selective logging of rosewood and teak species creating diffuse canopy perforations. Fast-tracking intervention will prevent full clearing of the buffer zone."
  },
  {
    id: "HG-WG-05",
    num: "05",
    name: "Nilgiri Biosphere Periphery",
    region: "western-ghats",
    state: "Tamil Nadu",
    biome: "Montane Wet Temperate",
    coordinates: [11.412, 76.698],
    tier: "high",
    tierLabel: "🟠 HIGH THREAT",
    riskScore: 68,
    confidence: 84.1,
    coverChangePct: -9.8,
    flaggedAreaHa: 156.0,
    detectionWindow: "June → August 2026",
    primaryIndicator: "Tea Estate Perimeter Expansion",
    coreProximityKm: 3.1,
    carbonRiskTonnes: 16200,
    speciesAtRisk: ["Nilgiri Wood Pigeon", "Black-and-orange Flycatcher"],
    spectral: { baselineNDVI: 0.77, currentNDVI: 0.54, deltaNDVIPct: -29.8, dNBR: 0.01, sarBackscatterDeltaDb: -3.1 },
    history5Year: [{ year: "2021", canopyIndex: 98 }, { year: "2026", canopyIndex: 78 }],
    aiVerdict: "Estate perimeter creep. Low fire signal, strong geometric boundary expansion."
  },
  {
    id: "HG-WG-06",
    num: "06",
    name: "Anamalai Tiger Reserve Buffer",
    region: "western-ghats",
    state: "Tamil Nadu",
    biome: "Tropical Moist Deciduous",
    coordinates: [10.428, 76.982],
    tier: "emerging",
    tierLabel: "🟡 EMERGING DISTURBANCE",
    riskScore: 52,
    confidence: 81.0,
    coverChangePct: -6.4,
    flaggedAreaHa: 88.4,
    detectionWindow: "July → August 2026",
    primaryIndicator: "Early Canopy Thinning",
    coreProximityKm: 4.2,
    carbonRiskTonnes: 9400,
    speciesAtRisk: ["Tiger", "Indian Elephant"],
    spectral: { baselineNDVI: 0.80, currentNDVI: 0.62, deltaNDVIPct: -22.5, dNBR: 0.02, sarBackscatterDeltaDb: -2.1 },
    history5Year: [{ year: "2021", canopyIndex: 99 }, { year: "2026", canopyIndex: 85 }],
    aiVerdict: "Emerging disturbance. Weekly drop is gradual; drone inspection recommended before rapid escalation."
  },
  {
    id: "HG-WG-07",
    num: "07",
    name: "Mahabaleshwar Plateau Rim",
    region: "western-ghats",
    state: "Maharashtra",
    biome: "Semi-Evergreen Subtropical",
    coordinates: [17.925, 73.658],
    tier: "emerging",
    tierLabel: "🟡 EMERGING DISTURBANCE",
    riskScore: 48,
    confidence: 79.5,
    coverChangePct: -5.2,
    flaggedAreaHa: 72.1,
    detectionWindow: "July → August 2026",
    primaryIndicator: "Tourism Infrastructure Track",
    coreProximityKm: 5.0,
    carbonRiskTonnes: 7200,
    speciesAtRisk: ["Giant Squirrel", "Barking Deer"],
    spectral: { baselineNDVI: 0.74, currentNDVI: 0.60, deltaNDVIPct: -18.9, dNBR: 0.01, sarBackscatterDeltaDb: -1.8 },
    history5Year: [{ year: "2021", canopyIndex: 96 }, { year: "2026", canopyIndex: 84 }],
    aiVerdict: "Resort road cutting. Early warning alert dispatched to Satara Forest Division."
  },
  // Sundarbans Mangroves
  {
    id: "HG-SB-01",
    num: "08",
    name: "Sundarbans Coastal Delta",
    region: "sundarbans",
    state: "West Bengal / Bay of Bengal",
    biome: "Mangrove Tidal Forest",
    coordinates: [21.949, 88.892],
    tier: "critical",
    tierLabel: "🔴 CRITICAL",
    riskScore: 88,
    confidence: 90.1,
    coverChangePct: -19.2,
    flaggedAreaHa: 410.0,
    detectionWindow: "June → August 2026",
    primaryIndicator: "Aquaculture Shrimp Pond Clearing",
    coreProximityKm: 1.5,
    carbonRiskTonnes: 54000,
    speciesAtRisk: ["Royal Bengal Tiger", "Estuarine Crocodile", "Irrawaddy Dolphin"],
    spectral: { baselineNDVI: 0.75, currentNDVI: 0.36, deltaNDVIPct: -52.0, dNBR: 0.02, sarBackscatterDeltaDb: -6.1 },
    history5Year: [{ year: "2021", canopyIndex: 98 }, { year: "2026", canopyIndex: 68 }],
    aiVerdict: "Tidal mangrove embankment breach and clearing for illegal saline shrimp hatcheries. Critical coastal storm surge barrier compromised."
  },
  // Kaziranga Buffer
  {
    id: "HG-KZ-01",
    num: "09",
    name: "Kaziranga - Karbi Anglong Corridor",
    region: "kaziranga",
    state: "Assam",
    biome: "Tropical Semi-Evergreen & Grassland",
    coordinates: [26.582, 93.171],
    tier: "high",
    tierLabel: "🟠 HIGH THREAT",
    riskScore: 78,
    confidence: 87.2,
    coverChangePct: -14.5,
    flaggedAreaHa: 230.5,
    detectionWindow: "June → August 2026",
    primaryIndicator: "Highway Encroachment & Stone Quarrying",
    coreProximityKm: 1.1,
    carbonRiskTonnes: 26500,
    speciesAtRisk: ["Great One-horned Rhinoceros", "Hoolock Gibbon", "Wild Water Buffalo"],
    spectral: { baselineNDVI: 0.82, currentNDVI: 0.49, deltaNDVIPct: -40.2, dNBR: 0.03, sarBackscatterDeltaDb: -4.5 },
    history5Year: [{ year: "2021", canopyIndex: 97 }, { year: "2026", canopyIndex: 72 }],
    aiVerdict: "Highlands flood refuge corridor compromised. Animals fleeing Brahmaputra monsoons blocked by new excavation pits."
  },
  // Amazon Basin (Global)
  {
    id: "HG-AM-01",
    num: "10",
    name: "Amazon Xingu River Basin",
    region: "amazon",
    state: "Pará, Brazil",
    biome: "Amazonian Dense Ombrophilous Forest",
    coordinates: [-5.214, -53.482],
    tier: "critical",
    tierLabel: "🔴 CRITICAL",
    riskScore: 96,
    confidence: 95.2,
    coverChangePct: -38.5,
    flaggedAreaHa: 1420.0,
    detectionWindow: "June → August 2026",
    primaryIndicator: "Industrial Cattle Ranching Clear-Cut",
    coreProximityKm: 0.5,
    carbonRiskTonnes: 195000,
    speciesAtRisk: ["Jaguar", "Harpy Eagle", "Hyacinth Macaw"],
    spectral: { baselineNDVI: 0.86, currentNDVI: 0.28, deltaNDVIPct: -67.4, dNBR: 0.12, sarBackscatterDeltaDb: -8.9 },
    history5Year: [{ year: "2021", canopyIndex: 100 }, { year: "2026", canopyIndex: 44 }],
    aiVerdict: "Massive industrial clear-cut detected by Sentinel-1 SAR and MODIS. Fishbone logging road pattern actively penetrating indigenous territory border."
  }
];

// Provide regional center coordinates
const REGION_CENTERS = {
  "western-ghats": { lat: 11.45, lng: 76.35, zoom: 8 },
  "sundarbans": { lat: 21.94, lng: 88.90, zoom: 9 },
  "kaziranga": { lat: 26.58, lng: 93.17, zoom: 9 },
  "amazon": { lat: -5.21, lng: -53.48, zoom: 8 }
};

window.SYLVA_DATA = {
  ASSETS,
  HOTSPOTS_DATA,
  REGION_CENTERS
};
