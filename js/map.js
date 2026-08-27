/**
 * FORESTWATCH // GEOSPATIAL RADAR & MAP ENGINE
 * Leaflet integration with multi-spectral satellite overlays, custom animated pulse markers, and coordinate HUD.
 */

class SylvaMapEngine {
  constructor(containerId, onHotspotSelect) {
    this.containerId = containerId;
    this.onHotspotSelect = onHotspotSelect;
    this.map = null;
    this.markersLayer = null;
    this.overlayLayer = null;
    this.currentFilter = 'all';
    this.currentLayer = 'true-color';
    this.activeHotspotId = null;

    this.initMap();
  }

  initMap() {
    // Default center on Western Ghats, India
    const initialCenter = window.SYLVA_DATA.REGION_CENTERS["western-ghats"];

    this.map = L.map(this.containerId, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialCenter.zoom,
      zoomControl: true,
      attributionControl: false
    });

    // Base Sat Tile Layers
    this.baseLayers = {
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Esri World Imagery'
      }),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: 'CartoDB Dark Matter'
      })
    };

    // Add default satellite layer
    this.baseLayers.satellite.addTo(this.map);

    // Markers layer group
    this.markersLayer = L.layerGroup().addTo(this.map);

    // Track mouse coordinates for HUD
    const hudCoords = document.getElementById('hud-coordinates');
    const hudZoom = document.getElementById('hud-zoom-level');

    this.map.on('mousemove', (e) => {
      if (hudCoords) {
        hudCoords.textContent = `${e.latlng.lat.toFixed(3)}° N, ${e.latlng.lng.toFixed(3)}° E`;
      }
    });

    this.map.on('zoomend', () => {
      if (hudZoom) {
        hudZoom.textContent = `ZOOM: ${this.map.getZoom()}x`;
      }
    });

    // Render initial hotspot markers
    this.renderMarkers();
  }

  renderMarkers() {
    this.markersLayer.clearLayers();
    const data = window.SYLVA_DATA.HOTSPOTS_DATA;

    data.forEach((hotspot) => {
      // Check filter
      if (this.currentFilter !== 'all' && hotspot.tier !== this.currentFilter) {
        return;
      }

      // Create custom HTML animated pulse pin
      const isSelected = hotspot.id === this.activeHotspotId;
      const markerColorClass = hotspot.tier === 'critical' ? 'marker-critical' : (hotspot.tier === 'high' ? 'marker-high' : 'marker-emerging');
      const selectedClass = isSelected ? 'marker-selected' : '';

      const customIcon = L.divIcon({
        className: 'custom-radar-marker',
        html: `
          <div class="radar-marker-wrap ${markerColorClass} ${selectedClass}">
            <div class="radar-pulse"></div>
            <div class="radar-center-dot">
              <span class="marker-id-txt">${hotspot.num}</span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker(hotspot.coordinates, { icon: customIcon });

      // Hover Tooltip (Styled with Cutoshi Nature Tech UI)
      marker.bindTooltip(`
        <div class="map-tooltip-content">
          <div class="tt-header">
            <span class="tt-badge ${hotspot.tier}">${hotspot.tierLabel}</span>
            <span class="tt-id">#${hotspot.num}</span>
          </div>
          <div class="tt-title">${hotspot.name}</div>
          <div class="tt-stat">Cover Delta: <strong class="text-red">${hotspot.coverChangePct}%</strong></div>
          <div class="tt-stat">Confidence: <strong>${hotspot.confidence}%</strong></div>
        </div>
      `, {
        direction: 'top',
        className: 'custom-map-tooltip',
        offset: [0, -14]
      });

      marker.on('click', () => {
        this.selectHotspot(hotspot.id, true);
      });

      this.markersLayer.addLayer(marker);
    });
  }

  selectHotspot(hotspotId, shouldFly = false) {
    this.activeHotspotId = hotspotId;
    const hotspot = window.SYLVA_DATA.HOTSPOTS_DATA.find(h => h.id === hotspotId);
    if (!hotspot) return;

    if (shouldFly && this.map) {
      this.map.flyTo(hotspot.coordinates, Math.max(this.map.getZoom(), 11), {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }

    // Refresh marker styling to highlight active
    this.renderMarkers();

    // Call callback to notify app
    if (this.onHotspotSelect) {
      this.onHotspotSelect(hotspot);
    }
  }

  setFilter(filterType) {
    this.currentFilter = filterType;
    this.renderMarkers();
  }

  setRegion(regionKey) {
    const region = window.SYLVA_DATA.REGION_CENTERS[regionKey];
    if (region && this.map) {
      this.map.flyTo([region.lat, region.lng], region.zoom, {
        duration: 1.5
      });
    }
  }

  setLayer(layerType) {
    this.currentLayer = layerType;
    // Layer effects or filter overlays
    const mapEl = document.getElementById(this.containerId);
    if (!mapEl) return;

    if (layerType === 'falsecolor') {
      mapEl.style.filter = 'hue-rotate(290deg) saturate(1.8) contrast(1.1)';
    } else if (layerType === 'ndvi-heatmap') {
      mapEl.style.filter = 'hue-rotate(85deg) saturate(2.4) brightness(1.05)';
    } else if (layerType === 'loss-mask') {
      mapEl.style.filter = 'invert(0.1) saturate(1.5) contrast(1.2)';
    } else {
      mapEl.style.filter = 'none';
    }
  }
}

window.SylvaMapEngine = SylvaMapEngine;
