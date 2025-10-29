// ========================================
// SISTEMA DE VERSIONADO
// Boda Francisco y Rossy
// ========================================

const APP_VERSION = {
    major: 1,
    minor: 1,
    patch: 0,

    // Version completa
    get full() {
        return `${this.major}.${this.minor}.${this.patch}`;
    },

    // Timestamp para cache busting
    get timestamp() {
        return '20251029-001'; // Formato: YYYYMMDD-NNN
    },

    // Para usar en URLs
    get query() {
        return `v=${this.full}-${this.timestamp}`;
    }
};

// Información de versión visible en consola
console.log(`
╔════════════════════════════════════════╗
║  Selector de Fotos - Boda             ║
║  Francisco & Rossy                     ║
║                                        ║
║  Versión: ${APP_VERSION.full}                     ║
║  Build: ${APP_VERSION.timestamp}                 ║
╚════════════════════════════════════════╝
`);

// Exponer globalmente para otros scripts
window.APP_VERSION = APP_VERSION;
