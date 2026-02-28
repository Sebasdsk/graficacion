#!/bin/bash

FRONTEND_DIR="/Users/luisangelsotogalvez/graficacion/Front"
BACKEND_DIR="/Users/luisangelsotogalvez/graficacion/Back"

# Abrir Frontend en nueva ventana de Terminal
osascript -e "
tell application \"Terminal\"
    do script \"cd '$FRONTEND_DIR' && npm run dev\"
    activate
end tell"

# Abrir Backend en otra ventana de Terminal
osascript -e "
tell application \"Terminal\"
    do script \"cd '$BACKEND_DIR' && npx nodemon --exec ts-node src/index.ts\"
end tell"

echo "Frontend y Backend iniciados"