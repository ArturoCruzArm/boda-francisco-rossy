# 🚀 Inicialización Claude CLI - Galería Segura Multi-Evento

## 📋 Resumen del Proyecto

Sistema profesional de hosting para galerías de fotos protegidas de múltiples eventos en un VPS Ubuntu 24.04.

**Características principales:**
- ✅ Multi-evento: Múltiples eventos en un único VPS
- ✅ Protección de imágenes: Acceso mediante tokens
- ✅ HTTPS/TLS: Let's Encrypt + Cloudflare
- ✅ Fácil despliegue: Scripts automáticos
- ✅ Escalable: Soporta cientos de eventos

---

## 🌍 Información de Infraestructura

```
IP VPS:                 74.208.166.234
Dominio Principal:      invitados.org
Sistema Operativo:      Ubuntu 24.04
Node.js:                v24.11.0
Nginx:                  1.24.0
Express.js:             4.18.2
SSL/TLS:                Let's Encrypt + Cloudflare DNS
```

---

## 📁 Estructura del Proyecto

```
/opt/boda-francisco-rossy/          Backend central
├── server.js                        Servidor Express.js
├── package.json                     Dependencias Node
├── deploy-event.sh                 Script despliegue
├── public/                          Frontend compartido
│   ├── index.html                  Página principal
│   ├── js/
│   │   ├── auth.js                Autenticación
│   │   └── gallery.js             Galería
│   └── css/
├── images/                          Fotos evento actual
│   ├── foto0001.webp
│   ├── foto0002.webp
│   └── ... (300 fotos)
├── node_modules/                    Dependencias instaladas
├── README.md                        Introducción general
├── ADMIN.md                         Guía administración
├── CLOUDFLARE.md                   Configuración Cloudflare
├── COMO_VER_FOTOS.md               Guía usuario final
└── SETUP_FINAL.txt                 Resumen completo

/opt/eventos/                        Directorio de nuevos eventos
├── evento-quince/
│   ├── images/
│   └── public/
└── evento-santiago/
    ├── images/
    └── public/

/etc/nginx/sites-available/
├── eventos                          Configuración activa HTTPS
└── eventos-http                     Configuración HTTP (backup)

/var/log/
└── boda.log                         Logs de la aplicación
```

---

## 🎯 Comandos Principales

### Administración del Sistema

```bash
# Ver estado de servicios
systemctl status boda nginx

# Ver logs en tiempo real
tail -f /var/log/boda.log

# Reiniciar servicios
systemctl restart boda
systemctl restart nginx
systemctl restart boda nginx

# Ver certificado SSL
certbot certificates

# Renovar certificado (manual)
certbot renew
```

### Gestión de Eventos

```bash
# Crear nuevo evento
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/evento-id evento-id

# Ver eventos activos
ls -la /opt/eventos/

# Monitorear evento específico
grep "evento-id" /var/log/boda.log | tail -20

# Eliminar evento
rm -rf /opt/eventos/evento-id
systemctl restart boda
```

### Monitoreo

```bash
# Imágenes servidas
grep "\[IMAGE\]" /var/log/boda.log | wc -l

# Tokens generados
grep "\[TOKEN\]" /var/log/boda.log | wc -l

# Intentos fallidos
grep "\[AUTH\].*inválido" /var/log/boda.log | wc -l

# Estadísticas por evento
grep "evento-quince" /var/log/boda.log | wc -l
```

---

## 🌐 Acceso a Eventos

### Evento Actual

```
URL: https://rossy-francisco.invitados.org
Fotos: 300
Estado: ✅ Activo
```

### Crear Nuevo Evento

**PASO 1: Desplegar en VPS**
```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/evento-quince evento-quince
```

**PASO 2: Configurar Cloudflare DNS**
1. Accede a https://dash.cloudflare.com
2. Zona: `invitados.org`
3. DNS → Registros → Crear:
   - Tipo: A
   - Nombre: evento-quince
   - Valor: 74.208.166.234
   - Proxy: OFF (DNS Only)

**PASO 3: Esperar propagación (5-10 minutos)**

**PASO 4: Acceder**
```
https://evento-quince.invitados.org
```

---

## 🔒 Seguridad Implementada

### Protección de Imágenes

- ✅ Sistema de tokens (1 hora validez)
- ✅ Validación IP + User-Agent
- ✅ Headers CSP (Content Security Policy)
- ✅ Bloqueo de acceso directo a /images
- ✅ DevTools bloqueado (F12, Ctrl+Shift+I)
- ✅ No se pueden descargar
- ✅ No funciona clic derecho
- ✅ No se pueden arrastrar

### Infraestructura

- ✅ HTTPS/TLS 1.2 + 1.3
- ✅ HSTS Headers
- ✅ Rate limiting (100 req/15 min)
- ✅ Bloqueo User-Agents sospechosos
- ✅ Auto-renovación de certificados
- ✅ Helmet.js para headers de seguridad

---

## 📊 Configuración de Cloudflare

### Registros DNS Recomendados

