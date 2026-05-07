# 🎨 CREATIVE DIRECTION: TUALI (INTEGRATED)

> [!IMPORTANT]
> **ESTADO: INTEGRADO.** El proyecto del escritorio ha sido migrado a `/src/pages/LandingPage.tsx`. Los activos residen en `/public/Tuali/`.
**Framework F.R.A.M.E. | Versión 4.0 (Illustration Style)**

---

## 1. 🏛️ BRAND IDENTITY
- **Nombre:** Tuali
- **Posicionamiento:** "Tu Aliado Resuelve". La T que lo soluciona todo.
- **Voice & Tone:** Directo, resolutivo, tecnológico pero accesible.
- **Paleta de Colores:** 
  - `Action Orange (#EA580C)`
  - `Success Teal (#10B981)`
  - `Obsidian Navy (#1F2937)`
  - `Background White (#F9FAFB)`
- **Tipografía:** **Outfit** (Display/Headlines) e **Inter** (UI/Body).

---

## 2. 📝 COPY DE LA LANDING

### HERO SECTION
- **Headline:** "¿Ruptura, Reparación o Reforma? Tu Aliado Resuelve."
- **Subheadline:** "Conectamos emergencias, mantenimiento y proyectos con profesionales verificados en tiempo real."
- **CTA Primario:** "Publicar Emergencia"
- **CTA Secundario:** "Ver Servicios"

### SECCIÓN FEATURES (3 Pilares)
- **Emergencias:** Respuesta en menos de 1 hora.
- **Mantenimiento:** Profesionales calificados para tu hogar.
- **Reformas:** Proyectos a medida con garantía Tuali.

---

## 3. 🖼️ PROMPT IMAGE 1 (Frame INICIAL)
```markdown
[DALL-E 3 / Nano Banana]
A premium 3D illustration of a capital letter "T" acting as a multi-tool artifact, set against a clean white background.

SPACE DISTRIBUTION:
- LEFT 60% (SAFE ZONE): Pure, empty white space for text overlay.
- RIGHT 40% (SUBJECT ZONE): The "T" icon is positioned here.

SUBJECT:
- A stylized, chunky capital letter "T" with rounded edges.
- STYLE: "Premium 3D Illustration" or "Claymorphism". Smooth matte textures combined with translucent glass sections.
- TOOL INTEGRATION:
    - The LEFT end of the T-bar is shaped like a minimalist Wrench.
    - RIGHT end is shaped like a Hammer head.
    - BOTTOM is shaped like a Broom.
- COLORS: Main body #1F2937. Glows in #EA580C and #10B981.

VISUAL STYLE: Flat-3D hybrid. High contrast, vibrant colors.
Aspect Ratio: 16:9
```

---

## 4. 🖼️ PROMPT IMAGE 2 (Frame FINAL)
```markdown
[IDENTICAL COMPOSITION & SPACE DISTRIBUTION]
Same "T" Icon in the RIGHT 40% of the frame.

EVOLUTION:
- The internal light circuits inside the "T" pulse and then dim.
- The orange and teal glow points fade by 70%.
- Subtle "floating particles" appear around the icon as if it's charging energy.

Constraints: No physical movement of the "T" or camera. Only light evolution.
Aspect Ratio: 16:9
```

---

## 5. 🎬 PROMPT DE TRANSICIÓN (Image-to-Video)
```markdown
[TRANSITION INSTRUCTION]
"Start with the 'Off' frame (dimmed/dormant). 
Animate a smooth, professional sequence where the 'T' icon 'wakes up': 
The internal teal circuits and the orange tool-heads gradually ignite until they reach full radiance. 
The glow should bloom softly. 

Constraints:
- Sequence: Start (Off) -> Mid (On) -> End (Off) for a seamless loop.
- Duration: 7 seconds total.
- Camera: Perfectly static.
- No rotation or physical movement."
```

---

## 6. 🛠️ PROMPT ONE-SHOT PARA CLAUDE DESIGN (PRODUCTION READY)

