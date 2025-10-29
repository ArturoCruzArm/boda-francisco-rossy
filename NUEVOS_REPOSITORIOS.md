# 📦 Guía para Nuevos Repositorios - Galería Segura

Instrucciones completas para crear y desplegar nuevos eventos en el sistema.

---

## 🎯 Guía Rápida (5 pasos)

### 1️⃣ Preparar Fotos Localmente

```bash
# Crear carpeta para el evento
mkdir evento-quince
cd evento-quince

# Crear subcarpeta de imágenes
mkdir images

# Copiar fotos originales
cp /ruta/fotos/*.jpg images/

# (Opcional) Convertir a WebP
for f in images/*.jpg; do
  magick "$f" "images/$(basename ${f%.jpg}).webp"
done

# Renombrar todas las fotos al patrón correcto
python3 << 'EOF'
import os
import glob

os.chdir('images')
files = sorted(glob.glob('*.webp')) or sorted(glob.glob('*.jpg'))
for i, file in enumerate(files, 1):
    new_name = f"foto{i:04d}.{file.split('.')[-1]}"
    os.rename(file, new_name)
    print(f"✓ {file} → {new_name}")
EOF
```

### 2️⃣ Crear Repositorio Git

```bash
# Desde el directorio del evento
git init
git add images/
git commit -m "Fotos del evento quince"
git remote add origin https://github.com/tu-usuario/evento-quince.git
git push -u origin main
```

### 3️⃣ Desplegar en VPS

```bash
# En el VPS
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/tu-usuario/evento-quince evento-quince
```

### 4️⃣ Configurar Cloudflare

Dashboard Cloudflare → invitados.org → DNS → Crear registro:
```
Tipo:   A
Nombre: evento-quince
Valor:  74.208.166.234
Proxy:  OFF (DNS Only)
```

### 5️⃣ Esperar y Acceder

Espera 5-10 minutos, luego accede a:
```
https://evento-quince.invitados.org
```

---

## 📋 Checklist Detallado

### Fase 1: Preparación de Fotos

- [ ] Fotos en formato WebP o JPG/PNG
- [ ] Máximo 50 MB por foto
- [ ] Nombradas: foto0001.webp, foto0002.webp, etc
- [ ] Guardadas en carpeta `images/`
- [ ] Mínimo 10 fotos, máximo 1000

### Fase 2: Estructura del Repositorio

```
evento-quince/
├── images/
│   ├── foto0001.webp
│   ├── foto0002.webp
│   ├── foto0003.webp
│   └── ... (todas renombradas)
├── .gitignore (opcional)
└── README.md (opcional)
```

- [ ] Carpeta `images/` creada
- [ ] Todas las fotos renombradas correctamente
- [ ] README.md con descripción del evento (opcional)
- [ ] .gitignore configurado (opcional)

### Fase 3: Repositorio Git

- [ ] Repositorio inicializado (`git init`)
- [ ] Archivos agregados (`git add .`)
- [ ] Commit creado (`git commit`)
- [ ] Remote configurado (`git remote add origin`)
- [ ] Push realizado (`git push -u origin main`)
- [ ] Repositorio visible en GitHub/GitLab

### Fase 4: Despliegue en VPS

- [ ] Script `deploy-event.sh` ejecutado
- [ ] Sin errores en la ejecución
- [ ] Carpeta creada en `/opt/eventos/evento-quince/`
- [ ] Fotos copiadas correctamente
- [ ] Servidor Node.js reiniciado

### Fase 5: Configuración Cloudflare

- [ ] Registro A creado en Cloudflare
- [ ] Proxy establecido a OFF (DNS Only)
- [ ] TTL en Auto
- [ ] Propagación completada (5-10 min)

### Fase 6: Verificación

- [ ] DNS resuelve correctamente: `nslookup evento-quince.invitados.org`
- [ ] HTTPS funciona: `curl -I https://evento-quince.invitados.org`
- [ ] Galería carga: Accede en navegador
- [ ] Fotos visibles: Haz clic en thumbnails

---

