@echo off
REM Double-click entry point for the catalogue pipeline (CATALOGUE.md §2).
REM
REM Drop photographs into catalogue\raw\ named <kategori-slug>_<parca-adi>_<nn>.jpg,
REM double-click this file, then open catalogue\contact-sheet.html.
REM
REM Flags pass straight through:  catalogue.bat --force   catalogue.bat --only kolye

cd /d "%~dp0"
node scripts\catalogue.mjs %*

echo.
pause
