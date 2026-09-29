# Panni Margot · videos

Sala de videos del proyecto (estado de obra, recorrido de compra, tutoriales del panel y borradores de marketing),
publicada con GitHub Pages en https://emilianocobe.github.io/panni-videos/ (sin indexar: `noindex` + robots).

Los videos se producen en el repo privado `panni-margot` (carpeta `videos/`, HyperFrames + voz Azure).
Para actualizar: copiar los MP4 a `media/` con `ffmpeg -i x.mp4 -c copy -movflags +faststart media/<slug>.mp4`,
generar el póster (`media/<slug>.jpg`), ajustar la lista en `armar.mjs` y correr `node armar.mjs`.

Todos los datos que se ven en los videos son de ejemplo.
