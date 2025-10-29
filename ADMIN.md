# 📋 Administración de Eventos - Galería Segura

## Estructura de Directorios

```
/opt/
├── boda-francisco-rossy/          # Backend central (Express.js)
│   ├── server.js                  # Servidor principal
│   ├── package.json
│   ├── public/                    # Archivos base compartidos
│   │   ├── js/
│   │   │   ├── auth.js           # Gestor de autenticación
│   │   │   └── gallery.js        # Gestor de galería
│   │   └── css/
│   ├── deploy-event.sh            # Script para desplegar eventos
│   └── ADMIN.md                   # Este archivo
│
└── eventos/                       # Directorio de eventos
    ├── evento-1/
    │   ├── images/               # Fotos del evento
    │   │   ├── foto0001.webp
    │   │   ├── foto0002.webp
    │   │   └── ...
    │   └── public/               # Frontend personalizado
    │       ├── index.html
    │       ├── js/
    │       └── css/
    │
    ├── evento-2/
    │   └── ...
```

## Agregar un Nuevo Evento

### Opción 1: Despliegue Automático (Recomendado)

```bash
cd /opt/boda-francisco-rossy

# Desplegar desde un repositorio Git
./deploy-event.sh https://github.com/usuario/evento-boda evento-boda

# O desde un repositorio local
./deploy-event.sh /ruta/local/evento-quince evento-quince
```

### Opción 2: Despliegue Manual

```bash
# Crear estructura del evento
mkdir -p /opt/eventos/mi-evento/{images,public/js,public/css}

# Copiar imágenes
cp /ruta/imagenes/* /opt/eventos/mi-evento/images/

# Copiar HTML
cp /ruta/selector.html /opt/eventos/mi-evento/public/index.html

# Copiar CSS/JS personalizado
cp /ruta/css/* /opt/eventos/mi-evento/public/css/
cp /ruta/js/* /opt/eventos/mi-evento/public/js/

# Copiar scripts de autenticación
cp /opt/boda-francisco-rossy/public/js/auth.js /opt/eventos/mi-evento/public/js/
cp /opt/boda-francisco-rossy/public/js/gallery.js /opt/eventos/mi-evento/public/js/

# Asignar permisos
chown -R root:root /opt/eventos/mi-evento
chmod -R 755 /opt/eventos/mi-evento
```

## Configurar Dominio en Cloudflare

Después de desplegar un evento, sigue estos pasos en Cloudflare:

### 1. Accede a tu Dashboard de Cloudflare
- Inicia sesión en https://dash.cloudflare.com
- Selecciona tu zona: `rossy-francisco.invitados.org`

### 2. Ve a DNS → Registros

### 3. Crea un registro A para el evento
- **Tipo:** A
- **Nombre:** `evento-boda` (para `evento-boda.rossy-francisco.invitados.org`)
- **IPv4:** `74.208.166.234` (IP del VPS)
- **Proxy:** OFF (Gris - DNS Only, NO proxied)
- **TTL:** Auto

### 4. (Opcional) Crear alias www
- **Tipo:** CNAME
- **Nombre:** `www.evento-boda`
- **Objetivo:** `evento-boda.rossy-francisco.invitados.org`
- **Proxy:** OFF
- **TTL:** Auto

### 5. Esperar 5-10 minutos para propagación DNS

### 6. Probar acceso
```bash
# Verificar DNS
nslookup evento-boda.rossy-francisco.invitados.org

# Acceder al evento
curl http://evento-boda.rossy-francisco.invitados.org
```

## Configurar SSL/TLS (Una sola vez por dominio base)

### Certificado Wildcard (Recomendado)

```bash
# Obtener certificado wildcard para *.rossy-francisco.invitados.org
certbot certonly --webroot -w /var/www/certbot \
  -d rossy-francisco.invitados.org \
  -d www.rossy-francisco.invitados.org \
  -d '*.rossy-francisco.invitados.org' \
  --agree-tos --email admin@example.com --non-interactive
```

Este certificado cubre automáticamente todos los subdominios:
- `rossy-francisco.invitados.org`
- `www.rossy-francisco.invitados.org`
- `evento-1.rossy-francisco.invitados.org`
- `evento-2.rossy-francisco.invitados.org`
- Y cualquier otro subdominio

### Actualizar Nginx con HTTPS

Después de obtener el certificado, edita `/etc/nginx/sites-available/eventos` y descomentar la sección HTTPS:

