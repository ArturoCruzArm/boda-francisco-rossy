# Boda de Francisco y Rossy - Selector de Fotos

Sitio web para que los novios puedan seleccionar las fotos de su boda que desean imprimir, ampliar o compartir en redes sociales.

## 🎯 Características

- **Selector de fotos interactivo** con categorías:
  - 🖼️ Ampliación (recomendado: 1 foto)
  - 📸 Impresión (recomendado: 80 fotos)
  - 📱 Redes Sociales (sin límite)

- **Video de la boda** integrado desde YouTube
- **Sugerencias de cambios** para fotos y video
- **Protección anti-descarga** de fotos y video
- **Diseño responsivo** para móviles y tablets
- **Almacenamiento local** de selecciones
- **Exportación** de reporte en JSON

## 🛠️ Tecnologías

- HTML5 / CSS3 / JavaScript
- Imágenes en formato WebP (comprimidas)
- Google Fonts (Playfair Display, Great Vibes, Lato)
- LocalStorage para persistencia

## 📂 Estructura del Proyecto

```
boda-francisco-rossy/
├── index.html              # Página principal (opcional)
├── selector.html           # Selector de fotos
├── css/
│   ├── selector.css        # Estilos del selector
│   └── proteccion.css      # Estilos de protección
├── js/
│   ├── selector.js         # Lógica del selector
│   └── proteccion.js       # Protección anti-descarga
├── images/
│   ├── foto0001.webp       # Fotos comprimidas
│   ├── foto0002.webp
│   └── ...
├── compress_photos.py      # Script para comprimir fotos
├── favicon.svg             # Icono del sitio
└── README.md               # Este archivo
```

## 🖼️ Preparación de Fotos

### 1. Colocar fotos originales

Crea una carpeta llamada `fotos_originales` y coloca todas las fotos originales allí:

```bash
mkdir fotos_originales
# Copiar fotos a esta carpeta
```

### 2. Instalar Pillow (si no está instalado)

```bash
pip install Pillow
```

### 3. Comprimir fotos a WebP

```bash
python compress_photos.py ./fotos_originales 80
```

El script:
- Convertirá todas las fotos a formato WebP
- Las comprimirá con calidad 80 (ajustable)
- Las guardará en `images/` como foto0001.webp, foto0002.webp, etc.
- Mostrará estadísticas de reducción de tamaño

## 🚀 Despliegue

### GitHub Pages

1. Crear repositorio en GitHub
2. Subir archivos
3. Activar GitHub Pages desde la configuración del repositorio
4. El sitio estará disponible en: `https://[usuario].github.io/boda-francisco-rossy`

### Hosting personalizado

Simplemente sube todos los archivos a tu servidor web. El sitio es 100% estático.

## 📱 Uso

1. Abre `selector.html` en el navegador
2. Haz clic en cada foto para categorizarla
3. Usa los filtros para ver fotos por categoría
4. Agrega sugerencias de cambios para fotos y video
5. Descarga el reporte y envíalo por WhatsApp al 4779203776

## 🔒 Protección

El sitio incluye múltiples capas de protección anti-descarga:
- Bloqueo de clic derecho en imágenes e iframes
- Desactivación de arrastrar imágenes
- Bloqueo de atajos de teclado (Ctrl+S, F12, etc.)
- Protección de iframes (video)
- Prevención de inspección de elementos

## 📄 Licencia

© 2025 Producciones Foro 7 - Todos los derechos reservados

---

**Contacto:** 477-920-3776
**Servicios:** Fotografía, Video, Dron e Invitaciones Web
