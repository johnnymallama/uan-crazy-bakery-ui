# Plan de Ejecución: Evaluación de Paleta de Colores
**Proyecto:** uan-crazy-bakery-ui
**Fecha:** 2026-03-11
**Relacionado con:** `docs/spec-rediseno-paleta-colores.md`
**Estado:** `[ ] En progreso`

---

## Objetivo

Evaluar visualmente las 4 propuestas de paleta de colores en el entorno real del proyecto, para seleccionar la más adecuada con base en criterios de identidad, legibilidad y coherencia visual.

---

## Estrategia

Se aplicará cada paleta directamente en `globals.css` de forma temporal, se revisará en el navegador corriendo en `localhost:9002`, y se documentarán las impresiones. Al finalizar la evaluación de todas las opciones, se tomará la decisión final.

> El servidor de desarrollo corre en el puerto `9002` con Turbopack (`npm run dev`).

---

## Pasos previos (una sola vez)

- [ ] **1. Hacer backup de la paleta actual**
  - Copiar el bloque `:root` y `.dark` de `src/app/globals.css` en `docs/backup-paleta-original.css`
  - Esto permite restaurar en cualquier momento sin depender de git

- [ ] **2. Levantar el servidor de desarrollo**
  ```bash
  npm run dev
  ```
  Abrir `http://localhost:9002/es` en el navegador.

- [ ] **3. Identificar las pantallas clave a revisar durante cada evaluación**
  - Página principal (`/es`)
  - Wizard de pedido (flujo completo)
  - Dashboard consumidor (`/es/dashboard/consumer`)
  - Dashboard admin (`/es/dashboard/admin`)
  - Login / Registro (`/es/login`)

---

## Ciclo de evaluación por propuesta

Repetir estos pasos para cada propuesta (A → B → C → D):

### Paso 1 — Aplicar la paleta en `globals.css`
Reemplazar las variables CSS en `:root` (modo claro) y `.dark` (modo oscuro) con los valores de la propuesta correspondiente según `spec-rediseno-paleta-colores.md`.

### Paso 2 — Revisar en el navegador
Navegar por las pantallas clave definidas arriba. Evaluar:

| Criterio | Pregunta |
|---|---|
| Legibilidad | ¿El texto se lee con claridad sobre los fondos? |
| Identidad | ¿Transmite calidez y artesanía de bakery? |
| Botones | ¿El color primario funciona bien en CTA y botones? |
| Cards | ¿Las tarjetas de producto/pedido tienen buen contraste? |
| Formularios | ¿Los inputs y labels se ven bien? |
| Modo oscuro | ¿La paleta oscura es agradable y coherente? |
| Mobile | ¿Se ve bien en viewport móvil? |

### Paso 3 — Registrar impresiones
Anotar los comentarios en la sección correspondiente de `spec-rediseno-paleta-colores.md`.

### Paso 4 — Actualizar estado de la propuesta
Marcar en `spec-rediseno-paleta-colores.md` como `Revisada` o `Descartada`.

---

## Tabla de seguimiento

| Propuesta | Estado | Fecha revisión | Impresión general | Decisión |
|---|---|---|---|---|
| A — Artesanal Cálida | `[-] Descartada` | 2026-03-11 | Tonos muy opacos, baja visibilidad de texto en cards | Descartada |
| B — Pastelería Premium | `[★] Candidata` | 2026-03-11 | Luminosa, buen contraste en cards, elegante | Candidata |
| C — Moderno & Audaz | `[x] Seleccionada` | 2026-03-11 | Contrastada y audaz, personalidad fuerte | **Seleccionada** |
| D — Eco-Artesanal | `[-] Descartada` | 2026-03-11 | Paleta no agradó | Descartada |

---

## Criterios de desempate

Si después de revisar las 4 propuestas hay dudas entre dos, usar estos criterios para decidir:

1. **Contraste WCAG AA** — verificar con [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) que `foreground/background` tenga ratio ≥ 4.5:1
2. **Coherencia con el logo** — ¿el color primario complementa o choca con los assets de imagen existentes?
3. **Versatilidad** — ¿la paleta funciona bien tanto en modo claro como oscuro?
4. **Primera impresión emocional** — ¿qué transmite al abrir la página principal por primera vez?

---

## Posibles iteraciones

Una vez seleccionada la propuesta base, se podrán explorar ajustes menores:

- Cambiar solo el `--accent` manteniendo el resto de la propuesta ganadora
- Ajustar luminosidad del `--primary` para botones más llamativos
- Crear una variante híbrida combinando elementos de dos propuestas

Cualquier iteración debe documentarse aquí con fecha y justificación.

---

## Implementación final

Una vez aprobada la paleta definitiva:

- [ ] Confirmar valores HSL finales con Claude Code
- [ ] Aplicar cambios permanentes en `src/app/globals.css`
- [ ] Actualizar `CLAUDE.md` con la nueva paleta documentada
- [ ] Actualizar `docs/blueprint.md` si aplica
- [ ] Registrar decisión en `spec-rediseno-paleta-colores.md` → sección "Historial de decisiones"
- [ ] Commit con mensaje: `feat(ui): aplicar nueva paleta de colores [nombre propuesta]`
- [ ] Abrir PR para revisión del equipo

---

## Historial de cambios del plan

| Fecha | Cambio |
|---|---|
| 2026-03-11 | Plan creado |
| — | — |
