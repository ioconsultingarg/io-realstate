"""
Genera ilustraciones del plugin IO-RealState para Claude (manual/capturas/plugin-*.png).

No son capturas de la app de Claude ni imitan su interfaz: son paneles con el estilo de IO-RealState que muestran
un pedido del asesor y la respuesta que producen las skills con los datos ficticios de plugin/ejemplo/. Cada panel
lleva la leyenda "Ilustración con datos ficticios".

Uso (desde la raíz del repo):  python manual/ilustraciones_plugin.py
"""

from pathlib import Path

from playwright.sync_api import sync_playwright

DESTINO = Path(__file__).resolve().parent / 'capturas'

CSS = """
* { box-sizing: border-box; margin: 0; }
body { background: transparent; font-family: 'Geist', system-ui, sans-serif; }
.panel { width: 760px; background: #15130f; color: #f2ede4; border-radius: 22px; padding: 26px 28px 22px; }
.cab { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.marca { display: flex; gap: 10px; align-items: center; font-weight: 600; font-size: 15px; }
.ceja { font-family: 'Geist Mono', monospace; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #9a9184; }
.yo { margin: 0 0 18px auto; width: fit-content; max-width: 78%; background: #f2ede4; color: #15130f; border-radius: 16px 16px 4px 16px;
      padding: 11px 15px; font-size: 15px; line-height: 1.45; }
.ia { background: #221f1b; border: 1px solid #2f2b25; border-radius: 16px; padding: 18px 20px; font-size: 14.5px; line-height: 1.55; }
.sello { display: flex; gap: 8px; align-items: center; font-size: 12.5px; color: #c9c1b3; margin-bottom: 10px; }
.sello i { display: inline-block; width: 22px; height: 22px; border-radius: 6px; background: #18213a; }
.skill { font-family: 'Geist Mono', monospace; font-size: 11.5px; color: #8fb2ff; background: #18213a; border-radius: 6px; padding: 2px 7px; }
b, strong { color: #fff; font-weight: 600; }
.marca-c { color: #e3b968; }
.ok { color: #5cc996; } .no { color: #f0806f; } .q { color: #e8ae55; }
.meta { color: #9a9184; font-size: 13px; }
.item { padding: 10px 0; border-top: 1px solid #2f2b25; }
.item:first-of-type { border-top: 0; }
.num { font-family: 'Geist Mono', monospace; font-variant-numeric: tabular-nums; }
.borrador { background: #0f0e0c; border-radius: 12px; padding: 14px 16px; white-space: pre-line; font-size: 15px; line-height: 1.5; margin-top: 10px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.chips span { font-size: 11.5px; background: #18213a; color: #8fb2ff; border-radius: 999px; padding: 3px 9px; }
.kpis { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 10px; margin: 10px 0 12px; }
.kpi { background: #0f0e0c; border-radius: 12px; padding: 12px 14px; }
.kpi .v { font-family: 'Geist Mono', monospace; font-size: 20px; color: #fff; margin-top: 4px; }
.kpi.oro { background: #2b2316; } .kpi.oro .v { color: #e3b968; }
.pie { display: flex; justify-content: space-between; margin-top: 14px; font-size: 11.5px; color: #9a9184; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
td, th { padding: 6px 4px; border-bottom: 1px solid #2f2b25; text-align: left; }
th { color: #9a9184; font-weight: 500; }
td.r, th.r { text-align: right; }
"""

MARCA = """<svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#f2ede4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21 L12 47" stroke-width="7"/><path d="M29 30 L42.5 18.5 L56 30 L56 41 Q56 47 50 47 L35 47 Q29 47 29 41 Z" stroke-width="6.5"/></g><rect x="39.5" y="32" width="6" height="6" rx="1.6" fill="#e3b968"/></svg>"""


