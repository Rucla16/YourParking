// 1. Importamos Leaflet de forma normal y limpia arriba del todo
import L from 'leaflet';
import { showToast } from './ui.js';

let map = null;
let marker = null;

// Configuración de rutas de los iconos de Leaflet para entornos Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Ubicación por defecto inicial (Badalona / Barcelona)
const DEFAULT_COORDS = [41.4469, 2.2450]; 

export function initSensors() {
  const btnSave = document.getElementById('btnSaveLocation');
  const btnClear = document.getElementById('btnClearLocation');

  // Inicializamos el mapa directamente
  initLeafletMap();

  // Cargamos la ubicación guardada si existe
  loadSavedLocation();

  // Evento para guardar la ubicación actual
  btnSave?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('❌ El teu navegador no suporta Geolocalització', 'error');
      return;
    }

    showToast('📡 Buscant satèl·lits...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const locationData = {
          lat: latitude,
          lng: longitude,
          timestamp: new Date().toLocaleString('ca-ES')
        };
        localStorage.setItem('parked_car_location', JSON.stringify(locationData));

        updateMapMarker(latitude, longitude);
        updateUIStatus(locationData);
        
        showToast('✅ Ubicació del cotxe guardada!', 'success');
      },
      (error) => {
        showToast('❌ Error en obtenir la ubicació: ' + error.message, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // Evento para borrar la ubicación guardada
  btnClear?.addEventListener('click', () => {
    localStorage.removeItem('parked_car_location');
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    map.setView(DEFAULT_COORDS, 13);
    updateUIStatus(null);
    showToast('🗑️ Ubicació eliminada', 'info');
  });
}

function initLeafletMap() {
  const container = document.getElementById('mapContainer');
  if (!container || map) return; // Evita duplicados si ya está inicializado

  // Creamos el mapa
  map = L.map('mapContainer').setView(DEFAULT_COORDS, 13);

  // Capa de mapa estilo Cyberpunk / Oscuro
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  // Arreglo para que Leaflet se renderice bien al cambiar entre pestañas ocultas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === 'map' || btn.dataset.tab === 'sensors') {
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 200);
      }
    });
  });
}

function loadSavedLocation() {
  const saved = localStorage.getItem('parked_car_location');
  if (saved) {
    const locationData = JSON.parse(saved);
    updateMapMarker(locationData.lat, locationData.lng);
    updateUIStatus(locationData);
  }
}

function updateMapMarker(lat, lng) {
  if (!map) return;

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }
  
  marker.bindPopup('<b>🚗 El teu cotxe és aquí</b>').openPopup();
  map.setView([lat, lng], 17);
}

function updateUIStatus(data) {
  const statusDiv = document.getElementById('locationStatus');
  const btnClear = document.getElementById('btnClearLocation');
  
  if (!statusDiv || !btnClear) return;

  if (data) {
    statusDiv.className = "location-info-box"; // Asegura los estilos CSS
    statusDiv.innerHTML = `
      <div class="location-info-title">✅ Cotxe Localitzat</div>
      <div class="text-secondary">
        📅 <b>Aparcat el:</b> ${data.timestamp}<br>
        📍 <b>Coordenades:</b> ${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}
      </div>
    `;
    btnClear.style.display = 'flex'; // Muestra el botón de borrar con flex
  } else {
    statusDiv.className = "location-info-box";
    statusDiv.innerHTML = `
      <div class="location-info-title" style="color: var(--accent-warning);">⚠️ Sense dades</div>
      <span class="text-secondary">No hi ha cap ubicació guardada en aquest dispositiu. Clica el botó de dalt quan aparquis el cotxe.</span>
    `;
    btnClear.style.display = 'none'; // Oculta el botón de borrar
  }
}