# AJ Electronic Design Platform

Frontend de la plataforma AJ Electronic Design, construido con React, Vite, TypeScript y Tailwind CSS.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS 4
- React Router

## Arquitectura

Estructura feature-based con capas:

- `domain` — entidades y contratos de negocio
- `application` — casos de uso
- `infrastructure` — implementaciones concretas (HTTP, datos estáticos, mock)
- `presentation` — páginas, secciones, componentes y hooks React

```txt
src/
  app/           # router, layouts, providers
  shared/        # UI genérica, i18n y cliente HTTP
  features/      # landing, company, auth, workspace (área interna)
```

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # typecheck, build y fallback SPA para GitHub Pages
npm run preview  # preview del build
npm run lint     # lint
npm run test     # tests de auth y del cliente HTTP
```

## Variables de entorno

Copia `.env.example` a `.env`. Vite incrusta las variables `VITE_*` en el build; no son secretos de servidor.

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | Origen del backend, sin path. El cliente llama a `${VITE_API_URL}/api/v1`. Ejemplo local: `http://localhost:3000`. |
| `VITE_AUTH_MOCK` | `true` solo en desarrollo para iniciar sesión sin backend. |
| `VITE_EMAILJS_*` | Formulario público de contacto. |

El sitio publicado en GitHub Pages también necesita `VITE_API_URL` en el momento del build. En el repositorio, crea la variable de Actions `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables). El workflow de Pages la pasa al build. Si falta, el sitio público sigue construyendo, pero el login mostrará que la API no está configurada.

El backend vive en otro origen y no usa cookies. Su lista CORS debe incluir `http://localhost:5173` y `https://ajelectronicdesign.github.io` (el origen, sin el path `/AJ-Platform-Frontend/`).

## Autenticación

El contrato es el de `AJ-Platform-Backend` (base `${VITE_API_URL}/api/v1`). No hay refresh token: solo un access token de 3600 segundos. Al expirar o revocarse, se borra y la app vuelve a `/login`.

| Método | Ruta | Éxito |
| --- | --- | --- |
| `GET` | `/api/v1/health` | `200 { status, db, timestamp }` (no usa el sobre de error) |
| `POST` | `/api/v1/auth/login` | `200 { accessToken, expiresIn, user: { id, email, name, role } }` |
| `GET` | `/api/v1/auth/me` | `200 { user }` con `Authorization: Bearer` |
| `POST` | `/api/v1/auth/logout` | `204` sin cuerpo. Revoca todos los tokens de ese usuario |

Los errores son siempre `{ "error": { "code", "message", "details": [] } }`. El cliente decide por `error.code`:

- `INVALID_CREDENTIALS` (401) — login rechazado
- `RATE_LIMITED` (429) — demasiados intentos
- `UNAUTHORIZED`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `TOKEN_REVOKED` (401) — la sesión terminó; se borra el token y se vuelve a `/login`. Reusar un token después del logout responde `TOKEN_REVOKED`
- `FORBIDDEN` (403) — el token sigue siendo válido y el rol no alcanza. No cierra la sesión

`role` es `admin` o `employee`. El token vive solo en `src/shared/infrastructure/http/access-token.ts` y el cliente HTTP lo manda como Bearer. No se envía `credentials: 'include'`.

Al cargar, si hay token, `GET /auth/me` restaura el usuario, así que un refresh de la página mantiene la sesión mientras no haya vencido. El login y esa comprobación inicial no redirigen desde la landing: si el token ya no sirve, la sesión termina y `/app` manda a `/login`.

La página `/login` conserva su diseño. Estados: envío en curso, credenciales inválidas, rate limit y error de red. Quien ya tiene sesión y abre `/login` entra a `/app`.

My AJ, en el header y el footer, apunta a `/app`. Sin sesión, el guard redirige a `/login`.

### Mock de desarrollo

Con `VITE_AUTH_MOCK=true` no hace falta el backend:

- `demo@aj-electronic-design.com` / `password` (rol `admin`)
- `limited@aj-electronic-design.com` simula HTTP 429
- `offline@aj-electronic-design.com` simula un fallo de red
- cualquier otra combinación simula credenciales inválidas

## Área interna

`/app` es el shell protegido (sidebar, usuario y cierre de sesión), con el mismo lenguaje visual de la landing. Las rutas de los módulos que vienen son placeholders:

- `/app` — Dashboard
- `/app/clientes` — Clientes
- `/app/cotizaciones` — Cotizaciones
- `/app/ordenes-de-entrega` — Órdenes de entrega

`RequireAuth` protege ese árbol. `RequireRole` y `userHasRole` limitan un módulo a `admin` y/o `employee`. Un `403` del API no cierra la sesión.

## GitHub Pages

`base` es `/AJ-Platform-Frontend/`. El build copia `dist/index.html` a `dist/404.html` para que un enlace directo a `/app/...` cargue la SPA y React Router resuelva la ruta.