```markdown
Actúa como un Senior Frontend Engineer y UI Designer experto en React 19 y Tailwind CSS v4. Tu misión es construir la Landing Page de alta fidelidad para "Tuali", un marketplace de servicios y emergencias premium.

### 1. DISEÑO DE SISTEMA (SRE DESIGN OPS)
- **Concepto:** Liquid Glassmorphism & Claymorphism.
- **Tipografía:** 
  - Display: 'Outfit' (Semibold) para titulares impactantes.
  - Sans: 'Inter' (Medium/Regular) para legibilidad en cuerpos.
- **Paleta de Colores:**
  - Primary Action: #EA580C (Orange).
  - Trust/Background: #1F2937 (Obsidian Navy) y #F9FAFB (Off-White).
  - Success/Accent: #10B981 (Teal).
- **Tono:** Profesional, resolutivo, directo ("Tu Aliado Resuelve").

### 2. ASSETS & ROLES
- **Hero Video (Background):** Video de 7 segundos en loop ping-pong que muestra la "T" iconográfica. Rol: Generar impacto visual y transmitir modernidad técnica.
- **Smart Credits (Sección Pricing):** Iconos 3D de monedas de cristal. Rol: Explicar el modelo de negocio B2B.
- **Trust Icons:** Logos en escala de grises con hover a color para la sección de partners.

### 3. ESPECIFICACIONES TÉCNICAS (ANIMACIÓN)
- **Ping-Pong Loop:** Implementa el video hero usando el atributo `loop` o, para máxima suavidad, un listener `onEnded` que invierta la dirección o reinicie el clip si se detecta lag. Alternativamente, usa CSS `animation-direction: alternate` sobre contenedores con filtros de luz.
- **Framer Motion:** Aplica `initial={{ opacity: 0, y: 20 }}` con `staggerChildren` para que los elementos del hero aparezcan secuencialmente.

### 4. ESTRUCTURA DE 9 SECCIONES (MANDATORIO)
1. **NAVBAR:** Flotante, glassmorphism (backdrop-blur-2xl), bordes redondeados (full), botones minimalistas con micro-interacciones.
2. **HERO:** Layout asimétrico 60/40. Headline con kerning ajustado (-2px). CTA con shadow-xl y scale-hover. Background video integrado con mix-blend-mode.
3. **PROBLEMA:** Sección de "Dolor" (Urgencias, falta de confianza). Diseño limpio con tipografía de alto contraste.
4. **SOLUCIÓN:** Presentación de Tuali como la infraestructura que resuelve. Uso de iconos Lucide personalizados.
5. **FEATURES:** Grid de tarjetas tipo "Glass" con hover effects. Enfoque en: Emergencias <1h, Profesionales Verificados, Garantía.
6. **SCIENCE/TRUST:** Sección de datos duros. Contadores animados (+5000 profesionales, 98% resolución).
7. **TESTIMONIALS:** Slider horizontal con fotos de perfil (placeholders circulares) y citas en itálica sobre fondo neutro.
8. **PRICING:** Diseño de "Smart Credits". Tablas de precios claras con una opción destacada (Most Popular) usando bordes en Action Orange.
9. **FOOTER:** Minimalista. Enlaces organizados por categorías, newsletter input con estilo glass, y redes sociales.

### 5. NOTA DE CALIDAD
PROHIBIDO usar componentes genéricos de librerías básicas sin personalizar. Cada elemento (botones, inputs, cards) debe tener estados de hover, active y focus detallados. El código debe ser modular, usar TypeScript estricto y seguir las mejores prácticas de Tailwind CSS v4 (variables de tema nativas).
```

---

## 7. 💳 SUPPORTING VISUAL (DASHBOARD - CRÉDITOS)

### PROMPT IMAGE 3 (Smart Credits Icon)
```markdown
[DALL-E 3 / Nano Banana]
A premium 3D representation of a "Smart Credit Token" for the Tuali platform.

SUBJECT:
- A thick, translucent glass coin or digital card floating in mid-air.
- Embossed in the center is the Tuali "T" icon in polished orange resin (#EA580C).
- Around the border of the coin, glowing digital numbers showing a "Balance" in teal light (#10B981).
- The style is "Claymorphism" mixed with Glassmorphism, matching the Hero icon perfectly.

SPACE DISTRIBUTION:
- Centered 1:1 composition. Clean white background.
- High-end UI/UX 3D asset style.

Aspect Ratio: 1:1
```
---

