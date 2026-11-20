# Fitness Lacroix - Full-Stack (EFI Programación III)

Aplicación web full-stack interactiva y responsiva desarrollada para la plataforma **Fitness Lacroix**, orientada a la gestión integral de alumnos, planes de entrenamiento, blog fitness con comentarios en tiempo real y panel de control administrativo.

## 📋 Temática y Arquitectura
- **Temática:** Plataforma de gestión fitness, membresías, blog interactivo, registro público de alumnos y panel administrativo.
- **Repositorio Monorepo (Backend + Frontend):** https://github.com/lacroixdvs/efi-prog3-lacroix
- **API Backend:** API REST construida en **Django + Django REST Framework + SimpleJWT** (Cátedra Ingeniería de Software).

## 🚀 Enlaces del Proyecto
- **Aplicación Desplegada (Vercel):** https://efi-prog3-lacroix.vercel.app
- **Tablero Kanban (Metodología Ágil):** https://trello.com/b/OkM4woSJ/mi-tablero-de-trello

## 👤 Integrante
- **Nicolás Lacroix**

---

## 🛠️ Tecnologías y Funcionalidades Principales

### Frontend (`/frontend`)
- **Framework:** Next.js 15 (App Router) + React 19
- **Estilos:** Tailwind CSS v4
- **Lenguaje:** TypeScript (TSX)
- **Autenticación y Seguridad:** Gestión centralizada en `src/lib/api.ts` (`apiFetch`, `saveAuthCookies`, `clearAuthCookies`) almacenando los tokens **JWT (`access` y `refresh`) y roles exclusivamente en Cookies** (`SameSite=Lax; path=/`), evitando vulnerabilidades de exposición en `localStorage`.
- **Formularios y Validación:** React Hook Form + **Zod** (`src/lib/schemas.ts` con `loginSchema`, `registroSchema` y `planSchema`).
- **Vistas y Roles:**
  - **Invitado:** Navegación pública, lectura de artículos del blog, acceso a `/login` y registro abierto en `/registro`.
  - **Alumno (`ROLE: USUARIO`):** Inicio de sesión con JWT, lectura y publicación de comentarios en `/blog/[id]`.
  - **Administrador (`ROLE: ADMIN`):** Acceso exclusivo a `/dashboard` con CRUD completo de Alumnos, Posts del Blog, moderación de Comentarios y gestión de Usuarios sincronizados con Django.
- **Testing:** Vitest + Testing Library (`jsdom`)
- **Despliegue:** Vercel

### Backend (`/backend` - Django REST Framework)
- **Autenticación JWT:** `rest_framework_simplejwt` (`/api/token/` y `/api/token/refresh/`).
- **Endpoints REST (`/api/`):**
  - `POST /api/registro/`: Alta pública segura de nuevos alumnos con contraseña encriptada (`set_password`) y permisos regulares forzados (`is_staff=False`).
  - `GET/POST/PATCH/DELETE /api/usuarios/`: Gestión administrativa de alumnos (`IsAdminUser`).
  - `GET/POST/PATCH/DELETE /api/posts/` y `/api/categorias/`: Gestión del blog con lectura pública (`AllowAny`) y edición administrativa (`IsAdminUser`).
  - `GET/POST/PATCH/DELETE /api/comentarios/`: Lectura abierta y creación autenticada mediante token JWT (`IsAuthenticatedOrReadOnly`).

---

## ⚙️ Requisitos, Variables de Entorno y Levantamiento Local

### 1. Clonar el Repositorio
```bash
git clone [https://github.com/lacroixdvs/efi-prog3-lacroix.git](https://github.com/lacroixdvs/efi-prog3-lacroix.git)
cd efi-prog3-lacroix
```

### 2. Variables de Entorno

#### Backend (Archivo `.env` en la raíz o carpeta del backend, si aplica)
```env
SECRET_KEY=django-insecure-clave-local-lacroix
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Frontend (Crear archivo `.env.local` dentro de `frontend/`)
```env
NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
```

### 3. Instalar Dependencias y Levantar el Backend (Django + `uv`)
Desde la carpeta del backend (o raíz del proyecto donde está `manage.py`):
```bash
# Instalar dependencias con uv (o pip install -r requirements.txt)
uv sync

# Aplicar migraciones de la base de datos
uv run python manage.py migrate

# (Opcional) Crear superusuario administrador
uv run python manage.py createsuperuser

# Levantar servidor de desarrollo de Django
uv run python manage.py runserver
```
*La API REST estará disponible en `http://127.0.0.1:8000/api/`.*

### 4. Instalar Dependencias y Levantar el Frontend (Next.js)
Abrir otra terminal y navegar a la carpeta `frontend/`:
```bash
cd frontend

# Instalar dependencias de Node
npm install

# Iniciar servidor de desarrollo
npm run dev
```
*La aplicación web estará disponible en `http://localhost:3000`.*

---

## 🧪 Ejecución de Tests Unitarios

La suite de pruebas con **Vitest** abarca:
- Pruebas de componentes de UI (`Button.test.tsx`).
- Pruebas de validación de esquemas Zod (`schemas.test.ts` para `loginSchema`, `registroSchema` y `planSchema`).

Desde la carpeta `frontend/`, ejecutar:
```bash
npm run test
```

---

## 📸 Capturas de la Aplicación en Funcionamiento

![Vista de la aplicación 1](./docs/app-preview%20(1).png)
![Vista de la aplicación 2](./docs/app-preview%20(2).png)
![Vista de la aplicación 3](./docs/app-preview%20(3).png)
![Vista de la aplicación 4](./docs/app-preview%20(4).png)
![Vista de la aplicación 5](./docs/app-preview%20(5).png)
![Vista de la aplicación 6](./docs/app-preview%20(6).png)
![Vista de la aplicación 7](./docs/app-preview%20(7).png)
![Vista de la aplicación 8](./docs/app-preview%20(8).png)
![Vista de la aplicación 9](./docs/app-preview%20(9).png)
![Vista de la aplicación 10](./docs/app-preview%20(10).png)
![Vista de la aplicación 11](./docs/app-preview%20(11).png)
![Vista de la aplicación 12](./docs/app-preview%20(12).png)
![Vista de la aplicación 13](./docs/app-preview%20(13).png)

---

## 🌳 Metodología de Trabajo y GitFlow

El desarrollo se organiza siguiendo **Metodología Ágil (Kanban en Trello)** y la estrategia de ramas **GitFlow**:
- **`main`**: Rama principal con código estable y desplegado en producción (Vercel).
- **`develop`**: Rama de integración continua de nuevas funcionalidades.
- **`feature/*`**: Ramas específicas por funcionalidad (`feature/efi-frontend-setup`, `feature/jwt-cookies-registro`).
