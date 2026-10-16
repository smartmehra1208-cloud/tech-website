@echo off
title Deploy KioraTech to Vercel
echo ========================================================
echo         KIORATECH - VERCEL 1-CLICK DEPLOYMENT
echo ========================================================
echo.
echo Starting Vercel deployment...
echo (If this is your first time, Vercel will open your browser to log in)
echo.
npx vercel --prod
echo.
pause
