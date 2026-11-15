"""
Genera IO-RealState-Propuesta.pdf: la pieza de venta para asesores e inmobiliarias.

Usa las mismas capturas que el manual (manual/capturas/) y el estilo "Plano". Incluye un QR a la demo
publicada en GitHub Pages. Copia el resultado a demo/public/ para que la demo lo enlace.

Uso (desde la raíz del repo):  python manual/capturas.py && python manual/generar_venta.py
"""

import io
import shutil
from pathlib import Path

import qrcode
import qrcode.image.svg
from playwright.sync_api import sync_playwright

from generar_manual import CSS, MARCA

RAIZ = Path(__file__).resolve().parent.parent
CAPTURAS = Path(__file__).resolve().parent / 'capturas'
SALIDA = RAIZ / 'IO-RealState-Propuesta.pdf'
COPIA_DEMO = RAIZ / 'demo' / 'public' / 'io-realstate-propuesta.pdf'
DEMO = 'https://ioconsultingarg.github.io/io-realstate/'
CONTACTO = 'contacto@ioconsulting.com.ar'


def qr_svg(url: str) -> str:
    img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=1)
    buf = io.BytesIO()
    img.save(buf)
    svg = buf.getvalue().decode('utf-8')
    return svg[svg.index('<svg') :]


def img(nombre: str, pie: str = '', clase: str = '') -> str:
    ruta = CAPTURAS / f'{nombre}.png'
    if not ruta.exists():
        return ''
    figura = f'<figure class="{clase}"><img src="{ruta.as_uri()}" alt="{pie}">'
    if pie:
        figura += f'<figcaption>{pie}</figcaption>'
    return figura + '</figure>'


CSS_VENTA = """
.pagina { break-after: page; }
.pagina:last-child { break-after: auto; }
.grande { font-family: 'Instrument Serif', Georgia, serif; font-size: 30pt; line-height: 1.05; color: var(--ink); margin: 2mm 0 5mm; }
.grande em { color: var(--marca); }
.ceja { font-family: 'Geist Mono', monospace; font-size: 8.5pt; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink3); }
.dolores { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin: 6mm 0; }
.dolor { border: 1px solid var(--line); border-radius: 3mm; padding: 4mm 5mm; }
.dolor b { display: block; color: var(--ink); font-size: 11.5pt; margin-bottom: 1mm; }
.cita { border-left: 3px solid var(--marca); padding: 2mm 0 2mm 5mm; margin: 6mm 0; font-family: 'Instrument Serif', Georgia, serif; font-size: 15pt; line-height: 1.3; color: var(--ink); }
.cita small { display: block; font-family: 'Geist', sans-serif; font-size: 9pt; color: var(--ink3); margin-top: 2mm; }
.pasos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin: 5mm 0 7mm; }
.paso { background: var(--sunken); border-radius: 3mm; padding: 5mm; }
.paso .n { font-family: 'Geist Mono', monospace; color: var(--marca); font-size: 10pt; }
.paso b { display: block; color: var(--ink); margin: 1.5mm 0 1mm; font-size: 11.5pt; }
.funcion { display: grid; grid-template-columns: 0.95fr 1.25fr; gap: 6mm; align-items: center; margin: 0 0 7mm; break-inside: avoid; }
.funcion h3 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; font-size: 18pt; margin: 0 0 2mm; }
.funcion figure { margin: 0; }
.funcion ul { padding-left: 4mm; }
.nunca { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 6mm; margin: 4mm 0 0; padding: 0; list-style: none; }
.nunca li { padding-left: 6mm; position: relative; }
.nunca li::before { content: '✕'; position: absolute; left: 0; color: #b42318; font-weight: 600; }
.planes { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin: 5mm 0; }
.plan { border: 1px solid var(--line); border-radius: 4mm; padding: 6mm; }
.plan.destacado { border: 2px solid var(--marca); background: var(--marcaSoft); }
.plan h3 { margin: 0; font-size: 13pt; }
.plan .precio { font-family: 'Geist Mono', monospace; font-size: 22pt; color: var(--ink); margin: 3mm 0 1mm; }
.plan .precio small { font-size: 10pt; color: var(--ink3); }
.plan ul { padding-left: 4.5mm; margin-top: 3mm; }
.cierre { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 8mm; align-items: center; }
.qr { background: #fff; border: 1px solid var(--line); border-radius: 4mm; padding: 5mm; text-align: center; }
.qr svg { width: 46mm; height: 46mm; }
.qr p { margin: 2mm 0 0; font-family: 'Geist Mono', monospace; font-size: 8pt; color: var(--ink2); word-break: break-all; }
.probar li { margin: 1.5mm 0; }
.nota { font-size: 8.5pt; color: var(--ink3); }
"""


