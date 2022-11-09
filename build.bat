set NODE_OPTIONS=--openssl-legacy-provider
call npm run build
copy build\index.html build\404.html /a
pause
