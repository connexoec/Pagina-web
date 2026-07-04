# CLAUDE.md — Connexo Web · Única Fuente de Verdad (SSOT)

> Documento vivo. Se actualiza al cerrar cada hito ("cero lag" confirmado).
> No repetir errores ya resueltos aquí. Última actualización: **2026-07-04**.

---

## 1. Identidad del proyecto

**Connexo** (Ecuador) — Ecosistema de identidad digital NFC + IA y software de
ventas. Este repo es la **Landing Page principal**.

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
├─ index.html                 # fuentes + meta + root
├─ public/
│  ├─ favicon.svg
│  └─ perfiles/               # assets del carrusel (ver §5)
├─ src/
│  ├─ main.tsx                # entry → <Landing/>
│  ├─ index.css               # base Tailwind + tokens de componentes
│  ├─ Landing.tsx             # compone secciones; lazy-load bajo el pliegue
│  ├─ config/
│  │  └─ campaign.ts          # toggle ON/OFF del banner de campaña
│  ├─ data/
│  │  ├─ ecosystems.ts        # 8 ecosistemas del carrusel
│  │  └─ pricing.ts           # planes CONECTA / PRO / ULTRA
│  └─ components/
│     ├─ icons.tsx            # iconos SVG inline (sin dependencia externa)
│     ├─ Navbar.tsx           # 1. Nav glass fija
│     ├─ Hero.tsx             # 2. Hero
│     ├─ Mechanism.tsx        # 3. El mecanismo (3 pasos)
│     ├─ EcosystemsCarousel.tsx # 4. Carrusel 3D Cover Flow (CRÍTICO)
│     ├─ RedConnexo.tsx       # 5. RED CONNEXO (red de nodos)
│     ├─ Pricing.tsx          # 6. Escalabilidad (toggle Mensual/Anual)
│     ├─ CampaignBanner.tsx   # 7. Módulo de campañas (dinámico)
│     └─ Footer.tsx           # 8. Footer
```

**Principio**: datos separados de la vista (`data/`, `config/`). Para editar
contenido (precios, ecosistemas, campaña) se tocan esos archivos, no los
componentes.

---

## 4. Estado de secciones (hito actual)

Todas construidas, compiladas sin errores TS y verificadas en preview ("cero lag").

| # | Sección | Estado | Notas |
|---|---------|--------|-------|
| 1 | Navbar | ✅ | Glass al hacer scroll, badge "Próximamente" en RED CONNEXO, login borde naranja, menú móvil. |
| 2 | Hero | ✅ | H1 exacto (Tomorrow italic 600), CTA "DESBLOQUEA TU PERFIL" `#ff6600`. |
| 3 | Mecanismo | ✅ | Grid 3 columnas (Hardware / SaaS / Datos). |
| 4 | Ecosistemas | ✅ | **Carrusel 3D Cover Flow** con framer-motion (ver §6). |
| 5 | RED CONNEXO | ✅ | Textura de red de nodos SVG (estática, sin lag). |
| 6 | Escalabilidad | ✅ | Toggle Mensual/Anual dinámico; PRO destacado con glow. |
| 7 | Campañas | ✅ | Banner dinámico ON/OFF vía `config/campaign.ts`. |
| 8 | Footer | ✅ | Logo, legales, soporte `connexoec@gmail.com`. |

---

## 5. Assets de perfiles (`public/perfiles/`) — IMPORTANTE

Las imágenes reales entregadas estaban en `Perfiles/` (raíz) y se normalizaron a
`public/perfiles/*.png` (minúsculas, sin tildes) para servirlas desde `/perfiles/`.

Mapeo actual (7 imágenes reales → 8 espacios exactos):

| Espacio | Imagen | Fuente original |
|---------|--------|-----------------|
| 1. Profesional | `profesional.png` | Profesional.PNG |
| 2. Gastronomía | `gastro.png` | Gastro.PNG |
| 3. Barber & Beauty | `barber.png` | Barberia.PNG |
| 4. E-Commerce | `ecommerce.png` | E-Commerce.PNG |
| 5. Artistas | *(placeholder)* | ⚠️ FALTA `artistas.png` |
| 6. Corporativo B2B | *(placeholder)* | ⚠️ FALTA `corporativo.png` |
| 7. Servicios & Citas | `medico.png` | Médico.PNG |
| 8. Próximamente | *(placeholder reservado)* | — |

También copiadas pero sin usar aún: `inmobiliaria.png`, `veterinaria.png`
(disponibles si se decide dividir "Servicios & Citas").

**TODO assets**: subir `artistas.png` y `corporativo.png` a `public/perfiles/` y
quitar `reserved: true` + añadir `image` en `src/data/ecosystems.ts`. La tarjeta
placeholder ("Espacio reservado") aparece automáticamente cuando no hay imagen.

---

## 6. Decisiones técnicas / patrones a respetar

### Carrusel 3D (Cover Flow) — `EcosystemsCarousel.tsx`
- Índice `active`; para cada tarjeta se calcula `circularOffset` (distancia
  circular más corta) → posición en cascada infinita.
- Transformaciones por offset: `x` (gap), `scale` (1 centro / 0.82 / 0.66),
  `rotateY` (`offset * -22deg`), `opacity` (1 / 0.55 / 0.18), `zIndex`.
- **Perf**: solo se renderiza ventana de 5 tarjetas (`abs > 2 → null`) +
  `will-change: transform`. Imágenes `loading="lazy"`.
- Interacción: drag horizontal (framer), flechas, dots, teclado (←/→).

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

---

## 8. Convenciones de código
- Componentes en PascalCase, un componente de sección por archivo.
- Contenido/datos siempre en `data/` o `config/`, nunca hardcodeado en JSX de
  layout cuando sea reutilizable/editable.
- Iconos: añadir a `components/icons.tsx` (SVG inline, sin librería de iconos).
- Español (es-EC) para todo el copy visible.
- Correo de soporte oficial: **connexoec@gmail.com**.
