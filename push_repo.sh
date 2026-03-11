#!/bin/zsh

echo "Lista de ramas del proyecto:"
git branch

echo "Ingrese el nombre de la rama de los cambios"
read BRANCH

echo "Rama seleccionada: $BRANCH"

if [[ ! -n $BRANCH ]]; then
    echo "No ingresó el nombre de la rama."
    exit 1
fi

# Verifica que la rama exista localmente
if ! git show-ref --verify --quiet refs/heads/$BRANCH; then
    echo "La rama '$BRANCH' no existe."
    exit 1
fi

while true; do
    echo "Escriba el mensaje del commit:"
    read COMMIT_MESSAGE

    # Verifica que el mensaje del commit se haya ingresado
    if [[ ! -n $COMMIT_MESSAGE ]]; then
        echo "Por favor ingrese un mensaje al commit"
        continue
    fi

    break
done

# Ejecuta los comandos para hacer los cambios
git add .
git status
git commit -m "$COMMIT_MESSAGE" || { echo "Error en el commit"; exit 1; }
git push origin $BRANCH || { echo "Error en el push"; exit 1; }
git status

echo "Se hicieron los cambios al repo."
