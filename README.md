# 🎮 PokePedia

> **Versión 1.4**

PokePedia es una Pokédex interactiva inspirada en la app WikiDex, donde puedes explorar los más de 1000 Pokémon existentes, filtrarlos por tipo, generación o número, guardar tus favoritos y consultar la tabla de tipos y los mapas de cada región. Todo desde una interfaz moderna, rápida y siempre disponible.

---

## 📸 Pantallas

| Splash | Pokédex | Detalle |
|--------|---------|---------|
| Pantalla de bienvenida con login y registro | Listado completo con búsqueda y filtros | Modal con stats y línea evolutiva |

---

## ✨ Funcionalidades

- 🔐 **Login y Registro** conectados a Supabase
- 📖 **Pokédex completa** con los 1025 Pokémon de todas las generaciones
- 🔍 **Búsqueda** por nombre con filtros combinados por número, tipo y generación
- ⭐ **Sistema de favoritos** por usuario, almacenados en la nube
- 🃏 **Modal de detalle Pokémon** con estadísticas base y línea evolutiva completa
- 🗺️ **Mapas de las 9 regiones** con modal de detalle, descripción y localizaciones desde la PokéAPI
- ⚔️ **Tabla de tipos** con efectividades
- 👤 **Perfil editable** — nombre, correo y contraseña
- ℹ️ **Pantalla Info** con descripción de la app, tecnologías y enlace al desarrollador
- 📱 Interfaz SPA sin recargas de página

---

## 🛠️ Tecnologías empleadas

| Tecnología | Uso |
|---|---|
| **React + JavaScript** | Librería principal para la construcción de la SPA |
| **Tailwind CSS** | Framework de utilidades CSS para el diseño y los estilos |
| **Supabase (PostgreSQL)** | Base de datos en la nube para usuarios y favoritos |
| **PokéAPI** | API pública consumida para obtener todos los datos Pokémon |
| **React Router** | Gestión de rutas y navegación entre pantallas |

---

## 🚀 Instalación y uso

### 1. Clona el repositorio

```bash
git clone https://github.com/andrewexee/pokepedia.git
cd pokepedia
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tu_clave_publica
```

> Puedes obtener estos valores en tu proyecto de [Supabase](https://supabase.com) → **Settings → API**

### 4. Crea las tablas en Supabase

Ejecuta el siguiente SQL en el editor de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  email          VARCHAR(100) NOT NULL UNIQUE,
  password       VARCHAR(100) NOT NULL,
  rol            VARCHAR(10) DEFAULT 'USER' CHECK (rol IN ('ADMIN', 'USER')),
  fecha_registro TIMESTAMP DEFAULT NOW()
);

-- Tabla de favoritos
CREATE TABLE favoritos (
  id           SERIAL PRIMARY KEY,
  usuario_id   INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  pokemon_id   INT NOT NULL,
  pokemon_name VARCHAR(100) NOT NULL,
  UNIQUE (usuario_id, pokemon_id)
);
```

### 5. Añade las imágenes locales

Coloca los siguientes archivos en `public/resources/`:

```
public/
└── resources/
    ├── pokepedia-logo.png    ← Logo de la app
    ├── pokeball.png          ← Icono pokeball
    ├── tipos-tabla.jpg       ← Tabla de tipos
    ├── mapa-kanto.png        ← Región Kanto (1ª GEN)
    ├── mapa-johto.png        ← Región Johto (2ª GEN)
    ├── mapa-hoenn.png        ← Región Hoenn (3ª GEN)
    ├── mapa-sinnoh.png       ← Región Sinnoh (4ª GEN)
    ├── mapa-teselia.png      ← Región Teselia (5ª GEN)
    ├── mapa-kalos.png        ← Región Kalos (6ª GEN)
    ├── mapa-alola.png        ← Región Alola (7ª GEN)
    ├── mapa-galar.png        ← Región Galar (8ª GEN)
    └── mapa-paldea.png       ← Región Paldea (9ª GEN)
```

### 6. Arranca el proyecto

```bash
npm run dev
```

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── PokemonCard.jsx
│   ├── PokemonModal.jsx
│   └── MapaModal.jsx
├── pages/
│   ├── SplashScreen.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Pokedex.jsx
│   ├── Tipos.jsx
│   ├── Mapas.jsx
│   ├── Perfil.jsx
│   └── Ajustes.jsx
├── supabaseClient.js
└── App.jsx
```

---

## 👨‍💻 Desarrollador

Hecho por **andrewexee** — si quieres ver más proyectos visita mi perfil de GitHub:

[![GitHub](https://img.shields.io/badge/GitHub-andrewexee-181717?style=for-the-badge&logo=github)](https://github.com/andrewexee)

---

<p align="center">⭐ PokePedia v1.4 — Andrés Iglesias Camacho ⭐</p>