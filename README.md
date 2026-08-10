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
- `infrastructure` — implementaciones concretas (datos estáticos por ahora)
- `presentation` — páginas, secciones, componentes y hooks React

```txt
src/
  app/           # router, layouts, providers
  shared/        # UI genérica y utilidades
  features/      # features independientes (landing, futuro admin)
```

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run preview  # preview del build
npm run lint     # lint
```

## Alcance actual

- Landing pública
- Arquitectura preparada para módulos futuros (admin, clientes, cotizaciones, certificados)

Fuera de alcance por ahora: backend, login, admin y APIs.