def main():
    qr = qr_svg(DEMO)
    html = f"""<!doctype html><html lang="es-AR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>{CSS}{CSS_VENTA}</style></head><body>

<section class="portada">
  <div class="marca">{MARCA} IO-RealState</div>
  <div>
    <p class="ceja">Propuesta · asesores e inmobiliarias · noviembre 2026</p>
    <h1>Un equipo de IA que trabaja <em>para vos</em>, no en tu lugar</h1>
    <p class="bajada">Busca propiedades para tus clientes, arma tasaciones en minutos, te escribe los mensajes como los escribís vos y atiende las consultas de noche. Vos elegís, firmás y cerrás.</p>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8mm">
    <p class="pie">Probá la demo: <b>{DEMO}</b><br>IO Consulting · {CONTACTO}</p>
    <div style="background:#fff;border-radius:3mm;padding:3mm;width:30mm;height:30mm">{qr.replace('<svg', '<svg style="width:24mm;height:24mm"', 1)}</div>
  </div>
</section>

<section class="pagina">
  <p class="ceja">El problema</p>
  <p class="grande">Lo que hoy te come el día <em>no es vender</em>.</p>
  <div class="dolores">
    <div class="dolor"><b>Buscar a mano</b>Revisar portales todos los días para cada cliente comprador, filtrar repetidos y descartar lo que no sirve.</div>
    <div class="dolor"><b>Tasar lleva horas</b>Juntar comparables, calcular el precio por m² y armar un informe presentable para el propietario.</div>
    <div class="dolor"><b>Consultas que se enfrían</b>Las que llegan de noche o el fin de semana esperan al día siguiente, y el interesado le escribe a otro.</div>
    <div class="dolor"><b>Todo pasa por vos</b>La agenda, los seguimientos y lo que sabe la inmobiliaria viven en tu cabeza y en tu WhatsApp.</div>
  </div>
  <p class="cita">“Tengo tres búsquedas activas, tres clientes con la plata en la mano. Si un bot busca por mí y me avisa cuando aparece algo nuevo, yo solo filtro. Eso sí: los mensajes que salen no pueden parecer de una IA.”<small>Agente inmobiliario en actividad</small></p>

  <p class="ceja" style="margin-top:9mm">Cómo funciona</p>
  <div class="pasos">
    <div class="paso"><span class="n">01</span><b>Le contás cómo trabajás</b>Lo que busca cada cliente, tu cartera, tus zonas y tus precios. Por WhatsApp o en el panel.</div>
    <div class="paso"><span class="n">02</span><b>Los agentes hacen el trabajo</b>Revisan las alertas de los portales, calculan, redactan, agendan y te avisan lo importante.</div>
    <div class="paso"><span class="n">03</span><b>Vos decidís</b>Elegís qué mandar, revisás y firmás. Nada sale en tu nombre sin que lo apruebes.</div>
  </div>
</section>

<section class="pagina">
  <p class="ceja">Qué hace</p>
  <div class="funcion">
    <div><h3>Búsquedas que te avisan</h3>
      <ul><li>Cargás lo que busca cada cliente: lo obligatorio y lo deseable.</li><li>Junta las alertas de Zonaprop, Argenprop y Mercado Libre, saca duplicados y te avisa solo lo que coincide.</li><li>Te dice por qué: "terraza propia, a 4 cuadras del colegio, sin cochera".</li></ul></div>
    {img('busquedas')}
  </div>
  <div class="funcion">
    <div><h3>Mensajes en tu voz</h3>
      <ul><li>Con las propiedades que elegiste, arma el mensaje como lo escribís vos: sin emojis forzados ni frases de folleto.</li><li>Lo revisás y lo mandás desde tu WhatsApp. Es tu mensaje.</li></ul></div>
    {img('busquedas-borrador')}
  </div>
  <div class="funcion">
    <div><h3>Tasación en minutos</h3>
      <ul><li>Comparables vendidos y publicados, precio por m², rango y días de venta.</li><li>Informe con tu marca, listo para el propietario, que firmás vos.</li></ul></div>
    {img('informe-acm')}
  </div>
</section>

<section class="pagina">
  <div class="funcion">
    <div><h3>Atención a cualquier hora</h3>
      <ul><li>Para inmobiliarias: responde en tu WhatsApp con tu cartera real, califica al interesado y agenda la visita en la agenda del asesor.</li><li>Lo que necesita criterio humano (precio, ofertas, reclamos) pasa al asesor con el resumen hecho.</li></ul></div>
    {img('clientes')}
  </div>
  <div class="funcion">
    <div><h3>Tu día ordenado</h3>
      <ul><li>Recordatorios por WhatsApp: "recordame llamar a Tomás el jueves 10".</li><li>Panel con lo que pasó de noche, visitas del día y resultados de la semana.</li></ul></div>
    {img('hoy')}
  </div>
  <p class="ceja" style="margin-top:4mm">Lo que nunca hace</p>
  <ul class="nunca">
    <li>Negociar precio, aceptar ofertas o tomar reservas</li>
    <li>Inventar datos que no están en tu cartera</li>
    <li>Firmar una tasación: la firma es del corredor</li>
    <li>Recorrer portales con robots: usa sus alertas</li>
    <li>Escribirle a quien no aceptó recibir mensajes</li>
    <li>Ocultar que es un asistente cuando responde solo</li>
  </ul>
</section>

<section class="pagina">
  <p class="ceja">Planes</p>
  <p class="grande">Empezá por lo que <em>más tiempo te ahorra</em>.</p>
  <div class="planes">
    <div class="plan destacado">
      <h3>Asesor</h3>
      <p class="nota">Para el corredor independiente o el asesor con sus propios clientes</p>
      <p class="precio">USD 49 <small>/ mes</small></p>
      <ul>
        <li>Hasta 20 búsquedas activas con aviso de novedades</li>
        <li>Mensajes en tu voz para cada cliente</li>
        <li>Tasaciones con informe y firma</li>
        <li>Recordatorios y agenda en Google Calendar</li>
        <li>Lo usás el mismo día: sin trámites</li>
      </ul>
    </div>
    <div class="plan">
      <h3>Inmobiliaria</h3>
      <p class="nota">Hasta 10 asesores y 600 consultas por mes</p>
      <p class="precio">USD 449 <small>/ mes</small></p>
      <ul>
        <li>Todo lo del plan Asesor para el equipo</li>
        <li>Atención 24/7 en el WhatsApp de la inmobiliaria</li>
        <li>Panel del dueño, aprobaciones y auditoría</li>
        <li>Capacitación y práctica de objeciones</li>
        <li>Consultas extra: USD 0,40 cada una</li>
      </ul>
    </div>
  </div>
  <p>Precios de lanzamiento en dólares, se pueden pagar en pesos. La <b>implementación asistida</b> (armado del cerebro de la inmobiliaria, conexión del WhatsApp y capacitación del equipo) se cotiza aparte según el diagnóstico. Cada propuesta se ajusta a tu equipo y a tu momento.</p>
  <p class="ceja" style="margin-top:7mm">Cómo empezamos</p>
  <div class="pasos">
    <div class="paso"><span class="n">01</span><b>Reunión sin costo</b>20 minutos para ver cómo trabajás hoy y qué te saca más tiempo.</div>
    <div class="paso"><span class="n">02</span><b>Piloto con tus casos</b>Tus búsquedas y tasaciones reales durante dos semanas.</div>
    <div class="paso"><span class="n">03</span><b>Implementación</b>Lo dejamos andando y lo seguimos con vos.</div>
  </div>
</section>

<section class="pagina">
  <p class="ceja">Probalo ahora</p>
  <div class="cierre">
    <div>
      <p class="grande">La demo <em>funciona</em>: probala con un cliente real.</p>
      <ol class="probar">
        <li><b>Búsquedas → Nueva búsqueda:</b> cargá lo que pide uno de tus clientes.</li>
        <li><b>Agregar aviso:</b> pegá el texto de un aviso que hayas visto hoy y mirá cómo lo evalúa.</li>
        <li><b>Me sirve:</b> elegí una o dos y leé el mensaje que te arma.</li>
        <li><b>Asistente → #tasación:</b> cambiá los comparables por ventas que conozcas y mirá el valor.</li>
      </ol>
      <p class="nota">Lo que cargues queda solo en tu navegador. Los datos de ejemplo son ficticios.</p>
    </div>
    <div class="qr">{qr}<p>{DEMO}</p></div>
  </div>
  <div style="margin-top:12mm;border-top:1px solid var(--line);padding-top:6mm;display:flex;justify-content:space-between;align-items:center">
    <div class="marca">{MARCA} IO-RealState</div>
    <p style="margin:0;text-align:right">IO Consulting<br><b>{CONTACTO}</b></p>
  </div>
</section>

</body></html>"""

    temporal = RAIZ / 'manual' / 'venta.html'
    temporal.write_text(html, encoding='utf-8')
    with sync_playwright() as p:
        nav = p.chromium.launch()
        page = nav.new_page()
        page.goto(temporal.as_uri())
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(1200)
        page.pdf(
            path=str(SALIDA),
            format='A4',
            print_background=True,
            display_header_footer=True,
            header_template='<span></span>',
            footer_template='<div style="width:100%;font-family:sans-serif;font-size:8px;color:#6b6458;padding:0 17mm;display:flex;justify-content:space-between"><span>IO-RealState · Propuesta</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
            margin={'top': '16mm', 'bottom': '18mm', 'left': '17mm', 'right': '17mm'},
        )
        nav.close()
    temporal.unlink()
    shutil.copyfile(SALIDA, COPIA_DEMO)
    print('PDF:', SALIDA, f'({SALIDA.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
