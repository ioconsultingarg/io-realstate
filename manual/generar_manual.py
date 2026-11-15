"""
Genera Manual-IO-RealState.pdf desde 07-MANUAL.md.

Convierte el Markdown a HTML con el estilo "Plano" (versión clara para imprimir), dibuja los diagramas
mermaid, inserta las capturas de manual/capturas/ y lo imprime a PDF con Chromium (Playwright).
Copia el resultado a demo/public/ para que la demo publicada lo enlace.

Uso (desde la raíz del repo):  python manual/capturas.py && python manual/generar_manual.py
"""

import re
import shutil
from pathlib import Path

import markdown
from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
CAPTURAS = Path(__file__).resolve().parent / 'capturas'
SALIDA = RAIZ / 'Manual-IO-RealState.pdf'
COPIA_DEMO = RAIZ / 'demo' / 'public' / 'manual-io-realstate.pdf'

# capturas que se insertan después del encabezado que empieza con la clave
FIGURAS = {
    '## 2.': [('hoy', 'Pantalla Hoy: lo que hicieron los agentes, KPI de la semana y el chat de la noche.')],
    '## 4.': [('clientes', 'Pantalla Clientes: la conversación de las 23:14 y la ficha que armó el agente.')],
    '## 6.': [
        ('asistente-tasacion', 'Pedido de tasación al asistente: el agente devuelve el rango y los comparables.'),
        ('informe-acm', 'El informe con la marca de la inmobiliaria, en borrador hasta que firma la corredora.'),
    ],
    '## 8 bis.': [
        ('busquedas', 'Pantalla Búsquedas: los criterios del cliente y lo que encontró el agente, ordenado por afinidad.'),
        ('busquedas-borrador', 'El borrador del mensaje al cliente, escrito como escribe la asesora. Lo manda ella.'),
    ],
    '## 9.': [('agentes', 'Pantalla Agentes: el catálogo, con los que están activos y los que vienen.')],
    '## 10.': [('busquedas-aviso', 'Agregar un aviso: se pega el texto y el agente completa los datos y muestra la afinidad antes de guardar.'), ('tasacion-editor', 'Editor de tasación: superficie, ajuste y comparables, con el valor recalculado en vivo.'), ('cerebro', 'Pantalla Cerebro: los 10 temas y la cartera sincronizada.'), ('movil-hoy', 'La misma demo en el celular.')],
}

MARCA = """<svg width="44" height="44" viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#1a1714" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21 L12 47" stroke-width="7"/><path d="M29 30 L42.5 18.5 L56 30 L56 41 Q56 47 50 47 L35 47 Q29 47 29 41 Z" stroke-width="6.5"/></g><rect x="39.5" y="32" width="6" height="6" rx="1.6" fill="#a3640c"/></svg>"""

CSS = """
@page { size: A4; margin: 18mm 17mm 20mm; }
:root { --ink:#1a1714; --ink2:#4a443b; --ink3:#6b6458; --line:#e2dbcf; --sunken:#f3efe8; --marca:#8a5a12; --marcaSoft:#f6ecd9; }
* { box-sizing: border-box; }
body { font-family: 'Geist', system-ui, sans-serif; color: var(--ink2); font-size: 10.5pt; line-height: 1.55; margin: 0; }
h1, h2, h3 { color: var(--ink); text-wrap: balance; }
h1 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; font-size: 34pt; line-height: 1; margin: 0 0 6mm; letter-spacing: -0.01em; }
h2 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; font-size: 21pt; line-height: 1.1; margin: 9mm 0 3mm; break-after: avoid; }
h3 { font-size: 12pt; margin: 6mm 0 2mm; break-after: avoid; }
p { margin: 0 0 3mm; text-wrap: pretty; }
strong { color: var(--ink); font-weight: 600; }
code { font-family: 'Geist Mono', monospace; font-size: 9pt; background: var(--sunken); padding: 0.5mm 1.2mm; border-radius: 1.2mm; color: var(--ink); }
blockquote { margin: 3mm 0; padding: 3mm 4mm; background: var(--marcaSoft); border-radius: 2mm; color: var(--ink); }
hr { border: 0; border-top: 1px solid var(--line); margin: 6mm 0; }
ul, ol { margin: 0 0 3mm; padding-left: 5mm; }
li { margin: 0.8mm 0; }
table { width: 100%; border-collapse: collapse; margin: 2mm 0 5mm; font-size: 9pt; break-inside: auto; }
th { text-align: left; font-weight: 600; color: var(--ink); background: var(--sunken); }
th, td { padding: 1.8mm 2.2mm; border-bottom: 1px solid var(--line); vertical-align: top; }
tr { break-inside: avoid; }
pre.mermaid { background: #fff; border: 1px solid var(--line); border-radius: 3mm; padding: 4mm; text-align: center; break-inside: avoid; margin: 3mm 0 5mm; }
pre.mermaid svg { max-width: 100%; height: auto; }
figure { margin: 4mm 0 6mm; break-inside: avoid; }
figure img { width: 100%; border-radius: 2.5mm; border: 1px solid var(--line); }
figure.movil img { width: 42%; display: block; margin: 0 auto; }
figcaption { font-size: 8.5pt; color: var(--ink3); margin-top: 1.5mm; text-align: center; }
.portada { height: 255mm; display: flex; flex-direction: column; justify-content: space-between; break-after: page;
  background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 7mm 7mm; padding: 12mm; border-radius: 4mm; }
.portada .ceja { font-family: 'Geist Mono', monospace; font-size: 8.5pt; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink3); }
.portada h1 { font-size: 54pt; margin: 4mm 0 5mm; }
.portada h1 em { color: var(--marca); }
.portada .bajada { font-size: 13pt; color: var(--ink2); max-width: 120mm; background: #f5f2ecee; }
.portada .pie { font-size: 9pt; color: var(--ink3); background: #f5f2ecee; }
.marca { display: flex; align-items: center; gap: 3mm; font-weight: 600; color: var(--ink); font-size: 12pt; }
"""


