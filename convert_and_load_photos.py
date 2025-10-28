# -*- coding: utf-8 -*-
"""
Script para convertir y cargar fotos de la carpeta fuente
"""
import os
from pathlib import Path
from PIL import Image
import shutil

# Configuración
SOURCE_DIR = Path(r"F:\2025\10\25\IMG\SI\SI\SI\editada\zips\descomprimidas")
DEST_DIR = Path("images")
QUALITY = 85  # Calidad de compresión WebP

def convert_to_webp(source_path, dest_path, quality=85):
    """Convierte una imagen a formato WebP"""
    try:
        with Image.open(source_path) as img:
            # Convertir a RGB si es necesario
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')

            # Guardar como WebP
            img.save(dest_path, 'WEBP', quality=quality, method=6)

        return True
    except Exception as e:
        print(f"Error convirtiendo {source_path}: {e}")
        return False

def main():
    print("="*60)
    print("CONVERSOR Y CARGADOR DE FOTOS - Boda Francisco y Rossy")
    print("="*60)
    print()

    # Verificar carpeta fuente
    if not SOURCE_DIR.exists():
        print(f"Error: No se encontro la carpeta: {SOURCE_DIR}")
        return

    # Crear carpeta destino si no existe
    DEST_DIR.mkdir(exist_ok=True)

    # Obtener lista de archivos JPG
    jpg_files = sorted(SOURCE_DIR.glob("foto7_*.jpg"))
    total_files = len(jpg_files)

    print(f"Archivos encontrados: {total_files}")
    print()

    if total_files == 0:
        print("No se encontraron archivos foto7_*.jpg")
        return

    # Limpiar carpeta destino (eliminar fotos antiguas)
    print("Limpiando carpeta de imagenes...")
    for old_file in DEST_DIR.glob("*.webp"):
        old_file.unlink()

    # Eliminar photo_map.json antiguo si existe
    old_map = DEST_DIR / "photo_map.json"
    if old_map.exists():
        old_map.unlink()

    print("Carpeta limpiada.\n")

    # Convertir archivos
    print(f"Convirtiendo {total_files} fotos a WebP (calidad {QUALITY})...")
    print()

    converted = 0
    total_size_before = 0
    total_size_after = 0

    for idx, source_file in enumerate(jpg_files, 1):
        # Nombre destino temporal (sin ofuscar todavía)
        dest_file = DEST_DIR / f"foto{str(idx).zfill(4)}.webp"

        # Tamaño original
        size_before = source_file.stat().st_size
        total_size_before += size_before

        # Convertir
        if convert_to_webp(source_file, dest_file, QUALITY):
            size_after = dest_file.stat().st_size
            total_size_after += size_after
            reduction = ((size_before - size_after) / size_before) * 100
            converted += 1

            if idx % 50 == 0 or idx == total_files:
                print(f"Procesadas {idx}/{total_files} fotos...")

    print()
    print("="*60)
    print("CONVERSION COMPLETADA")
    print("="*60)
    print(f"Fotos convertidas: {converted}/{total_files}")
    print(f"Tamano original: {total_size_before / (1024*1024):.2f} MB")
    print(f"Tamano comprimido: {total_size_after / (1024*1024):.2f} MB")
    print(f"Reduccion total: {((total_size_before - total_size_after) / total_size_before) * 100:.1f}%")
    print()
    print("SIGUIENTE PASO: Ejecuta obfuscate_photos.py para ofuscar los nombres")
    print("="*60)

if __name__ == "__main__":
    main()
