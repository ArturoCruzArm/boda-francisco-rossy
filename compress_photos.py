#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para comprimir fotos a formato WebP para la boda de Francisco y Rossy.

Uso:
    python compress_photos.py [carpeta_origen] [calidad]

Argumentos:
    carpeta_origen: Carpeta con las fotos originales (por defecto: ./fotos_originales)
    calidad: Calidad de compresión 1-100 (por defecto: 80)

Ejemplo:
    python compress_photos.py ./mis_fotos 85
"""

import os
import sys
from pathlib import Path
from PIL import Image

# Configurar salida UTF-8 para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def comprimir_imagenes(carpeta_origen, carpeta_destino, calidad=80):
    """
    Comprime imágenes a formato WebP.

    Args:
        carpeta_origen: Ruta de la carpeta con imágenes originales
        carpeta_destino: Ruta donde se guardarán las imágenes WebP
        calidad: Calidad de compresión (1-100)
    """
    # Crear carpeta de destino si no existe
    Path(carpeta_destino).mkdir(parents=True, exist_ok=True)

    # Extensiones de imagen soportadas
    extensiones = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'}

    # Obtener lista de archivos de imagen
    archivos = []
    for ext in extensiones:
        archivos.extend(Path(carpeta_origen).glob(f'*{ext}'))
        archivos.extend(Path(carpeta_origen).glob(f'*{ext.upper()}'))

    # Ordenar archivos
    archivos.sort()

    if not archivos:
        print(f"⚠️  No se encontraron imágenes en {carpeta_origen}")
        print(f"   Extensiones buscadas: {', '.join(extensiones)}")
        return

    print(f"📸 Encontradas {len(archivos)} imágenes")
    print(f"🔧 Calidad de compresión: {calidad}%")
    print(f"📁 Carpeta destino: {carpeta_destino}")
    print()

    total_original = 0
    total_comprimido = 0

    for i, archivo in enumerate(archivos, 1):
        try:
            # Abrir imagen
            img = Image.open(archivo)

            # Convertir a RGB si es necesario (WebP no soporta todos los modos)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Si tiene transparencia, mantenerla
                if img.mode == 'P':
                    img = img.convert('RGBA')
                # Para WebP con alpha
                save_mode = img.mode
            else:
                img = img.convert('RGB')
                save_mode = 'RGB'

            # Nombre de archivo destino
            nombre_destino = f"foto{i:04d}.webp"
            ruta_destino = Path(carpeta_destino) / nombre_destino

            # Tamaño original
            tamano_original = archivo.stat().st_size

            # Guardar como WebP
            img.save(
                ruta_destino,
                'WEBP',
                quality=calidad,
                method=6  # Método de compresión más lento pero mejor
            )

            # Tamaño comprimido
            tamano_comprimido = ruta_destino.stat().st_size

            # Calcular reducción
            reduccion = ((tamano_original - tamano_comprimido) / tamano_original) * 100

            # Acumular totales
            total_original += tamano_original
            total_comprimido += tamano_comprimido

            print(f"✅ [{i:3d}/{len(archivos)}] {archivo.name:30s} → {nombre_destino:15s} "
                  f"({tamano_original/1024:6.1f}KB → {tamano_comprimido/1024:6.1f}KB, "
                  f"reducción: {reduccion:5.1f}%)")

        except Exception as e:
            print(f"❌ Error procesando {archivo.name}: {e}")

    print()
    print("=" * 80)
    print(f"✨ Compresión completada!")
    print(f"   Total original:    {total_original/1024/1024:8.2f} MB")
    print(f"   Total comprimido:  {total_comprimido/1024/1024:8.2f} MB")
    print(f"   Reducción total:   {((total_original - total_comprimido) / total_original) * 100:6.1f}%")
    print(f"   Imágenes procesadas: {len(archivos)}")
    print("=" * 80)

def main():
    """Función principal."""
    # Obtener argumentos
    carpeta_origen = sys.argv[1] if len(sys.argv) > 1 else './fotos_originales'
    calidad = int(sys.argv[2]) if len(sys.argv) > 2 else 80

    # Validar calidad
    if not 1 <= calidad <= 100:
        print("❌ Error: La calidad debe estar entre 1 y 100")
        sys.exit(1)

    # Verificar que existe la carpeta origen
    if not Path(carpeta_origen).exists():
        print(f"❌ Error: No existe la carpeta {carpeta_origen}")
        print(f"   Crea la carpeta y coloca las fotos allí, o especifica otra carpeta.")
        sys.exit(1)

    # Carpeta destino
    carpeta_destino = './images'

    print()
    print("=" * 80)
    print("🖼️  COMPRESOR DE FOTOS PARA BODA - FRANCISCO Y ROSSY")
    print("=" * 80)
    print()

    # Comprimir imágenes
    comprimir_imagenes(carpeta_origen, carpeta_destino, calidad)

if __name__ == '__main__':
    main()