def figuras_html(items):
    html = ''
    for nombre, texto in items:
        ruta = CAPTURAS / f'{nombre}.png'
        if not ruta.exists():
            continue
        clase = ' class="movil"' if nombre.startswith('movil') else ''
        html += f'<figure{clase}><img src="{ruta.as_uri()}" alt="{texto}"><figcaption>{texto}</figcaption></figure>\n'
    return html


def main():
    md = (RAIZ / '07-MANUAL.md').read_text(encoding='utf-8')
    # el título del archivo va en la portada
    md = re.sub(r'^# .*\n', '', md, count=1)
    # diagramas mermaid: bloque crudo que mermaid dibuja en el navegador
    md = re.sub(r'```mermaid\n(.*?)```', lambda m: f'<pre class="mermaid">\n{m.group(1)}</pre>', md, flags=re.S)
    # capturas después de cada sección
    lineas = []
    pendientes = None
    for linea in md.split('\n'):
        if linea.startswith('## ') and pendientes:
            lineas.append(figuras_html(pendientes))
            pendientes = None
        lineas.append(linea)
        for clave, items in FIGURAS.items():
            if linea.startswith(clave + ' ') or linea == clave:
                pendientes = items
    if pendientes:
        lineas.append(figuras_html(pendientes))
    cuerpo = markdown.markdown('\n'.join(lineas), extensions=['tables', 'fenced_code', 'sane_lists'])

    html = f"""<!doctype html><html lang="es-AR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
<section class="portada">
  <div class="marca">{MARCA} IO-RealState</div>
  <div>
    <p class="ceja">Manual · versión demo · noviembre 2026</p>
    <h1>Cómo funciona <em>IO-RealState</em></h1>
    <p class="bajada">Un equipo de agentes de IA, uno por departamento, que atiende y trabaja por WhatsApp con la información de tu inmobiliaria. Qué es cada pieza, qué pasa en cada flujo y cómo recorrer la demo.</p>
  </div>
  <p class="pie">IO Consulting · contacto@ioconsulting.com.ar · © 2026 Todos los derechos reservados.<br>Los datos de la demo son ficticios.</p>
</section>
{cuerpo}
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';
  mermaid.initialize({{ startOnLoad: false, theme: 'base',
    sequence: {{ actorFontSize: 17, messageFontSize: 17, noteFontSize: 16, width: 120, actorMargin: 30, boxMargin: 6 }},
    flowchart: {{ useMaxWidth: true }},
    themeVariables: {{ fontSize: '17px',
    fontFamily: 'Geist, sans-serif', primaryColor: '#f6ecd9', primaryBorderColor: '#a3640c', primaryTextColor: '#1a1714',
    lineColor: '#6b6458', secondaryColor: '#e8eefc', tertiaryColor: '#f3efe8', actorBkg: '#f6ecd9', actorBorder: '#a3640c' }} }});
  await mermaid.run({{ querySelector: 'pre.mermaid' }});
  document.body.dataset.listo = '1';
</script>
</body></html>"""

    temporal = RAIZ / 'manual' / 'manual.html'
    temporal.write_text(html, encoding='utf-8')

    with sync_playwright() as p:
        nav = p.chromium.launch()
        page = nav.new_page()
        page.goto(temporal.as_uri())
        page.wait_for_selector('body[data-listo="1"]', timeout=60000)
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(500)
        page.pdf(
            path=str(SALIDA),
            format='A4',
            print_background=True,
            display_header_footer=True,
            header_template='<span></span>',
            footer_template='<div style="width:100%;font-family:sans-serif;font-size:8px;color:#6b6458;padding:0 17mm;display:flex;justify-content:space-between"><span>IO-RealState · Manual</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
            margin={'top': '16mm', 'bottom': '18mm', 'left': '17mm', 'right': '17mm'},
        )
        nav.close()
    temporal.unlink()
    shutil.copyfile(SALIDA, COPIA_DEMO)
    print('PDF:', SALIDA, f'({SALIDA.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
