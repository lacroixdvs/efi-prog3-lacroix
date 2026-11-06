# Fitness Lacroix - Frontend (EFI Programación III)

Aplicación web interactiva y responsiva desarrollada para la plataforma **Fitness Lacroix**, orientada a la gestión de planes de entrenamiento, catálogo de clases y reservas de usuarios.

## 📋 Temática y API Consumida
- **Temática:** Plataforma de gestión fitness, membresías, profesores y login de usuarios.
- **Repositorio Monorepo / Backend:** https://github.com/lacroixdvs/efi-prog3-lacroix
- **API Backend:** API REST construida en **Django / Django REST Framework** (Cátedra Ingeniería de Software).

## 🚀 Enlaces del Proyecto
- **Aplicación Desplegada (Vercel):** https://efi-prog3-lacroix.vercel.app
- **Tablero Kanban (Metodología Ágil):** https://trello.com/b/OkM4woSJ/mi-tablero-de-trello

## 👤 Integrante
- **Nicolás Lacroix**

---

## 🛠️ Tecnologías y Estructura
- **Framework:** Next.js 15 (App Router) + React 19
- **Estilos:** Tailwind CSS v4
- **Lenguaje:** TypeScript (TSX)
- **Validación de Datos:** Zod (`src/lib/schemas.ts`)
- **Testing:** Vitest + Testing Library (`jsdom`)
- **Despliegue:** Vercel

---

## ⚙️ Requisitos y Configuración Local

### 1. Variables de Entorno
Crear un archivo `.env.local` en la carpeta `frontend/` con la siguiente variable:

NEXT_PUBLIC_API_URL=https://api-placeholder.com/api

### 2. Pasos para Ejecutar Localmente

1. Clonar el repositorio y navegar a la carpeta del frontend:
git clone https://github.com/lacroixdvs/efi-prog3-lacroix.git
cd efi-prog3-lacroix/frontend

2. Instalar las dependencias:
npm install

3. Iniciar el servidor de desarrollo:
npm run dev

*La aplicación estará disponible en http://localhost:3000.*

---

## 🧪 Ejecución de Tests Unitarios

La suite de pruebas con **Vitest** abarca:
- Pruebas de componentes de UI (`Button.test.tsx`).
- Pruebas de validación de esquemas Zod (`schemas.test.ts` para `loginSchema` y `planSchema`).

Para ejecutar todos los tests:

npm run test

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
![Vista de la aplicación 9](./docs/app-preview%20(1).png)

---

## 🌳 Metodología de Trabajo y GitFlow
El proyecto sigue la estrategia de ramas **GitFlow**:
- **`main`**: Código estable y desplegado en Vercel.
- **`develop`**: Rama de integración de características.
- **`feature/*`**: Ramas de trabajo funcional (`feature/efi-frontend-setup`).

---

## 💻 Comandos para guardar y subir los cambios a GitHub (Terminal)

