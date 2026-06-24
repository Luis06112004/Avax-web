<p align="center">
  <img src="public/images/avax-logo.png" width="220" alt="AVAX">
</p>

<h1 align="center">AVAX Web</h1>

Frontend de **AVAX**, una tienda de zapatillas/sneakers premium para el mercado peruano (precios en PEN). Construido con **Next.js 15** (App Router), **React 19**, **TypeScript** y **Tailwind CSS 4**.

Este proyecto es **toda la interfaz visual** de AVAX: tanto la **tienda pública** que ve el cliente como el **panel administrativo (CMS)** que usa la empresa. No tiene base de datos propia: obtiene **todos** sus datos del backend **Avax-api** (Laravel) mediante llamadas HTTP.

## Arquitectura — backend + frontend separados

AVAX está partido en dos proyectos independientes que se comunican por HTTP:

```
┌─────────────────────────┐         HTTP / JSON          ┌─────────────────────────┐
│        Avax-web         │  ───────────────────────────▶ │        Avax-api         │
│   (ESTE repo; Next.js)  │   GET/POST  /api/...           │   (Laravel / PHP)       │
│   tienda + panel CMS    │ ◀───────────────────────────  │   API REST + base datos │
│   http://localhost:3000 │        respuestas JSON        │  http://127.0.0.1:8000  │
└─────────────────────────┘                               └─────────────────────────┘
```

- **Avax-web** (este repositorio) → interfaz visual; no guarda datos, los pide a la API.
- **Avax-api** → API REST en Laravel que entrega los datos en JSON.

Para que la aplicación completa funcione hay que tener **los dos proyectos corriendo a la vez** (ver [Conexión con el backend](#conexión-con-el-backend-avax-api)).

## Tecnologías

- **Next.js** 15 — App Router, Server Components y revalidación ISR
- **React** 19
- **TypeScript** 5
- **Tailwind CSS** 4 (vía `@tailwindcss/postcss`)
- **Framer Motion** — animaciones y transiciones de página
- **lucide-react** — iconos

## Estructura del proyecto

```
src/
├── app/
│   ├── (shop)/              # Tienda pública (home, tienda, producto, carrito, checkout, login…)
│   │   ├── checkout/        # Checkout multi-paso (datos-envío → método → pago → confirmación)
│   │   ├── producto/[slug]/ # Detalle de producto
│   │   ├── mis-pedidos/     # Pedidos del cliente autenticado
│   │   └── …
│   ├── admin/
│   │   ├── (cms)/           # Panel administrativo (dashboard, productos, sync, banners, cupones…)
│   │   │   └── home/        # Editor del home por secciones (hero, destacados, promo, marcas…)
│   │   ├── _components/     # Componentes propios del panel (Sidebar, Topbar, editores…)
│   │   └── login / registro # Acceso al CMS
│   ├── api/revalidate/      # Route handler para revalidar la home (ISR)
│   └── layout.tsx           # Layout raíz (fuentes, metadata)
├── components/              # UI reutilizable (ui/, layout/, product/, sections/, cart/, auth/)
├── lib/                     # Clientes de la API y utilidades
│   ├── shop-api.ts          #   catálogo público
│   ├── orders-api.ts        #   pedidos
│   ├── auth-api.ts          #   auth de cliente (Sanctum)
│   ├── admin-auth.ts        #   auth del CMS (role=admin)
│   ├── home-api.ts          #   CMS del home
│   ├── cart.ts              #   tipos de carrito / envío / pago
│   └── revalidate.ts        #   disparo de revalidación ISR
├── data/                    # Datos mock (en transición hacia la API real)
└── types/                   # Tipos compartidos
```

## Funcionalidades

### Tienda pública
- **Home** dinámico por secciones gestionadas desde el CMS (hero/carrusel, destacados, nuevos, populares, promo, marcas, Instagram, testimonios).
- **Catálogo** con búsqueda, filtros (marca, categoría, género, precio) y ordenamiento.
- **Detalle de producto** con galería, tallas, colores y stock.
- **Carrito** persistente (drawer) y **checkout multi-paso**: datos de envío → método de envío → pago → confirmación.
- **Compra como invitado** o autenticado; pago con tarjeta, Yape o transferencia.
- **Cuenta de cliente**: registro, login y "Mis pedidos".

### Panel administrativo (CMS) — `/admin`
- **Dashboard** con estadísticas.
- **Productos**, **banners**, **categorías**, **clientes**, **cupones** y **configuración** de la tienda.
- **Sincronización** del catálogo con el proveedor externo (UI del proceso).
- **Editor del home por secciones** con vista previa por dispositivo (desktop / tablet / móvil) y reordenamiento.
- Acceso restringido a usuarios con `role = admin`.

## Conexión con el backend (Avax-api)

El frontend no comparte código ni base de datos con el backend: se comunican solo por HTTP. La integración se controla con **variables de entorno**.

### Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL base de la API Laravel (incluye el prefijo /api)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# URL del almacenamiento del backend (imágenes subidas desde el CMS)
NEXT_PUBLIC_STORAGE_URL=http://127.0.0.1:8000/storage
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL base de la API Laravel, con `/api` | `http://127.0.0.1:8000/api` |
| `NEXT_PUBLIC_STORAGE_URL` | URL del `storage` del backend para imágenes | `http://127.0.0.1:8000/storage` |

> Ambas tienen valores por defecto que coinciden con `php artisan serve`, así que en local funciona sin configurar nada. Para producción apunta estas variables al dominio real del backend.

### Autenticación (token Bearer)

La auth es por **token Sanctum**, no por cookies:

1. El usuario hace login → el backend devuelve un **token**.
2. El frontend lo guarda (en `localStorage` para el CMS) y lo envía en cada petición protegida:
   ```http
   Authorization: Bearer <token>
   ```
3. La tienda y el panel admin usan tokens y almacenamiento **separados** (`admin-auth.ts` vs `auth-api.ts`).

> El backend debe permitir el origen del frontend en su configuración de **CORS** (los puertos `3000/3001/3005` ya están permitidos por defecto en Avax-api).

### Imágenes remotas

`next.config.ts` autoriza cargar imágenes desde el proveedor externo (`api1.eless.com.pe`, `elesstyle.com`). Si el backend sirve imágenes desde otro dominio, hay que añadirlo a `images.remotePatterns`.

## Requisitos

- Node.js 18+ y npm
- El backend **Avax-api** corriendo (para datos reales)

## Instalación y desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el entorno
#    crear .env.local con NEXT_PUBLIC_API_URL (ver arriba)

# 3. Arrancar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:3000`.

### Checklist de arranque conjunto

| Paso | Dónde | Comando / valor |
|------|-------|-----------------|
| 1 | Avax-api | `php artisan serve` → `http://127.0.0.1:8000` |
| 2 | Avax-web | `.env.local` con `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api` |
| 3 | Avax-web | `npm run dev` → `http://localhost:3000` |

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build de producción |
| `npm run lint` | Linter (ESLint) |

## Licencia

Software propietario de AVAX.
