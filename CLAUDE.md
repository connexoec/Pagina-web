# CLAUDE.md — Connexo Web · Única Fuente de Verdad (SSOT)

> Documento vivo. Se actualiza al cerrar cada hito ("cero lag" confirmado).
> No repetir errores ya resueltos aquí. Última actualización: **2026-08-18**
> (sticky del pipeline arreglado en PC + glitch yautja permanente en el logo).
> Hito previo: **2026-08-17**
> (logo oficial + auditoría contra el Manual de Capacitación v0.52.1 +
> 9 plantillas reales + 5 secciones nuevas + capa de animación).

---

## 0. FUENTE DE VERDAD DEL PRODUCTO ⚠️

Lo que la web puede afirmar sale del **Manual de Capacitación de Connexo
v0.52.1** (4-ago-2026). Antes de escribir cualquier feature nueva en la landing,
verificar que exista en el manual.

**El manual es CONFIDENCIAL y está en `.gitignore` (`/Documentos/`, `*.docx`).**
Sus Partes VII–VIII contienen la ruta del panel `/admin`, los roles, los nombres
de los scripts SQL de Supabase y el flujo de credenciales de la pasarela de pago.
**Nunca se commitea, nunca se despliega, nunca se cita en el copy público.**

Hechos del producto que la web DEBE respetar:
- **No existe auto-registro.** La cuenta la crea Connexo (manual §5.1). Todo CTA
  va a WhatsApp o a la tienda; jamás a un formulario de signup.
- **No hay IA en el producto.** Cero menciones en el manual. No prometerla.
- **No hay dominio personalizado.** La URL es `connexoapp.com/usuario` (§16.1).
- **La plantilla es una sola por cliente**, en cualquier plan (§1.2).
- **CONECTA no publica precio**: es la puerta de entrada como prueba gratuita, y
  esa prueba puede correrse con funciones de PRO o de ULTRA.
- **Las reservas son "parciales" en PRO** y dependen del rubro (§2.1). Decirlo.
- RED CONNEXO **no está en el manual**: es producto propio de la web. Desde
  2026-08-17 es un **directorio público de emprendedores** (ver §10).

---

## 1. Identidad del proyecto

**Connexo** (Ecuador) — Ecosistema de identidad digital NFC y software de
ventas. Este repo es la **Landing Page principal**.

### Datos oficiales (viven en `src/config/site.ts`, no hardcodear)
| Dato | Valor |
|------|-------|
| WhatsApp ventas | `+593 99 430 7367` → `wa.me/593994307367` |
| Tienda (perfil E-commerce propio) | https://www.connexoapp.com/connexo |
| App / panel del cliente | https://www.connexoapp.com |
| Soporte | connexoec@gmail.com |
| Fundación Arupo | https://www.fundacionarupo.org/ |

### Stack (fijo — no cambiar sin justificación)
| Capa | Tecnología | Versión |
|------|-----------|---------|
| UI | React | 19 |
| Build | Vite | 6 |
| Estilos | Tailwind CSS | 3 |
| Animación | Framer Motion | 11 |
| Lenguaje | TypeScript | 5.7 (strict) |

Comandos: `npm run dev` · `npm run build` (typecheck + build) · `npm run preview`.

---

## 2. Sistema de diseño (REGLAS ESTRICTAS)

### Color (definido en `tailwind.config.js`)
- **Fondo**: Negro puro `#000000` → `abyss-950` (page) / grises abismales
  `abyss-800/700/600` para tarjetas y superficies.
- **Acento / CTA**: Naranja puro `#ff6600` → `connexo` (`connexo-DEFAULT`).
  Escala completa `connexo-50..900`. **Todo botón de conversión es sólido naranja.**

### Tipografía (USO EXCLUSIVO — no mezclar)
- **Tomorrow SemiBold Italic** → `font-heading`. SOLO titulares de impacto
  (H1, H2, claims, precios, números destacados). El italic + weight 600 se
  fuerza en `index.css` (`.font-heading`).
- **Space Grotesk** → `font-sans` (default del body). TODO lo demás: párrafos,
  botones, UI, datos, badges.
