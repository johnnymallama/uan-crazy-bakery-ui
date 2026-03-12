# Especificación: Seguridad FE–BE con Header Authorization
**Proyecto:** uan-crazy-bakery-ui
**Fecha:** 2026-03-11
**Estado:** `[ ] Pendiente implementación`
**Autor:** Johnny Mallama

---

## Contexto

El backend (Spring Boot) ya tiene implementada la validación de seguridad mediante el header `Authorization`, que espera recibir el JWT en formato `Bearer <idToken>`, donde el `idToken` es el token generado por Firebase Authentication tras la autenticación del usuario.

Actualmente, el frontend **no envía este header** en ninguna llamada al backend. Todas las llamadas se realizan con `fetch()` enviando únicamente `Content-Type: application/json`.

---

## Objetivo

Interceptar todas las llamadas al backend para incluir automáticamente el header:

```
Authorization: Bearer <idToken>
```

donde `<idToken>` se obtiene de Firebase Authentication mediante `user.getIdToken()`.

---

## Endpoints excluidos de la seguridad

Los siguientes endpoints **no requieren** el header `Authorization`:

| Método | Endpoint | Motivo |
|---|---|---|
| `POST` | `/usuarios` | Registro de nuevo usuario, aún sin sesión |
| `GET` | `/receta/ultimas-imagenes` | Consulta pública |
| `GET` | `/geografia/*` | Consulta pública (departamentos, ciudades, etc.) |

---

## Estado actual

### Cómo se obtiene el token hoy

Firebase Authentication **sí emite un idToken** tras el login, pero el frontend no lo extrae ni lo usa. El flujo actual es:

```
1. signInWithEmailAndPassword() → retorna UserCredential
2. Se extrae solo: userCredential.user.uid
3. Se llama a /api/auth/login con { uid }
4. Se establece cookie HTTP-only { uid, role }
5. Las llamadas al backend se hacen sin ningún token
```

### Dónde se hacen las llamadas al backend

| Archivo | Descripción |
|---|---|
| `src/lib/api.ts` | API central: usuarios, tamaños, ingredientes, órdenes, productos |
| `src/lib/apis/orden-api.ts` | Crear orden, agregar receta, notas, estado |
| `src/lib/apis/torta-api.ts` | Crear torta |
| `src/lib/apis/receta-api.ts` | Crear receta |
| `src/lib/apis/tamano-api.ts` | Obtener tamaños por tipo de receta |
| `src/lib/apis/ingrediente-api.ts` | Buscar ingredientes |
| `src/lib/apis/imagen-api.ts` | Generar imagen personalizada |
| `src/lib/apis/costo-api.ts` | Calcular costo del pedido |

### Patrón de llamada actual

```typescript
// Así se llama hoy — sin Authorization
const response = await fetch(`${BASE_URL}/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

---

## Solución propuesta

### Crear un helper centralizado `apiFetch`

En lugar de modificar cada llamada individualmente (son decenas), se creará un helper centralizado en `src/lib/api-fetch.ts` que:

1. Obtiene el `idToken` vigente desde el usuario autenticado en Firebase
2. Construye los headers con `Authorization: Bearer <idToken>`
3. Detecta si el endpoint está en la lista de exclusiones y omite el header si aplica
4. Reemplaza el uso directo de `fetch()` en todos los archivos de la capa de API

```typescript
// src/lib/api-fetch.ts (nuevo archivo)

import { getAuth } from 'firebase/auth';

const PUBLIC_ENDPOINTS = [
  { method: 'POST', path: '/usuarios' },
  { method: 'GET',  path: '/receta/ultimas-imagenes' },
  { method: 'GET',  path: '/geografia/' },  // cubre /geografia/*
];

function isPublicEndpoint(method: string, url: string): boolean {
  return PUBLIC_ENDPOINTS.some(({ method: m, path }) =>
    method.toUpperCase() === m && url.includes(path)
  );
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method ?? 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (!isPublicEndpoint(method, url)) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const idToken = await user.getIdToken();
    headers.set('Authorization', `Bearer ${idToken}`);
  }

  return fetch(url, { ...options, headers });
}
```

### Reemplazar `fetch` por `apiFetch` en la capa de API