## 🖼️ Formatos y Especificaciones de Fotos

### Recomendado: WebP

```bash
# Convertir JPG a WebP
magick foto.jpg -quality 80 foto.webp

# Convertir múltiples
for f in *.jpg; do
  magick "$f" -quality 80 "${f%.jpg}.webp"
done
```

**Ventajas:**
- 30-40% más pequeño que JPG
- Mejor calidad visual
- Carga más rápida
- Soportado en todos los navegadores modernos

### También Soportado: JPG/PNG

```bash
# JPG: Buena compresión
magick foto.png -quality 85 foto.jpg

# PNG: Sin pérdida (no recomendado para este uso)
# Usar solo si es necesario preservar transparencia
```

### Especificaciones Técnicas

| Aspecto | Recomendación |
|---------|---------------|
| **Formato** | WebP (preferido) o JPG |
| **Calidad** | 80-90 sobre 100 |
| **Resolución** | 1920x1080 o mayor |
| **Tamaño máximo** | 50 MB por foto |
| **Profundidad color** | RGB (no CMYK) |
| **Metadata** | Eliminar EXIF (privacidad) |

### Limpiar Metadata (Recomendado)

```bash
# Eliminar EXIF data
magick foto.jpg -strip foto.jpg

# Para múltiples archivos
for f in *.jpg; do
  magick "$f" -strip "${f}"
done
```

---

## 📁 Ejemplos de Estructura de Repositorio

### Ejemplo Mínimo (Recomendado)

```
evento-quince/
└── images/
    ├── foto0001.webp
    ├── foto0002.webp
    ├── foto0003.webp
    └── ... (hasta foto0XXX)
```

### Ejemplo Completo (Con personalización)

```
evento-quince/
├── images/
│   ├── foto0001.webp
│   ├── foto0002.webp
│   └── ...
├── css/
│   └── custom.css          (CSS personalizado - opcional)
├── js/
│   └── custom.js           (JS personalizado - opcional)
├── selector.html           (HTML personalizado - opcional)
├── README.md               (Descripción del evento)
└── .gitignore             (Archivos a ignorar)
```

---

## 🚀 Despliegue Paso a Paso

### Comando Completo

```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/usuario/evento-quince evento-quince
```

### Qué Hace el Script

1. ✅ Crea directorio: `/opt/eventos/evento-quince/`
2. ✅ Clona repositorio
3. ✅ Copia imágenes a `/opt/eventos/evento-quince/images/`
4. ✅ Crea estructura `public/`
5. ✅ Copia archivos HTML/CSS/JS personalizados (si existen)
6. ✅ Copia scripts de autenticación
7. ✅ Asigna permisos correctos
8. ✅ Reinicia Node.js

### Verificación Después del Despliegue

```bash
# Ver estructura creada
ls -la /opt/eventos/evento-quince/

# Ver imágenes
ls -la /opt/eventos/evento-quince/images/ | head -10

# Ver logs del despliegue
tail -50 /var/log/boda.log | grep evento-quince

# Verificar permisos
ls -la /opt/eventos/evento-quince/
```

---

## 🔧 Configuración Avanzada

### Personalizar HTML

Crea `selector.html` en la raíz del repositorio:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evento Quince - Galería</title>
    <link rel="stylesheet" href="/css/selector.css">
    <link rel="stylesheet" href="/css/custom.css"> <!-- Tu CSS -->
</head>
<body>
    <div id="gallery" class="loading">Cargando galería...</div>
    <div id="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <img id="modal-image" src="" alt="">
            <div class="modal-controls">
                <span class="prev">&larr;</span>
                <div class="image-counter">
                    <span id="image-current">1</span> / <span id="image-total">1</span>
                </div>
                <span class="next">&rarr;</span>
            </div>
        </div>
    </div>

    <script src="/js/auth.js"></script>
    <script src="/js/gallery.js"></script>
    <script src="/js/custom.js"></script> <!-- Tu JS -->
</body>
</html>
```

### Personalizar CSS

Crea `css/custom.css`:

```css
/* Personaliza colores, fuentes, etc */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Arial', sans-serif;
}

