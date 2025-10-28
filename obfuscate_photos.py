# -*- coding: utf-8 -*-
"""
Script para ofuscar nombres de fotos
Genera nombres aleatorios y crea un mapa de correspondencia
"""
import os
import json
import hashlib
import shutil
from pathlib import Path

def generate_hash(index):
    """Genera un hash único para cada foto basado en su índice"""
    # Usamos hash + salt para que sea impredecible
    salt = "francisco_rossy_boda_2025"
    input_str = f"{salt}_{index}"
    hash_obj = hashlib.sha256(input_str.encode())
    # Tomamos los primeros 8 caracteres del hash
    return hash_obj.hexdigest()[:8]

def obfuscate_photos():
    """Renombra todas las fotos con nombres ofuscados"""

    images_dir = Path("images")

    if not images_dir.exists():
        print("Error: No se encontro la carpeta 'images'")
        return

    # Crear mapeo
    photo_map = {}

    print("Generando nombres ofuscados para 300 fotos...")

    # Primero, crear el mapeo
    for i in range(1, 301):
        old_name = f"foto{str(i).zfill(4)}.webp"
        new_name = f"{generate_hash(i)}.webp"
        photo_map[i-1] = new_name  # índice base 0

    # Guardar el mapeo en un archivo JSON
    map_file = images_dir / "photo_map.json"
    with open(map_file, 'w', encoding='utf-8') as f:
        json.dump(photo_map, f, indent=2, ensure_ascii=False)

    print(f"Mapa creado: {map_file}")

    # Renombrar archivos en dos pasos para evitar conflictos
    # Paso 1: Renombrar a temporales
    print("\nPaso 1: Renombrando a temporales...")
    for i in range(1, 301):
        old_path = images_dir / f"foto{str(i).zfill(4)}.webp"
        temp_path = images_dir / f"temp_{i}.webp"

        if old_path.exists():
            shutil.move(str(old_path), str(temp_path))
            if i % 50 == 0:
                print(f"   Procesadas {i}/300 fotos...")

    # Paso 2: Renombrar de temporales a ofuscados
    print("\nPaso 2: Aplicando nombres ofuscados...")
    for i in range(1, 301):
        temp_path = images_dir / f"temp_{i}.webp"
        new_name = photo_map[i-1]
        new_path = images_dir / new_name

        if temp_path.exists():
            shutil.move(str(temp_path), str(new_path))
            if i % 50 == 0:
                print(f"   Procesadas {i}/300 fotos...")

    print("\nOfuscacion completada!")
    print(f"   - 300 fotos renombradas")
    print(f"   - Mapa guardado en: images/photo_map.json")
    print("\nEjemplos de nombres nuevos:")
    for i in range(5):
        print(f"   Foto {i+1}: {photo_map[i]}")
    print("   ...")

if __name__ == "__main__":
    print("="*60)
    print("OFUSCADOR DE FOTOS - Boda Francisco y Rossy")
    print("="*60)
    print()

    obfuscate_photos()

    print("\n" + "="*60)
    print("IMPORTANTE: Guarda el archivo photo_map.json")
    print("   Es necesario para que el sitio funcione")
    print("="*60)
