# Manual de Marca - Tuali

Este documento define las bases visuales y comunicacionales de la plataforma Tuali. Todo desarrollo futuro (UI/UX, Copywriting, Marketing) debe regirse por estos lineamientos.

## 1. Identidad Principal
*   **Nombre de la Marca**: Tuali (derivado de "Tu Aliado").
*   **Propósito**: Conectar de forma rápida y segura la demanda residencial/vacacional con la oferta técnica regional, combatiendo la informalidad mediante confianza y verificación.

## 2. Paleta de Colores (V4 Marino + Óxido)
La estética visual se basa en el modo claro (Light Mode) para transmitir limpieza, con acentos fuertes para llamar a la acción.

*   **Trust Navy (`#1E3A8A`)**: Color primario. Representa seguridad, solidez y respaldo corporativo. Usado en tipografía principal, encabezados y logos.
*   **Action Orange / Óxido (`#EA580C`)**: Color secundario y CTA. Representa herramientas, construcción, urgencia y acción. Usado en botones principales ("Solicitar Técnico") y alertas.
*   **Verification Green (`#10B981`)**: Color de validación. Usado exclusivamente para los sellos de "Identidad Verificada" o "Antecedentes Revisados".
*   **Backgrounds (`#FFFFFF` y `#F8FAFC`)**: Blancos y grises muy sutiles (Slate) para mantener la interfaz limpia y fácil de leer.

## 3. Tipografía
**Decisión:** 2 familias tipográficas para alinear con el espíritu sobrio y artesano de la paleta (menos es más).

| Rol | Familia | Pesos | Uso |
| :--- | :--- | :--- | :--- |
| **Principal** | Plus Jakarta Sans | 400, 500, 600, 700, 800 | 100% de la interfaz: headings, body, UI, buttons, copy marketing. |
| **Mono** | JetBrains Mono | 400, 500 | Solo IDs de servicio, códigos de verificación, números técnicos (créditos, distancias). |

**Por qué Plus Jakarta Sans:**
*   Es humanista geométrica — tiene calor sin ser rebuscada.
*   La "T" del wordmark Tuali renderiza limpia y con personalidad en ExtraBold.
*   Excelente legibilidad en móvil (app PWA mobile-first).
*   Soporta tildes y ñ sin sacrificar consistencia.

### Jerarquía Oficial
| Nivel | Tamaño móvil | Peso | Color | Uso |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 36px | 800 | Primary | Pantallas de onboarding, hero |
| **H1** | 28px | 800 | `#1A1D23` | Títulos de pantalla |
| **H2** | 22px | 700 | `#1A1D23` | Secciones |
| **H3** | 18px | 600 | `#1A1D23` | Cards, subtítulos |
| **Body** | 16px | 400 | `#1A1D23` | Texto corrido, descripciones |
| **Body Strong** | 16px | 600 | `#1A1D23` | Énfasis dentro de párrafo |
| **Label** | 13px | 600 | `#4A5568` | Labels de formulario, categorías |
| **Caption** | 12px | 500 | `#4A5568` | Timestamps, metadata |
| **Button** | 15px | 600 | variable | Todos los CTAs |
| **Mono** | 14px | 500 | `#4A5568` | IDs, códigos OTP, créditos |

*   **Line-height estándar:** 1.5 para body, 1.2 para headings.
*   **Letter-spacing:** headings ExtraBold llevan -0.5px a -1px (mejora ajuste visual). Body sin ajuste.

**Importación (HTML/CSS):**
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
```css
body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
code, .mono { font-family: 'JetBrains Mono', monospace; }
```

## 4. Tono de Voz (Copywriting)

### 4.1 Los 3 pilares
1.  **Humano antes que algoritmo.** Nunca suena a sistema. Una notificación de "procesamiento completado" es un error de marca. Siempre hay una persona del otro lado.
2.  **Respeto al oficio.** El profesional es aliado, no "prestador". Su trabajo es oficio, no "servicio técnico". Dignificamos lo que hace.
3.  **Brevedad con calidez y contexto cultural.** Dos frases cortas y claras valen más que un párrafo amable. El uso ocasional de diminutivos amigables ("trabajito", "arreglito") ayuda a anclar la marca en la cultura cálida colombiana sin perder profesionalismo.

### 4.2 Personalidad de voz
| Atributo | Dial | Explicación |
| :--- | :--- | :--- |
| Formal ←→ Casual | **Casual** | Tuteo siempre, contracciones permitidas. |
| Serio ←→ Entusiasta | **Centrado** | Ni robótico ni payaso — el punto medio. |
| Respetuoso ←→ Cercano | **Ambos** | Cercano sin perder respeto al profesional. Uso del "Don" o "Maestro" cuando aplique. |
| Directo ←→ Diplomático | **Directo** | Ir al grano, sin rodeos burocráticos. |
| Técnico ←→ Llano | **Llano** | Cero jerga tech innecesaria. |

### 4.3 Vocabulario oficial Tuali

✅ **Palabras marca (USAR):**
*   **Aliado**: Siempre que hablemos del profesional.
*   **Trabajo / Arreglo (y diminutivos)**: Un servicio o encargo concreto. Ocasionalmente se usarán los diminutivos colombianos ("un trabajito", "un arreglito") para generar calidez y empatía.
*   **Oficio**: La categoría profesional (plomería, electricidad…).
*   **Tomar el trabajo**: Aceptar la solicitud.
*   **Respaldo**: El valor diferencial (verificación + reputación).
*   **Verificado**: Estado del perfil tras KYC.
*   **Maestro**: Uso ocasional y respetuoso para el aliado.
*   **Contacto**: En la UI del cliente al referirse al pro.
*   **Cercano / cerca de ti**: Para hablar de proximidad.
*   **Tu lado / de tu lado**: Refuerzo del concepto "aliado".