## 8. 🛠️ PROMPT ONE-SHOT TEMPORAL (STATIC ASSET)

> [!NOTE]
> Usar este prompt mientras el video Hero no esté disponible. Utiliza `hero1.jpeg` como pieza central.

```markdown
Actúa como un Senior Frontend Engineer y UI Designer experto en React 19 y Tailwind CSS v4. Tu misión es construir la Landing Page de alta fidelidad para "Tuali", un marketplace de servicios y emergencias premium.

### 1. DISEÑO DE SISTEMA (SRE DESIGN OPS)
- **Concepto:** Liquid Glassmorphism & Claymorphism.
- **Tipografía:** 
  - Display: 'Outfit' (Semibold) para titulares impactantes.
  - Sans: 'Inter' (Medium/Regular) para legibilidad en cuerpos.
- **Paleta de Colores:**
  - Primary Action: #EA580C (Orange).
  - Trust/Background: #1F2937 (Obsidian Navy) y #F9FAFB (Off-White).
  - Success/Accent: #10B981 (Teal).
- **Tono:** Profesional, resolutivo, directo ("Tu Aliado Resuelve").

### 2. ASSETS & ROLES
- **Hero Image (Static):** Imagen `/assets/images/hero1.jpeg`. Rol: Pieza central del Hero (Lado derecho, 40% ancho). Debe integrarse suavemente con el fondo blanco.
- **Smart Credits (Sección Pricing):** Iconos 3D de monedas de cristal. Rol: Explicar el modelo de negocio B2B.
- **Trust Icons:** Logos en escala de grises con hover a color para la sección de partners.

### 3. ESPECIFICACIONES TÉCNICAS (ANIMACIÓN)
- **Micro-interacción de Imagen:** Debido a que el asset es estático, aplica un efecto de "float" sutil (y: [-10, 10]) y un "glow" pulsante en la opacidad usando Framer Motion para simular vida.
- **Framer Motion:** Aplica `initial={{ opacity: 0, y: 20 }}` con `staggerChildren` para que los elementos del hero aparezcan secuencialmente.

### 4. ESTRUCTURA DE 9 SECCIONES (MANDATORIO)
1. **NAVBAR:** Flotante, glassmorphism (backdrop-blur-2xl), bordes redondeados (full), botones minimalistas con micro-interacciones.
2. **HERO:** Layout asimétrico 60/40. Headline con kerning ajustado (-2px). CTA con shadow-xl y scale-hover.
3. **PROBLEMA:** Sección de "Dolor" (Urgencias, falta de confianza). Diseño limpio con tipografía de alto contraste.
4. **SOLUCIÓN:** Presentación de Tuali como la infraestructura que resuelve. Uso de iconos Lucide personalizados.
5. **FEATURES:** Grid de tarjetas tipo "Glass" con hover effects. Enfoque en: Emergencias <1h, Profesionales Verificados, Garantía.
6. **SCIENCE/TRUST:** Sección de datos duros. Contadores animados (+5000 profesionales, 98% resolución).
7. **TESTIMONIALS:** Slider horizontal con fotos de perfil (placeholders circulares) y citas en itálica sobre fondo neutro.
8. **PRICING:** Diseño de "Smart Credits". Tablas de precios claras con una opción destacada (Most Popular) usando bordes en Action Orange.
9. **FOOTER:** Minimalista. Enlaces organizados por categorías, newsletter input con estilo glass, y redes sociales.

### 5. NOTA DE CALIDAD
PROHIBIDO usar componentes genéricos de librerías básicas sin personalizar. Cada elemento (botones, inputs, cards) debe tener estados de hover, active y focus detallados. El código debe ser modular, usar TypeScript estricto y seguir las mejores prácticas de Tailwind CSS v4.
```
