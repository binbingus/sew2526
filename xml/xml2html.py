"""
P6 - Generador de InfoCircuito.html desde XML

@version: 1.0 26/Octubre/2025
@author: Olga Alonso Grela UO288066
"""
import os
import xml.etree.ElementTree as ET

class Html:
    def __init__(self, title="Información del circuito"):
        self.title = title
        self.content = []

    def add_line(self, line):
        self.content.append(line)

    def open_tag(self, tag, attrs=""):
        self.add_line(f"<{tag} {attrs}>".strip())

    def close_tag(self, tag):
        self.add_line(f"</{tag}>")

    def get_html(self):
        return "\n".join(self.content)

def main():
    # Archivos
    base_dir = os.path.dirname(os.path.abspath(__file__))
    xml_file = os.path.join(base_dir, "circuitoEsquema.xml")
    html_file = os.path.join(base_dir, "infoCircuito.html")

    NS = {'c': 'http://www.uniovi.es'}

    # Parsear XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Crear objeto Html
    html = Html(title="Información del Circuito")

    # Cabecera HTML
    """
    <head>
        <meta charset="UTF-8"/>
        <meta name="author" content="Olga Alonso Grela"/>
        <meta name="description" content="página principal"/>
        <meta name="keywords" content="MotoGP, piloto, Raúl Fernández, biografía, equipos, resultados, estadísticas, circuito"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" href="estilo/estilo.css"/>
        <link rel="stylesheet" href="estilo/layout.css"/>
        <link rel="icon" href="multimedia/img/motogp.ico"/> <!-- HTML2: Ejercicio 3: favicon -->
        <title>MotoGP</title>
    </head>
    """
    html.add_line('<!DOCTYPE html>')
    html.open_tag("html", 'lang="es"')
    # Elementos head
    html.open_tag("head")
    html.add_line('<meta charset="UTF-8">')
    html.add_line('<meta name="author" content="Olga Alonso Grela"/>')
    html.add_line('<meta name="description" content="Información del circuito Autódromo do Algarve"/>')
    html.add_line('<meta name="keywords" content="MotoGP, circuito, Autódromo do Algarve, Portugal, carrera, resultados, ganador"/>')
    html.add_line('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
    html.add_line(f'<link rel="stylesheet" href="estilo/estilo.css">')
    html.add_line(f'<link rel="stylesheet" href="estilo/layout.css">')
    html.add_line('<link rel="icon" href="multimedia/img/motogp.ico"/>')
    html.add_line(f'<title>{html.title}</title>')
    html.close_tag("head")

    html.open_tag("body")

    # Información general
    info_items = [
        ("Longitud circuito", "c:longitudCircuito"),
        ("Anchura", "c:anchura"),
        ("Fecha de carrera", "c:fechaCarrera"),
        ("Hora de inicio", "c:horaInicio"),
        ("Número de vueltas", "c:numeroVueltas"),
        ("Localidad", "c:localidad"),
        ("País", "c:pais"),
        ("Patrocinador", "c:patrocinador")
    ]

    html.add_line("<h2>Autódromo do Algarve</h2>")
    html.open_tag("section")
    html.add_line("<h3>Datos generales</h3>")
    html.open_tag("ul")
    for label, xpath in info_items:
        elem = root.find(xpath, NS)
        if elem is not None:
            html.add_line(f"<li><strong>{label}:</strong> {elem.text}</li>")
    html.close_tag("ul")
    html.close_tag("section")

    # Referencias
    referencias = root.findall("c:referencias/c:referencia", NS)
    if referencias:
        html.open_tag("section")
        html.add_line("<h3>Referencias</h3>")
        html.open_tag("ul")
        for ref in referencias:
            html.add_line(f'<li><a href="{ref.text}" target="_blank">{ref.text}</a></li>')
        html.close_tag("ul")
        html.close_tag("section")

    # Fotos
    fotos = root.findall("c:fotos/c:foto", NS)
    if fotos:
        html.open_tag("section")
        html.add_line("<h3>Fotos</h3>")
        for foto in fotos:
            html.add_line(f'<img src="{foto.text}" alt="Foto del circuito" style="max-width:100%;height:auto;">')
        html.close_tag("section")

    # Videos
    videos = root.findall("c:videos/c:video", NS)
    if videos:
        html.open_tag("section")
        html.add_line("<h3>Videos</h3>")
        for video in videos:
            html.add_line(f'<video src="{video.text}" controls style="max-width:100%;height:auto;"></video>')
        html.close_tag("section")

    # Vencedor
    ganador = root.find("c:vencedor/c:piloto", NS)
    tiempo = root.find("c:vencedor/c:tiempo", NS)
    if ganador is not None and tiempo is not None:
        html.open_tag("section")
        html.add_line("<h3>Ganador de la carrera</h3>")
        
        # Formatear tiempo PTxxHxxMxxS a HH:MM:SS
        import re
        match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', tiempo.text)
        if match:
            h = int(match.group(1)) if match.group(1) else 0
            m = int(match.group(2)) if match.group(2) else 0
            s = int(match.group(3)) if match.group(3) else 0
            tiempo_formateado = f"{h:02d}:{m:02d}:{s:02d}"
        else:
            tiempo_formateado = tiempo.text

        html.add_line(f"<p>{ganador.text} - Tiempo: {tiempo_formateado}</p>")
        html.close_tag("section")

    # Clasificación Mundial
    clasif = root.findall("c:clasificacionMundial/c:piloto", NS)
    if clasif:
        html.open_tag("section")
        html.add_line("<h3>Clasificación Mundial</h3>")
        html.open_tag("ol")
        for piloto in clasif:
            html.add_line(f"<li>{piloto.text}</li>")
        html.close_tag("ol")
        html.close_tag("section")

    html.close_tag("body")
    html.close_tag("html")

    # Guardar HTML
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html.get_html())

    print(f"Archivo HTML generado correctamente: {html_file}")

if __name__ == "__main__":
    main()
