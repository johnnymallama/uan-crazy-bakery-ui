# Crazy Bakery — Frontend

Aplicación web para la pastelería **Crazy Bakery**, que permite a los clientes personalizar y ordenar tortas y cupcakes con ayuda de inteligencia artificial. Desarrollada como proyecto académico de la Universidad Antonio Nariño (UAN).

---

## Tecnologías

### Framework y lenguaje
| Tecnología | Versión | Descripción |
|---|---|---|
| Next.js | 15.5.9 | Framework React con App Router y SSR |
| React | 19.2.1 | Librería de interfaces de usuario |
| TypeScript | 5 | Tipado estático sobre JavaScript |

### UI y estilos
| Tecnología | Versión | Descripción |
|---|---|---|
| Tailwind CSS | 3.4.1 | Framework CSS utilitario |
| shadcn/ui | — | Componentes accesibles sobre Radix UI |
| Lucide React | 0.475.0 | Librería de iconos |

### Autenticación
| Tecnología | Descripción |
|---|---|
| Firebase Auth | Autenticación con email/contraseña y Google |
| HTTP-only cookie (`session`) | Cookie de sesión con `{ uid, role }` para protección de rutas en middleware |

### Inteligencia Artificial
| Tecnología | Versión | Descripción |
|---|---|---|
| OpenAI SDK | — | Generación de sugerencias de personalización vía streaming |
| Genkit | 1.20.0 | Framework de Google para features con IA (configurado, sin uso activo) |

### Formularios y validación
| Tecnología | Versión | Descripción |
|---|---|---|
| React Hook Form | 7.54.2 | Manejo de formularios con validación |
| Zod | 3.24.2 | Esquemas de validación con tipos TypeScript |

### Testing
| Tecnología | Descripción |
|---|---|
| Jest | Runner de pruebas |
| React Testing Library | Pruebas de componentes orientadas al usuario |

---

## Arquitectura

```
src/
├── app/
│   ├── [lang]/               # Rutas con soporte i18n (es / en)
│   │   ├── page.tsx          # Home
│   │   ├── login/
│   │   ├── register/
│   │   ├── order/
│   │   ├── account/
│   │   ├── contact/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── unauthorized/
│   │   └── dashboard/
│   │       ├── admin/        # Rutas protegidas (rol: administrador)
│   │       └── consumer/     # Rutas protegidas (rol: consumidor)
│   └── api/
│       ├── auth/login/       # Crea cookie de sesión HTTP-only
│       ├── auth/logout/      # Elimina cookie de sesión
│       └── generate-suggestion/  # Endpoint de IA (streaming)
├── components/
│   ├── ui/                   # Componentes base shadcn/ui
│   ├── admin/                # Dashboards de administración
│   ├── consumer/             # Vistas de órdenes del consumidor
│   ├── order/                # Wizard de pedido y sus pasos
│   ├── auth/                 # Login, registro, cuenta
│   └── layout/               # Header, footer, navegación
├── lib/
│   ├── api.ts                # Capa central de llamadas al backend
│   ├── apis/                 # Módulos de API por dominio
│   ├── types/                # Tipos TypeScript del dominio
│   ├── dictionaries/         # Archivos JSON de traducciones
│   └── get-dictionary.ts     # Carga server-side de diccionarios
├── ai/
│   └── genkit.ts             # Configuración de Genkit + Gemini
├── context/
│   └── session-provider.tsx  # Proveedor de sesión Firebase
└── middleware.ts             # Protección de rutas por rol y locale
```

### Internacionalización

Los idiomas soportados son `es` (por defecto) y `en`, definidos en `i18n-config.ts`. El middleware redirige automáticamente las rutas sin prefijo de locale.

### Autenticación y sesión

La autenticación es de doble capa:

1. **Firebase Auth** — maneja la identidad del usuario (email/contraseña + Google).
   El `SessionProvider` escucha `onAuthStateChanged` y enriquece el usuario con su rol (`administrador` / `consumidor`) desde el backend.
2. **Cookie HTTP-only** (`session`) — establecida al hacer login vía `/api/auth/login`.
   El middleware la lee para proteger rutas del dashboard.