- Fuentes cargadas por `<link>` en `index.html` (Google Fonts, `display=swap`).

### Clases de utilidad clave (`src/index.css`)
- `.glass` → cristal oscuro del navbar (backdrop-blur).
- `.btn-cta` → botón conversión sólido naranja (texto negro).
- `.btn-outline` → botón secundario con borde naranja.
- `.section-pad` → contenedor `max-w-7xl` + padding responsive.
- Shadows: `shadow-glow` / `shadow-glow-lg` (halo naranja para plan PRO).

---

## 3. Arquitectura aprobada

```
ConnexoWeb/
├─ index.html                 # fuentes + favicon + OG + root
├─ public/
│  ├─ connexo-lockup.png      # LOGO oficial: isotipo+palabra, fondo transparente
│  ├─ connexo-yautja.png      # "CONNEXO" en alfabeto yautja (glitch del logo, §9)
│  ├─ connexo-logo.jpg        # Isotipo cuadrado sobre negro (origen del favicon)
│  ├─ favicon-32/180/512.png  # Derivados del isotipo
│  └─ perfiles/               # capturas del carrusel (ver §5)
├─ src/
│  ├─ main.tsx                # entry → <App/>
│  ├─ App.tsx                 # rutas + capa de atmósfera global
│  ├─ router.tsx              # enrutador mínimo sin dependencias (§11)
│  ├─ index.css               # base Tailwind + tokens de componentes
│  ├─ Landing.tsx             # página "/" — secciones, lazy bajo el pliegue
│  ├─ pages/
│  │  └─ RedPage.tsx          # página "/red" — directorio RED CONNEXO (§10)
│  ├─ config/
│  │  ├─ site.ts              # WhatsApp, tienda, app, correo (SSOT de contacto)
│  │  └─ campaign.ts          # toggle ON/OFF del banner de campaña
│  ├─ data/
│  │  ├─ ecosystems.ts        # las 9 plantillas reales del carrusel
│  │  ├─ directory.ts         # miembros de la RED CONNEXO (§10)
│  │  └─ pricing.ts           # planes + tabla comparativa (`comparison`)
│  └─ components/
│     ├─ fx/
│     │  ├─ Ambient.tsx       # FilmGrain · Aurora · PerspectiveGrid · Spotlight
│     │  └─ Motion.tsx        # Magnetic · TiltCard · Counter · DecodeText ·
│     │                       #   BeamDivider · NfcRings · Marquee
│     ├─ icons.tsx            # iconos SVG inline (incl. SignalIcon, WhatsappIcon)
│     ├─ SectionKicker.tsx    # FIRMA de marca: glifo señal NFC + label (ver §9)
│     ├─ Navbar.tsx           #  1. Nav glass fija + logo oficial
│     ├─ Hero.tsx             #  2. Hero (anillos NFC + decode + marquee)
│     ├─ Mechanism.tsx        #  3. Bajo el toque (3 pasos)
│     ├─ EcosystemsCarousel.tsx #  4. Carrusel 3D Cover Flow (CRÍTICO, §6)
│     ├─ Platform.tsx         #  5. PWA · push · 8 idiomas · tour guiado
│     ├─ Operations.tsx       #  6. Pipeline de pedido con sticky-scroll
│     ├─ Membership.tsx       #  7. Códigos de miembro y clubes
│     ├─ Payments.tsx         #  8. Las 4 formas de cobro
│     ├─ Analytics.tsx        #  9. Analíticas + mapa de calor
│     ├─ RedTeaser.tsx        # 10. Banda que invita a /red (NO es el directorio)
│     ├─ DirectoryCard.tsx    #     MemberCard + OpenSlotCard (los usa RedPage)
│     ├─ Pricing.tsx          # 11. Planes + chip 10% Arupo
│     ├─ PlanMatrix.tsx       #     └─ comparador de 3 planes (dentro de Pricing)
│     ├─ Arupo.tsx            # 12. Responsabilidad social · Fundación Arupo (§9)
│     ├─ CampaignBanner.tsx   # 13. Módulo de campañas (dinámico)
│     └─ Footer.tsx           # 14. Footer (+ WhatsApp, correo, 10% Arupo)
```