Una vez creado el helper, se sustituye `fetch(...)` por `apiFetch(...)` en:

- `src/lib/api.ts`
- `src/lib/apis/orden-api.ts`
- `src/lib/apis/torta-api.ts`
- `src/lib/apis/receta-api.ts`
- `src/lib/apis/tamano-api.ts`
- `src/lib/apis/ingrediente-api.ts`
- `src/lib/apis/imagen-api.ts`
- `src/lib/apis/costo-api.ts`

> **No aplica** a `src/app/api/auth/login/route.ts` ni a `src/components/auth/login-form.tsx` ya que son rutas internas de Next.js, no llamadas directas al backend Spring Boot.

---

## Consideraciones importantes

### Refresco automático del token

Firebase renueva el `idToken` automáticamente cada hora. Al usar `user.getIdToken()` (sin parámetros), Firebase retorna el token en caché si aún es válido, o lo refresca si está próximo a expirar. Esto significa que **no hay que manejar el refresco manualmente**.

Si se desea forzar un refresco: `user.getIdToken(true)` — pero no es necesario en condiciones normales.

### Manejo de errores de autenticación

Si el backend responde con `401 Unauthorized`, significa que el token expiró o es inválido. Se deberá:

1. Capturar el error `401` en `apiFetch`
2. Intentar refrescar el token con `user.getIdToken(true)`
3. Reintentar la solicitud una sola vez
4. Si sigue fallando, redirigir al login

Este comportamiento puede implementarse como mejora en una iteración posterior.

### Usuarios no autenticados

El helper lanza un error si `auth.currentUser` es `null`. Esto está cubierto por el middleware de rutas, que ya protege las páginas que requieren autenticación. Los endpoints públicos no pasan por esta validación.

---

## Archivos a crear o modificar

| Acción | Archivo | Descripción |
|---|---|---|
| **Crear** | `src/lib/api-fetch.ts` | Helper centralizado con lógica de Authorization |
| **Modificar** | `src/lib/api.ts` | Reemplazar `fetch` por `apiFetch` |
| **Modificar** | `src/lib/apis/orden-api.ts` | Reemplazar `fetch` por `apiFetch` |
| **Modificar** | `src/lib/apis/torta-api.ts` | Reemplazar `fetch` por `apiFetch` |
| **Modificar** | `src/lib/apis/receta-api.ts` | Reemplazar `fetch` por `apiFetch` |
| **Modificar** | `src/lib/apis/tamano-api.ts` | Reemplazar `fetch` por `apiFetch` |
| **Modificar** | `src/lib/apis/ingrediente-api.ts` | Reemplazar `fetch` por `apiFetch` |
| **Modificar** | `src/lib/apis/imagen-api.ts` | Reemplazar `fetch` por `apiFetch` |
| **Modificar** | `src/lib/apis/costo-api.ts` | Reemplazar `fetch` por `apiFetch` |

---

## Flujo resultante tras la implementación

```
Usuario autenticado en Firebase
        │
        ▼
  apiFetch(url, options)
        │
        ├── ¿Es endpoint público? ──► SÍ ──► fetch() sin Authorization
        │
        └── NO
              │
              ▼
        auth.currentUser.getIdToken()
              │
              ▼
        headers.set('Authorization', `Bearer ${idToken}`)
              │
              ▼
        fetch(url, { ...options, headers })
              │
              ▼
        Spring Boot valida JWT contra Firebase
              │
              ▼
        Respuesta al frontend
```

---

## Criterios de aceptación

- [ ] El header `Authorization: Bearer <token>` se envía en todas las llamadas al backend excepto las excluidas
- [ ] `POST /usuarios` no envía el header Authorization
- [ ] `GET /receta/ultimas-imagenes` no envía el header Authorization
- [ ] `GET /geografia/*` no envía el header Authorization
- [ ] El token se obtiene de Firebase sin necesidad de almacenarlo manualmente
- [ ] No hay duplicación de lógica de headers en los archivos de API
- [ ] Las llamadas a rutas internas de Next.js (`/api/auth/login`) no se ven afectadas

---

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 2026-03-11 | Especificación creada |
| — | — |
