"""
P5 - XML to KML Converter

@version: 1.0 21/Octubre/2025
@author: Olga Alonso Grela UO288066
"""
import xml.etree.ElementTree as ET

# Archivos
xml_file = "xml/circuitoEsquema.xml"
kml_file = "xml/circuito.kml"

# Espacios de nombres
NS = {'c': 'http://www.uniovi.es'}

# Parsear XML
tree = ET.parse(xml_file)
root = tree.getroot()

# Cabecera KML
kml_header = '''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
'''

kml_footer = '</Document>\n</kml>'

# Crear un Placemark para cada tramo
placemarks = ''

for tramo in root.findall('.//c:tramo', NS):
    lon = tramo.find('c:longitud', NS).text
    lat = tramo.find('c:latitud', NS).text
    alt = tramo.find('c:altitud', NS).text
    sector = tramo.find('c:sector', NS).text

    placemarks += f'''
    <Placemark>
        <sector>Sector {sector}</sector>
        <Point>
            <coordinates>{lon},{lat},{alt}</coordinates>
        </Point>
    </Placemark>
    '''

# Añadir punto de origen
origen = root.find('c:puntoOrigen', NS)
if origen is not None:
    lon = origen.find('c:longitud', NS).text
    lat = origen.find('c:latitud', NS).text
    alt = origen.find('c:altitud', NS).text

    placemarks += f'''
    <Placemark>
        <name>Origen</name>
        <Point>
            <coordinates>{lon},{lat},{alt}</coordinates>
        </Point>
    </Placemark>
    '''

# Guardar KML
with open(kml_file, 'w', encoding='utf-8') as f:
    f.write(kml_header + placemarks + kml_footer)

print(f"KML generado: {kml_file}")
