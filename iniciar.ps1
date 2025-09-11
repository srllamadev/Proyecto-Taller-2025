#!/bin/bash

# Script de inicio rápido para el Sistema de Administración de Edificio
# Para Windows PowerShell

Write-Host "🏢 Iniciando Sistema de Administración de Edificio..." -ForegroundColor Green
Write-Host ""

# Verificar si Python está instalado
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Python detectado: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Python no encontrado. Por favor instale Python 3.7 o superior." -ForegroundColor Red
    exit 1
}

# Cambiar al directorio backend
Set-Location backend

# Instalar dependencias si no están instaladas
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
$pipList = pip list 2>&1
if ($pipList -notmatch "Flask") {
    Write-Host "📥 Instalando dependencias..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

# Iniciar el servidor Flask
Write-Host ""
Write-Host "🚀 Iniciando servidor Flask..." -ForegroundColor Cyan
Write-Host "📍 Backend disponible en: http://localhost:5000" -ForegroundColor White
Write-Host "🌐 Frontend: Abra frontend/index.html en su navegador" -ForegroundColor White
Write-Host ""
Write-Host "Para detener el servidor, presione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

python app.py
