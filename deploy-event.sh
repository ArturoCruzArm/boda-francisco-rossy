#!/bin/bash

# Script para desplegar nuevos eventos de forma fácil

set -e

if [ $# -lt 2 ]; then
    echo "Uso: $0 <repo-url> <event-id>"
    echo ""
    echo "Ejemplos:"
    echo "  $0 https://github.com/user/boda-santiago evento-santiago"
    echo "  $0 https://github.com/user/quince-lucia evento-quince"
    exit 1
fi

REPO_URL=$1
EVENT_ID=$2
EVENTS_DIR="/opt/eventos"
EVENT_PATH="$EVENTS_DIR/$EVENT_ID"

echo "=========================================="
echo "Desplegando evento: $EVENT_ID"
echo "Repo: $REPO_URL"
echo "=========================================="

# Crear directorio del evento si no existe
if [ ! -d "$EVENT_PATH" ]; then
    echo "✓ Creando directorio: $EVENT_PATH"
    mkdir -p "$EVENT_PATH"
else
    echo "✗ El evento ya existe en: $EVENT_PATH"
    exit 1
fi

# Clonar repositorio
echo "↓ Clonando repositorio..."
git clone "$REPO_URL" "$EVENT_PATH/repo"

# Copiar imágenes y estructura
echo "✓ Copiando estructura..."

# Copiar directorio de imágenes si existe
if [ -d "$EVENT_PATH/repo/images" ]; then
    mkdir -p "$EVENT_PATH/images"
    cp "$EVENT_PATH/repo/images"/* "$EVENT_PATH/images/" 2>/dev/null || true
    echo "✓ Imágenes copiadas"
fi

# Crear directorio public con archivos base
mkdir -p "$EVENT_PATH/public/js"
mkdir -p "$EVENT_PATH/public/css"

# Copiar CSS si existe
if [ -d "$EVENT_PATH/repo/css" ]; then
    cp "$EVENT_PATH/repo/css"/* "$EVENT_PATH/public/css/" 2>/dev/null || true
fi

# Copiar JS si existe
if [ -d "$EVENT_PATH/repo/js" ]; then
    cp "$EVENT_PATH/repo/js"/* "$EVENT_PATH/public/js/" 2>/dev/null || true
fi

# Copiar HTML si existe
if [ -f "$EVENT_PATH/repo/selector.html" ]; then
    cp "$EVENT_PATH/repo/selector.html" "$EVENT_PATH/public/index.html"
elif [ -f "$EVENT_PATH/repo/index.html" ]; then
    cp "$EVENT_PATH/repo/index.html" "$EVENT_PATH/public/index.html"
fi

# Copiar los archivos de autenticación y galería del backend
echo "✓ Instalando scripts de autenticación..."
cp /opt/boda-francisco-rossy/public/js/auth.js "$EVENT_PATH/public/js/"
cp /opt/boda-francisco-rossy/public/js/gallery.js "$EVENT_PATH/public/js/"

# Asignar permisos
echo "✓ Asignando permisos..."
chown -R root:root "$EVENT_PATH"
chmod -R 755 "$EVENT_PATH"

echo ""
echo "=========================================="
echo "✓ Evento desplegado exitosamente"
echo "=========================================="
echo ""
echo "Detalles del evento:"
echo "  Ruta: $EVENT_PATH"
echo "  ID: $EVENT_ID"
echo "  Imágenes: $EVENT_PATH/images"
echo "  Frontend: $EVENT_PATH/public"
echo ""
echo "Próximos pasos:"
echo "1. Configura el dominio en Cloudflare:"
echo "   - Tipo: A"
echo "   - Nombre: $EVENT_ID.rossy-francisco.invitados.org"
echo "   - Valor: 74.208.166.234"
echo "   - Proxy: OFF (DNS Only)"
echo ""
echo "2. Espera 5-10 minutos para que se propague el DNS"
echo ""
echo "3. El servidor automáticamente servirá:"
echo "   https://$EVENT_ID.rossy-francisco.invitados.org"
echo ""