❌ **Palabras prohibidas (NO USAR):**
*   *Vuelta*: En Colombia puede tener connotaciones ilegales o fuertemente informales ("hacer una vuelta"). Queda estrictamente restringida.
*   *Usuario*: Frío, despersonaliza. Usa "aliado" o "cliente".
*   *Prestador*: Burocrático, desdeñoso del oficio.
*   *Lead / prospecto*: Es lenguaje interno, no de UI.
*   *Plataforma*: Úsalo rara vez — preferir "Tuali" o "la app".
*   *Cliente final*: Redundante, solo "cliente".
*   *Transacción / procesar*: Muy frío, prefiere "pago", "listo".
*   *¡Increíble! / ¡Wow!*: Exagerado, no somos eso.
*   *Campeón / crack / parce / pana*: Coloquial excesivo.
*   *Booking / rating / feedback*: Anglicismos innecesarios.
*   *Gestionar su solicitud*: Corporativo burocrático.

### 4.4 Do / Don't por contexto
| Contexto | ✅ Tuali dice | ❌ Tuali no dice |
| :--- | :--- | :--- |
| **Bienvenida cliente** | "Listo. Encuentra el aliado que necesitas." | "¡Bienvenido a nuestra plataforma!" |
| **Bienvenida profesional** | "Bienvenido, tu oficio ahora tiene respaldo." | "Registro exitoso, complete su perfil." |
| **Solicitud recibida (al pro)** | "Un cliente en Ricaurte te está buscando para un arreglito de plomería. ¿Lo tomas?" | "Nueva oportunidad comercial disponible según su perfil." |
| **Crédito consumido** | "Listo. Ya puedes ver los datos del cliente." | "Transacción exitosa. Procesando información." |
| **Trato fallido (al cliente)** | "Notamos que no se concretó el servicio. ¿Aún tienes ese arreglito pendiente?" | "El profesional reportó un cierre fallido. Proceda si lo desea." |
| **Verificación completa** | "Estás verificado. Tu perfil ya es visible." | "Verificación aprobada por el administrador." |
| **Créditos bajos** | "Te quedan 3 créditos. Recarga para seguir tomando trabajos." | "Saldo bajo. Recargue ahora." |
| **Error de red** | "Algo falló conectando. Intentémoslo otra vez." | "Error 500. Internal Server Error." |
| **Cancelación** | "Solicitud cancelada. Tranquilo, no se descontó ningún crédito." | "La operación fue abortada por el usuario." |
| **Calificación pedida** | "¿Cómo te fue con tu aliado? Tu calificación ayuda a otros." | "Por favor califique al prestador para continuar." |

### 4.5 Emojis — reglas de uso
**Permitidos (con moderación):**
*   ✓ Verificación (o el check gráfico propio)
*   ⭐ Solo para mostrar rating, no en copy
*   📍 Solo en contexto de ubicación

**Prohibidos:**
*   🎉 🚀 🔥 💯 🏆 (Celebratorios festivos)
*   👨‍🔧 👩‍🔧 (Emojis figurativos de profesionales - infantiliza)
*   Cualquier emoji en contextos de error, pago o penalización.
*   *Regla general: un emoji por mensaje, máximo, y solo si aporta claridad visual real.*

### 4.6 Notificaciones push (WhatsApp + PWA)
**Reglas estrictas:**
1. Máximo 80 caracteres visible antes del "ver más".
2. Verbo de acción en primera palabra cuando sea posible.
3. Nombre del actor contrario si aporta contexto.
4. Un solo CTA por notificación.

**Ejemplos:**
*   *Nueva solicitud al pro*: "Ana R. busca un aliado para un trabajito en Ricaurte. ¿Lo tomas?"
*   *Un colega compró primero*: "Alguien ya tomó el contacto. Quedan 2 cupos."
*   *Cliente calificó al pro*: "Ana te calificó con 5 ★. Buen trabajo, maestro."
*   *Créditos recargados*: "Listo. Tienes 10 créditos nuevos."
*   *Al cliente, aliado aceptó*: "Juan M. aceptó tu solicitud. Ya puedes hablar con él."
*   *Al cliente, reenganche*: "¿Aún necesitas el arreglito de plomería? Hay aliados disponibles."

### 4.7 Principios de microcopy
*   **Botones con verbo, no sustantivo:** "Tomar el trabajo" > "Aceptar".
*   **Mensajes de error sin culpa:** explica qué pasó y qué hacer, no regañes.
*   **Confirmaciones suaves:** "Listo" > "Éxito".
*   **Labels cortos:** "Oficio" > "Categoría de servicio profesional".
*   **Empty states con invitación:** "Aún no tienes trabajos. Toma el primero." > "Sin datos".
*   **Tiempo con calidez:** "Hace un momento" > "Now".

### 4.8 Voz en diferentes canales
| Canal | Registro | Ejemplo |
| :--- | :--- | :--- |
| **App UI (PWA)** | Casual directo | "Tomar el trabajo" |
| **WhatsApp push** | Casual + nombre propio | "Juan M. aceptó tu solicitud." |
| **Email transaccional** | Casual pero más formal | "Hola, Ana. Te confirmamos que…" |
| **Redes sociales** | Casual + narrativo | "Detrás de cada trabajito bien hecho hay un aliado Tuali." |
| **Blog / Landing** | Narrativo inspirador | "Tu oficio merece respaldo. Por eso existe Tuali." |
| **Términos y condiciones** | Formal obligatorio | "El usuario declara que…" (única excepción permitida) |
