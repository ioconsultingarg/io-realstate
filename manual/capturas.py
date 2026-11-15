"""
Toma las capturas reales de la demo para el manual.

Levanta la versión compilada con `vite preview`, recorre las pantallas y guarda cada imagen en
manual/capturas/. Usa movimiento reducido: el chat aparece completo y el asistente responde al instante,
así las capturas salen siempre iguales.

Uso (desde la raíz del repo, con la demo compilada):  python manual/capturas.py
"""

import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
DEMO = RAIZ / 'demo'
DESTINO = Path(__file__).resolve().parent / 'capturas'
PUERTO = 4320
BASE = f'http://127.0.0.1:{PUERTO}/'


def esperar_servidor():
    for _ in range(60):
        try:
            urlopen(BASE, timeout=1)
            return
        except Exception:
            time.sleep(0.5)
    sys.exit('No arrancó vite preview')


def main():
    DESTINO.mkdir(exist_ok=True)
    npx = 'npx.cmd' if sys.platform == 'win32' else 'npx'
    servidor = subprocess.Popen([npx, 'vite', 'preview', '--port', str(PUERTO), '--strictPort'], cwd=DEMO, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        esperar_servidor()
        with sync_playwright() as p:
            nav = p.chromium.launch()
            ctx = nav.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=2, reduced_motion='reduce')
            page = ctx.new_page()

            def ir(ruta, nombre, completa=False, ms=900):
                page.goto(BASE + '#' + ruta)
                page.wait_for_timeout(ms)
                page.screenshot(path=str(DESTINO / f'{nombre}.png'), full_page=completa)
                print('  capturada', nombre)

            ir('/', 'hoy')
            ir('/conversaciones?id=lucia', 'clientes')
            ir('/agentes', 'agentes')
            ir('/cerebro', 'cerebro')

            page.goto(BASE + '#/busquedas')
            page.wait_for_timeout(700)
            page.get_by_role('button', name='Me sirve').first.click()
            page.wait_for_timeout(400)
            page.screenshot(path=str(DESTINO / 'busquedas.png'))
            page.locator('#borrador').scroll_into_view_if_needed()
            page.wait_for_timeout(300)
            page.screenshot(path=str(DESTINO / 'busquedas-borrador.png'))
            print('  capturadas busquedas y busquedas-borrador')

            page.goto(BASE + '#/asistente')
            page.wait_for_timeout(600)
            page.get_by_text('Armame el ACM de Ugarte').click()
            page.wait_for_timeout(1200)
            page.get_by_text('Ver informe completo').scroll_into_view_if_needed()
            page.screenshot(path=str(DESTINO / 'asistente-tasacion.png'))
            print('  capturada asistente-tasacion')
            page.get_by_text('Ver informe completo').click()
            page.wait_for_timeout(800)
            page.screenshot(path=str(DESTINO / 'informe-acm.png'))
            print('  capturada informe-acm')

            movil = nav.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=3, reduced_motion='reduce', is_mobile=True, has_touch=True)
            pm = movil.new_page()
            pm.goto(BASE + '#/')
            pm.wait_for_timeout(900)
            pm.screenshot(path=str(DESTINO / 'movil-hoy.png'))
            print('  capturada movil-hoy')
            nav.close()
    finally:
        servidor.terminate()


if __name__ == '__main__':
    main()