```
Tipo    Nombre                      Valor               Proxy
─────────────────────────────────────────────────────────────
A       rossy-francisco             74.208.166.234      OFF
CNAME   www.rossy-francisco         rossy-francisco...  OFF
A       evento-quince               74.208.166.234      OFF
CNAME   www.evento-quince           evento-quince...    OFF
A       evento-santiago             74.208.166.234      OFF
CNAME   www.evento-santiago         evento-santiago...  OFF
```

### Settings Cloudflare Recomendados

**SSL/TLS:**
- SSL Mode: Full (strict)
- HSTS: 12 meses, incluir subdomains, preload

**Security:**
- WAF: Habilitado
- DDoS: Habilitado
- Rate Limiting: 100 req/10s

**Performance:**
- Minify: CSS, JS, HTML
- Brotli: Habilitado
- HTTP/3: Habilitado

**Caching:**
- `/api/*` → Never Cache
- `/api/images/*` → Never Cache
- `*.css`, `*.js` → Cache Everything (30 días)

---

## 🛠️ Configuración Recomendada para Nuevos Repositorios

### Estructura del Repositorio

```
tu-evento/
├── images/                  Fotos originales
│   ├── foto1.jpg
│   ├── foto2.jpg
│   └── ... más fotos
├── selector.html            HTML personalizado (opcional)
├── css/
│   └── custom.css          Estilos personalizados (opcional)
├── js/
│   └── custom.js           Scripts personalizados (opcional)
└── README.md               Información del evento
```

### Requisitos de Fotos

- **Formato:** WebP (recomendado) o JPG/PNG
- **Calidad:** Alta (80-90 sobre 100)
- **Tamaño:** Máximo 50 MB por foto
- **Nombre:** fotoXXXX.ext (foto0001.webp, foto0002.jpg, etc)
- **Cantidad:** Hasta 1000 fotos

### Pasos para Nuevo Repositorio

**1. Preparar fotos:**
```bash
# Convertir a WebP (opcional pero recomendado)
# Usar herramienta como ImageMagick
for f in *.jpg; do
  magick "$f" "${f%.jpg}.webp"
done
```

**2. Crear estructura:**
```
tu-evento/
└── images/
    ├── foto0001.webp
    ├── foto0002.webp
    └── ... (todos renombrados)
```

**3. Crear repositorio Git:**
```bash
git init
git add images/
git commit -m "Inicial: Fotos del evento"
git remote add origin https://github.com/usuario/tu-evento.git
git push -u origin main
```

**4. Desplegar en VPS:**
```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/tu-evento evento-id
```

**5. Configurar DNS en Cloudflare:**
```
Tipo: A
Nombre: evento-id
Valor: 74.208.166.234
Proxy: OFF
```

---

## 📝 Variables de Entorno

El servidor Node.js usa:

```bash
NODE_ENV=production
PORT=3000
```

Estos se setean automáticamente en el systemd service.

---

## 🔄 Ciclo de Vida de Eventos

### Crear
```bash
./deploy-event.sh <url-repo> <evento-id>
# Crear DNS en Cloudflare
# Esperar 5-10 min
```

### Actualizar Imágenes
```bash
cd /opt/eventos/evento-id/images/
# Agregar nuevas fotos (foto0XXX.webp)
systemctl restart boda
```

### Actualizar Contenido (HTML/CSS/JS)
```bash
cd /opt/eventos/evento-id/public/
# Editar index.html, css/, js/
# Los cambios se ven inmediatamente en el navegador
```

### Eliminar
```bash
rm -rf /opt/eventos/evento-id/
# Eliminar registro DNS en Cloudflare (opcional)
systemctl restart boda
```

---

## 📞 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| No se ven fotos | `ls -la /opt/eventos/evento-id/images/` |
| DNS no propaga | Espera 10-15 min, verifica Cloudflare Proxy: OFF |
| Node.js crash | `journalctl -u boda -n 50` → `systemctl restart boda` |
| HTTPS no funciona | `certbot certificates` → `systemctl restart nginx` |
| Imágenes lentas | Usa WebP comprimido, activa Cloudflare cache |

---

## 📚 Documentación Complementaria

- **README.md** - Introducción general
- **ADMIN.md** - Guía completa de administración
- **CLOUDFLARE.md** - Configuración detallada de Cloudflare
- **COMO_VER_FOTOS.md** - Guía para usuarios finales
- **SETUP_FINAL.txt** - Resumen del setup completo

---

## 🎯 Próximas Mejoras Sugeridas

- [ ] Dashboard web para administración
- [ ] Descarga de galería completa (ZIP)
- [ ] Compartir fotos con link privado
- [ ] Impresión de fotos
- [ ] Estadísticas detalladas
- [ ] Backup automático a la nube

---

## 📞 Información de Contacto

**Sistema:** Galería Segura Multi-Evento v1.0
**Última actualización:** 2025-10-28
**Estado:** ✅ PRODUCCIÓN - 100% OPERATIVO
**Soporte:** Ver documentación en `/opt/boda-francisco-rossy/`

---

**¿Listo para crear tu primer evento?** 🚀

```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/evento-id evento-id
```
