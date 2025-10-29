/**
 * Gestor de autenticación para acceso seguro a imágenes
 */
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('imageToken');
    this.tokenExpiry = parseInt(localStorage.getItem('tokenExpiry') || 0);
    this.refreshIntervalId = null;

    // Si no hay token válido, solicitar uno nuevo
    if (!this.token || Date.now() > this.tokenExpiry) {
      this.requestNewToken();
    } else {
      this.scheduleTokenRefresh();
    }
  }

  async requestNewToken() {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.token;
      this.tokenExpiry = Date.now() + (data.expiresIn * 1000);

      // Guardar en localStorage
      localStorage.setItem('imageToken', this.token);
      localStorage.setItem('tokenExpiry', this.tokenExpiry);

      console.log('✓ Token de autenticación obtenido');

      // Programar renovación del token antes de que expire
      this.scheduleTokenRefresh();

      // Disparar evento para que otros componentes sepan que se tiene token
      window.dispatchEvent(new CustomEvent('tokenReady', { detail: { token: this.token } }));
    } catch (error) {
      console.error('✗ Error de autenticación:', error);
      // Reintentar cada 5 segundos
      setTimeout(() => this.requestNewToken(), 5000);
    }
  }

  scheduleTokenRefresh() {
    // Limpiar intervalo anterior si existe
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }

    // Renovar token 5 minutos antes de que expire
    const timeUntilExpiry = this.tokenExpiry - Date.now();
    const refreshIn = Math.max(0, timeUntilExpiry - (5 * 60 * 1000));

    this.refreshIntervalId = setTimeout(() => {
      console.log('↻ Renovando token...');
      this.requestNewToken();
    }, refreshIn);
  }

  getToken() {
    if (!this.token || Date.now() > this.tokenExpiry) {
      this.requestNewToken();
      return null;
    }
    return this.token;
  }

  getImageUrl(filename) {
    const token = this.getToken();
    if (!token) return null;
    return `/api/images/${filename}?token=${token}`;
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'X-Image-Token': this.token,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }

    localStorage.removeItem('imageToken');
    localStorage.removeItem('tokenExpiry');
    this.token = null;
    this.tokenExpiry = null;

    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }

    console.log('✓ Sesión cerrada');
  }
}

// Crear instancia global de AuthManager
const auth = new AuthManager();