**Principio**: datos separados de la vista (`data/`, `config/`). Para editar
contenido (precios, ecosistemas, campaña) se tocan esos archivos, no los
componentes.

---

## 4. Estado de secciones (hito actual)

Todas construidas, compiladas sin errores TS y verificadas en preview ("cero lag").

| # | Sección | Estado | Notas |
|---|---------|--------|-------|
| 1 | Navbar | ✅ | Glass al scroll; **logo oficial**; links Ecosistemas/Cómo opera/Planes/**Causa**/RED CONNEXO; "Iniciar sesión" → app real. El logo glitchea en bucle a alfabeto yautja (§9). |
| 2 | Hero | ✅ | H1 exacto (Tomorrow italic 600) con `DecodeText` en la 2.ª frase; anillos NFC; CTA magnético → WhatsApp; cinta de los 9 rubros. |
| 3 | Mecanismo | ✅ | Kicker "bajo el toque"; 3 pasos (El objeto / El instante / La huella). |
| 4 | Ecosistemas | ✅ | **Carrusel 3D Cover Flow** con las **9 plantillas reales** (ver §6). Marco con la proporción exacta de la captura → sin recorte. |
| 5 | Plataforma | ✅ | PWA instalable, avisos con la app cerrada, 8 idiomas, tour guiado. Manual §6, §7, §21. |
| 6 | Cómo opera | ✅ | Pipeline del pedido con **sticky-scroll** (5 estados). Manual §24.6, §25.5, §30.5. |
| 7 | Club / códigos | ✅ | Códigos de miembro reales (B-/E-/R-/S-/F-), sellos, VIP. Manual §18. |
| 8 | Cobros | ✅ | Las 4 formas de pago + facturación con RUC. Manual §23.5, §24.9. |
| 9 | Analíticas | ✅ | Contadores + mapa de calor 7×12 + conclusiones automáticas. Manual §15. |
| 10 | RED CONNEXO | ✅ | En la portada solo va `RedTeaser` (banda + CTA). **El directorio vive en su propia página `/red`** (§10). |
| 11 | Planes | ✅ | CONECTA sin precio ("Prueba gratis"); PRO/ULTRA → tienda; toggle Mensual/Anual; chip "10% Arupo"; **comparador `PlanMatrix`**. |
| 12 | Fundación Arupo | ✅ | Responsabilidad social: 10% de cada plan. Cifra ancla "10%" + manifiesto + CTA externo a fundacionarupo.org. |
| 13 | Campañas | ✅ | Banner dinámico ON/OFF vía `config/campaign.ts`. |
| 14 | Footer | ✅ | Logo oficial, legales, 10% Arupo, WhatsApp y `connexoec@gmail.com`. |

---

## 5. Assets de perfiles (`public/perfiles/`) — IMPORTANTE

Las imágenes reales entregadas estaban en `Perfiles/` (raíz) y se normalizaron a
`public/perfiles/*.png` (minúsculas, sin tildes) para servirlas desde `/perfiles/`.

Mapeo actual — **las 9 plantillas del manual**, 7 con captura real:

| # | Plantilla (id) | Imagen |
|---|----------------|--------|
| 1 | Estándar (`estandar`) | `profesional.png` |
| 2 | Barbería (`barberia`) | `barber.png` |
| 3 | Gastronomía (`gastronomia`) | `gastro.png` |
| 4 | E-Commerce (`ecommerce`) | `ecommerce.png` |
| 5 | Petcare (`petcare`) | `veterinaria.png` |
| 6 | Salud (`medico`) | `medico.png` |
| 7 | Inmobiliaria (`inmobiliaria`) | `inmobiliaria.png` |
| 8 | Artista (`artista`) | ⚠️ FALTA `artistas.png` |
| 9 | Sublimados (`sublimados`) | ⚠️ FALTA `sublimados.png` |

**TODO assets**: subir `artistas.png` y `sublimados.png` a `public/perfiles/`,
quitar `reserved: true` y añadir `image` en `src/data/ecosystems.ts`. La cara
placeholder ("Captura en camino") aparece sola mientras no haya imagen.

