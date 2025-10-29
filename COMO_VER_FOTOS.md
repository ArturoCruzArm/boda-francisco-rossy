# 🖼️ Cómo Ver las Fotos y Videos

## Acceso a la Galería

### Desde navegador

1. Abre en tu navegador:
   ```
   https://rossy-francisco.invitados.org
   ```

2. El sistema automáticamente:
   - Genera un token de acceso
   - Carga las 300 fotos
   - Muestra la galería en grid

3. Haz clic en cualquier foto para ver a pantalla completa

### Características

✅ **Galería de 300 fotos**
- Grid responsive (se adapta a móvil/tablet)
- Carga automática al entrar
- Miniaturas de vista previa

✅ **Visualización a pantalla completa**
- Click en cualquier foto abre modal
- Navegación con flechas (← →)
- Navegación con teclado (arrow keys)
- Cerrar con ESC o clic afuera

✅ **Seguridad implementada**
- No se pueden descargar las fotos
- DevTools bloqueado
- No funciona clic derecho
- No se pueden arrastrar

✅ **Información de navegación**
- Contador: foto actual / total de fotos
- Ejemplo: "150 / 300"

## Próximas funcionalidades

- [ ] Videos (cuando se agreguen)
- [ ] Descarga de galería completa (en próximas actualizaciones)
- [ ] Compartir fotos (link privado)
- [ ] Impresión de fotos

## Solucionar problemas

### No se ven las fotos
- Recarga la página (F5)
- Limpia cache: Ctrl+Shift+Supr
- Verifica conexión a internet

### El modal no abre
- Usa un navegador moderno (Chrome, Firefox, Safari, Edge)
- Desactiva extensiones del navegador
- Intenta en modo incógnito

### Navegación lenta
- Las fotos se cargan bajo demanda
- Primera vez tarda más
- Descarga se optimiza con Cloudflare CDN

## Especificaciones técnicas

- **Formato**: WebP (comprimido)
- **Calidad**: Alta (80/100)
- **Total**: 300 fotos
- **Tamaño**: ~150 MB total
- **Nombres**: foto0001.webp a foto0300.webp

## Información de seguridad

El sistema cuenta con múltiples capas de protección:
- Tokens únicos por sesión (1 hora de validez)
- Validación por IP y User-Agent
- Headers CSP y X-Frame-Options
- Bloqueo de descarga directa
- DevTools deshabilitados
- HTTPS/TLS 1.3

---

**¿Necesitas ayuda?** Contacta al administrador del sistema.
