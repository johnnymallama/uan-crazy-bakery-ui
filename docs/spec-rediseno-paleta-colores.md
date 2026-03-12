# Especificación: Rediseño de Paleta de Colores
**Proyecto:** uan-crazy-bakery-ui
**Fecha:** 2026-03-11
**Estado:** En evaluación
**Autor:** Johnny Mallama

---

## Contexto

La paleta de colores actual fue definida en la etapa inicial del proyecto. Tras una revisión visual y de tendencias 2025 para sitios de pastelería artesanal, se identificó que la identidad actual carece de profundidad artesanal y no refleja con precisión la propuesta de valor de la marca.

### Paleta actual (baseline)

| Variable CSS | Descripción | HEX aprox. | HSL |
|---|---|---|---|
| `--primary` | Coral/Rojo | `#EF6B5F` | `356 79% 59%` |
| `--secondary` | Marrón-naranja | `#9E6B55` | `15 35% 55%` |
| `--accent` | Marrón-naranja (igual a secondary) | `#9E6B55` | `15 35% 55%` |
| `--background` | Beige ultra claro | `#FFFFF7` | `43 100% 98%` |
| `--card` | Beige claro | `#E9DCC9` | `39 88% 93%` |
| `--foreground` | Marrón muy oscuro | `#3D2817` | `25 55% 15%` |
| `--border` | Beige grisáceo | `#DAD2C7` | `39 50% 85%` |
| `--muted-foreground` | Gris-marrón | — | `25 25% 45%` |

**Tipografía actual (se mantiene):**
- Headlines: `Playfair Display` (serif elegante)
- Cuerpo: `PT Sans` (sans-serif limpio)

**Problemas identificados:**
- `--secondary` y `--accent` tienen el mismo valor → sin diferenciación visual.
- El coral como único color dominante no transmite suficiente calidez artesanal.
- La paleta general carece de jerarquía de color clara.

---

## Referencia de tendencias 2025

- **Pantone Color del Año 2025:** Mocha Mousse `#A47764` — tono marrón cálido y cremoso, reminiscente de cacao, café y chocolate. Directamente alineado con la *little treat culture* de 2025.
- **Tendencia general:** Paletas tierra + cremas + un color de acento vibrante.
- **Dirección visual:** Imperfección artesanal, espacio en blanco generoso, fotografía de producto protagonista.

---

## Propuestas de paleta

> **Instrucciones de iteración:**
> Marcar cada propuesta con uno de los estados: `[ ] Pendiente`, `[x] Seleccionada`, `[-] Descartada`.
> Agregar comentarios debajo de cada propuesta durante la revisión.

---

### Propuesta A — "Artesanal Cálida"
**Concepto:** Nostálgico, hecho a mano, recetas de abuela, calidad premium.
**Estado:** `[-] Descartada`

| Variable | Nombre | HEX | HSL |
|---|---|---|---|
| `--primary` | Mocha Mousse | `#A47764` | `20 26% 52%` |
| `--secondary` | Corteza Dorada | `#C19A6B` | `33 40% 58%` |
| `--accent` | Horno Tostado | `#A0522D` | `20 55% 40%` |
| `--background` | Crema Suave | `#FAF3E0` | `43 88% 93%` |
| `--card` | Masa (Dough) | `#E4C29E` | `33 56% 76%` |
| `--foreground` | Marrón Profundo | `#3D2817` | `25 55% 15%` |
| `--border` | Arena cálida | `#D4BFA0` | `35 40% 73%` |
| `--muted-foreground` | Gris arena | `#8C7B6B` | `25 14% 49%` |

**Modo oscuro sugerido:**

| Variable | HEX | HSL |
|---|---|---|
| `--background` | `#1F130A` | `25 55% 8%` |
| `--card` | `#2E1C10` | `22 48% 12%` |
| `--primary` | `#C49580` | `20 35% 63%` |
| `--foreground` | `#FAF3E0` | `43 88% 93%` |

**Comentarios:**

<!-- Espacio para notas de revisión -->

---

### Propuesta B — "Pastelería Premium"
**Concepto:** Elegante, delicado, patisserie francesa, tortas de boda.
**Estado:** `[★] Candidata`

| Variable | Nombre | HEX | HSL |
|---|---|---|---|
| `--primary` | Dusty Rose | `#A4546B` | `344 32% 48%` |
| `--secondary` | Rosa Empolvado | `#CCA4AC` | `350 30% 72%` |
| `--accent` | Dorado Rico | `#CB9F0C` | `47 89% 42%` |
| `--background` | Blanco Cremoso | `#F4F2EE` | `40 27% 94%` |
| `--card` | Lino Suave | `#EDE8DF` | `38 27% 88%` |
| `--foreground` | Marrón Elegante | `#2C1F1F` | `0 17% 15%` |
| `--border` | Rosa pálido | `#DED0D3` | `350 18% 84%` |
| `--muted-foreground` | Gris rosado | `#9E8C8F` | `350 8% 59%` |

