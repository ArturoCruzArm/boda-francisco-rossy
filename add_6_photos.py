# -*- coding: utf-8 -*-
"""
Script para agregar las 6 fotos adicionales
"""
from pathlib import Path
from PIL import Image

# Configuración
SOURCE_DIR = Path(r"F:\2025\10\25\IMG\SI\SI\NO\SI\SI\SI")
DEST_DIR = Path("images")
QUALITY = 85

def convert_to_webp(source_path, dest_path, quality=85):
    """Convierte una imagen a formato WebP"""
    try:
        with Image.open(source_path) as img:
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            img.save(dest_path, 'WEBP', quality=quality, method=6)
        return True
    except Exception as e:
        print(f"Error convirtiendo {source_path}: {e}")
        return False

def main():
    print("="*60)
    print("AGREGANDO 6 FOTOS ADICIONALES")
    print("="*60)

    # Obtener las 6 fotos
    jpg_files = sorted(SOURCE_DIR.glob("DSC_*.JPG"))

    if len(jpg_files) != 6:
        print(f"Error: Se esperaban 6 fotos, se encontraron {len(jpg_files)}")
        return

    print(f"Fotos encontradas: {len(jpg_files)}")
    print()

    # Convertir las 6 fotos como foto0295 a foto0300
    total_size_before = 0
    total_size_after = 0

    for idx, source_file in enumerate(jpg_files, 295):
        dest_file = DEST_DIR / f"foto{str(idx).zfill(4)}.webp"

        print(f"Convirtiendo {source_file.name} -> {dest_file.name}")

        size_before = source_file.stat().st_size
        total_size_before += size_before

        if convert_to_webp(source_file, dest_file, QUALITY):
            size_after = dest_file.stat().st_size
            total_size_after += size_after

    print()
    print("="*60)
    print("AGREGADAS 6 FOTOS")
    print("="*60)
    print(f"Tamano original: {total_size_before / (1024*1024):.2f} MB")
    print(f"Tamano comprimido: {total_size_after / (1024*1024):.2f} MB")
    print(f"Reduccion: {((total_size_before - total_size_after) / total_size_before) * 100:.1f}%")
    print()
    print("Total de fotos ahora: 300")
    print("="*60)

if __name__ == "__main__":
    main()
