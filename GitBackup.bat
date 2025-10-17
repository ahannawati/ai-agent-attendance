@echo off
:: =====================================================
::  Git Auto-Backup Script for AI Agent Attendance
::  Author: Giok Han Anies
::  Version: 1.0
::  Description: Automatically commit & push workflow JSONs to GitHub
:: =====================================================

:: Change to your project folder
cd /d "C:\Users\User\Desktop\GitHubBackup"

:: Tell Git who you are (only needed first run)
git config --global user.name "ahannawati"
git config --global user.email "ahannawati@gmail.com"

:: Add all JSONs (or any changed files)
git add .

:: Create a timestamp for the commit message
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (set mydate=%%a-%%b-%%c)
for /f "tokens=1 delims= " %%a in ('time /t') do (set mytime=%%a)
set commitmsg=backup: Auto commit on %mydate%_%mytime%

:: Commit and push to GitHub
echo 📦 Committing changes: %commitmsg%
git commit -m "%commitmsg%"
git branch -M main
git push -u origin main

echo ✅ Backup complete! Check your repo:
echo https://github.com/ahannawati/ai-agent-attendance
pause
