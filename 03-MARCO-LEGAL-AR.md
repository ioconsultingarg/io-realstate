# 03 · Marco legal argentino aplicable

> **Esto no es asesoramiento legal.** Es el mapa de normas que el producto tiene que respetar, para
> validarlo con un abogado y con el Colegio de la jurisdicción antes del primer cliente pago.
> Cada punto indica de dónde sale: **[Colegio]** = leído en colegioinmobiliario.org.ar el 14/11/2026;
> **[A verificar]** = conocimiento general que todavía no se contrastó con la fuente oficial.

---

## 1. Qué dice (y qué no dice) el sitio del Colegio

Fuente indicada por Gonzalo: https://colegioinmobiliario.org.ar/ (CUCICBA, Colegio Único de Corredores
Inmobiliarios de la Ciudad de Buenos Aires). Páginas leídas: home, servicios, matriculación, registro de
ilegales, calculadora de alquileres, novedades y privacidad.

**Lo que sí está [Colegio]:**

- Para ejercer el corretaje inmobiliario en CABA **hay que estar matriculado en el CUCICBA**; la
  matrícula se jura según la **Ley 2340** (CABA). Requisitos: título universitario de corredor, domicilio
  en CABA con un año de antigüedad, antecedentes penales, entre otros. Costos 2027: inscripción
  $6.000.000, matrícula anual $750.000, fianza $15.000.
- **Registro público de "Inmobiliarias Ilegales e Infractores"** (271 registros al relevarlo): operar sin
  habilitación del Colegio se persigue y se publica.
- **Alquileres**: la calculadora del Colegio resume que la Ley 27.551 (2020) y la 27.737 (2023) fijaban
  plazos e índices, y que el **DNU 70/2023** dejó índice y frecuencia de ajuste a la libre negociación de
  las partes. Ofrece índices (BCRA/ICL, INDEC, Casa Propia, IPCBA) e **integración por iframe o API REST
  para portales**.
- Política de privacidad de su app: cita la **Ley 25.326**, transferencia internacional de datos con
  consentimiento expreso (servidores AWS en EE.UU.) y la AAIP como autoridad.
- Novedades recientes sin leer en detalle: "Firma Electrónica" (21/10/2026), "Real Estate Innovation"
  (06/11/2026), "Perspectivas 2027 y claves jurídicas" (16/10/2026). Conviene leerlas.

**Lo que NO está en el sitio:** código de ética, reglas de publicidad, honorarios, reservas/señas,
tasaciones, UIF, IA. Para esos temas hay que ir a la Ley 2340, al código de ética y a las resoluciones del
Colegio, o consultar a info@colegioinmobiliario.org.ar.

**Ojo con el alcance territorial**: el CUCICBA es solo CABA. Cada provincia tiene su ley y su colegio
(p. ej. Colegio de Martilleros y Corredores en Provincia de Buenos Aires, Córdoba, Santa Fe, Chaco). El
producto tiene que tener la **jurisdicción como dato del cliente** y textos legales por jurisdicción.

---

## 2. Reglas de diseño que se desprenden

### 2.1 El agente no intermedia: asiste a un corredor matriculado

- [Colegio] Solo un corredor matriculado puede ejercer el corretaje. [A verificar] El Código Civil y
  Comercial (arts. 1345 a 1355) regula el contrato de corretaje.
- **Regla de producto**: la cuenta de la inmobiliaria tiene un **corredor responsable** con matrícula y
  jurisdicción cargadas en el onboarding. Los agentes de cara al cliente **se presentan como asistentes de
  la inmobiliaria** y no cierran operaciones, no aceptan ofertas, no fijan precios ni toman reservas o
  señas: todo eso se deriva al corredor.
- **Vender solo a matriculados** (o a inmobiliarias con corredor responsable). Verificar la matrícula al
  alta contra el padrón público del Colegio cuando exista consulta (CUCICBA tiene "Guía de matriculados" y
  "Padrón"). Esto además es argumento de venta ante el Colegio: el producto **no habilita el ejercicio
  ilegal**.

### 2.2 Publicidad de inmuebles

- [A verificar] La Ley 2340 y normas de los colegios exigen que la publicidad de un corredor identifique
  **nombre y matrícula**; Defensa del Consumidor (Ley 24.240) exige información veraz y precio cierto.
- **Regla de producto**: toda ficha, copy, posteo o aviso generado lleva **pie con nombre del corredor
  responsable y matrícula** (configurable por jurisdicción) y no inventa datos: los campos que no estén en
  la cartera salen como "a confirmar", nunca completados por el modelo.

### 2.3 Tasaciones

- [A verificar] Quién puede firmar una tasación y con qué alcance depende de la jurisdicción.
- **Regla de producto**: el agente de tasación produce un **borrador de análisis comparativo de mercado
  (ACM)** con fuentes y comparables visibles; el documento final lo **revisa y firma el corredor**. El
  texto lo dice explícitamente ("opinión de valor elaborada por [corredor], matrícula N°…").

### 2.4 Datos personales — Ley 25.326

Es el riesgo más concreto del producto: maneja nombres, teléfonos, ingresos, garantías y conversaciones.

- [A verificar] Inscripción de las bases de datos ante la **AAIP**; finalidad declarada; consentimiento
  libre, expreso e informado; derechos de acceso, rectificación y supresión; seguridad; **transferencia
  internacional** (los modelos de IA y la nube están fuera del país) con consentimiento o garantías
  contractuales [Colegio: el propio Colegio usa este esquema en su app].
