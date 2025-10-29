const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Confiar en proxy (Nginx)
app.set('trust proxy', 1);

// Seguridad con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],  // Permitir blob para canvas
      connectSrc: ["'self'"],  // Permitir conexiones a si mismo
      frameSrc: ["https://www.youtube.com"],  // Permitir YouTube
      mediaSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  xFrameOptions: { action: "SAMEORIGIN" }  // Permitir iframe en el mismo origen
}));

// Optimizar compresión
app.use(compression({
  level: 6,  // Balance entre compresión y velocidad
  threshold: 512,  // Comprimir archivos > 512 bytes
  filter: (req, res) => {
    // No comprimir imágenes (ya están comprimidas en WebP)
    if (req.path.includes('/api/images/')) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
app.use(express.json());

// Rate limiting - más permisivo para galerías de fotos
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5000, // 5000 solicitudes por hora (suficiente para galería de 300+ fotos)
  message: 'Demasiadas solicitudes',
  standardHeaders: true, // Devuelve info en headers RateLimit-*
  legacyHeaders: false, // Deshabilita headers X-RateLimit-*
});
app.use(limiter);

// Almacenamiento de tokens en memoria
const activeTokens = new Map();
const TOKEN_EXPIRY = 3600000; // 1 hora

// Directorio base de eventos
const EVENTS_BASE_DIR = '/opt/eventos';

console.log('Servidor iniciando...');
console.log(`Base de eventos: ${EVENTS_BASE_DIR}`);

// Crear directorio base si no existe
if (!fs.existsSync(EVENTS_BASE_DIR)) {
  fs.mkdirSync(EVENTS_BASE_DIR, { recursive: true });
  console.log(`Creado directorio: ${EVENTS_BASE_DIR}`);
}

/**
 * Obtener información del evento basado en el host
 */
function getEventByHost(host) {
  // host puede ser: event.rossy-francisco.invitados.org
  // o simplemente: rossy-francisco.invitados.org

  const parts = host.split('.');

  // Si es un subdominio, usar como evento
  if (parts.length > 3) {
    return parts[0]; // event
  }

  // Si no es subdominio, extraer de la referencia HTTP
  return 'boda-francisco-rossy';
}

/**
 * Obtener ruta del evento
 */
function getEventPath(eventId) {
  // Mapear IDs a directorio real
  const eventMap = {
    'boda-francisco-rossy': '/opt/boda-francisco-rossy'
  };

  return eventMap[eventId] || `/opt/eventos/${eventId}`;
}

/**
 * Validar que el evento existe
 */
function isValidEvent(eventId) {
  const eventPath = getEventPath(eventId);
  const imagesPath = path.join(eventPath, 'images');
  return fs.existsSync(imagesPath);
}

// Endpoint para obtener token de autenticación
app.post('/api/auth/token', (req, res) => {
  const eventId = getEventByHost(req.get('host'));

  if (!isValidEvent(eventId)) {
    return res.status(404).json({ error: 'Evento no encontrado' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const sessionData = {
    eventId: eventId,
    createdAt: Date.now(),
    expiresAt: Date.now() + TOKEN_EXPIRY,
    ip: req.ip
  };

  activeTokens.set(token, sessionData);

  console.log(`[TOKEN] ${eventId} | Nuevo token: ${token.substring(0, 8)}...`);

  res.json({
    token,
    expiresIn: TOKEN_EXPIRY / 1000,
    eventId: eventId
  });
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-image-token'] || req.query.token;
  const eventId = getEventByHost(req.get('host'));

  if (!token) {
    console.warn(`[AUTH] ${eventId} | Acceso sin token desde ${req.ip}`);
    return res.status(401).json({ error: 'No autorizado' });
  }

  const session = activeTokens.get(token);

  if (!session) {
    console.warn(`[AUTH] ${eventId} | Token no encontrado desde ${req.ip}`);
    return res.status(401).json({ error: 'Token inválido' });
  }

  if (session.expiresAt < Date.now()) {
    activeTokens.delete(token);
    console.warn(`[AUTH] ${eventId} | Token expirado desde ${req.ip}`);
    return res.status(401).json({ error: 'Token expirado' });
  }

  // Validar que el token pertenece al evento correcto
  if (session.eventId !== eventId) {
    console.warn(`[AUTH] ${eventId} | Token de evento diferente desde ${req.ip}`);
    return res.status(401).json({ error: 'Token inválido' });
  }

  // Validar IP (User-Agent no es fiable entre peticiones)
  if (session.ip !== req.ip) {
    console.warn(`[AUTH] ${eventId} | Token inválido: IP mismatch esperada ${session.ip} recibida ${req.ip}`);
    return res.status(401).json({ error: 'Token inválido' });
  }

  req.eventId = eventId;
  next();
};

// Bloquear User-Agents sospechosos (solo los muy obios, no 'bot' que puede estar en Chrome)
app.use((req, res, next) => {
  const suspiciousAgents = ['curl', 'wget', 'scrapy', 'httpClient'];
  const userAgent = req.headers['user-agent']?.toLowerCase() || '';

  if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
    console.warn(`[SECURITY] Bloqueado User-Agent sospechoso: ${userAgent}`);
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  next();
});

// Endpoint para servir imágenes protegidas
app.get('/api/images/:filename', verifyToken, (req, res) => {
  const filename = req.params.filename;
  const eventId = req.eventId;

  // Validar nombre de archivo
  if (!filename.match(/^foto\d{4,}\.(webp|jpg|png|jpeg)$/i)) {
    console.warn(`[SECURITY] ${eventId} | Intento de acceso a archivo inválido: ${filename}`);
    return res.status(400).json({ error: 'Archivo inválido' });
  }

  const eventPath = getEventPath(eventId);
  const filepath = path.join(eventPath, 'images', filename);

  // Verificar que existe y está dentro del directorio del evento
  if (!fs.existsSync(filepath) || !filepath.startsWith(path.join(eventPath, 'images'))) {
    console.warn(`[404] ${eventId} | Imagen no encontrada: ${filename}`);
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }

  // Headers para proteger imágenes pero permitir caché del navegador
  res.set({
    'Content-Disposition': 'inline',
    'Cache-Control': 'private, max-age=86400',  // Caché privado por 24 horas
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block'
  });

  console.log(`[IMAGE] ${eventId} | Sirviendo: ${filename}`);
  res.sendFile(filepath);
});

// Endpoint para listar imágenes
app.get('/api/images', verifyToken, (req, res) => {
  const eventId = req.eventId;
  const eventPath = getEventPath(eventId);
  const imagesDir = path.join(eventPath, 'images');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error(`[ERROR] ${eventId} | Error al leer directorio:`, err);
      return res.status(500).json({ error: 'Error al leer imágenes' });
    }

    const images = files
      .filter(f => f.match(/\.(webp|jpg|png|jpeg)$/i))
      .sort()
      .map(f => ({
        filename: f,
        url: `/api/images/${f}`
      }));

    console.log(`[API] ${eventId} | Listando ${images.length} imágenes`);
    res.json({
      eventId: eventId,
      total: images.length,
      images
    });
  });
});

// Endpoint para logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['x-image-token'] || req.body.token;
  const eventId = getEventByHost(req.get('host'));

  if (token) {
    activeTokens.delete(token);
    console.log(`[LOGOUT] ${eventId} | Token eliminado`);
  }
  res.json({ success: true, message: 'Sesión cerrada' });
});

// Servir archivos estáticos del evento
app.use((req, res, next) => {
  const eventId = getEventByHost(req.get('host'));
  const eventPath = getEventPath(eventId);
  const publicPath = path.join(eventPath, 'public');

  if (fs.existsSync(publicPath)) {
    express.static(publicPath)(req, res, next);
  } else {
    next();
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  const eventId = getEventByHost(req.get('host'));
  const eventPath = getEventPath(eventId);
  const indexPath = path.join(eventPath, 'public', 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      message: 'Bienvenido a la galería de fotos',
      eventId: eventId,
      api: '/api/auth/token para obtener token'
    });
  }
});

// Bloquear acceso directo a /images
app.use('/images', (req, res) => {
  const eventId = getEventByHost(req.get('host'));
  console.warn(`[SECURITY] ${eventId} | Intento de acceso directo a /images desde ${req.ip}`);
  return res.status(403).json({ error: 'Acceso denegado. Las imágenes se sirven mediante API autenticada.' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`✓ Servidor ejecutándose en puerto ${PORT}`);
  console.log(`✓ Modo: Multi-evento`);
  console.log(`✓ Base de eventos: ${EVENTS_BASE_DIR}`);
  console.log(`========================================`);
});
