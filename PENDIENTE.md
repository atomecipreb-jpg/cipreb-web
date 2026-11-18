# PENDIENTE — Puesta en marcha de la nueva versión

Estado: **construida en local, NO publicada**. El sitio público sigue mostrando "Sitio en construcción".

## Vista previa local

```bash
cd /home/andy/WEBCIPREB/site-build
python3 -m http.server 8080
```

Abrir: http://127.0.0.1:8080/novedades.html (o cualquier otra página).

Los datos que se ven son de prueba. Para vaciarlos: `python3 scripts/limpiar_demo.py`.

## Antes de publicar

1. **Borrar la carpeta de prueba** `sveltia/admin-sveltia/` del repositorio.
2. **Completar los datos reales**: teléfono, email, dirección y vínculos institucionales.
3. **Revisar todas las páginas** en escritorio y en teléfono.
4. **Crear la cuenta institucional** de la persona que edita (colaboradora del repo, permiso Write).
5. **Probar el panel** `/admin/` con esa cuenta.
6. **Decidir la portada**: `index.html` sigue con "Sitio en construcción"; falta la home definitiva.
7. **Formulario de contacto**: se quitó el formulario de prueba porque no enviaba nada. Si se quiere un formulario real, hay que elegir un servicio (Formspree, Google Forms, etc.) y aprobarlo.

## Cómo publicar (25+ archivos)

- **Opción A (recomendada):** instalar `gh`, autenticar y hacer un único commit desde la copia local.
  ```bash
  sudo apt install gh        # o el método que corresponda
  gh auth login
  cd /home/andy/WEBCIPREB/site-build
  git add -A && git commit -m "Contenido administrable + Sveltia CMS"
  git push origin main
  ```
- **Opción B:** subir los archivos por la web de GitHub (lento y propenso a error).

## Cambios técnicos de esta versión

- Contenido separado en `content/` (JSON). Las páginas lo leen con `assets/app.js`.
- `marked` + `DOMPurify` incluidos localmente (`assets/vendor/`) para renderizar Markdown sin depender de CDN.
- Panel: Decap → **Sveltia CMS** (`admin/index.html`), configuración ampliada en `admin/config.yml`.
- Menú de Servicios generado desde `content/servicios.json`: agregar un servicio en el panel crea su enlace automáticamente.
- Páginas viejas de servicios (`microscopia.html`, `invitro.html`, `invivo.html`, `proyectos-personalizados.html`, `spf.html`) ahora redirigen a `servicio.html?s=...` para no romper enlaces existentes.
- Se eliminó `content.json` (reemplazado por `content/site.json`) y `script.js` (carrusel viejo).
- Se quitó el buscador del encabezado: no buscaba nada.

## Pendientes funcionales

- Home definitiva con carrusel/portada (hoy `index.html` = en construcción).
- Mapa / ubicación institucional (no hay datos ni coordenadas).
- **Formulario de contacto funcional (requisito confirmado por Andrés: tiene que andar).**
  Hoy la página de Contacto solo muestra los datos. Opciones a evaluar cuando se retome:
  servicio de formularios (Formspree, Web3Forms, Google Forms embebido) o endpoint propio.
  Requiere decidir destino de los mensajes (casilla institucional) y política de privacidad.
- Capturas de pantalla para la guía (`docs/GUIA_CONTENIDOS.md`), una vez que el panel esté publicado.