⚠️ **Las capturas nuevas deben mantener la proporción ≈ 0.512** (pantalla de
teléfono, p. ej. 500×977). El marco del carrusel usa esa constante (`SHOT_RATIO`)
para que la imagen entre completa. Ver §7.4.

---

## 6. Decisiones técnicas / patrones a respetar

### Carrusel 3D (Cover Flow) — `EcosystemsCarousel.tsx`
- Índice `active`; para cada tarjeta se calcula `circularOffset` (distancia
  circular más corta) → posición en cascada infinita.
- Transformaciones por offset: `x` (gap), `scale` (1 centro / 0.84 / 0.68),
  `rotateY` (`offset * -24deg`), `opacity` (1 / 0.6 / 0.2), `zIndex`.
- **Perf**: solo se renderiza ventana de 5 tarjetas (`abs > 2 → null`) +
  `will-change: transform`. Imágenes `loading="lazy"`.
- Interacción: drag horizontal (framer), flechas, dots, teclado (←/→).
- **Geometría (no romper)**: el ancho manda (`card`), el alto se DERIVA
  (`phoneH = card / SHOT_RATIO`). El nombre va en una banda de `LABEL_H` px
  **debajo** del teléfono, nunca encima de la captura.

### Capa de animación (`components/fx/`)
**Presupuesto de rendimiento — regla dura**: solo se animan `transform` y
`opacity` (las únicas que resuelve el compositor en GPU). **Nunca** animar
`filter`, `blur`, `box-shadow`, `width` ni `height`.
- `Aurora`: el `blur` es estático; lo que se mueve es el `transform` del blob.
- `FilmGrain`: ruido SVG horneado como data-URI **una sola vez**. Coste/frame: 0.
- `Spotlight`: variables CSS con rAF *throttled* y solo en `pointer: fine`.
- `Marquee`: CSS puro con `animation-play-state: paused` fuera de viewport.
- `Operations`: `useMotionValueEvent` sobre `scrollYProgress`, con `setState`
  **solo cuando cambia el índice** — no un render por frame.
- Todo respeta `prefers-reduced-motion` vía `useReducedMotion()`.
- ❌ Descartado a propósito: WebGL/Three.js, partículas por canvas y cualquier
  animación de desenfoque. Pesan y funden batería en gama media.

### Performance / "cero lag"
- Secciones bajo el pliegue con `React.lazy` + `Suspense` (code-splitting).
  Verificado: chunks separados (EcosystemsCarousel, RedConnexo, Pricing,
  CampaignBanner, Footer).
- Red de nodos (RED CONNEXO) es **SVG estático** con pulso de opacidad barato
  (no canvas, no rAF por frame) → evita jank.
- `overflow-x: hidden` en body para contener tarjetas del carrusel fuera de vista.
- Respeta `prefers-reduced-motion` (index.css).

### Módulo de campañas
- `src/config/campaign.ts` → `enabled: boolean` es el master switch.
- `CampaignBanner` retorna `null` si `enabled === false` → **sin hueco de layout**.

---

## 7. Errores resueltos (NO repetir)

1. **`tsc -b` sin `composite`** → fallaba el build. Solución: script de build usa
   `tsc --noEmit && vite build` (tsconfig con `noEmit: true`, un solo config).
2. **`noUnusedLocals` (strict)** → `ReservedFace({ eco })` recibía prop sin usar y
   rompía el typecheck. Solución: quitar el parámetro y el import de tipo no usado.
   → **Regla**: con `strict` + `noUnused*`, no dejar imports/params sin usar.
3. **Preview: salto de scroll aparente** → el panel de preview enfoca el deck del
   carrusel (`tabIndex=0`, elemento alto) y el navegador lo mantiene a la vista,
   dando la impresión de que la página no vuelve arriba. **No es un bug** de la
   app; en carga normal nada auto-enfoca el deck.
4. **Capturas del carrusel "cortadas"** (reportado 2026-08-17) → la tarjeta tenía
   proporción 0.757 mientras la captura es 0.512, y encima la etiqueta con el
   nombre se dibujaba **sobre** la imagen con un degradado (`p-5 pt-16`). Aunque
   había `object-contain`, el rótulo tapaba la parte baja de la pantalla.
   → **Solución**: el marco usa la proporción exacta de la captura
   (`SHOT_RATIO = 0.512`) y el nombre se movió a una banda **debajo** del
   teléfono. **Regla**: ningún rótulo se dibuja encima de una captura de perfil.
