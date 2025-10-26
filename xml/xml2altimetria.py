"""
P5 - Generador de altimetría SVG con etiquetas de puntos sin solaparse

@version: 1.5 26/Octubre/2025
@author: Olga Alonso Grela UO288066
"""
import os
import xml.etree.ElementTree as ET

# Archivos
base_dir = os.path.dirname(os.path.abspath(__file__))
xml_file = os.path.join(base_dir, "circuitoEsquema.xml")
svg_file = os.path.join(base_dir, "altimetria.svg")

# Espacios de nombres
NS = {'c': 'http://www.uniovi.es'}

# Parsear XML
tree = ET.parse(xml_file)
root = tree.getroot()

# Recoger distancias, altitudes y nombres
distancias = []
altitudes = []
nombres = []

for tramo in root.findall('.//c:tramo', NS):
    dist = float(tramo.find('c:distancia', NS).text)
    alt = float(tramo.find('c:altitud', NS).text)
    nombre = tramo.find('c:nombrePunto', NS).text
    distancias.append(dist)
    altitudes.append(alt)
    nombres.append(nombre)

# Dimensiones SVG
SVG_WIDTH = 1400
SVG_HEIGHT = 400
MARGIN = 80  # margen aumentado para etiquetas verticales

# Escalado
min_dist = 0
max_dist = sum(distancias)
min_alt = 0
max_alt = 500

def scale_x(d):
    return MARGIN + d / max_dist * (SVG_WIDTH - 2*MARGIN)

def scale_y(a):
    return SVG_HEIGHT - MARGIN - (a - min_alt) / (max_alt - min_alt) * (SVG_HEIGHT - 2*MARGIN)

# Crear polyline
coords = []
dist_acum = 0
for d, alt in zip(distancias, altitudes):
    x = scale_x(dist_acum)
    y = scale_y(alt)
    coords.append(f"{x},{y}")
    dist_acum += d

# Crear el SVG
svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{SVG_WIDTH}" height="{SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  
  <!-- Ejes -->
  <line x1="{MARGIN}" y1="{SVG_HEIGHT-MARGIN}" x2="{SVG_WIDTH-MARGIN}" y2="{SVG_HEIGHT-MARGIN}" stroke="black" stroke-width="2"/>
  <line x1="{MARGIN}" y1="{MARGIN}" x2="{MARGIN}" y2="{SVG_HEIGHT-MARGIN}" stroke="black" stroke-width="2"/>
'''

# Marcas y etiquetas eje Y
num_ticks = 10
for i in range(num_ticks + 1):
    alt_tick = min_alt + i*(max_alt - min_alt)/num_ticks
    y = scale_y(alt_tick)
    svg_content += f'<line x1="{MARGIN-5}" y1="{y}" x2="{MARGIN}" y2="{y}" stroke="black" stroke-width="1"/>\n'
    svg_content += f'<text x="{MARGIN-10}" y="{y+4}" font-size="12" text-anchor="end">{int(alt_tick)}</text>\n'

# Etiqueta eje Y
svg_content += f'<text x="{MARGIN-50}" y="{SVG_HEIGHT/2}" font-size="14" text-anchor="middle" transform="rotate(-90,{MARGIN-50},{SVG_HEIGHT/2})">Altura (m)</text>\n'

# Polyline del perfil (línea roja, sin cerrar)
coord_text = ' '.join(coords)
svg_content += f'''
  <polyline points="{coord_text}" stroke="red" stroke-width="3" fill="none"/>
'''

# Etiquetas eje X debajo del eje, verticales y separadas para no solaparse
dist_acum = 0
separacion = 25  # separación vertical de la línea del eje
offsets = [0, 15]  # alternar posición vertical de etiquetas
for i, nombre in enumerate(nombres):
    x = scale_x(dist_acum)
    y = SVG_HEIGHT - MARGIN + separacion + offsets[i % len(offsets)]
    svg_content += f'<text x="{x}" y="{y}" font-size="12" text-anchor="end" transform="rotate(-90,{x},{y})">{nombre}</text>\n'
    dist_acum += distancias[i]

# Etiqueta eje X
svg_content += f'<text x="{SVG_WIDTH/2}" y="{SVG_HEIGHT-MARGIN+70}" font-size="14" text-anchor="middle">Puntos del circuito</text>\n'

# Cierre SVG
svg_content += '</svg>'

# Guardar SVG
with open(svg_file, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"SVG de altimetría generado correctamente: {svg_file}")
