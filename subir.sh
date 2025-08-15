#!/bin/bash
cd wasm
make
cd ..
npm run build
workbox generateSW workbox-config.cjs
echo "Introduce usuario@servidor:"
read usuario_servidor
rsync -rvnzi --delete dist/ $usuario_servidor:/var/www/misitio/apps/firmador/
echo "¿Subir? [s/n]"
read opcion
if [[ "$opcion" == "s" ]]; then
	echo "Subiendo..."
	rsync -rvzi --delete dist/ $usuario_servidor:/var/www/misitio/apps/firmador/
fi