header h1 {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

/* Más estilos personalizados */
```

### Personalizar JavaScript

Crea `js/custom.js`:

```javascript
// Scripts personalizados para tu evento
console.log('Evento Quince - Galería personalizada');

// Por ejemplo, agregar analytics, tracking, etc
```

---

## 📊 Monitoreo del Evento

### Ver Logs en Tiempo Real

```bash
# Logs generales
tail -f /var/log/boda.log

# Solo del evento específico
tail -f /var/log/boda.log | grep evento-quince

# Eventos específicos
grep "\[IMAGE\].*evento-quince" /var/log/boda.log
grep "\[TOKEN\].*evento-quince" /var/log/boda.log
```

### Estadísticas del Evento

```bash
# Total de imágenes servidas
grep "\[IMAGE\].*evento-quince" /var/log/boda.log | wc -l

# Total de tokens generados
grep "\[TOKEN\].*evento-quince" /var/log/boda.log | wc -l

# Intentos fallidos
grep "\[AUTH\].*inválido.*evento-quince" /var/log/boda.log | wc -l

# Usuarios únicos (aproximado)
grep "evento-quince" /var/log/boda.log | grep "\[TOKEN\]" | wc -l
```

---

## 🐛 Problemas Comunes y Soluciones

### Las fotos no aparecen

**Causa:** Fotos no renombradas correctamente

**Solución:**
```bash
cd /opt/eventos/evento-quince/images/
python3 << 'EOF'
import os
import glob

files = sorted(glob.glob('*'))
for i, file in enumerate(files, 1):
    ext = file.split('.')[-1].lower()
    new_name = f"foto{i:04d}.{ext}"
    if file != new_name:
        os.rename(file, new_name)
        print(f"{file} → {new_name}")
EOF

systemctl restart boda
```

### DNS no propaga

**Causa:** Cloudflare Proxy está en ON (naranja)

**Solución:**
1. Ve a Cloudflare Dashboard
2. DNS → Registros
3. Haz clic en la nube del registro
4. Cámbiala a gris (DNS Only)
5. Espera 10-15 minutos

### HTTPS no funciona

**Causa:** Certificado no generado para el nuevo dominio

**Solución:**
```bash
# El certificado wildcard ya cubre *.invitados.org
# Si aún no funciona, fuerza renovación:
certbot renew --force-renewal

# Reinicia Nginx
systemctl restart nginx
```

### Node.js se cuelga

**Causa:** Demasiados eventos o imágenes

**Solución:**
```bash
# Reinicia el servicio
systemctl restart boda

# Ver detalles del error
journalctl -u boda -n 100

# Aumentar memoria (si es necesario)
systemctl edit boda
# Agregar: MemoryLimit=2G
```

---

## ✅ Checklist Final Antes de Lanzar

- [ ] Fotos renombradas correctamente (foto0001.webp, etc)
- [ ] Mínimo 10 fotos disponibles
- [ ] Repositorio Git creado y pusheado
- [ ] Script deploy-event.sh ejecutado sin errores
- [ ] Registro DNS creado en Cloudflare (Proxy: OFF)
- [ ] DNS propagó (nslookup muestra 74.208.166.234)
- [ ] HTTPS funciona (curl -I devuelve 200 o 403)
- [ ] Galería carga en navegador
- [ ] Se ven las miniaturas
- [ ] Las fotos se abren al hacer clic
- [ ] Navegación funciona (flechas)
- [ ] Modal se cierra (ESC o clic afuera)

---

## 📞 Contacto y Soporte

**Documentación:** `/opt/boda-francisco-rossy/`
**Logs:** `/var/log/boda.log`
**Comando despliegue:** `/opt/boda-francisco-rossy/deploy-event.sh`

¿Problemas? Revisa los logs:
```bash
tail -100 /var/log/boda.log | grep -i error
```

---

**¡Listo para crear tu evento?** 🎉

```bash
cd /opt/boda-francisco-rossy
./deploy-event.sh https://github.com/tu-usuario/evento-quince evento-quince
```