**Modo oscuro sugerido:**

| Variable | HEX | HSL |
|---|---|---|
| `--background` | `#1A1215` | `340 17% 9%` |
| `--card` | `#241820` | `340 20% 12%` |
| `--primary` | `#C47A8F` | `344 35% 62%` |
| `--foreground` | `#F4F2EE` | `40 27% 94%` |

**Comentarios:**

<!-- Espacio para notas de revisión -->

---

### Propuesta C — "Moderno & Audaz"
**Concepto:** Urbano, contemporáneo, audiencia millennial/Gen Z, fuerte presencia en redes.
**Estado:** `[x] Seleccionada`

| Variable | Nombre | HEX | HSL |
|---|---|---|---|
| `--primary` | Rojo Cereza | `#9B1B30` | `350 70% 36%` |
| `--secondary` | Mostaza Ámbar | `#D4A017` | `44 79% 46%` |
| `--accent` | Azul Cobalto | `#1E3A8A` | `224 63% 33%` |
| `--background` | Crema Caliente | `#FDF6EC` | `37 90% 96%` |
| `--card` | Gris Cálido | `#EDE8DF` | `38 27% 88%` |
| `--foreground` | Casi Negro | `#1A1A1A` | `0 0% 10%` |
| `--border` | Gris suave | `#D1C4B0` | `37 24% 75%` |
| `--muted-foreground` | Gris medio | `#7A6E63` | `25 10% 44%` |

**Modo oscuro sugerido:**

| Variable | HEX | HSL |
|---|---|---|
| `--background` | `#0F0F0F` | `0 0% 6%` |
| `--card` | `#1C1C1C` | `0 0% 11%` |
| `--primary` | `#C4364F` | `350 54% 49%` |
| `--foreground` | `#F5F5F5` | `0 0% 96%` |

**Comentarios:**

<!-- Espacio para notas de revisión -->

---

### Propuesta D — "Eco-Artesanal"
**Concepto:** Orgánico, sostenible, ingredientes naturales, sin gluten / vegano.
**Estado:** `[-] Descartada`

| Variable | Nombre | HEX | HSL |
|---|---|---|---|
| `--primary` | Terracota | `#C4714F` | `17 45% 54%` |
| `--secondary` | Sage Green | `#8B9F77` | `93 16% 55%` |
| `--accent` | Esmeralda | `#2D6A4F` | `156 40% 30%` |
| `--background` | Crema de Avena | `#F2EAD3` | `40 53% 88%` |
| `--card` | Arena Orgánica | `#E2D5BE` | `38 36% 81%` |
| `--foreground` | Verde Oscuro | `#1B2E24` | `150 26% 14%` |
| `--border` | Lino natural | `#C9BCA8` | `36 21% 73%` |
| `--muted-foreground` | Gris verdoso | `#7A8C78` | `115 8% 51%` |

**Modo oscuro sugerido:**

| Variable | HEX | HSL |
|---|---|---|
| `--background` | `#0D1810` | `130 30% 8%` |
| `--card` | `#152218` | `140 25% 11%` |
| `--primary` | `#D4896A` | `17 52% 62%` |
| `--foreground` | `#F2EAD3` | `40 53% 88%` |

**Comentarios:**

<!-- Espacio para notas de revisión -->

---

## Criterios de evaluación

Al revisar cada propuesta, considerar:

- [ ] **Legibilidad:** ¿El contraste foreground/background es accesible? (mínimo WCAG AA: ratio 4.5:1)
- [ ] **Identidad:** ¿Transmite los valores de una bakery artesanal premium?
- [ ] **Coherencia:** ¿Primary, Secondary y Accent se complementan sin competir?
- [ ] **Modo oscuro:** ¿La paleta funciona en ambos modos?
- [ ] **Componentes clave:** ¿Se ve bien en botones, cards, formularios y el wizard de pedidos?

---

## Plan de implementación (una vez seleccionada)

1. **Actualizar `src/app/globals.css`** — reemplazar variables CSS en `:root` y `.dark`
2. **Verificar `tailwind.config.ts`** — confirmar que el mapeo de variables no requiere cambios
3. **Revisar componentes con color hardcodeado** — buscar clases como `text-[#...]` o `bg-[#...]`
4. **Actualizar `CLAUDE.md`** — reflejar la nueva paleta documentada
5. **Actualizar `docs/blueprint.md`** — si aplica
6. **Prueba visual** — revisar en mobile y desktop, modo claro y oscuro

---

## Historial de decisiones

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-03-11 | Especificación creada | Paleta actual sin suficiente profundidad artesanal |
| 2026-03-11 | Propuesta A descartada | Tonos muy opacos, baja visibilidad de texto en cards |
| 2026-03-11 | Propuesta D descartada | Paleta no agradó |
| 2026-03-11 | Propuesta C seleccionada | Mejor contraste, personalidad audaz y moderna, supera a B y D |
