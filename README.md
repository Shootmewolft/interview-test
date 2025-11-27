# 🌳 Family Tree Manager

Una aplicación web moderna para gestionar árboles genealógicos familiares con soporte para anidación infinita de nodos, campos personalizados y una interfaz intuitiva.

![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=flat-square&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Reference](#-api-reference)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelos de Datos](#-modelos-de-datos)

---

## ✨ Características

### Gestión de Familias
- ✅ Crear, editar y eliminar familias
- ✅ Vista de tabla con todas las familias registradas
- ✅ Contador de miembros por familia

### Árbol Genealógico
- ✅ Visualización jerárquica en formato de árbol
- ✅ **Anidación infinita** de nodos (hijos, nietos, bisnietos, etc.)
- ✅ Expandir/colapsar ramas del árbol
- ✅ Navegación directa a cada nodo

### Editor de Nodos
- ✅ Edición de información personal (nombre, DNI, fecha de nacimiento)
- ✅ **Builder de campos personalizados** con soporte para:
  - 📝 Texto libre
  - 🎨 Selector de color
  - 📅 Fecha
  - 📊 Rango numérico (0-100)
- ✅ Visualización de hijos directos con navegación

### Experiencia de Usuario
- ✅ Interfaz moderna con shadcn/ui
- ✅ Notificaciones toast con Sonner
- ✅ Diseño responsive
- ✅ Tema claro/oscuro compatible

---

## 🛠 Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Lenguaje** | TypeScript 5 |
| **Base de Datos** | Firebase Firestore |
| **Estilos** | Tailwind CSS 4 |
| **Componentes** | shadcn/ui + Radix UI |
| **Validación** | Valibot |
| **Iconos** | Lucide React |
| **Linting** | Biome |
| **Notificaciones** | Sonner |

---

## 🏗 Arquitectura

La aplicación sigue una arquitectura limpia y modular:

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Pages     │  │ Components  │  │   Hooks     │      │
│  │  (App Dir)  │  │  (UI/Logic) │  │  (Estado)   │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │              │
│         └────────────────┼────────────────┘              │
│                          ▼                               │
│              ┌─────────────────────┐                     │
│              │  Client Services    │                     │
│              │  (HTTP Helpers)     │                     │
│              └──────────┬──────────┘                     │
└─────────────────────────┼───────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    API ROUTES                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ /api/family │  │ /api/family │  │  /api/son   │      │
│  │   GET/POST  │  │   [id]/*    │  │  [familyId] │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │              │
│         └────────────────┼────────────────┘              │
│                          ▼                               │
│              ┌─────────────────────┐                     │
│              │  Valibot Schemas    │                     │
│              │   (Validación)      │                     │
│              └──────────┬──────────┘                     │
└─────────────────────────┼───────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  FIREBASE SERVICE                        │
│              ┌─────────────────────┐                     │
│              │  Firebase Firestore │                     │
│              │    (Base de Datos)  │                     │
│              └─────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Server Components** obtienen datos directamente de Firebase
2. **Client Components** usan servicios HTTP para mutaciones
3. **API Routes** validan con Valibot y ejecutan operaciones en Firebase
4. **Firebase Service** maneja la serialización de Timestamps

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ o Bun 1.0+
- Cuenta de Firebase con proyecto creado
- Git

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Shootmewolft/interview-test.git
   cd interview-test
   ```

2. **Instalar dependencias**
   ```bash
   # Con Bun (recomendado)
   bun install

   # O con npm
   npm install

   # O con pnpm
   pnpm install
   ```

3. **Configurar variables de entorno** (ver sección [Configuración](#-configuración))

4. **Ejecutar en desarrollo**
   ```bash
   bun dev
   # o
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

---

## ⚙ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API URL (opcional, para producción)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database** en modo producción o prueba
4. Ve a Configuración del proyecto > General > Tus apps
5. Registra una app web y copia las credenciales
6. Copia los valores al archivo `.env.local`

### Reglas de Firestore (Desarrollo)

Para desarrollo, puedes usar estas reglas permisivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ **Importante**: Configura reglas más restrictivas para producción.

---

## 📖 Uso

### Vista Principal - Lista de Familias

Al acceder a la aplicación, verás una tabla con todas las familias:

| Acción | Descripción |
|--------|-------------|
| **Crear familia** | Botón "Nueva familia" para crear una familia |
| **Editar** | Icono de lápiz para modificar nombre/descripción |
| **Eliminar** | Icono de papelera para eliminar (con confirmación) |
| **Ver árbol** | Click en el nombre para ver el árbol genealógico |

### Vista de Árbol Genealógico

Muestra la estructura jerárquica de la familia:

- **Expandir/Colapsar**: Click en el icono de flecha
- **Agregar hijo**: Botón "+" en cada nodo
- **Editar nodo**: Icono de lápiz
- **Eliminar nodo**: Icono de papelera
- **Ver detalle**: Icono de ojo para ir al editor completo

### Editor de Nodos

Página dedicada para editar un miembro de la familia:

1. **Información personal**: Edita nombre, DNI, fecha de nacimiento
2. **Descripción**: Campo opcional para notas
3. **Campos personalizados**: Agrega campos con el builder
4. **Guardar**: Los cambios se guardan al hacer click en "Guardar cambios"

---

## 📡 API Reference

### Familias

#### `GET /api/family`
Obtiene todas las familias.

**Response:**
```json
{
  "data": [
    {
      "id": "abc123",
      "name": "Familia García",
      "description": "Familia principal",
      "sons": [...],
      "createdAt": "2025-11-27T10:00:00.000Z"
    }
  ]
}
```

#### `POST /api/family`
Crea una nueva familia.

**Body:**
```json
{
  "name": "Familia García",
  "description": "Opcional",
  "sons": []
}
```

#### `GET /api/family/[id]`
Obtiene una familia por ID.

#### `PUT /api/family/[id]`
Actualiza una familia.

#### `DELETE /api/family/[id]`
Elimina una familia.

---

### Nodos (Miembros)

#### `GET /api/son/[familyId]`
Obtiene todos los nodos raíz de una familia.

#### `POST /api/son/[familyId]`
Crea un nodo raíz o hijo.

**Body:**
```json
{
  "name": "Juan García",
  "dni": 12345678,
  "birthdate": "1990-05-15",
  "description": "Opcional",
  "parentId": "opcional_para_hijos"
}
```

#### `GET /api/son/[familyId]/[sonId]`
Obtiene un nodo específico.

#### `PUT /api/son/[familyId]/[sonId]`
Actualiza un nodo.

#### `DELETE /api/son/[familyId]/[sonId]`
Elimina un nodo y sus descendientes.

---

## 📁 Estructura del Proyecto

```
src/
├── app/                      # App Router de Next.js
│   ├── api/                  # API Routes
│   │   ├── family/           # Endpoints de familias
│   │   │   ├── route.ts      # GET all, POST create
│   │   │   └── [id]/
│   │   │       └── route.ts  # GET, PUT, DELETE by ID
│   │   └── son/              # Endpoints de nodos
│   │       └── [familyId]/
│   │           ├── route.ts  # GET all, POST create
│   │           └── [sonId]/
│   │               └── route.ts
│   ├── [familyId]/           # Página de árbol familiar
│   │   ├── page.tsx
│   │   └── [sonId]/          # Página de editor de nodo
│   │       └── page.tsx
│   ├── layout.tsx            # Layout principal con Toaster
│   ├── page.tsx              # Página principal (lista familias)
│   └── globals.css           # Estilos globales
│
├── components/               # Componentes React
│   ├── families/             # Componentes de familias
│   │   ├── families-view.tsx # Vista principal con tabla
│   │   ├── family-table.tsx  # Tabla de familias
│   │   ├── create-family-dialog.tsx
│   │   ├── edit-family-dialog.tsx
│   │   └── delete-family-dialog.tsx
│   ├── family-tree/          # Componentes del árbol
│   │   ├── family-tree-view.tsx
│   │   ├── tree-node.tsx     # Nodo recursivo
│   │   ├── create-node-dialog.tsx
│   │   ├── edit-node-dialog.tsx
│   │   └── delete-node-dialog.tsx
│   ├── node/                 # Editor de nodo
│   │   └── node-editor.tsx   # Editor con campos custom
│   └── ui/                   # shadcn/ui components
│
├── config/                   # Configuración
│   └── environment.config.ts # Variables de entorno
│
├── consts/                   # Constantes
│   ├── app.ts
│   └── firebase.ts           # Nombre de colección
│
├── errors/                   # Clases de error personalizadas
│   ├── errors.ts
│   ├── firebase.ts
│   └── http.ts
│
├── lib/                      # Librerías externas
│   └── firebase.ts           # Inicialización Firebase
│
├── models/                   # Tipos TypeScript
│   └── family.ts             # Family, FamilyNode, CustomField
│
├── schemas/                  # Schemas de Valibot
│   └── family.ts             # Validación de datos
│
├── services/                 # Servicios
│   ├── firebase.ts           # Operaciones Firestore
│   ├── family.ts             # Cliente HTTP para API
│   └── http/                 # Helpers HTTP
│       ├── get.ts
│       ├── post.ts
│       ├── put.ts
│       ├── patch.ts
│       └── delete.ts
│
└── utils/                    # Utilidades
    ├── cn.ts                 # Merge de clases CSS
    ├── nodes.ts              # Funciones para árboles
    └── api.ts                # Helpers para API routes
```

---

## 📊 Modelos de Datos

### Family

```typescript
interface Family {
  id: string;           // ID único (generado por Firestore)
  name: string;         // Nombre de la familia
  description?: string; // Descripción opcional
  sons: FamilyNode[];   // Nodos raíz del árbol
  createdAt: Date;      // Fecha de creación
}
```

### FamilyNode

```typescript
interface FamilyNode {
  id: string;                   // ID único
  name: string;                 // Nombre completo
  dni: number;                  // Documento de identidad
  description?: string;         // Descripción opcional
  birthdate: Date;              // Fecha de nacimiento
  customFields?: CustomField[]; // Campos personalizados
  sons: FamilyNode[];           // Hijos (anidación infinita)
  createdAt: Date;              // Fecha de creación
}
```

### CustomField

```typescript
interface CustomField {
  id: string;                              // ID único
  type: 'text' | 'color' | 'range' | 'date'; // Tipo de campo
  label: string;                           // Etiqueta visible
  value: string;                           // Valor almacenado
}
```

---

## 🧪 Scripts Disponibles

```bash
# Desarrollo
bun dev          # Inicia servidor de desarrollo

# Producción
bun build        # Compila para producción
bun start        # Inicia servidor de producción

# Calidad de código
bun lint         # Ejecuta Biome check
bun format       # Formatea código con Biome
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

<div align="center">

Desarrollado con ❤️ por Shootmewolft

</div>