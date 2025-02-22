@REM clear latest
RMDIR .\pre-build\ /S /Q


@REM main
xcopy application.cjs .\pre-build\
xcopy .\src-application\ .\pre-build\src-application\ /E

xcopy .\static\icons\Deskset.png .\pre-build\static\icons\

gcc -fPIC -shared "./module-bin/main.c" -o "./pre-build/setBottom.dll"


@REM render
@REM use call to avoid exit bat after npm run
call npm run build-Vite
xcopy .\dist\ .\pre-build\dist\ /E


@REM npm
xcopy package.json .\pre-build\
xcopy forge.config.cjs .\pre-build\


pause
