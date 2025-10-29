# 🚀 Galería Segura Multi-Evento - Claude CLI

Bienvenido a la documentación de Claude CLI para el sistema de galerías seguras.

## 📖 Documentación Disponible

### Para Iniciarte

- **[init.md](./init.md)** - Guía de inicialización completa
  - Resumen del proyecto
  - Información de infraestructura
  - Estructura del proyecto
  - Comandos principales
  - Acceso a eventos

### Para Crear Nuevos Eventos

- **[../NUEVOS_REPOSITORIOS.md](../NUEVOS_REPOSITORIOS.md)** - Guía paso a paso
  - Preparar fotos
  - Crear repositorio Git
  - Desplegar en VPS
  - Configurar Cloudflare
  - Personalización avanzada

### Para Administradores

- **[../ADMIN.md](../ADMIN.md)** - Guía completa de administración
  - Comandos útiles
  - Monitoreo
  - Troubleshooting
  - Ciclo de vida de eventos

### Para Configurar Cloudflare

- **[../CLOUDFLARE.md](../CLOUDFLARE.md)** - Configuración detallada
  - Pasos iniciales
  - Registros DNS
  - Settings recomendados
  - Optimización de rendimiento

### Para Usuarios Finales

- **[../COMO_VER_FOTOS.md](../COMO_VER_FOTOS.md)** - Guía de uso
  - Cómo acceder a la galería
  - Características
  - Navegación
  - Solucionar problemas

### Resumen Completo

- **[../SETUP_FINAL.txt](../SETUP_FINAL.txt)** - Resumen del setup
  - Todo lo realizado
  - Status actual
  - Próximos pasos

---

## 🎯 Comandos Rápidos

### Crear Nuevo Evento

```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/evento-id evento-id
```

### Ver Estado del Sistema

```bash
systemctl status boda nginx
```

### Ver Logs en Tiempo Real

```bash
tail -f /var/log/boda.log
```

### Listar Eventos Activos

```bash
ls -la /opt/eventos/
```

### Monitorear Evento Específico

```bash
grep "evento-id" /var/log/boda.log | tail -20
```

---

## 📋 Resumen del Proyecto

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Galería de fotos segura multi-evento |
| **IP VPS** | 74.208.166.234 |
| **Dominio** | invitados.org |
| **OS** | Ubuntu 24.04 |
| **Runtime** | Node.js v24.11.0 |
| **Framework** | Express.js 4.18.2 |
| **Web Server** | Nginx 1.24.0 |
| **SSL/TLS** | Let's Encrypt + Cloudflare |
| **Evento Actual** | rossy-francisco (300 fotos) ✅ |
| **Estado** | PRODUCCIÓN - 100% OPERATIVO |

---

## 🔄 Flujo de Trabajo Típico

### 1. Preparar Evento Nuevo

```bash
# Crear carpeta y copiar fotos
mkdir evento-quince
cd evento-quince
mkdir images
cp /ruta/fotos/*.jpg images/

# Renombrar fotos al patrón correcto
python3 << 'EOF'
import os, glob
os.chdir('images')
for i, f in enumerate(sorted(glob.glob('*.*')), 1):
    new = f"foto{i:04d}.{f.split('.')[-1]}"
    os.rename(f, new)
EOF
```

### 2. Crear Repositorio Git

```bash
cd evento-quince
git init
git add images/
git commit -m "Fotos evento quince"
git remote add origin https://github.com/usuario/evento-quince.git
git push -u origin main
```

### 3. Desplegar en VPS

```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/evento-quince evento-quince
```

### 4. Configurar DNS en Cloudflare

Dashboard → invitados.org → DNS → Crear:
```
Tipo: A
Nombre: evento-quince
Valor: 74.208.166.234
Proxy: OFF (DNS Only)
```

### 5. Acceder

Espera 5-10 minutos, luego:
```
https://evento-quince.invitados.org
```

---

## 📁 Estructura del Proyecto

```
/opt/boda-francisco-rossy/
├── .claude/
│   ├── init.md              ← Guía de inicialización
│   ├── README.md            ← Este archivo
│   └── config.json          ← Configuración para Claude CLI
├── server.js                ← Servidor Express.js
├── package.json
├── public/                  ← Frontend compartido
│   ├── index.html
│   ├── js/
│   └── css/
├── images/                  ← Fotos del evento actual (300)
├── README.md
├── ADMIN.md                 ← Guía de administración
├── CLOUDFLARE.md            ← Configuración Cloudflare
├── COMO_VER_FOTOS.md        ← Guía para usuarios
├── NUEVOS_REPOSITORIOS.md   ← Crear nuevos eventos
└── SETUP_FINAL.txt          ← Resumen del setup

/opt/eventos/               ← Nuevos eventos
├── evento-quince/
├── evento-santiago/
└── ...

/etc/nginx/sites-available/
├── eventos                  ← Configuración HTTPS (activa)
└── eventos-http             ← Configuración HTTP (backup)

/var/log/
└── boda.log                 ← Logs del servidor
```

