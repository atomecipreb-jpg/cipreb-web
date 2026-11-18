# CIPReB — Sitio web

Sitio institucional estático de CIPReB (Centro de Investigación del Cáncer de Rosario, FCM-UNR).
Publicado con GitHub Pages en https://www.cipreb.com.ar

## Cómo está armado

- **HTML + CSS + JavaScript**, sin compilación ni servidor propio.
- **Contenido separado del diseño**: todo vive en `content/` (archivos JSON).
- Las páginas leen esos archivos con `assets/app.js` y se arman en el navegador.
- El texto largo se escribe en Markdown y se renderiza con `marked` + `DOMPurify`
  (incluidos localmente en `assets/vendor/`, sin dependencias externas en tiempo de ejecución).

## Administración de contenidos

Panel: **https://www.cipreb.com.ar/admin/** (Sveltia CMS).

Secciones editables:

| Sección | Archivo |
|---|---|
| Datos del sitio | `content/site.json` |
| Novedades | `content/novedades.json` |
| Personal | `content/personal.json` |
| Publicaciones | `content/publicaciones.json` |
| Servicios | `content/servicios.json` |
| Páginas | `content/paginas/*.json` |

Guía para quien carga contenido: [`docs/GUIA_CONTENIDOS.md`](docs/GUIA_CONTENIDOS.md).
Puesta en marcha y permisos: [`docs/PUESTA_EN_MARCHA_ADMIN.md`](docs/PUESTA_EN_MARCHA_ADMIN.md).

## Desarrollo local

```bash
python3 -m http.server 8080
# abrir http://127.0.0.1:8080/
```

Datos de prueba para ver el diseño: `python3 scripts/cargar_demo.py`.
Para vaciarlos antes de publicar: `python3 scripts/limpiar_demo.py`.

## Estructura

```
admin/            panel (Sveltia CMS) y su configuración
assets/           app.js + librerías locales (marked, DOMPurify)
content/          contenido editable
docs/             guías
images/uploads/   imágenes y PDF subidos desde el panel
scripts/          utilidades (demo, respaldos)
*.html            páginas del sitio
style.css         estilos
CNAME             dominio personalizado
```

## Publicación

GitHub Pages, rama `main`, carpeta raíz. Cada cambio en `main` se publica solo en 1-2 minutos.

## Respaldos

Ver [`RESPALDOS.md`](RESPALDOS.md). Resumen: GitHub + pendrive al cierre de cada jornada.
