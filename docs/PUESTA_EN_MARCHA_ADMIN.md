# Puesta en marcha — habilitar a la persona que carga contenido

Checklist técnico. Lo hace el responsable (Andrés), no la persona que edita.

## 0. Requisito previo

La web nueva **tiene que estar publicada** en `main`. Mientras no se publique:

- `/admin/` sigue mostrando el panel viejo (Decap) que solo edita `content.json`, y ese archivo ya no alimenta la web.
- Las páginas nuevas no existen en el servidor.

## 1. Cuenta de GitHub para la persona que edita

El panel se autentica con GitHub, así que necesita una cuenta.

1. Crear una cuenta **institucional**, por ejemplo `cipreb-contenidos`, con el correo institucional.
   - No usar la cuenta personal de la persona si es posible.
   - Activar verificación en dos pasos (2FA).
2. Anotar el usuario y guardar la contraseña en un gestor de contraseñas. **No compartirla por chat ni por correo.**

## 2. Darle permiso sobre el repositorio

1. Entrar a https://github.com/atomecipreb-jpg/cipreb-web/settings/access
2. **Add people** → buscar la cuenta → rol **Write**.
3. La persona recibe un correo de invitación y tiene que **aceptarla**.

Sin este paso puede iniciar sesión en el panel, pero no guardar nada.

## 3. Probar de punta a punta (importante)

Con esa cuenta, en un navegador limpio (o ventana de incógnito):

1. Abrir `https://www.cipreb.com.ar/admin/`
2. **Sign in with GitHub** → autorizar la app **CIPReB CMS**.
3. Ver que aparezcan las secciones: Datos del sitio, Novedades, Personal, Publicaciones, Servicios, Páginas.
4. Crear una novedad de prueba, guardar y esperar 1-2 minutos.
5. Verificar que aparezca en `https://www.cipreb.com.ar/novedades.html`.
6. Borrarla.
7. Repetir una vez subiendo una imagen y un PDF (CV).

Si el paso 2 falla, el problema está en el Worker OAuth o en la invitación, no en el panel.

## 4. Datos que hay que entregarle

- URL del panel: `https://www.cipreb.com.ar/admin/`
- Usuario de GitHub (no la contraseña: se la entrega el responsable en mano o por gestor de contraseñas).
- La guía: `docs/GUIA_CONTENIDOS.md` (conviene imprimirla o pasarla a PDF).
- A quién avisar si algo falla.

## 5. Seguridad a revisar antes de abrir

- **Alcance de la app OAuth:** la app actual es una OAuth App clásica de GitHub, que pide acceso a *todos* los repositorios de la cuenta que autoriza. Si la cuenta es institucional y solo se usa para esto, el riesgo es bajo. Si se quiere limitar, hay que migrar el Worker a una **GitHub App** (Sveltia CMS Authenticator), que da acceso solo a este repositorio.
- **Desvincular** a la persona si deja de colaborar: quitarla de colaboradores del repo.
- **No** dar acceso a Cloudflare, DNS ni a la configuración técnica.

## 6. Pendiente de producto

La portada sigue en "Sitio en construcción". Aunque la persona cargue novedades, no se verán desde la home hasta que se publique la portada definitiva. Definir antes de abrir la carga masiva.