---

## 🔒 Seguridad Implementada

✅ **Protección de Imágenes**
- Tokens únicos por sesión (1 hora validez)
- Validación IP + User-Agent
- Headers CSP
- Bloqueo de acceso directo a /images

✅ **Prevención de Descargas**
- DevTools bloqueado (F12, Ctrl+Shift+I)
- No funciona clic derecho
- No se pueden arrastrar imágenes
- Content-Disposition: inline

✅ **Infraestructura**
- HTTPS/TLS 1.2 + 1.3
- HSTS Headers
- Rate limiting (100 req/15 min)
- Auto-renovación de certificados
- Helmet.js para headers de seguridad

---

## 📞 Soporte Rápido

### Ver Logs
```bash
tail -f /var/log/boda.log
```

### Reiniciar Servicios
```bash
systemctl restart boda
systemctl restart nginx
systemctl restart boda nginx
```

### Ver Certificado
```bash
certbot certificates
```

### Ver Eventos
```bash
ls -la /opt/eventos/
```

### Estadísticas
```bash
# Imágenes servidas
grep "\[IMAGE\]" /var/log/boda.log | wc -l

# Tokens generados
grep "\[TOKEN\]" /var/log/boda.log | wc -l

# Intentos fallidos
grep "\[AUTH\].*inválido" /var/log/boda.log | wc -l
```

---

## 🎯 Próximas Acciones

1. **Lee init.md** para entender la infraestructura
2. **Consulta NUEVOS_REPOSITORIOS.md** para crear tu primer evento
3. **Usa ADMIN.md** para administración diaria
4. **Revisa CLOUDFLARE.md** para configuraciones avanzadas

---

## 📚 Documentación Completa

Para acceder a toda la documentación:

```bash
cd /opt/boda-francisco-rossy

# Ver todos los archivos de documentación
ls -la *.md .claude/

# Leer la documentación (ejemplos)
cat README.md
cat ADMIN.md
cat NUEVOS_REPOSITORIOS.md
```

---

## 🚀 Inicio Rápido

### Crear tu primer evento en 5 minutos

```bash
# 1. Preparar fotos (local)
mkdir evento-test && cd evento-test
mkdir images
# Copiar fotos a images/

# 2. Renombrar fotos
python3 << 'EOF'
import os, glob
os.chdir('images')
for i, f in enumerate(sorted(glob.glob('*')), 1):
    os.rename(f, f"foto{i:04d}.{f.split('.')[-1]}")
EOF

# 3. Git
git init && git add . && git commit -m "Init"
git remote add origin https://github.com/usuario/evento-test.git
git push -u origin main

# 4. Desplegar
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/evento-test evento-test

# 5. Cloudflare
# Dashboard → DNS → Crear registro A
# Nombre: evento-test, Valor: 74.208.166.234, Proxy: OFF

# 6. Acceder (después de 5-10 minutos)
# https://evento-test.invitados.org
```

---

## ✨ Features Principales

- 🔐 **Protección de imágenes** - Tokens y validación
- 🎯 **Multi-evento** - Múltiples galerías en un VPS
- 🚀 **Fácil despliegue** - Scripts automáticos
- 🌐 **Múltiples dominios** - Cada evento su dominio
- 📱 **Responsive** - Funciona en móvil/tablet
- ⚡ **Rápido** - Compresión GZIP + Cloudflare CDN
- 🔄 **Auto-renovación** - Certificados automáticos
- 📊 **Monitoreo** - Logs y estadísticas

---

## 🎓 Próximas Mejoras

- [ ] Dashboard web de administración
- [ ] Descarga de galería completa (ZIP)
- [ ] Compartir fotos con link privado
- [ ] Impresión de fotos
- [ ] Estadísticas detalladas
- [ ] Backup automático a la nube

---

## 📝 Información del Sistema

**Versión:** 1.0.0
**Última actualización:** 2025-10-28
**Estado:** ✅ PRODUCCIÓN - 100% OPERATIVO
**Soporte:** Ver documentación en /opt/boda-francisco-rossy/

---

**¿Listo para empezar?** 🎉

```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh <url-del-repo> <id-evento>
```

Para más información, lee [init.md](./init.md) o [../NUEVOS_REPOSITORIOS.md](../NUEVOS_REPOSITORIOS.md)
