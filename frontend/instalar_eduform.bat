@echo off
echo =====================================
echo INSTALADOR AUTOMATICO EDUFORM
echo =====================================

echo.
echo Instalando dependencias del BACKEND...
cd mi-plataforma\backend
npm install

echo.
echo Instalando dependencias del FRONTEND...
cd ..\..\mi-react-app
npm install

echo.
echo =====================================
echo INSTALACION COMPLETADA
echo =====================================
echo.

pause