def panel(paso: str, pedido: str, skill: str, cuerpo: str) -> str:
    return f"""
<div class="panel">
  <div class="cab"><div class="marca">{MARCA} IO-RealState <span class="meta" style="font-weight:400">· plugin para Claude</span></div><span class="ceja">{paso}</span></div>
  <p class="yo">{pedido}</p>
  <div class="ia">
    <div class="sello"><i></i>Responde con la skill <span class="skill">{skill}</span></div>
    {cuerpo}
  </div>
  <div class="pie"><span>Ilustración con datos ficticios</span><span>Los datos quedan en la carpeta IO-RealState de tu computadora</span></div>
</div>"""


ESCENAS = {
    'plugin-1-busquedas': panel(
        'Paso 1 · Búsquedas',
        '¿Qué búsquedas tengo?',
        'busquedas-de-compradores',
        """<p style="margin-bottom:8px">Tenés <b>2 búsquedas activas</b>:</p>
        <div class="item"><b>Familia Ocampo</b> <span class="meta">· desde el 5/11 · alertas en Zonaprop, Argenprop y Mercado Libre</span><br>
        Compra · Villa Urquiza o Coghlan · 4+ ambientes · hasta USD 300.000<br>
        <span class="meta">Obligatorio:</span> patio o terraza · <span class="meta">Deseable:</span> cerca del colegio, cochera, sin escaleras</div>
        <div class="item"><b>Lucía Benítez</b> <span class="meta">· desde el 14/11 · alertas en Zonaprop y Argenprop</span><br>
        Compra · Belgrano · 3+ ambientes · USD 180.000 a 210.000<br>
        <span class="meta">Obligatorio:</span> apto crédito · <span class="meta">Deseable:</span> balcón, cerca del subte</div>
        <p style="margin-top:10px">¿Cargamos otra o reviso las alertas de hoy?</p>""",
    ),
    'plugin-2-alertas': panel(
        'Paso 2 · Alertas del día',
        'Revisá las alertas',
        'revisar-alertas',
        """<p class="meta" style="margin-bottom:6px">6 avisos en 3 mails · 1 duplicado (Melián 3120 en Zonaprop y Argenprop) · 5 para revisar</p>
        <p style="margin:8px 0 2px"><b class="marca-c">Familia Ocampo · 3</b></p>
        <div class="item"><b>1. Melián 3120, Coghlan</b> · <span class="num">USD 289.000</span> · <b class="num">94</b> <span class="meta">muy buena</span><br>
        <span class="ok">✓ terraza propia</span> · <span class="ok">✓ a 4 cuadras del colegio</span> · <span class="ok">✓ sin escaleras</span> · <span class="no">✗ sin cochera</span><br><span class="meta">Zonaprop y Argenprop</span></div>
        <div class="item"><b>2. Pedraza 2450, Villa Urquiza</b> · <span class="num">USD 262.000</span> · <b class="num">85</b> <span class="meta">muy buena</span><br>
        <span class="ok">✓ patio</span> · <span class="ok">✓ USD 38 k por debajo del tope</span> · <span class="q">~ colegio a verificar</span> · <span class="no">✗ escalera</span> · <span class="no">✗ sin cochera</span><br><span class="meta">Mercado Libre</span></div>
        <div class="item"><b>3. Monroe 4880, Villa Urquiza</b> · <span class="num">USD 305.000</span> · <b class="num">64</b> <span class="meta">posible</span><br>
        <span class="q">~ USD 5 k arriba del tope</span> · <span class="q">~ no dice si tiene patio o terraza</span> · <span class="ok">✓ cochera</span><br><span class="meta">Zonaprop</span></div>
        <p style="margin:12px 0 2px"><b class="marca-c">Lucía Benítez · 2</b></p>
        <div class="item"><b>4. Juramento 2655, Belgrano</b> · <span class="num">USD 205.000</span> · <b class="num">99</b> <span class="meta">muy buena</span><br>
        <span class="ok">✓ apto crédito</span> · <span class="ok">✓ balcón aterrazado</span> · <span class="ok">✓ a 2 cuadras del subte D</span><br><span class="meta">Argenprop</span></div>
        <div class="item"><b>5. Mendoza 2140, Belgrano</b> · <span class="num">USD 189.000</span> · <b class="num">66</b> <span class="meta">buena</span><br>
        <span class="q">~ no dice si es apto crédito</span> · <span class="no">✗ sin balcón</span> · <span class="q">~ subte a verificar</span><br><span class="meta">Mercado Libre</span></div>
        <p style="margin-top:10px">¿Cuáles te sirven? Decime los números y te armo el mensaje para cada cliente.</p>""",
    ),
    'plugin-3-mensaje': panel(
        'Paso 3 · Mensaje en tu voz',
        'Los dos de los Ocampo me sirven. Armale el mensaje a Mariana.',
        'mensaje-en-tu-voz',
        """<div class="borrador">Hola Mariana. Entraron dos que creo que te pueden servir.

Melián 3120, en Coghlan. 4 ambientes con terraza propia de 30 m², a 4 cuadras del colegio. Piden USD 289.000. No tiene cochera.

Pedraza 2450, en Villa Urquiza. PH con patio, sin expensas, a USD 262.000. Tiene escalera al primer piso, eso sí.

¿Te parece si coordino para verlas el sábado a la mañana?
Martina</div>
        <div class="chips"><span>Saluda con "Hola" y el nombre</span><span>Tutea</span><span>Sin emojis</span><span>Frases cortas</span><span>Cierra con una pregunta</span><span>Firma Martina</span></div>
        <p class="meta" style="margin-top:10px">Copialo y mandalo desde tu WhatsApp. Si algo no lo dirías así, decímelo y lo aprendo.</p>""",
    ),
    'plugin-4-tasacion': panel(
        'Paso 4 · Tasación',
        'Armame el ACM de Ugarte 1856, PH de 4 ambientes y 120 m² con terraza propia, para Tomás Iriarte',
        'tasacion-acm',
        """<p>Con <b>6 PH comparables</b> de Villa Urquiza y Coghlan (4 vendidos, 2 publicados):</p>
        <div class="kpis">
          <div class="kpi oro"><div class="ceja" style="color:#e3b968">Valor sugerido</div><div class="v">USD 239.000</div></div>
          <div class="kpi"><div class="ceja">Rango</div><div class="v" style="font-size:15px">228.000 – 246.000</div></div>
          <div class="kpi"><div class="ceja">Días de venta</div><div class="v">≈ 69</div></div>
        </div>
        <table><tr><th>Comparable</th><th class="r">m²</th><th class="r">USD/m²</th><th class="r">Estado</th></tr>
        <tr><td>Tamborini 4512 · PH</td><td class="r num">115</td><td class="r num">1.965</td><td class="r">Vendido · 63 d</td></tr>
        <tr><td>Ugarte 2010 · PH</td><td class="r num">126</td><td class="r num">2.000</td><td class="r">Vendido · 58 d</td></tr>
        <tr><td class="meta">+ 4 comparables más</td><td></td><td></td><td></td></tr></table>
        <p style="margin-top:10px">Mediana de <span class="num">USD 1.983/m²</span> × 120 m² + 0,5 % por terraza propia. Dejé el informe en <span class="num">tasaciones/ugarte-1856.md</span> como <b>borrador pendiente de firma</b>. ¿Lo revisás?</p>""",
    ),
}


def main():
    DESTINO.mkdir(exist_ok=True)
    with sync_playwright() as p:
        nav = p.chromium.launch()
        page = nav.new_page(device_scale_factor=2, viewport={'width': 820, 'height': 900})
        for nombre, html in ESCENAS.items():
            page.set_content(
                f"""<!doctype html><html lang="es-AR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{html}</body></html>"""
            )
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(400)
            page.locator('.panel').screenshot(path=str(DESTINO / f'{nombre}.png'), omit_background=True)
            print('  ilustración', nombre)
        nav.close()


if __name__ == '__main__':
    main()