5. **`<>` con `key` dentro de `<tbody>`** → no compila. Usar
   `<Fragment key={...}>` importado de `react` (ver `PlanMatrix.tsx`).
6. **Móvil: "el menú se sale de la página"** (reportado 2026-08-17) → no era el
   menú. Las tarjetas laterales del carrusel desbordaban a lo ancho y
   `overflow-x: hidden` estaba **solo en `body`**; varios navegadores móviles
   igual dejan desplazar el viewport, el documento queda más ancho que la
   pantalla y la barra fija (100vw) se ve corrida respecto al contenido.
   → **Solución en tres capas**: (a) `overflow-x: hidden` + `width: 100%`
   también en `html`; (b) `overflow-hidden` en la sección del carrusel, que es
   donde nace el desborde; (c) el menú móvil con `max-w-full` y
   `max-h-[calc(100vh-4rem)] overflow-y-auto`.
   ⚠️ **Nunca poner `overflow-hidden` en una sección que contenga
   `position: sticky`** — lo rompe. Por eso `Operations.tsx` no lo lleva y su
   halo usa `-inset-3` en vez de `-inset-8`.
7. 🔴 **`overflow-x: hidden` en `html`/`body` ROMPE `position: sticky`.**
   El error más caro del proyecto, y fue una regresión introducida al arreglar
   el menú móvil (error 6). Poner `overflow-x: hidden` obliga a que el eje
   contrario compute a `auto`, lo que convierte al elemento en **contenedor de
   scroll**; a partir de ahí todos sus descendientes `sticky` dejan de fijarse.
   Por eso el pipeline de `Operations.tsx` se veía roto en PC **y** en móvil.
   → **Usar siempre `overflow-x: clip`**, que recorta igual pero NO crea
   contenedor de scroll. Está en `index.css` con su comentario.
   **Nunca volver a poner `hidden` ahí.** Verificación rápida tras compilar:
   `overflow-x:clip` debe aparecer 2 veces en el CSS y `overflow-x:hidden` 0.
8. **`Operations.tsx`: scroll con tirones y columnas separadas** (reportado
   2026-08-17). Además del punto 7, el propio componente tenía cuatro fallos:
   - **Parpadeo**: el bloque de texto usaba `key={stage.key}`, así que React lo
     remontaba en cada paso y repetía la animación de entrada. → Los cinco
     bloques quedan montados y solo se cruza su `opacity`.
   - **Saltos**: el punto del paso activo usaba `layoutId`; una animación de
     layout entre filas da tirones al scrollear rápido. → `opacity` y ya.
   - **Scroll muerto**: 72vh por paso = 360vh de rodar para 5 estados. →
     `VH_PER_STAGE = 55`. Es la perilla para regular el largo de la sección.
   - **Móvil**: `min-h-screen` usa `vh`, que cambia cuando aparece o se esconde
     la barra del navegador. → `min-h-[100svh]`.
   - **Escritorio, "muy separados"**: `max-w-7xl` + `lg:grid-cols-2` dejaba las
     dos mitades a ~250px una de otra. → rejilla acotada con columna fija.

   **Arquitectura final (la que funciona)** — no volver al esquema anterior:
   - **Nada de un contenedor de `N vh` con un hijo `sticky` de `100vh`.** Ese
     esquema se rompe si el contenido supera el alto de la pantalla y obliga a
     cuadrar alturas mágicas. Ahora el `sticky` va sobre un elemento de **alto
     natural** (`sticky top-28`) y la altura del recorrido la da la columna del
     relato: 5 bloques de `min-h-[58vh]`.
   - El paso activo se detecta con **`useInView` por bloque**
     (`margin: '-45% 0px -45% 0px'` = solo el centro de la pantalla), no con
     aritmética sobre `scrollYProgress`. Funciona igual en cualquier pantalla.
   - `onEnter` va envuelto en `useCallback`: si cambiara en cada render, el
     efecto de cada bloque se redispararía sin parar.
   - **Dos rastreadores distintos**: `FullTracker` (tarjeta vertical, solo
     `lg:`) y `CompactTracker` (tira horizontal de ~90px fijada bajo la barra,
     solo móvil). La tarjeta vertical en teléfono se comía media pantalla.

