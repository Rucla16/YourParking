import { showToast } from './ui.js';

const photos = JSON.parse(localStorage.getItem('parked_car_photos')) || [];
let currentPhoto = null;


export function initGallery() {

  document.addEventListener('photo:captured', (e) => {
    addPhoto(e.detail);
  });

  renderSavedPhotos();

  
  document.getElementById('clearGallery')
    ?.addEventListener('click', clearGallery);

  
  document.getElementById('closeModal')
    ?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')
    ?.addEventListener('click', closeModal);
  document.getElementById('downloadBtn')
    ?.addEventListener('click', downloadPhoto);
}

function addPhoto(photoData) {
  const photo = { id: Date.now(), ...photoData };
  photos.unshift(photo);

  localStorage.setItem('parked_car_photos', JSON.stringify(photos));

  renderPhotoItem(photo);
}

function renderPhotoItem(photo) {
  const grid = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');
  if (!grid) return;

  empty?.classList.add('hidden');

  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.innerHTML = `
    <img src="${photo.dataUrl}" alt="Captura" loading="lazy" />
    <div class="gallery-item-info">
      <span>📅 ${photo.timestamp.split(' ')[0]}</span>
    </div>
  `;

  item.addEventListener('click', () => openModal(photo));
  grid.insertBefore(item, grid.firstChild);
}

function renderSavedPhotos() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  
  // Limpio contenido dinámico viejo sin tocar el div de "vacío"
  const items = grid.querySelectorAll('.gallery-item');
  items.forEach(el => el.remove());

  if (photos.length > 0) {
    document.getElementById('galleryEmpty')?.classList.add('hidden');
    // Pinto de atrás hacia adelante para mantener el orden cronológico invertido
    [...photos].reverse().forEach(photo => {
      renderPhotoItem(photo);
    });
  } else {
    document.getElementById('galleryEmpty')?.classList.remove('hidden');
  }
}


function clearGallery() {
  photos.length = 0;
  localStorage.removeItem('parked_car_photos');
  
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(el => el.remove());
  
  document.getElementById('galleryEmpty')?.classList.remove('hidden');
  showToast('🗑️ Galeria neta', 'info');
}

function openModal(photo) {
  currentPhoto = photo;

  const modal     = document.getElementById('photoModal');
  const img       = document.getElementById('modalImage');
  const info      = document.getElementById('modalInfo');
  if (!modal || !img || !info) return;

  img.src = photo.dataUrl;

  const magnitude = Math.sqrt(
    photo.accel.x**2 + photo.accel.y**2 + photo.accel.z**2
  ).toFixed(1);

  info.innerHTML = `
    <strong>📅</strong> ${photo.timestamp} &nbsp;|&nbsp;
    <strong>✨</strong> ${photo.effect} &nbsp;|&nbsp;
    <strong>⚡</strong> ${magnitude} G
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('photoModal')?.classList.add('hidden');
  document.body.style.overflow = '';
  currentPhoto = null;
}

function downloadPhoto() {
  if (!currentPhoto) return;
  const a      = document.createElement('a');
  a.href       = currentPhoto.dataUrl;
  a.download   = `sensorCam_${currentPhoto.id}.jpg`;
  a.click();
  showToast('⬇️ Foto descarregada!', 'success');
}

function formatHour(ts) {
  return ts.split(', ')[1] ?? ts;
}