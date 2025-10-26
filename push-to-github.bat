@echo off
echo ========================================
echo Subiendo cambios a GitHub
echo ========================================
echo.

git add .
git status

echo.
echo Presiona Enter para continuar con el commit o Ctrl+C para cancelar
pause

git commit -m "Actualizar fotos y selector"
git push

echo.
echo ========================================
echo Cambios subidos exitosamente!
echo ========================================
pause
