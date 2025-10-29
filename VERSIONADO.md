# Sistema de Versionado

## 📦 ¿Qué es?

Sistema para forzar la recarga de archivos JS y CSS cuando se actualizan, evitando problemas de caché del navegador.

## 🔢 Esquema de Versiones

Usamos **Semantic Versioning**: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x): Cambios grandes que rompen compatibilidad
- **MINOR** (x.1.x): Nuevas características sin romper nada
- **PATCH** (x.x.1): Corrección de bugs pequeños

**Versión Actual:** `1.1.0`

## 📝 Cómo Actualizar Versión

### Paso 1: Editar `version.js`

```javascript
const APP_VERSION = {
    major: 1,
    minor: 1,    // ← Cambiar este número
    patch: 0,

    // Actualizar timestamp (formato: YYYYMMDD-NNN)
    get timestamp() {
        return '20251029-002'; // ← Incrementar el contador
    }
};
```

### Paso 2: Actualizar `selector.html`

Cambiar todas las versiones `?v=` en:
- CSS (líneas 9-11)
- Scripts (líneas 221-225)

**Ejemplo:**
```html
<!-- Antes -->
<script src="js/selector.js?v=1.1.0"></script>

<!-- Después -->
<script src="js/selector.js?v=1.2.0"></script>
```

### Paso 3: Commit y Push

```bash
git add version.js selector.html
git commit -m "Actualizar versión a 1.2.0"
git push
```

## 🎯 Cuándo Actualizar Cada Número

### MAJOR (x.0.0)
- Cambios de diseño completo
- Estructura completamente nueva
- Funcionalidades que ya no son compatibles

**Ejemplo:** Cambiar de selector simple a sistema con login

### MINOR (x.x.0)
- Agregar nueva funcionalidad
- Agregar nuevo componente
- Mejoras importantes

**Ejemplo:**
- ✅ Agregar reproductor de música → `1.0.0` → `1.1.0`
- ✅ Agregar sistema de comentarios → `1.1.0` → `1.2.0`

### PATCH (x.x.x)
- Corrección de bugs
- Ajustes pequeños de CSS
- Mejoras de rendimiento

**Ejemplo:**
- ✅ Corregir color de botón → `1.1.0` → `1.1.1`
- ✅ Arreglar error de consola → `1.1.1` → `1.1.2`

## 📋 Historial de Versiones

### v1.1.0 (2025-10-29)
- ✨ Agregado reproductor de música automático
- 🎵 Canción: "Hoy me siento tan afortunada"
- 🎨 Controles flotantes elegantes
- 📱 Diseño responsive

### v1.0.0 (2025-10-29)
- 🎉 Versión inicial
- 📸 Selector de 300 fotos
- 🖼️ Sistema de categorías (Ampliación, Impresión, Redes)
- 💾 Guardado en localStorage
- 🎥 Video de YouTube integrado
- 💬 Sistema de sugerencias
- 🔒 Protección anti-descarga

## 🚀 Script Rápido de Actualización

Para actualizar rápidamente SOLO el número PATCH:

```bash
# Incrementar de 1.1.0 a 1.1.1
# 1. Buscar y reemplazar en selector.html:
#    v=1.1.0  →  v=1.1.1

# 2. Actualizar version.js:
#    patch: 0  →  patch: 1
#    timestamp: '20251029-001'  →  '20251029-002'

# 3. Commit
git add version.js selector.html
git commit -m "Bump version to 1.1.1"
git push
```

## ⚠️ Importante

1. **SIEMPRE** actualizar `version.js` primero
2. **TODAS** las referencias `?v=` deben tener la misma versión
3. **INCREMENTAR** el timestamp cada vez que hagas cambios
4. **NO OLVIDAR** hacer push después de actualizar

## 🔍 Verificar Versión Actual

Abre la consola del navegador (F12) y verás:

```
╔════════════════════════════════════════╗
║  Selector de Fotos - Boda             ║
║  Francisco & Rossy                     ║
║                                        ║
║  Versión: 1.1.0                       ║
║  Build: 20251029-001                  ║
╚════════════════════════════════════════╝
```

También puedes ejecutar en consola:
```javascript
APP_VERSION.full  // "1.1.0"
APP_VERSION.timestamp  // "20251029-001"
```

## 💡 Consejos

- 📝 Documenta cada cambio de versión en este archivo
- 🏷️ Usa tags de git para versiones importantes: `git tag v1.1.0`
- 🔄 Actualiza versión ANTES de hacer cambios importantes
- 📢 Comunica cambios de MAJOR version a los usuarios

---

**Última actualización:** 2025-10-29
**Versión del sistema:** 1.1.0
