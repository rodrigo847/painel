@echo off
echo ========================================
echo   INICIANDO SISTEMA DE SENHAS
echo ========================================
echo.

REM Iniciar servidor de impressao em segundo plano
echo [1/2] Iniciando servidor de impressao...
start "Servidor de Impressao" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul

REM Iniciar frontend
echo [2/2] Iniciando frontend...
start "Frontend - Painel de Senhas" cmd /k "npm run dev"

echo.
echo ========================================
echo   SISTEMA INICIADO!
echo ========================================
echo.
echo Servidor de Impressao: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
