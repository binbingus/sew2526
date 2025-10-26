"""
P5 - XML to KML Converter

@version: 1.1 26/Octubre/2025
@author: Olga Alonso Grela UO288066
"""
import os
import xml.etree.ElementTree as ET

# Archivos
base_dir = os.path.dirname(os.path.abspath(__file__))
xml_file = os.path.join(base_dir, "circuitoEsquema.xml")
kml_file = os.path.join(base_dir, "circuito.kml")

# Espacios de nombres
NS = {'c': 'http://www.uniovi.es'}

# Parsear XML
tree = ET.parse(xml_file)
root = tree.getroot()

# Cabecera y pie del KML
kml_header = '''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
    <name>Circuito</name>
    <Style id="lineaRoja">
        <LineStyle>
            <color>ff0000ff</color> <!-- rojo en formato aabbggrr -->
            <width>8</width>
        </LineStyle>
    </Style>
'''

kml_footer = '</Document>\n</kml>'

# Recoger coordenadas (sin crear pines individuales)
coordinates = []

# Punto de origen
origen = root.find('c:puntoOrigen', NS)
if origen is not None:
    lon = origen.find('c:longitud', NS).text
    lat = origen.find('c:latitud', NS).text
    alt = origen.find('c:altitud', NS).text
    coordinates.append(f"{lon},{lat},{alt}")

# Puntos de cada tramo
for tramo in root.findall('.//c:tramo', NS):
    lon = tramo.find('c:longitud', NS).text
    lat = tramo.find('c:latitud', NS).text
    alt = tramo.find('c:altitud', NS).text
    coordinates.append(f"{lon},{lat},{alt}")

# Crear solo la línea roja, sin pines
placemarks = ''
if coordinates:
    coord_text = ' '.join(coordinates)
    placemarks += f'''
    <Placemark>
        <name>Recorrido del circuito</name>
        <styleUrl>#lineaRoja</styleUrl>
        <LineString>
            <tessellate>1</tessellate>
            <altitudeMode>clampToGround</altitudeMode>
            <coordinates>
                {coord_text}
            </coordinates>
        </LineString>
    </Placemark>
    '''

# Guardar KML
with open(kml_file, 'w', encoding='utf-8') as f:
    f.write(kml_header + placemarks + kml_footer)

print(f"KML generado correctamente: {kml_file}")
