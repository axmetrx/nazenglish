@echo off
echo.
echo  ============================================
echo   EnglishClass — Запуск платформы
echo  ============================================
echo.

:: Обновляем PATH для Node.js
set "PATH=%PATH%;C:\Program Files\nodejs"

echo  [1/2] Запуск бэкенда (порт 5000)...
start "EnglishClass Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 2 /nobreak >nul

echo  [2/2] Запуск фронтенда (порт 5173)...
start "EnglishClass Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo  ✅ Платформа запускается!
echo.
echo  🌐 Откройте в браузере: http://localhost:5173
echo  🔧 API бэкенд:          http://localhost:5000/api/health
echo.
echo  📌 Для учителя:         http://localhost:5173/admin/login
echo  📌 Для ученика:         http://localhost:5173
echo.
pause
