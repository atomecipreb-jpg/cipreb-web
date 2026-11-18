#!/usr/bin/env python3
"""Deja las colecciones vacías y los datos de contacto en blanco (quita los datos de prueba)."""
import json, os

def guardar(ruta, datos):
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
        f.write("\n")

guardar("content/novedades.json", {"items": []})
guardar("content/personal.json", {"items": []})
guardar("content/publicaciones.json", {"items": []})

servicios = json.load(open("content/servicios.json", encoding="utf-8"))
for s in servicios.get("items", []):
    s["image"] = ""
    s["body"] = ""
    s["contact"] = ""
guardar("content/servicios.json", servicios)

guardar("content/site.json", {
    "name": "CIPReB",
    "title": "Centro de Investigación del Cáncer de Rosario",
    "subtitle": "CIPReB & CICR",
    "contact": {"phone": "", "email": "", "address": ""},
    "links": [],
    "copyright": "© 2026 Instituto Científico CIPReB & CICR",
})
print("Datos de prueba eliminados.")
