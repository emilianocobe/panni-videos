# Panni Margot · videos

Sala de videos del proyecto (actualizaciones de obra, estado de obra, recorrido de compra, tutoriales del panel y
borradores de marketing),
publicada con GitHub Pages en https://emilianocobe.github.io/panni-videos/ (sin indexar: `noindex` + robots).

Los videos se producen en el repo privado `panni-margot` (carpeta `videos/`, HyperFrames + voz Azure).
Para actualizar: copiar los MP4 a `media/` con `ffmpeg -i x.mp4 -c copy -movflags +faststart media/<slug>.mp4`,
generar el póster (`media/<slug>.jpg`), ajustar la lista en `armar.mjs` y correr `node armar.mjs`.

**Actualizaciones de obra** es el primer grupo de la página: cada entrada lleva su `fecha` (AAAA-MM-DD) y se ordenan
solas, de la más nueva a la más vieja; la cabecera muestra la fecha de la última.

Las clientas, los pedidos y los usuarios que se ven en los videos son de ejemplo. Las actualizaciones de obra muestran
el catálogo real (piezas, precios y fotos) grabado en una copia local del sitio de prueba.