```bash
# Copiar el archivo con HTTPS habilitado
# Ver la sección "# HTTPS" en la configuración
nano /etc/nginx/sites-available/eventos

# Validar
nginx -t

# Reiniciar
systemctl restart nginx
```

## Comandos Útiles

### Ver logs del servidor
```bash
tail -f /var/log/boda.log
```

### Monitorear eventos en tiempo real
```bash
tail -f /var/log/boda.log | grep -E "\[TOKEN\]|\[IMAGE\]|\[AUTH\]"
```

### Reiniciar servicios
```bash
# Reiniciar Node.js
systemctl restart boda

# Reiniciar Nginx
systemctl restart nginx

# Reiniciar ambos
systemctl restart boda nginx
```

### Verificar estado
```bash
systemctl status boda
systemctl status nginx
```

### Ver estadísticas de acceso
```bash
grep "\[IMAGE\]" /var/log/boda.log | wc -l     # Total imágenes servidas
grep "\[TOKEN\]" /var/log/boda.log | wc -l     # Total tokens generados
grep "\[AUTH\].*inválido" /var/log/boda.log | wc -l  # Intentos fallidos
```

## Seguridad

### Protecciones Implementadas

1. **Sistema de Tokens**
   - Tokens únicos por sesión (duración: 1 hora)
   - Validación por IP y User-Agent
   - Tokens vinculados a evento específico

2. **Bloqueo de Descargas**
   - Headers: `Content-Disposition: inline`
   - No cacheable localmente
   - Sin clic derecho
   - Sin arrastrar imágenes
   - DevTools deshabilitadas

3. **Rate Limiting**
   - 100 requests por 15 minutos por IP
   - Válido para API y assets

4. **CSP (Content Security Policy)**
   - Solo scripts locales
   - Solo estilos locales
   - Solo imágenes locales
   - Sin iframes

5. **HTTPS + HSTS**
   - TLS 1.2/1.3
   - HSTS por 1 año

### Monitoreo de Seguridad

```bash
# Ver intentos de acceso no autorizado
grep "\[AUTH\].*inválido\|Token no encontrado" /var/log/boda.log

# Ver User-Agents bloqueados
grep "Bloqueado User-Agent" /var/log/boda.log

# Ver intentos de directory traversal
grep "\[SECURITY\]" /var/log/boda.log
```

## Troubleshooting

### El evento no carga imágenes

1. Verificar que existe la carpeta `/opt/eventos/evento-id/images/`
2. Verificar nombres de archivo: deben ser `fotoXXXX.webp` (mínimo 4 dígitos)
3. Revisar logs: `grep evento-id /var/log/boda.log`

### DNS no se propaga

1. Verificar registro en Cloudflare (debe ser "DNS Only", no proxied)
2. Esperar 10-15 minutos
3. Limpiar cache DNS: `sudo systemctl restart systemd-resolved`

### SSL/TLS no funciona

1. Verificar: `certbot certificates`
2. Renovar si es necesario: `certbot renew`
3. Verificar path en Nginx: `/etc/letsencrypt/live/dominio/`

### Servidor Node.js crash

```bash
# Ver logs detallados
journalctl -u boda -n 50

# Reiniciar
systemctl restart boda

# Ver estado
systemctl status boda
```

## Mantenimiento

### Renovar certificados automáticamente

El servidor ya incluye renovación automática con systemd:

```bash
# Verificar timer
systemctl status certbot.timer

# Ver próximas renovaciones
certbot certificates
```

### Actualizar scripts de galería

Si actualizas `auth.js` o `gallery.js` en el backend:

```bash
# Copiar a todos los eventos
cp /opt/boda-francisco-rossy/public/js/auth.js /opt/eventos/*/public/js/
cp /opt/boda-francisco-rossy/public/js/gallery.js /opt/eventos/*/public/js/
```

### Limpiar logs antiguos

```bash
# Rotar manualmente
truncate -s 0 /var/log/boda.log

# O configurar logrotate automático
cat > /etc/logrotate.d/boda << 'EOF'
/var/log/boda.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0644 root root
    sharedscripts
    postrotate
        systemctl reload boda > /dev/null 2>&1 || true
    endscript
}
EOF
```

## Información de la IP del VPS

**IP Pública:** `74.208.166.234`

Usa esta IP en todos los registros DNS de Cloudflare.

## Información de Contacto

Para soportar múltiples eventos:
- Backend: `/opt/boda-francisco-rossy/server.js`
- Eventos: `/opt/eventos/`
- Logs: `/var/log/boda.log`
- Nginx: `/etc/nginx/sites-available/eventos`
