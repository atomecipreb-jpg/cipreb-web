/* CIPReB — render de contenido desde /content (sin compilación) */
(function () {
  'use strict';

  var state = { site: {}, servicios: [] };
  var q = function (sel, root) { return (root || document).querySelector(sel); };
  var qa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function md(text) {
    if (!text) return '';
    var html = window.marked ? window.marked.parse(String(text)) : '<p>' + esc(text) + '</p>';
    return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
  }

  function fecha(iso) {
    if (!iso) return '';
    var d = new Date(String(iso).length === 10 ? iso + 'T12:00:00' : iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function cargar(ruta, porDefecto) {
    return fetch(ruta, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .catch(function (e) { console.warn('No se pudo leer ' + ruta, e); return porDefecto; });
  }

  function cargarLista(ruta) {
    return cargar(ruta, {}).then(function (d) {
      if (Array.isArray(d)) return d;
      return (d && Array.isArray(d.items)) ? d.items : [];
    });
  }

  function visible(el, valor) {
    if (!el) return;
    if (valor) { el.hidden = false; } else { el.hidden = true; }
  }

  function pintarEntorno() {
    var s = state.site || {};

    qa('[data-site-name]').forEach(function (el) { el.textContent = s.name || 'CIPReB'; });
    qa('[data-site-title]').forEach(function (el) { el.textContent = s.title || ''; });
    qa('[data-copyright]').forEach(function (el) {
      el.textContent = s.copyright || ('© ' + new Date().getFullYear() + ' ' + (s.name || 'CIPReB'));
    });

    var c = s.contact || {};
    qa('[data-contact-phone]').forEach(function (el) {
      el.textContent = c.phone ? '☎ ' + c.phone : '';
      el.href = c.phone ? 'tel:' + String(c.phone).replace(/[^0-9+]/g, '') : '#';
      visible(el, c.phone);
    });
    qa('[data-contact-email]').forEach(function (el) {
      el.textContent = c.email ? '✉ ' + c.email : '';
      el.href = c.email ? 'mailto:' + c.email : '#';
      visible(el, c.email);
    });
    qa('[data-contact-address]').forEach(function (el) {
      el.textContent = c.address || '';
      visible(el, c.address);
    });

    var linkBox = q('[data-links]');
    if (linkBox) {
      var links = (s.links || []).filter(function (l) { return l && l.label && l.url; });
      linkBox.innerHTML = links.length
        ? links.map(function (l) {
            return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
          }).join('')
        : '';
      var bloque = linkBox.closest('[data-links-block]');
      if (bloque) visible(bloque, links.length || s.contact && s.contact.address);
    }

    var menu = q('[data-nav-servicios]');
    if (menu) {
      var servicios = state.servicios || [];
      menu.innerHTML = servicios.map(function (sv) {
        return '<a href="servicio.html?s=' + encodeURIComponent(sv.slug) + '">' + esc(sv.name) + '</a>';
      }).join('');
      var drop = menu.closest('.dropdown');
      if (drop) visible(drop, servicios.length);
    }
  }

  function vacio(mensaje) {
    return '<p class="aviso">' + esc(mensaje) + '</p>';
  }

  function renderNovedades() {
    var cont = q('#contenido');
    return cargarLista('content/novedades.json').then(function (lista) {
      lista = (lista || []).slice().sort(function (a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      });
      if (!lista.length) { cont.innerHTML = vacio('Todavía no hay novedades publicadas.'); return; }
      cont.innerHTML = '<h1>Novedades</h1>' + lista.map(function (n) {
        var img = n.image
          ? '<img class="novedad-img" src="' + esc(n.image) + '" alt="' + esc(n.title || '') + '" loading="lazy">'
          : '';
        return '<article class="novedad">' + img + '<div class="novedad-texto">' +
          '<time datetime="' + esc(n.date || '') + '">' + esc(fecha(n.date)) + '</time>' +
          '<h2>' + esc(n.title || '') + '</h2>' +
          (n.summary ? '<p class="resumen">' + esc(n.summary) + '</p>' : '') +
          '<div class="prosa">' + md(n.body) + '</div>' +
          '</div></article>';
      }).join('');
    });
  }

  function renderPersonal() {
    var cont = q('#contenido');
    return cargarLista('content/personal.json').then(function (lista) {
      if (!lista.length) { cont.innerHTML = '<h1>Personal</h1>' + vacio('Todavía no hay personas cargadas.'); return; }
      cont.innerHTML = '<h1>Personal</h1><div class="grilla-personas">' + lista.map(function (p) {
        var foto = p.photo
          ? '<img class="persona-foto" src="' + esc(p.photo) + '" alt="' + esc(p.name || '') + '" loading="lazy">'
          : '<div class="persona-foto persona-inicial">' + esc((p.name || '?').trim().charAt(0).toUpperCase()) + '</div>';
        return '<article class="persona">' + foto +
          '<h3>' + esc(p.name || '') + '</h3>' +
          (p.role ? '<p class="cargo">' + esc(p.role) + '</p>' : '') +
          (p.area ? '<p class="area">' + esc(p.area) + '</p>' : '') +
          (p.email ? '<a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a>' : '') +
          (p.cv ? '<a class="boton" href="' + esc(p.cv) + '" target="_blank" rel="noopener">Descargar CV</a>' : '') +
          '</article>';
      }).join('') + '</div>';
    });
  }

  function renderPublicaciones() {
    var cont = q('#contenido');
    return cargarLista('content/publicaciones.json').then(function (lista) {
      if (!lista.length) { cont.innerHTML = '<h1>Publicaciones</h1>' + vacio('Todavía no hay publicaciones cargadas.'); return; }
      var porAnio = {};
      lista.forEach(function (p) {
        var a = String(p.year || '').trim() || 'Sin fecha';
        (porAnio[a] = porAnio[a] || []).push(p);
      });
      var anios = Object.keys(porAnio).sort(function (a, b) {
        if (a === 'Sin fecha') return 1;
        if (b === 'Sin fecha') return -1;
        return Number(b) - Number(a);
      });
      cont.innerHTML = '<h1>Publicaciones</h1>' + anios.map(function (a) {
        return '<section class="anio"><h2>' + esc(a) + '</h2><ul class="lista-pubs">' +
          porAnio[a].map(function (p) {
            var enlaces = [];
            if (p.link) enlaces.push('<a href="' + esc(p.link) + '" target="_blank" rel="noopener">Ver enlace</a>');
            if (p.file) enlaces.push('<a href="' + esc(p.file) + '" target="_blank" rel="noopener">Descargar PDF</a>');
            return '<li><p class="pub-titulo">' + esc(p.title || '') + '</p>' +
              (p.authors ? '<p class="pub-autores">' + esc(p.authors) + '</p>' : '') +
              (p.journal ? '<p class="pub-revista">' + esc(p.journal) + '</p>' : '') +
              (enlaces.length ? '<p class="pub-enlaces">' + enlaces.join(' · ') + '</p>' : '') +
              '</li>';
          }).join('') + '</ul></section>';
      }).join('');
    });
  }

  function renderServicio() {
    var cont = q('#contenido');
    var slug = new URLSearchParams(location.search).get('s');
    var sv = (state.servicios || []).filter(function (x) { return x.slug === slug; })[0];
    if (!sv) {
      cont.innerHTML = '<h1>Servicio</h1>' + vacio('No encontramos ese servicio. Volvé al inicio y elegí uno del menú.');
      return Promise.resolve();
    }
    document.title = sv.name + ' — CIPReB';
    var img = sv.image ? '<img class="servicio-img" src="' + esc(sv.image) + '" alt="' + esc(sv.name) + '">' : '';
    cont.innerHTML = '<h1>' + esc(sv.name) + '</h1>' +
      (sv.short ? '<p class="bajada">' + esc(sv.short) + '</p>' : '') +
      img +
      '<div class="prosa">' + (sv.body ? md(sv.body) : '<p class="aviso">Contenido pendiente de carga.</p>') + '</div>' +
      (sv.contact ? '<p class="contacto-servicio">Consultas: ' + esc(sv.contact) + '</p>' : '');
    return Promise.resolve();
  }

  function renderPagina() {
    var cont = q('#contenido');
    var slug = document.body.dataset.slug;
    return cargar('content/paginas/' + slug + '.json', {}).then(function (p) {
      if (!p || !p.title) { cont.innerHTML = vacio('Contenido pendiente de carga.'); return; }
      document.title = p.title + ' — CIPReB';
      var c = (state.site || {}).contact || {};
      var filas = [];
      if (slug === 'contacto') {
        if (c.phone) filas.push('<li><strong>Teléfono:</strong> ' + esc(c.phone) + '</li>');
        if (c.email) filas.push('<li><strong>Email:</strong> <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></li>');
        if (c.address) filas.push('<li><strong>Dirección:</strong> ' + esc(c.address) + '</li>');
      }
      var cuerpo = p.body ? md(p.body) : (filas.length ? '' : '<p class="aviso">Contenido pendiente de carga.</p>');
      cont.innerHTML = '<h1>' + esc(p.title) + '</h1>' +
        (p.subtitle ? '<p class="bajada">' + esc(p.subtitle) + '</p>' : '') +
        (cuerpo ? '<div class="prosa">' + cuerpo + '</div>' : '');
      if (filas.length) cont.innerHTML += '<section class="datos-contacto"><h2>Datos de contacto</h2><ul>' + filas.join('') + '</ul></section>';
    });
  }

  function iniciarMenu() {
    var nav = q('.navbar');
    var boton = q('.menu-btn');
    if (boton && nav) {
      boton.addEventListener('click', function () {
        var abierto = nav.getAttribute('data-menu') === 'abierto';
        nav.setAttribute('data-menu', abierto ? 'cerrado' : 'abierto');
        boton.setAttribute('aria-expanded', abierto ? 'false' : 'true');
      });
    }
    qa('.dropbtn').forEach(function (b) {
      b.addEventListener('click', function (e) {
        var drop = b.parentNode;
        if (window.matchMedia('(max-width: 800px)').matches) {
          e.preventDefault();
          drop.setAttribute('data-abierto', drop.getAttribute('data-abierto') === 'si' ? '' : 'si');
        }
      });
    });
  }

  function iniciar() {
    Promise.all([
      cargar('content/site.json', {}),
      cargarLista('content/servicios.json')
    ]).then(function (res) {
      state.site = res[0] || {};
      state.servicios = Array.isArray(res[1]) ? res[1] : [];
      pintarEntorno();
      iniciarMenu();
      var pagina = document.body.dataset.page;
      var renders = {
        novedades: renderNovedades,
        personal: renderPersonal,
        publicaciones: renderPublicaciones,
        servicio: renderServicio,
        pagina: renderPagina
      };
      if (renders[pagina]) renders[pagina]();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
