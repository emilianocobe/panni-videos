/* Arma la sala de videos de Panni Margot (GitHub Pages): index.html con todo y una página por video en v/<slug>/.
   Los MP4 y los pósters están en media/. Uso: node armar.mjs */
import fs from "node:fs";
import path from "node:path";

const BASE = "https://emilianocobe.github.io/panni-videos";
const mm = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

const GRUPOS = [
  {
    id: "recorrido", titulo: "Cómo funciona, de punta a punta", kanji: "工程",
    bajada: "Una compra real en el sitio y lo que pasa en la casa: grabado en vivo, con voz.",
    videos: [
      { slug: "recorrido-de-compra", titulo: "Recorrido de compra", dur: 416, formato: "16:9",
        texto: "Una clienta compra una pieza única en el sitio y la casa la despacha desde el panel. Capítulos: 01 La clienta (0:05) · 02 El mail (2:40) · 03 La casa (3:38) · 04 El stock (4:56) · 05 De vuelta en el sitio (5:48)." },
    ],
  },
  {
    id: "estado", titulo: "Estado de obra", kanji: "家",
    bajada: "Qué está hecho, cómo se ve y qué necesitamos de la casa para lanzar.",
    videos: [
      { slug: "estado-de-obra", titulo: "Estado de obra · 28/09/2026", dur: 239, formato: "16:9",
        texto: "De dónde venimos, los 10 de 26 hitos hechos, el sitio y el panel en pantalla, lo que protege sin verse, lo que falta de la casa y las próximas fechas." },
    ],
  },
  {
    id: "tutoriales", titulo: "Tutoriales del panel", kanji: "筆",
    bajada: "El manual en video para el equipo: paso a paso sobre las pantallas reales, con datos de ejemplo.",
    videos: [
      ["01-entrar-al-panel", "01 · Entrar al panel", 237, "La dirección, el ingreso, elegir la clave la primera vez, recuperarla y qué ve cada rol."],
      ["02-cargar-una-pieza", "02 · Cargar una pieza", 232, "Alta rápida y ficha completa: precio, talles, stock, medidas, a pedido, complementos, vista previa y publicar."],
      ["03-fotos-y-videos", "03 · Fotos y videos", 237, "La biblioteca, subir o elegir fotos, insertar videos de YouTube, Vimeo o TikTok, y ordenarlos."],
      ["04-catalogo-en-lote-y-orden", "04 · Catálogo en lote y orden", 226, "Filtros, acciones en lote con vista previa, liquidación, precios, y el orden de la grilla arrastrando."],
      ["05-lo-que-muestra-el-sitio", "05 · Lo que muestra el sitio", 233, "Portada, banners, franja de anuncio, textos del sitio, ajustes y redirecciones."],
      ["06-stock-de-piezas-unicas", "06 · Stock de piezas únicas", 239, "Inventario y conteo, apartados, traslados, kardex, alertas y etiquetas QR."],
      ["07-pedidos-y-boutique", "07 · Pedidos y boutique", 230, "El tablero, los pedidos y sus estados, vender en la boutique, devoluciones, arrepentimiento, cupones y tarjetas de regalo."],
      ["08-seguimiento", "08 · Seguimiento", 232, "Audiencia, campañas con el editor de bloques, cupones personales, newsletter y automatizaciones."],
      ["09-whatsapp-y-cuentas", "09 · WhatsApp y cuentas de clientas", 237, "La bandeja de WhatsApp, cómo se conecta la línea, y las cuentas de clientas con Google."],
    ].map(([s, t, d, x]) => ({ slug: `tutorial-${s}`, titulo: t, dur: d, formato: "16:9", texto: x })),
  },
  {
    id: "marketing", titulo: "Marketing · borradores", kanji: "一点物",
    bajada: "Borradores para que Panni los vea y apruebe. No están publicados; los textos son provisorios.",
    videos: [
      ["manifiesto-16x9", "Manifiesto · horizontal", 42, "16:9", "Los textos de la casa, tal cual: genderless fashion, la misión y «Somos todos Carbono…»."],
      ["manifiesto-9x16", "Manifiesto · vertical", 42, "9:16", "El mismo manifiesto para Reels e Historias."],
      ["teaser-drop-9x16", "Anuncio de lanzamiento", 15, "9:16", "Plantilla para anunciar piezas nuevas con acceso anticipado para la lista."],
      ["trench-shukai-organza-9x16", "Trench Shukai Organza · vertical", 17, "9:16", "Pieza única 1/1: fotos que se revelan a color, nombre, sellos y precio."],
      ["trench-shukai-organza-1x1", "Trench Shukai Organza · cuadrado", 17, "1:1", "La misma pieza para el feed."],
      ["blazer-nuime-9x16", "Blazer Nuime · vertical", 17, "9:16", "Generado automáticamente desde el catálogo."],
      ["blazer-nuime-1x1", "Blazer Nuime · cuadrado", 17, "1:1", "La misma pieza para el feed."],
      ["tapado-kimono-brushed-takai-9x16", "Tapado Kimono Brushed Takai · vertical", 17, "9:16", "Pieza pintada a mano, 手描き."],
      ["tapado-kimono-brushed-takai-1x1", "Tapado Kimono Brushed Takai · cuadrado", 17, "1:1", "La misma pieza para el feed."],
      ["saga-flora-ring-9x16", "Saga · Flora Ring · vertical", 15, "9:16", "Joyería a pedido de Saga Jwls, con su plazo de producción."],
      ["saga-flora-ring-1x1", "Saga · Flora Ring · cuadrado", 15, "1:1", "La misma pieza para el feed."],
    ].map(([s, t, d, f, x]) => ({ slug: `mk-${s}`, titulo: t, dur: d, formato: f, texto: x })),
  },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const cabeza = (titulo, pre) => `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(titulo)}</title>
<link rel="icon" href="${pre}assets/isologo-nn-blanco.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${pre}assets/sala.css">
</head>
<body>
<header class="cab"><a href="${pre}index.html" aria-label="Panni Margot · videos"><img src="${pre}assets/logo-completo-blanco.svg" alt="Panni Margot" class="logo"></a><span class="mono">VIDEOS · ${esc("SEPTIEMBRE 2026")}</span></header>
`;
const pie = `<footer class="pie mono">PANNI MARGOT · HONDURAS 4940, PALERMO · PRODUCIDO POR ECOBE · USO INTERNO, NO COMPARTIR</footer>
</body>
</html>
`;

const tarjeta = (v, pre) => `<a class="tarjeta f-${v.formato.replace(":", "x")}" href="${pre}v/${v.slug}/">
  <span class="poster"><img src="${pre}media/${v.slug}.jpg" alt="" loading="lazy"><span class="dur mono">${mm(v.dur)}</span></span>
  <span class="t">${esc(v.titulo)}</span>
  <span class="x">${esc(v.texto)}</span>
</a>`;

let index = cabeza("Panni Margot · videos", "") + `<main>
<section class="intro"><h1>Videos del proyecto</h1><p>El sitio, el panel y lo que viene, en video. Tocá cualquiera para verlo; cada uno tiene su link propio para compartir dentro del equipo.</p></section>
`;
for (const g of GRUPOS) {
  index += `<section class="grupo" id="${g.id}"><div class="gcab"><h2>${esc(g.titulo)}</h2><span class="kanji">${g.kanji}</span></div><p class="bajada">${esc(g.bajada)}</p><div class="grilla">
${g.videos.map((v) => tarjeta(v, "")).join("\n")}
</div></section>
`;
  for (const v of g.videos) {
    const dir = path.join("v", v.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), cabeza(`${v.titulo} · Panni Margot`, "../../") + `<main class="ver">
<a class="volver mono" href="../../index.html#${g.id}">&lt;&lt; TODOS LOS VIDEOS</a>
<p class="mono grupo-t">${esc(g.titulo.toUpperCase())}</p>
<h1>${esc(v.titulo)}</h1>
<div class="reproductor f-${v.formato.replace(":", "x")}"><video controls playsinline preload="metadata" poster="../../media/${v.slug}.jpg" src="../../media/${v.slug}.mp4"></video></div>
<p class="x">${esc(v.texto)}</p>
<p class="mono meta">${mm(v.dur)} · ${v.formato} · <a href="../../media/${v.slug}.mp4" download>DESCARGAR MP4</a></p>
</main>
` + pie);
    v.url = `${BASE}/v/${v.slug}/`;
  }
}
index += `</main>
` + pie;
fs.writeFileSync("index.html", index);
fs.writeFileSync("links.json", JSON.stringify(GRUPOS.map((g) => ({ grupo: g.titulo, videos: g.videos.map((v) => ({ titulo: v.titulo, dur: mm(v.dur), url: v.url })) })), null, 2));
console.log("ok", GRUPOS.reduce((n, g) => n + g.videos.length, 0), "videos");
