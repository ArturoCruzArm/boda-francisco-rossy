/**
 * Gestor de galería con protección contra descargas
 */
class Gallery {
  constructor(authManager) {
    this.auth = authManager;
    this.images = [];
    this.currentImageIndex = 0;
    this.init();
  }

  async init() {
    // Esperar a que el token esté listo
    window.addEventListener('tokenReady', () => {
      console.log('Token recibido, cargando imágenes...');
      this.loadImages();
    });

    // Configurar modal y prevención de descargas ahora
    this.setupModal();
    this.preventDownload();

    // Esperar brevemente y luego intentar cargar si ya hay token
    await new Promise(resolve => setTimeout(resolve, 100));

    const token = this.auth.getToken();
    if (token) {
      console.log('Token disponible, cargando imágenes inmediatamente...');
      await this.loadImages();
    } else {
      console.log('Esperando token...');
    }
  }

  async loadImages() {
    try {
      let token = this.auth.getToken();

      // Si no hay token, esperar un poco y reintentar
      if (!token) {
        console.log('Esperando token...');
        await new Promise(resolve => setTimeout(resolve, 500));
        token = this.auth.getToken();
      }

      if (!token) {
        console.error('No se pudo obtener token después de esperar');
        const gallery = document.getElementById('gallery');
        if (gallery) {
          gallery.innerHTML = '<p style="color: red; text-align: center;">Error de autenticación. Por favor, recarga la página.</p>';
        }
        return;
      }

      console.log('Haciendo solicitud a /api/images con token...');
      const response = await fetch('/api/images', {
        headers: { 'X-Image-Token': token }
      });

      if (!response.ok) {
        console.error(`Error HTTP ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.images = data.images;

      console.log(`✓ ${data.total} imágenes cargadas`);
      this.renderGallery();
    } catch (error) {
      console.error('✗ Error al cargar imágenes:', error);
      const gallery = document.getElementById('gallery');
      if (gallery) {
        gallery.innerHTML = '<p style="color: red; text-align: center;">Error al cargar la galería. Por favor, recarga la página.</p>';
      }
    }
  }

  renderGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    // Actualizar contador total
    const totalSpan = document.getElementById('image-total');
    if (totalSpan) totalSpan.textContent = this.images.length;

    this.images.forEach((image, index) => {
      const container = document.createElement('div');
      container.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = this.auth.getImageUrl(image.filename);
      img.alt = image.filename;
      img.className = 'gallery-thumbnail';
      img.loading = 'lazy';

      // Prevenir que se pueda hacer clic derecho o arrastrar
      img.addEventListener('contextmenu', (e) => e.preventDefault());
      img.addEventListener('dragstart', (e) => e.preventDefault());

      // Click para abrir modal
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(index);
      });

      container.appendChild(img);
      gallery.appendChild(container);
    });
  }

  setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (!modal) return;

    // Botón cerrar
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Cerrar al hacer click fuera de la imagen
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Navegación con botones
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousImage());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextImage());
    }

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (modal.style.display !== 'flex') return;

      if (e.key === 'ArrowLeft') {
        this.previousImage();
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
      } else if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  openModal(index) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');

    if (!modal || !modalImg) return;

    this.currentImageIndex = index;
    const image = this.images[index];

    modalImg.src = this.auth.getImageUrl(image.filename);
    modal.style.display = 'flex';

    // Actualizar contador
    const currentSpan = document.getElementById('image-current');
    const totalSpan = document.getElementById('image-total');
    if (currentSpan) currentSpan.textContent = (index + 1);
    if (totalSpan) totalSpan.textContent = this.images.length;

    console.log(`Imagen ${index + 1}/${this.images.length}: ${image.filename}`);
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.openModal(this.currentImageIndex + 1);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.openModal(this.currentImageIndex - 1);
    }
  }

  preventDownload() {
    // Prevenir clic derecho
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    });

    // Prevenir arrastrar imágenes
    document.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    });

    // Prevenir atajos de teclado peligrosos
    document.addEventListener('keydown', (e) => {
      // F12 - DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I - DevTools
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C - Inspector
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }

      // Ctrl+S - Guardar página
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+K - Consola
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        return false;
      }
    });
  }
}

// Inicializar galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new Gallery(auth);
  console.log('✓ Galería inicializada');
});
