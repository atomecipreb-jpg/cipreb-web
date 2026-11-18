#!/usr/bin/env python3
"""Carga datos de PRUEBA para ver el diseño en local. NO usar en producción."""
import json

def guardar(ruta, datos):
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
        f.write("\n")

guardar("content/site.json", {
    "name": "CIPReB",
    "title": "Centro de Investigación del Cáncer de Rosario",
    "subtitle": "CIPReB & CICR",
    "contact": {"phone": "(0341) 000-0000", "email": "contacto@dominio.org", "address": "Dirección de prueba"},
    "links": [{"label": "Universidad Nacional de Rosario", "url": "https://unr.edu.ar"}],
    "copyright": "© 2026 Instituto Científico CIPReB & CICR",
})
guardar("content/novedades.json", {"items": [
    {"title": "Jornada abierta de microscopía", "date": "2026-11-10",
     "summary": "Texto de prueba para ver el diseño de la página.",
     "image": "", "body": "## Subtítulo de prueba\n\nTexto **con formato** y una lista:\n\n- Primer punto\n- Segundo punto"},
    {"title": "Nuevo equipamiento", "date": "2026-10-02",
     "summary": "Otra novedad de prueba.", "image": "", "body": "Párrafo breve de prueba."}
]})
guardar("content/personal.json", {"items": [
    {"name": "Nombre Apellido", "role": "Directora", "area": "Dirección", "photo": "", "email": "ejemplo@dominio.org", "cv": ""},
    {"name": "Otra Persona", "role": "Investigadora", "area": "Biología molecular", "photo": "", "email": "", "cv": ""},
    {"name": "Tercera Persona", "role": "Técnica", "area": "Microscopía", "photo": "", "email": "", "cv": ""}
]})
guardar("content/publicaciones.json", {"items": [
    {"title": "Título de publicación de prueba", "authors": "Apellido A, Apellido B", "year": 2026, "journal": "Revista de ejemplo", "link": "https://example.org", "file": ""},
    {"title": "Otra publicación de prueba", "authors": "Apellido D", "year": 2025, "journal": "Otra revista", "link": "", "file": ""}
]})
s = json.load(open("content/servicios.json", encoding="utf-8"))
s["items"][0]["body"] = "Texto de prueba del servicio.\n\n- Prestación uno\n- Prestación dos"
s["items"][0]["contact"] = "servicio@dominio.org"
guardar("content/servicios.json", s)
print("Datos de prueba cargados.")