Protección de rutas:
- `/dashboard/admin/*` → requiere `role === 'administrador'`
- `/dashboard/consumer/*` → requiere `role === 'consumidor'`
- Sin sesión → redirige a `/{lang}/unauthorized`

---

## Módulos de API (cliente → Spring Boot)

El backend es un servicio Spring Boot en:
```
https://crazy-bakery-bk-835393530868.us-central1.run.app
```

| Módulo | Archivo | Responsabilidad |
|---|---|---|
| API base | `src/lib/api.ts` | Configuración base, headers de autorización |
| Órdenes | `src/lib/apis/orden-api.ts` | Crear, listar y gestionar órdenes |
| Tortas | `src/lib/apis/torta-api.ts` | Configuración de tortas personalizadas |
| Recetas | `src/lib/apis/receta-api.ts` | Gestión de recetas |
| Tamaños | `src/lib/apis/tamano-api.ts` | Tamaños disponibles |
| Ingredientes | `src/lib/apis/ingrediente-api.ts` | Ingredientes (bizcocho, relleno, cobertura) |
| Imágenes | `src/lib/apis/imagen-api.ts` | Generación de imágenes con IA |
| Costos | `src/lib/apis/costo-api.ts` | Cálculo de costos |

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/{lang}/` | Público | Página de inicio con carrusel y catálogo |
| `/{lang}/login` | Público | Inicio de sesión |
| `/{lang}/register` | Público | Registro de usuarios |
| `/{lang}/order` | Público | Página de pedido con wizard |
| `/{lang}/account` | Autenticado | Gestión de cuenta personal |
| `/{lang}/contact` | Público | Página de contacto |
| `/{lang}/privacy` | Público | Política de privacidad |
| `/{lang}/terms` | Público | Términos y condiciones |
| `/{lang}/unauthorized` | Público | Acceso denegado |
| `/{lang}/dashboard/admin` | Administrador | Panel de administración |
| `/{lang}/dashboard/admin/products` | Administrador | Gestión de productos |
| `/{lang}/dashboard/admin/sizes` | Administrador | Gestión de tamaños |
| `/{lang}/dashboard/admin/users` | Administrador | Gestión de usuarios |
| `/{lang}/dashboard/admin/order-management` | Administrador | Gestión de órdenes |
| `/{lang}/dashboard/consumer` | Consumidor | Panel del cliente |
| `/{lang}/dashboard/consumer/orders` | Consumidor | Historial de órdenes |

---

## Wizard de pedido

El flujo principal de compra es un wizard multi-paso (`src/components/order/order-wizard-modal.tsx`):

1. Tipo de receta (TORTA / CUPCAKE)
2. Selección de tamaño
3. Ingrediente de bizcocho
4. Ingrediente de relleno
5. Ingrediente de cobertura
6. Personalización + generación de imagen con IA
7. Gate de autenticación (login/registro si no hay sesión)
8. Información de envío
9. Resumen y confirmación

Al enviar, el wizard crea en secuencia: `torta` → `receta` → `orden` en el backend. Se pueden agregar múltiples productos a la misma orden.

---

## Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto con:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# IA
OPENAI_API_KEY=
OPENAI_API_MODEL=   # opcional, por defecto gpt-5-mini
```

---

## Cómo ejecutar

### Requisitos previos
- Node.js >= 18
- npm

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación corre en [http://localhost:9002](http://localhost:9002) con Turbopack.

### Servidor de IA (Genkit)

```bash
npm run genkit:dev
# o en modo watch
npm run genkit:watch
```

### Build de producción

```bash
npm run build
npm start
```

### Linting y tipos

```bash
npm run lint
npm run typecheck
```

### Tests

```bash
# Interactivo
npm run test

# Modo CI (no interactivo)
npm run test:ci

# Archivo individual
npx jest src/components/auth/login-form.test.tsx
```

---

## Nota para desarrollo local

El middleware tiene un bloque comentado para simular sesión en entornos sin Firebase configurado. Revisar `src/middleware.ts` y alternar el comentario correspondiente al cambiar entre entorno local y producción.
