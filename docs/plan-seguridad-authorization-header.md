# Plan de Ejecución: Seguridad FE–BE con Header Authorization
**Proyecto:** uan-crazy-bakery-ui
**Fecha:** 2026-03-11
**Relacionado con:** `docs/spec-seguridad-authorization-header.md`
**Estado:** `[ ] En progreso`

---

## Objetivo

Implementar el envío del header `Authorization: Bearer <idToken>` en todas las llamadas al backend de Spring Boot, usando el token JWT de Firebase Authentication, sin afectar los endpoints públicos.

---

## Paso 1 — Crear el helper centralizado `apiFetch`

**Archivo a crear:** `src/lib/api-fetch.ts`

Crear el helper que:
- Importa `auth` desde `src/lib/firebase.ts`
- Define la lista de endpoints públicos (sin Authorization)
- Obtiene el `idToken` con `auth.currentUser.getIdToken()`
- Construye los headers con `Authorization: Bearer <idToken>`
- Expone la función `apiFetch(url, options)` como reemplazo de `fetch`

**Endpoints públicos a excluir del header:**
| Método | Path |
|---|---|
| `POST` | `/usuarios` |
| `GET` | `/receta/ultimas-imagenes` |
| `GET` | `/geografia/` (cubre `/geografia/*`) |

**Estado:** `[ ] Pendiente`

---

## Paso 2 — Migrar `src/lib/api.ts`

**Archivo a modificar:** `src/lib/api.ts`

- Importar `apiFetch` desde `@/lib/api-fetch`
- Reemplazar cada `fetch(...)` por `apiFetch(...)`
- Verificar que `POST /usuarios` (función `createUser`) quede correctamente excluido por la lógica del helper

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `getUsers` | GET | `/usuarios` |
| `createUser` | POST | `/usuarios` ← **excluido** |
| `getUserById` | GET | `/usuarios/{id}` |
| `deleteUser` | DELETE | `/usuarios/{id}` |
| `updateUser` | PUT/PATCH | `/usuarios/{id}` |
| `createTamano` | POST | `/tamanos` |
| `getTamanos` | GET | `/tamanos` |
| `getTamanoById` | GET | `/tamanos/{id}` |
| `updateTamano` | PUT/PATCH | `/tamanos/{id}` |
| `deleteTamano` | DELETE | `/tamanos/{id}` |
| `addIngredienteTamano` | POST | `/ingredientes-tamano` |
| `getIngredientesPorTamano` | GET | `/ingredientes-tamano/{id}` |
| `deleteIngredienteTamano` | DELETE | `/ingredientes-tamano/{id}` |
| `createProduct` | POST | `/ingredientes` |
| `getProducts` | GET | `/ingredientes` |
| `getProductTypes` | GET | `/ingredientes/tipos` |
| `getProductById` | GET | `/ingredientes/{id}` |
| `updateProduct` | PUT/PATCH | `/ingredientes/{id}` |
| `deleteProduct` | DELETE | `/ingredientes/{id}` |
| `getProductsByType` | GET | `/ingredientes/tipo/{tipo}` |
| `getOrders` | GET | `/orden` |
| `updateOrderStatus` | PATCH | `/orden/{id}/estado` |

**Estado:** `[ ] Pendiente`

---

## Paso 3 — Migrar `src/lib/apis/orden-api.ts`

**Archivo a modificar:** `src/lib/apis/orden-api.ts`

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `crearOrden` | POST | `/orden` |
| `agregarRecetaAOrden` | PATCH | `/orden/{id}/receta` |
| `getOrdersByUserId` | GET | `/orden/usuario/{id}` |
| `addNoteToOrder` | PATCH | `/orden/{id}/nota` |
| `updateOrderStatus` | PATCH | `/orden/{id}/estado` |

**Estado:** `[ ] Pendiente`

---

## Paso 4 — Migrar `src/lib/apis/torta-api.ts`

**Archivo a modificar:** `src/lib/apis/torta-api.ts`

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `crearTorta` | POST | `/torta` |

**Estado:** `[ ] Pendiente`

---

## Paso 5 — Migrar `src/lib/apis/receta-api.ts`

**Archivo a modificar:** `src/lib/apis/receta-api.ts`

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `crearReceta` | POST | `/receta` |

**Estado:** `[ ] Pendiente`

---

## Paso 6 — Migrar `src/lib/apis/tamano-api.ts`

**Archivo a modificar:** `src/lib/apis/tamano-api.ts`

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `getTamanosByTipoReceta` | GET | `/tamanos/tipo-receta/{tipo}` |

**Estado:** `[ ] Pendiente`

---

## Paso 7 — Migrar `src/lib/apis/ingrediente-api.ts`

**Archivo a modificar:** `src/lib/apis/ingrediente-api.ts`

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `getIngredients` | GET | `/ingredientes/search` |

**Estado:** `[ ] Pendiente`

---

## Paso 8 — Migrar `src/lib/apis/imagen-api.ts`

**Archivo a modificar:** `src/lib/apis/imagen-api.ts`

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `generateCustomCakeImage` | POST | `/generate-image/custom-cake` |

**Estado:** `[ ] Pendiente`

---

## Paso 9 — Migrar `src/lib/apis/costo-api.ts`

**Archivo a modificar:** `src/lib/apis/costo-api.ts`

Funciones afectadas:
| Función | Método | Endpoint |
|---|---|---|
| `calcularCostoPedido` | POST | `/costo/calcular` |

**Estado:** `[ ] Pendiente`

---

## Paso 10 — Verificación

- [ ] Levantar el servidor: `npm run dev`
- [ ] Iniciar sesión con un usuario válido
- [ ] Abrir DevTools → Network y verificar que las llamadas al backend incluyan el header `Authorization: Bearer ...`
- [ ] Verificar que `POST /usuarios` (registro) **no** incluya el header
- [ ] Verificar que el flujo completo del wizard de pedido funcione sin errores
- [ ] Verificar que los dashboards de admin y consumidor carguen correctamente
- [ ] Ejecutar: `npm run typecheck` — sin errores de tipos
- [ ] Ejecutar: `npm run lint` — sin warnings

---

## Paso 11 — Commit

Una vez verificado todo, hacer commit con el mensaje:

```
feat(seguridad): agregar header Authorization en llamadas al backend

Se implementa helper centralizado apiFetch que obtiene el idToken de
Firebase Authentication y lo envía como Bearer token en todas las
llamadas al backend Spring Boot.

Endpoints públicos excluidos: POST /usuarios,
GET /receta/ultimas-imagenes, GET /geografia/*.
```

---

## Resumen de archivos

| Acción | Archivo |
|---|---|
| Crear | `src/lib/api-fetch.ts` |
| Modificar | `src/lib/api.ts` |
| Modificar | `src/lib/apis/orden-api.ts` |
| Modificar | `src/lib/apis/torta-api.ts` |
| Modificar | `src/lib/apis/receta-api.ts` |
| Modificar | `src/lib/apis/tamano-api.ts` |
| Modificar | `src/lib/apis/ingrediente-api.ts` |
| Modificar | `src/lib/apis/imagen-api.ts` |
| Modificar | `src/lib/apis/costo-api.ts` |

**Total: 1 archivo nuevo + 8 archivos modificados**

---

## Historial de cambios del plan

| Fecha | Cambio |
|---|---|
| 2026-03-11 | Plan creado |
| — | — |