9. 🔴 **`items-start` en una rejilla CSS mata el `sticky` de su columna.**
   (Reportado 2026-08-18: "el scroll en PC está muy mal, en teléfono está
   perfecto"). La rejilla de `Operations.tsx` llevaba `lg:items-start`. Con
   `align-items: start` el item de la rejilla queda del **alto de su
   contenido**, no del alto de la fila; y como el `sticky` solo puede recorrer
   el bloque contenedor, el rastreador tenía ~0 px de recorrido: se despegaba
   al primer scroll y quedaban ~250vh de texto con la columna izquierda vacía.
   En teléfono no se notaba porque el `CompactTracker` cuelga de un `div` que sí
   ocupa toda la sección.
   → **Regla**: la columna que lleva un `sticky` NUNCA se alinea con
   `items-start` / `self-start`; necesita el `stretch` por defecto para heredar
   el alto de la fila. Aplica igual a flexbox (`items-start` ahí hace lo mismo).
   Sigue valiendo el punto 7: el `sticky` en sí va sobre un elemento de alto
   natural, dentro de esa columna estirada.

---

## 8. Convenciones de código
- Componentes en PascalCase, un componente de sección por archivo.
- Contenido/datos siempre en `data/` o `config/`, nunca hardcodeado en JSX de
  layout cuando sea reutilizable/editable.
- Iconos: añadir a `components/icons.tsx` (SVG inline, sin librería de iconos).
- Español (es-EC) para todo el copy visible.
- **Nunca hardcodear** teléfono, correo ni URLs: importar de `config/site.ts`
  (`site`, `wa()`, `waMsg`). Todo enlace externo lleva `target="_blank"` +
  `rel="noopener noreferrer"`.
- Correo de soporte oficial: **connexoec@gmail.com**.

---

## 9. Voz, tono y firma de marca (REGLA — "no genérico")

El cliente rechaza el look/copy típico de landing hecha con IA. Al escribir o
editar copy y etiquetas, respetar:

- **NADA de "eyebrows" genéricos** tipo `text-xs uppercase tracking-[0.3em]` con
  una sola palabra funcional ("El mecanismo", "Ecosistemas", "Escalabilidad").
  Eso es la firma de las landings IA y está **prohibido**.
- **Marcador de sección = `SectionKicker`** (`components/SectionKicker.tsx`):
  glifo `SignalIcon` (ondas NFC que emanan de un toque) + label en **minúscula**,
  con voz propia, no funcional. Es la firma visual recurrente. Ej: "bajo el
  toque", "elige tu terreno", "tres formas de conectar", "no es marketing, es un
  trato". Para añadir una sección nueva, usar este mismo marcador.
- **Copy con actitud ecuatoriana, concreto y con imágenes**, no corporativo
  neutro. Preferir frases-claim ("El precio que ves es el que pagas.", "Nadie se
  va sin dejar rastro.") sobre descripciones planas de features.
- El motivo del **papel vs. toque** ("deja tu tarjeta de papel en el pasado") es
  un hilo narrativo recurrente — reutilizarlo, no reinventarlo cada vez.

### Responsabilidad social — Fundación Arupo (`components/Arupo.tsx`)
- Compromiso real: **el 10% de cada plan vendido es de la Fundación Arupo**
  (inclusión, derechos humanos e innovación social · Ecuador).
- Enlace oficial: **https://www.fundacionarupo.org/** (siempre `target="_blank"`
  + `rel="noopener noreferrer"`). Presente en: sección Arupo, chip en Pricing,
  enlace en Footer y link "Causa" del navbar.
- Tono: honesto y humano, **no publicitario** — es un compromiso, no un gancho.
  No inventar cifras/programas específicos de la fundación; mantener general y
  enlazar para detalle.

### Logo de marca — ✅ RESUELTO (2026-08-17)
- `public/connexo-lockup.png` (2153×301, **fondo transparente**) → Navbar y
  Footer, como `<img>` con `width`/`height` para no producir CLS.
- `public/connexo-logo.jpg` (1080×1080, isotipo naranja sobre negro puro) →
  origen de `favicon-32/180/512.png` y de la `og:image`.
- El glifo provisional `ConnexoMark` se **eliminó** de `icons.tsx`.
- ⚠️ El isotipo solo existe sobre **negro puro**. Si algún día hace falta sobre
  otro fondo, hay que pedir el SVG o un PNG transparente del isotipo.

### El logo con glitch yautja (2026-08-18)
El logo de la barra **glitchea solo, en bucle**: cada ciclo de **12 s** la
palabra se desarma y se lee ~3.9 s en alfabeto yautja, con frames sucios de por
medio, y vuelve. Vive en `Brand` (`Navbar.tsx`) + los keyframes `glitch-word` /
`glitch-yautja` de `tailwind.config.js`. No hay clic, ni estado, ni temporizador.
- Asset: `public/connexo-yautja.png` (640×142, 11 kB). Se generó desde
  `public/red/Connexo Yautja.png` recortando el marco transparente sobrante
  (954×371 → contenido 753×167), reescalando y **recoloreando de `#f9421c` al
  naranja de marca `#ff6600`** (§2: la paleta es negro + `#ff6600`, sin
  excepciones). El original queda donde estaba, sin tocar.
- ⚠️ **CSS puro, nunca JS.** Es lo único del sitio que anima **para siempre y
  siempre en pantalla** (la barra es `fixed`). Con `setTimeout` + estado de
  React serían renders cada pocos ms hasta que cierren la pestaña; en CSS lo
  resuelve el compositor y el navegador además lo congela solo cuando la
  pestaña está oculta. Mismo criterio que el `Marquee` (§6).
- **`step-end`, no `linear`**: cada keyframe es un corte seco. Con fundido esto
  sería un crossfade bonito, no un glitch.
- Las dos capas son **complementarias sobre el mismo ciclo**: donde las dos
  valen 1 se ven encimadas (frame sucio) y donde las dos valen 0 queda un
  parpadeo en negro. Ahí está el efecto — si se tocan los porcentajes, tocarlos
  **en pareja**. Ambas arrancan juntas porque se montan en el mismo paint.
- El lockup nunca sale del flujo — es el que reserva el espacio, así que el
  glitch **no mueve la barra** (cero CLS). Los glifos van absolutos, centrados
  **por flexbox y nunca por `translate`**: el `transform` de la animación
  pisaría cualquier `-translate-x-1/2` de Tailwind.
- Van a `150%` del alto del lockup: con eso las dos imágenes miden casi lo mismo
  de ancho y el cambio se lee como un reemplazo, no como un salto.
- El tirón lateral (`translate3d`) va **solo en los glifos**: el lockup de marca
  no se deforma nunca.
- `prefers-reduced-motion` no necesita código: la regla global de `index.css`
  colapsa la duración y el keyframe `100%` es "Connexo visible / yautja oculto",
  así que queda el logo quieto y limpio.

---

## 10. RED CONNEXO — Directorio de emprendedores

**Es una página propia: `/red`** (`pages/RedPage.tsx`), no una sección de la
portada. Cualquiera entra, busca, ve qué hace cada negocio y salta a su perfil
real en `connexoapp.com`.

En la portada queda únicamente `components/RedTeaser.tsx`: una banda con el
claim y el botón "ENTRAR AL DIRECTORIO". **No duplicar ahí el directorio.**

### Cómo sumar un negocio (el flujo entero)
1. Verificar que su perfil abra de verdad en `connexoapp.com/<usuario>`.
2. Añadir el objeto en **`src/data/directory.ts`** (`members`), con `ecosystem`
   igual a un `id` de `data/ecosystems.ts` — de ahí salen los filtros.
3. Foto opcional en `public/red/<id>.jpg` apuntada en `image`. **Sin foto no
   pasa nada**: la ficha dibuja su identidad sola (rejilla de nodos + inicial).
4. Bajar `OPEN_SLOTS` si ya no hacen falta tantos espacios libres.

### ⚠️ REGLA INNEGOCIABLE
**Solo negocios reales, con perfil publicado y verificable.** Nunca inventar
miembros para "llenar" la grilla: un directorio con negocios falsos engaña al
visitante que hace clic y quema la marca. Mientras la red sea chica se muestran
**espacios libres** (`OpenSlotCard`) — la escasez juega a favor, la mentira no.

Hoy hay **20 miembros reales**. `city` y `what` siguen incompletos en varios:
se rellenan cuando el negocio los confirme, no antes.

⚠️ Los perfiles de `connexoapp.com` son una **SPA**: al pedirlos devuelven un
cascarón vacío titulado "Connexo". **No se pueden extraer rubro, ciudad ni
descripción automáticamente** — hay que pedírselos al negocio. Y como el
servidor responde 200 a cualquier ruta por su regla de reescritura, un usuario
mal escrito **no da error**: los enlaces se comprueban a ojo, uno por uno.

### Convenios con organizaciones (`components/NgoAlliance.tsx`)
Va **antes** del directorio en `/red`. Explica que las organizaciones aliadas
activan perfiles Connexo a los emprendedores que acompañan, y ancla el
compromiso del 10% con la Fundación Arupo.
- Las organizaciones que se listan salen de `directory.ts` con `ngo: true`.
- `OPEN_AGREEMENTS` dibuja cupos abiertos. **Nunca inventar una alianza**: una
  ONG falsa en una página pública es un problema serio, no un adorno.

### Decisiones de diseño
- Búsqueda **sin acentos y con palabras en cualquier orden** (`normalize()` con
  `NFD` + `\p{M}`), igual que el buscador de catálogo del producto (manual §17.3).
- Chips de rubro **con conteo**; los rubros sin miembros salen deshabilitados —
  se ve la forma de la red sin fingir que está llena.
- Al filtrar **no se dibujan espacios libres**: mezclarlos con resultados de
  búsqueda confunde.
- **Sin colores por rubro**: la marca es negro + `#ff6600` y punto (§2). Los
  rubros se distinguen por etiqueta, no por color.
- `RadarSweep` es un `conic-gradient` girando con `rotate` — GPU pura, y se
  desactiva con `prefers-reduced-motion`.
- Los códigos `CX-XXXX` son cosméticos y deterministas (hash del `id`).

---

## 11. Enrutado (`src/router.tsx`)

Enrutador propio de ~100 líneas sobre la History API. **Sin dependencias**: meter
react-router para dos rutas serían ~20 kB para resolver un `switch`. Si algún día
hay muchas rutas con parámetros, ahí sí toca cambiarlo.

| Ruta | Componente |
|------|-----------|
| `/` | `Landing.tsx` |
| `/red` | `pages/RedPage.tsx` (lazy — su código no viaja con la portada) |
| cualquier otra | cae en `Landing.tsx` |

### Reglas al escribir enlaces
- **Enlace interno → `<Link href="…">` de `router.tsx`**, nunca `<a>`.
- **Anclas del navbar y del footer van absolutas** (`/#planes`, no `#planes`):
  esos componentes también se montan en `/red`, donde un `#planes` suelto
  apuntaría a una sección que ahí no existe.
- Enlaces externos (`http…`, `mailto:`, `tel:`) siguen siendo `<a>` normales.
  `Link` los deja pasar al navegador sin interceptar, igual que los clics con
  Ctrl/⌘/rueda — abrir en pestaña nueva tiene que seguir funcionando.

### Detalles que ya costaron
- `scrollToHash()` **reintenta unos frames**: al llegar a `/#planes` desde `/red`,
  las secciones son `React.lazy` y el elemento aún no existe cuando se procesa
  el clic.
- `FilmGrain` y `Spotlight` viven en `App.tsx`, **por encima de las rutas**. Si
  se montan dentro de cada página, el grano parpadea en cada navegación.
- Los deep links (`/red` escrito a mano, recarga, enlace compartido) dependen de
  la regla `rewrites` de `vercel.json`. **No borrarla.**