- **Roles**: la inmobiliaria es **responsable** de su base; nosotros somos **encargado del tratamiento**.
  Hace falta un contrato de encargo (DPA) y que la inmobiliaria tenga su aviso de privacidad.
- **Reglas de producto**:
  - Primer mensaje de cara al cliente con **aviso breve de privacidad** y de que conversa con un asistente
    automatizado, y link a la política de la inmobiliaria.
  - **Minimización**: el agente de leads pide solo lo necesario para calificar. La precalificación de
    inquilinos con recibos de sueldo y garantías queda para fase 2 y con consentimiento específico.
  - Retención configurable y borrado a pedido; exportación de los datos del cliente final.
  - Registro de auditoría de qué agente leyó o escribió qué dato.
  - Nada de **perfilar propietarios a partir de redes sociales** ni enriquecer contactos con fuentes
    externas (uno de los casos de VC): no hay base de consentimiento.

### 2.5 Contacto saliente — Registro Nacional "No Llame" (Ley 26.951)

- [A verificar] Prohíbe contactar con fines publicitarios a quienes estén inscriptos, por servicios de
  telefonía en todas sus modalidades (la AAIP lo interpretó también para mensajería). Hay que **consultar
  el registro antes de campañas salientes**.
- **Regla de producto**: la reactivación de base, los broadcasts y cualquier llamada de voz con IA saliente
  se hacen **solo a contactos con opt-in registrado** y con chequeo contra la lista. Sin opt-in no hay
  campaña. La atención entrante (el cliente escribe primero) no tiene ese problema.
- Llamadas con IA: avisar al inicio que es un asistente automatizado y, si se graba, pedir consentimiento.

### 2.6 WhatsApp / Meta

- Mensajes iniciados por la empresa fuera de la ventana de 24 h solo con **plantillas aprobadas** y con
  opt-in del usuario (el repo `turnero-whatsapp-demo` ya documenta este esquema).
- [A verificar] Meta restringió en 2026 los **asistentes de IA de propósito general** en la WhatsApp
  Business API; los asistentes **específicos del negocio** siguen permitidos. Nuestros agentes tienen que
  estar acotados al negocio inmobiliario del cliente.
- [A verificar] **Bots en grupos de WhatsApp**: el soporte de grupos en la Cloud API oficial es limitado.
  **No usar librerías no oficiales** (que emulan WhatsApp Web): violan los términos de Meta y exponen el
  número del cliente a bloqueo. Ver alternativas en `05`.

### 2.7 Prevención de lavado — UIF (Ley 25.246)

- [A verificar] Los corredores inmobiliarios matriculados son **sujetos obligados** ante la UIF y tienen
  que identificar al cliente (KYC) y reportar operaciones sospechosas según las resoluciones vigentes.
- **Oportunidad de producto (fase 2)**: checklist de debida diligencia por operación y recordatorio de
  documentación. Fuera del MVP.

### 2.8 Alquileres

- [Colegio] Desde el DNU 70/2023 índice y frecuencia de ajuste son de libre pacto.
- **Regla de producto**: el agente de alquileres **no da por vigente** ningún régimen: calcula ajustes con
  el índice y la frecuencia **que dice el contrato cargado** y usa como fuente de índices la calculadora o
  API del Colegio (o la del BCRA/INDEC). Fase 2.

### 2.9 Propiedad intelectual y análisis de competencia

- El análisis de competencia trabaja con **publicidad pública** (p. ej. la Biblioteca de Anuncios de Meta)
  y con avisos publicados, resumidos y citados, sin copiar fotos ni textos ajenos.
- **No scrapear portales** en contra de sus términos de uso. Para leer avisos de portales, usar sus
  APIs/feeds oficiales o acuerdos. Pendiente revisar los términos de Zonaprop, Argenprop y Mercado Libre.
- Las fotos y textos que produce el agente de marketing son del cliente; las fotos de propiedades que suba
  el cliente son su responsabilidad (autorización del propietario).

---

## 2.10 Verificado el 14/11/2026 (ver `08`)

- **Grupos de WhatsApp:** la API oficial admite 8 participantes y está reservada a cuentas de gran volumen:
  se descarta. Política de IA de Meta: los asistentes específicos del negocio están permitidos.
- **UIF:** rige la **Resolución UIF 43/2024** (modificada por la 56/2024) para agentes y corredores inmobiliarios.
- **Ley 25.326:** sigue vigente; hay proyectos de reemplazo en el Congreso sin sanción.
- **Biblioteca de anuncios de Meta:** su API no devuelve anuncios comerciales fuera de la UE; el análisis
  de competencia trabaja con lo que comparte el asesor.

## 3. Checklist antes del primer cliente pago

- [ ] Revisión del documento por abogado (datos personales + corretaje).
- [ ] Leer Ley 2340, código de ética y normas de publicidad del CUCICBA (y del colegio de la provincia del piloto).
- [ ] Contrato de servicio + DPA (encargado del tratamiento) + política de privacidad del producto.
- [ ] Plantilla de aviso de privacidad para el cliente final, por jurisdicción.
- [ ] Inscripción de nuestras bases ante la AAIP.
- [ ] Procedimiento de consulta al Registro No Llame para campañas salientes.
- [ ] Verificación de la política vigente de Meta para IA en WhatsApp Business y del soporte de grupos.
- [ ] Términos de uso de portales para cualquier lectura de avisos.
