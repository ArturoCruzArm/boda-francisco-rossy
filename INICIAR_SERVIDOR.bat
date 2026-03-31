@echo off
echo ================================================
echo    SERVIDOR WEB - Boda Francisco y Rossy
echo ================================================
echo.
echo Iniciando servidor web local en puerto 8000...
echo.
echo Una vez iniciado, abre tu navegador en:
echo   http://localhost:8000/selector.html
echo.
echo Presiona Ctrl+C para detener el servidor
echo ================================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
